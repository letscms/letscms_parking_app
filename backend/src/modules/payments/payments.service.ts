import { Injectable, NotFoundException, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod, PaymentGateway, PaymentType } from '@payments/schemas/payment.entity';
import { WalletTransaction } from '@payments/schemas/payment.entity';
import { Booking } from '@bookings/schemas/booking.entity';
import { AuthUser } from '@auth/schemas/auth-user.entity';
import { CreatePaymentDto, UpdatePaymentDto, CreateRefundDto, CreateWalletTransactionDto, WalletTopUpDto, TransactionType } from './dto/payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(AuthUser)
    private userRepository: Repository<AuthUser>,
    private dataSource: DataSource,
  ) {}

  // Payment methods
  async createPayment(createPaymentDto: CreatePaymentDto, user: AuthUser): Promise<Payment> {
    const booking = await this.bookingRepository.findOne({
      where: { id: createPaymentDto.bookingId },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== user.id) {
      throw new ForbiddenException('You can only make payments for your own bookings');
    }

    // Check if payment already exists for this booking
    const existingPayment = await this.paymentRepository.findOne({
      where: { bookingId: createPaymentDto.bookingId, status: PaymentStatus.COMPLETED },
    });

    if (existingPayment) {
      throw new ConflictException('Payment already exists for this booking');
    }

    const payment = this.paymentRepository.create({
      bookingId: createPaymentDto.bookingId,
      userId: user.id,
      amount: createPaymentDto.amount,
      totalAmount: createPaymentDto.amount, // Calculate with fees/taxes if needed
      method: createPaymentDto.method,
      gateway: createPaymentDto.gateway as PaymentGateway,
      gatewayTransactionId: createPaymentDto.gatewayTransactionId,
      metadata: createPaymentDto.metadata ? JSON.stringify(createPaymentDto.metadata) : undefined,
      status: PaymentStatus.PENDING,
      type: PaymentType.BOOKING,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Process payment based on method
    if (createPaymentDto.method === PaymentMethod.WALLET) {
      return this.processWalletPayment(savedPayment);
    } else {
      return this.processGatewayPayment(savedPayment);
    }
  }

  async findAllPayments(
    page: number = 1,
    limit: number = 10,
    userId?: string,
    status?: PaymentStatus,
    method?: PaymentMethod,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    payments: Payment[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    let queryBuilder = this.paymentRepository.createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.booking', 'booking');

    if (userId) {
      queryBuilder = queryBuilder.andWhere('payment.userId = :userId', { userId });
    }

    if (status) {
      queryBuilder = queryBuilder.andWhere('payment.status = :status', { status });
    }

    if (method) {
      queryBuilder = queryBuilder.andWhere('payment.method = :method', { method });
    }

    if (startDate && endDate) {
      queryBuilder = queryBuilder.andWhere(
        'payment.createdAt BETWEEN :startDate AND :endDate',
        { startDate, endDate }
      );
    }

    const [payments, total] = await queryBuilder
      .orderBy('payment.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      payments,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'booking'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updatePayment(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const updateData: any = { ...updatePaymentDto };
    if (updatePaymentDto.metadata) {
      updateData.metadata = JSON.stringify(updatePaymentDto.metadata);
    }
    await this.paymentRepository.update(id, updateData);
    return this.findPaymentById(id);
  }

  async processRefund(id: string, createRefundDto: CreateRefundDto, user: AuthUser): Promise<Payment> {
    const payment = await this.findPaymentById(id);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Can only refund completed payments');
    }

    if (payment.userId !== user.id) {
      throw new ForbiddenException('You can only refund your own payments');
    }

    if (createRefundDto.amount > payment.amount) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update payment status
      const newStatus = createRefundDto.amount === payment.amount 
        ? PaymentStatus.REFUNDED 
        : PaymentStatus.PARTIALLY_REFUNDED;

      await queryRunner.manager.update(Payment, id, {
        status: newStatus,
        refundedAmount: createRefundDto.amount,
        refundedAt: new Date(),
      });

      // Create wallet transaction for refund
      await this.createWalletTransaction({
        type: TransactionType.CREDIT,
        amount: createRefundDto.amount,
        description: `Refund for payment ${payment.id}: ${createRefundDto.reason}`,
        referenceId: payment.id,
        referenceType: 'refund',
      }, user, queryRunner.manager);

      await queryRunner.commitTransaction();
      return this.findPaymentById(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Wallet methods
  async getWalletBalance(userId: string): Promise<number> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['walletBalance'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.walletBalance || 0;
  }

  async getWalletTransactions(
    userId: string,
    page: number = 1,
    limit: number = 10,
    type?: 'credit' | 'debit',
  ): Promise<{
    transactions: WalletTransaction[];
    total: number;
    totalPages: number;
    currentBalance: number;
  }> {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    const [transactions, total] = await this.walletTransactionRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const currentBalance = await this.getWalletBalance(userId);

    return {
      transactions,
      total,
      totalPages: Math.ceil(total / limit),
      currentBalance,
    };
  }

  async topUpWallet(walletTopUpDto: WalletTopUpDto, user: AuthUser): Promise<{ payment: Payment; transaction?: WalletTransaction }> {
    // Create a payment record for the top-up
    const payment = this.paymentRepository.create({
      userId: user.id,
      amount: walletTopUpDto.amount,
      totalAmount: walletTopUpDto.amount,
      method: walletTopUpDto.method,
      gateway: walletTopUpDto.gateway as PaymentGateway,
      status: PaymentStatus.PENDING,
      description: 'Wallet top-up',
      type: PaymentType.WALLET_TOPUP,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    if (walletTopUpDto.method === PaymentMethod.WALLET) {
      throw new BadRequestException('Cannot use wallet to top up wallet');
    }

    // Process gateway payment for top-up
    const processedPayment = await this.processGatewayPayment(savedPayment);

    // If payment is successful, create wallet transaction
    if (processedPayment.status === PaymentStatus.COMPLETED) {
      const transaction = await this.createWalletTransaction({
        type: TransactionType.CREDIT,
        amount: walletTopUpDto.amount,
        description: 'Wallet top-up',
        referenceId: processedPayment.id,
        referenceType: 'top-up',
      }, user);

      return { payment: processedPayment, transaction };
    }

    return { payment: processedPayment, transaction: undefined };
  }

  private async createWalletTransaction(
    createWalletTransactionDto: CreateWalletTransactionDto,
    user: AuthUser,
    manager?: any,
  ): Promise<WalletTransaction> {
    const repository = manager ? manager.getRepository(WalletTransaction) : this.walletTransactionRepository;
    const userRepository = manager ? manager.getRepository(AuthUser) : this.userRepository;

    const currentBalance = await this.getWalletBalance(user.id);
    let newBalance: number;

    if (createWalletTransactionDto.type === TransactionType.CREDIT) {
      newBalance = currentBalance + createWalletTransactionDto.amount;
    } else {
      if (currentBalance < createWalletTransactionDto.amount) {
        throw new BadRequestException('Insufficient wallet balance');
      }
      newBalance = currentBalance - createWalletTransactionDto.amount;
    }

    const transaction = repository.create({
      ...createWalletTransactionDto,
      userId: user.id,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
    });

    const savedTransaction = await repository.save(transaction);

    // Update user wallet balance
    await userRepository.update(user.id, { walletBalance: newBalance });

    return savedTransaction;
  }

  private async processWalletPayment(payment: Payment): Promise<Payment> {
    const user = await this.userRepository.findOne({
      where: { id: payment.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentBalance = user.walletBalance || 0;

    if (currentBalance < payment.amount) {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failureReason: 'Insufficient wallet balance',
      });
      throw new BadRequestException('Insufficient wallet balance');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update payment status
      await queryRunner.manager.update(Payment, payment.id, {
        status: PaymentStatus.COMPLETED,
        processedAt: new Date(),
      });

      // Create wallet transaction
      await this.createWalletTransaction({
        type: TransactionType.DEBIT,
        amount: payment.amount,
        description: `Payment for booking ${payment.bookingId}`,
        referenceId: payment.id,
        referenceType: 'payment',
      }, user, queryRunner.manager);

      await queryRunner.commitTransaction();
      return this.findPaymentById(payment.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async processGatewayPayment(payment: Payment): Promise<Payment> {
    // This is a simplified implementation
    // In a real application, you would integrate with actual payment gateways
    // like Stripe, Razorpay, PayPal, etc.

    try {
      // Simulate gateway processing
      const isSuccessful = Math.random() > 0.1; // 90% success rate for simulation

      if (isSuccessful) {
        await this.paymentRepository.update(payment.id, {
          status: PaymentStatus.COMPLETED,
          processedAt: new Date(),
          gatewayTransactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });
      } else {
        await this.paymentRepository.update(payment.id, {
          status: PaymentStatus.FAILED,
          failureReason: 'Gateway processing failed',
        });
      }

      return this.findPaymentById(payment.id);
    } catch (error) {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failureReason: 'Gateway processing error',
      });
      throw error;
    }
  }

  async handleWebhook(webhookData: any): Promise<void> {
    // This method would handle webhooks from payment gateways
    // Implementation depends on the specific gateway being used
    
    // Example for handling webhook events:
    const { type, data } = webhookData;

    switch (type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(data.object);
        break;
      default:
        console.log(`Unhandled webhook event type: ${type}`);
    }
  }

  private async handlePaymentSuccess(paymentData: any): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { gatewayTransactionId: paymentData.id },
    });

    if (payment) {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.COMPLETED,
        processedAt: new Date(),
      });
    }
  }

  private async handlePaymentFailure(paymentData: any): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: { gatewayTransactionId: paymentData.id },
    });

    if (payment) {
      await this.paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        failureReason: paymentData.last_payment_error?.message || 'Payment failed',
      });
    }
  }
}
