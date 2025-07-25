import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Booking } from '@bookings/schemas/booking.entity';
import { AuthUser } from '@auth/schemas/auth-user.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  WALLET = 'wallet',
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  CASH = 'cash',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export enum PaymentGateway {
  STRIPE = 'stripe',
  RAZORPAY = 'razorpay',
  PAYPAL = 'paypal',
  SQUARE = 'square',
  INTERNAL = 'internal',
}

export enum PaymentType {
  BOOKING = 'booking',
  EXTENSION = 'extension',
  OVERSTAY = 'overstay',
  PENALTY = 'penalty',
  REFUND = 'refund',
  WALLET_TOPUP = 'wallet_topup',
}

@Entity({ name: 'payments' })
@Index('idx_payment_booking', ['bookingId'])
@Index('idx_payment_user', ['userId'])
@Index('idx_payment_status', ['status'])
@Index('idx_payment_date', ['createdAt'])
@Index('idx_payment_gateway_ref', ['gatewayTransactionId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  bookingId: string;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gatewayFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentGateway,
  })
  gateway: PaymentGateway;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.BOOKING,
  })
  type: PaymentType;

  @Column({ nullable: true })
  gatewayTransactionId: string;

  @Column({ nullable: true })
  gatewayPaymentId: string;

  @Column({ nullable: true })
  gatewayOrderId: string;

  @Column({ type: 'text', nullable: true })
  gatewayResponse: string; // JSON response from gateway

  @Column({ nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  refundId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundedAmount: number;

  @Column({ nullable: true })
  refundedAt: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  metadata: string; // JSON metadata

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => AuthUser)
  @JoinColumn({ name: 'userId' })
  user: AuthUser;
}

// Wallet transactions
@Entity({ name: 'wallet_transactions' })
@Index('idx_wallet_transaction_user', ['userId'])
@Index('idx_wallet_transaction_type', ['type'])
@Index('idx_wallet_transaction_date', ['createdAt'])
export class WalletTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceBefore: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balanceAfter: number;

  @Column({
    type: 'enum',
    enum: ['credit', 'debit'],
  })
  type: 'credit' | 'debit';

  @Column()
  description: string;

  @Column({ nullable: true })
  referenceId: string; // booking ID, payment ID, etc.

  @Column({ nullable: true })
  referenceType: string; // 'booking', 'payment', 'refund', etc.

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => AuthUser)
  @JoinColumn({ name: 'userId' })
  user: AuthUser;
}
