import { IsUUID, IsDateString, IsOptional, IsString, IsEnum, IsDecimal, IsBoolean, IsInt, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingType } from '@bookings/schemas/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ description: 'Parking slot ID', example: 'uuid-string' })
  @IsUUID()
  slotId: string;

  @ApiPropertyOptional({ description: 'Vehicle ID', example: 'uuid-string' })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiProperty({ description: 'Booking start time', example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'Booking end time', example: '2024-01-15T12:00:00Z' })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({ 
    description: 'Booking type',
    enum: BookingType,
    example: BookingType.HOURLY
  })
  @IsOptional()
  @IsEnum(BookingType)
  type?: BookingType;

  @ApiPropertyOptional({ description: 'Vehicle license plate', example: 'ABC-123' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  licensePlate?: string;

  @ApiPropertyOptional({ description: 'Special instructions' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialInstructions?: string;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'Booking end time', example: '2024-01-15T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Vehicle license plate', example: 'ABC-123' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  licensePlate?: string;

  @ApiPropertyOptional({ description: 'Special instructions' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialInstructions?: string;
}

export class ExtendBookingDto {
  @ApiProperty({ description: 'Extension duration in minutes', example: 60 })
  @IsInt()
  extensionMinutes: number;

  @ApiPropertyOptional({ description: 'Reason for extension' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  reason?: string;
}

export class CancelBookingDto {
  @ApiProperty({ description: 'Reason for cancellation' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  reason: string;
}

export class CheckInBookingDto {
  @ApiPropertyOptional({ description: 'Actual license plate if different' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  actualLicensePlate?: string;
}

export class CheckOutBookingDto {
  @ApiPropertyOptional({ description: 'Any checkout notes' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;
}
