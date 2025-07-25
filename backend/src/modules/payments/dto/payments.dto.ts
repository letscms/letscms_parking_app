import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsUUID, Min, Max, IsDecimal, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@payments/schemas/payment.entity';

// Define TransactionType enum for DTOs
export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Booking ID this payment is for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  bookingId: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 25.50,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Payment gateway (required for online payments)',
    example: 'stripe',
  })
  @IsOptional()
  @IsString()
  gateway?: string;

  @ApiPropertyOptional({
    description: 'Payment gateway transaction ID',
    example: 'pi_3LE4Js2eZvKYlo2C0u1wxxxx',
  })
  @IsOptional()
  @IsString()
  gatewayTransactionId?: string;

  @ApiPropertyOptional({
    description: 'Additional payment metadata',
    example: { cardLast4: '4242', cardBrand: 'visa' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Payment gateway transaction ID',
    example: 'pi_3LE4Js2eZvKYlo2C0u1wxxxx',
  })
  @IsOptional()
  @IsString()
  gatewayTransactionId?: string;

  @ApiPropertyOptional({
    description: 'Failure reason if payment failed',
    example: 'Insufficient funds',
  })
  @IsOptional()
  @IsString()
  failureReason?: string;

  @ApiPropertyOptional({
    description: 'Additional payment metadata',
    example: { cardLast4: '4242', cardBrand: 'visa' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateRefundDto {
  @ApiProperty({
    description: 'Refund amount',
    example: 25.50,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Reason for refund',
    example: 'Customer cancellation',
    minLength: 5,
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class CreateWalletTransactionDto {
  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.CREDIT,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction amount',
    example: 50.00,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Wallet top-up',
    minLength: 3,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Reference ID (e.g., payment ID, booking ID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  referenceId?: string;

  @ApiPropertyOptional({
    description: 'Reference type (e.g., payment, booking, refund)',
    example: 'payment',
  })
  @IsOptional()
  @IsString()
  referenceType?: string;
}

export class WalletTopUpDto {
  @ApiProperty({
    description: 'Top-up amount',
    example: 100.00,
    minimum: 10.00,
    maximum: 1000.00,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(10.00)
  @Max(1000.00)
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    description: 'Payment method for top-up',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Payment gateway',
    example: 'stripe',
  })
  @IsOptional()
  @IsString()
  gateway?: string;
}

export class PaymentWebhookDto {
  @ApiProperty({
    description: 'Event type',
    example: 'payment_intent.succeeded',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Event data',
    example: { object: { id: 'pi_xxx', status: 'succeeded' } },
  })
  @IsNotEmpty()
  data: any;

  @ApiPropertyOptional({
    description: 'Event ID',
    example: 'evt_1LE4Js2eZvKYlo2C0u1wxxxx',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
    description: 'Event created timestamp',
    example: 1647875400,
  })
  @IsOptional()
  @IsNumber()
  created?: number;
}
