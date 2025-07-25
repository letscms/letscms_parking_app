import { IsString, IsOptional, IsEnum, IsDecimal, IsInt, IsEmail, IsPhoneNumber, IsLatitude, IsLongitude, MinLength, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationType, LocationStatus } from '@parking/schemas/parking-location.entity';
import { SlotType, SlotStatus } from '@parking/schemas/parking-slot.entity';

export class CreateParkingLocationDto {
  @ApiProperty({ description: 'Location name', example: 'Downtown Parking Complex' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Location description' })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @ApiProperty({ description: 'Street address', example: '123 Main Street' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city: string;

  @ApiProperty({ description: 'State/Province', example: 'NY' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  state: string;

  @ApiProperty({ description: 'ZIP/Postal code', example: '10001' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  zipCode: string;

  @ApiProperty({ description: 'Country', example: 'United States' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  country: string;

  @ApiProperty({ description: 'Latitude', example: 40.7128 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: -74.0060 })
  @IsLongitude()
  longitude: number;

  @ApiPropertyOptional({ 
    description: 'Location type',
    enum: LocationType,
    example: LocationType.OUTDOOR
  })
  @IsOptional()
  @IsEnum(LocationType)
  type?: LocationType;

  @ApiProperty({ description: 'Hourly rate in USD', example: 5.00 })
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  hourlyRate: number;

  @ApiPropertyOptional({ description: 'Daily rate in USD', example: 25.00 })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  dailyRate?: number;

  @ApiPropertyOptional({ description: 'Monthly rate in USD', example: 150.00 })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  monthlyRate?: number;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsPhoneNumber()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Amenities (JSON string)', example: '["Security", "CCTV", "Covered"]' })
  @IsOptional()
  @IsString()
  amenities?: string;

  @ApiPropertyOptional({ description: 'Operating hours (JSON string)', example: '{"monday": "6:00-22:00", "sunday": "8:00-20:00"}' })
  @IsOptional()
  @IsString()
  operatingHours?: string;
}

export class UpdateParkingLocationDto {
  @ApiPropertyOptional({ description: 'Location name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Location description' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Location status',
    enum: LocationStatus
  })
  @IsOptional()
  @IsEnum(LocationStatus)
  status?: LocationStatus;

  @ApiPropertyOptional({ description: 'Hourly rate in USD' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({ description: 'Daily rate in USD' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  dailyRate?: number;

  @ApiPropertyOptional({ description: 'Monthly rate in USD' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  monthlyRate?: number;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  @IsOptional()
  @IsPhoneNumber()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Amenities (JSON string)' })
  @IsOptional()
  @IsString()
  amenities?: string;

  @ApiPropertyOptional({ description: 'Operating hours (JSON string)' })
  @IsOptional()
  @IsString()
  operatingHours?: string;
}

export class CreateParkingSlotDto {
  @ApiProperty({ description: 'Slot number', example: 'A-101' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  slotNumber: string;

  @ApiProperty({ description: 'Floor', example: 'Ground Floor' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  floor: string;

  @ApiProperty({ description: 'Section', example: 'A' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  section: string;

  @ApiPropertyOptional({ 
    description: 'Slot type',
    enum: SlotType,
    example: SlotType.REGULAR
  })
  @IsOptional()
  @IsEnum(SlotType)
  type?: SlotType;

  @ApiPropertyOptional({ description: 'Custom hourly rate (overrides location rate)' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  customHourlyRate?: number;

  @ApiPropertyOptional({ description: 'Custom daily rate (overrides location rate)' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  customDailyRate?: number;

  @ApiPropertyOptional({ description: 'Slot length in meters' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  length?: number;

  @ApiPropertyOptional({ description: 'Slot width in meters' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  width?: number;

  @ApiPropertyOptional({ description: 'Special notes about the slot' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;

  @ApiPropertyOptional({ description: 'Slot features (JSON string)', example: '["EV Charging", "Covered"]' })
  @IsOptional()
  @IsString()
  features?: string;
}

export class UpdateParkingSlotDto {
  @ApiPropertyOptional({ 
    description: 'Slot status',
    enum: SlotStatus
  })
  @IsOptional()
  @IsEnum(SlotStatus)
  status?: SlotStatus;

  @ApiPropertyOptional({ 
    description: 'Slot type',
    enum: SlotType
  })
  @IsOptional()
  @IsEnum(SlotType)
  type?: SlotType;

  @ApiPropertyOptional({ description: 'Custom hourly rate' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  customHourlyRate?: number;

  @ApiPropertyOptional({ description: 'Custom daily rate' })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Min(0)
  customDailyRate?: number;

  @ApiPropertyOptional({ description: 'Special notes about the slot' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;

  @ApiPropertyOptional({ description: 'Slot features (JSON string)' })
  @IsOptional()
  @IsString()
  features?: string;

  @ApiPropertyOptional({ description: 'Active status' })
  @IsOptional()
  isActive?: boolean;
}
