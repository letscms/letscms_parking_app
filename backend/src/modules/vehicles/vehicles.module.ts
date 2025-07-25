import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { UserVehicle, VehicleUsageStats } from '@vehicles/schemas';

@Module({
  imports: [TypeOrmModule.forFeature([UserVehicle, VehicleUsageStats])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
