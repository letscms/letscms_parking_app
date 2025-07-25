import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { UserRole } from '@auth/schemas/auth-user.entity';
import { PaymentStatus, PaymentMethod } from '@payments/schemas/payment.entity';
import { CreatePaymentDto, UpdatePaymentDto, CreateRefundDto, WalletTopUpDto, PaymentWebhookDto } from './dto/payments.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 409, description: 'Payment already exists for this booking' })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: any,
  ) {
    return this.paymentsService.createPayment(createPaymentDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'Filter by user ID' })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus, description: 'Filter by payment status' })
  @ApiQuery({ name: 'method', required: false, enum: PaymentMethod, description: 'Filter by payment method' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date filter (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date filter (ISO string)' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  async findAllPayments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId?: string,
    @Query('status') status?: PaymentStatus,
    @Query('method') method?: PaymentMethod,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.paymentsService.findAllPayments(
      page,
      limit,
      userId,
      status,
      method,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('my-payments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user payments' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: PaymentStatus, description: 'Filter by payment status' })
  @ApiQuery({ name: 'method', required: false, enum: PaymentMethod, description: 'Filter by payment method' })
  @ApiResponse({ status: 200, description: 'User payments retrieved successfully' })
  async getUserPayments(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: PaymentStatus,
    @Query('method') method?: PaymentMethod,
  ) {
    return this.paymentsService.findAllPayments(
      page,
      limit,
      req.user.id,
      status,
      method,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findPaymentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findPaymentById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async updatePayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process refund for a payment' })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  @ApiResponse({ status: 400, description: 'Can only refund completed payments' })
  @ApiResponse({ status: 403, description: 'You can only refund your own payments' })
  async processRefund(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createRefundDto: CreateRefundDto,
    @Request() req: any,
  ) {
    return this.paymentsService.processRefund(id, createRefundDto, req.user);
  }

  // Wallet endpoints
  @Get('wallet/balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Wallet balance retrieved successfully' })
  async getWalletBalance(@Request() req: any) {
    const balance = await this.paymentsService.getWalletBalance(req.user.id);
    return { balance };
  }

  @Get('wallet/transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get wallet transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'type', required: false, enum: ['credit', 'debit'], description: 'Filter by transaction type' })
  @ApiResponse({ status: 200, description: 'Wallet transactions retrieved successfully' })
  async getWalletTransactions(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('type') type?: 'credit' | 'debit',
  ) {
    return this.paymentsService.getWalletTransactions(req.user.id, page, limit, type);
  }

  @Post('wallet/topup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Top up wallet' })
  @ApiResponse({ status: 201, description: 'Wallet topped up successfully' })
  @ApiResponse({ status: 400, description: 'Cannot use wallet to top up wallet' })
  async topUpWallet(
    @Body() walletTopUpDto: WalletTopUpDto,
    @Request() req: any,
  ) {
    return this.paymentsService.topUpWallet(walletTopUpDto, req.user);
  }

  // Webhook endpoint for payment gateway callbacks
  @Post('webhook')
  @ApiOperation({ summary: 'Handle payment gateway webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(@Body() webhookData: PaymentWebhookDto) {
    await this.paymentsService.handleWebhook(webhookData);
    return { status: 'success' };
  }
}
