import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType } from '@vehicles/schemas/user-vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC123', description: 'Vehicle license plate' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ example: 'Toyota', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'Camry', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: 'Blue', required: false })
  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateVehicleDto {
  @ApiProperty({ example: 'ABC123', required: false })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiProperty({ enum: VehicleType, required: false })
  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @ApiProperty({ example: 'Toyota', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'Camry', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ example: 'Blue', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
