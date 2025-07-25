import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserVehicle } from '@vehicles/schemas';
import { AuthUser } from '@auth/schemas';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { IPaginationResponse } from '@shared/interfaces';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(UserVehicle)
    private vehicleRepository: Repository<UserVehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto, user: AuthUser) {
    // Check if license plate already exists for this user
    const existingVehicle = await this.vehicleRepository.findOne({
      where: {
        licensePlate: createVehicleDto.licensePlate,
        userId: user.id,
      },
    });

    if (existingVehicle) {
      throw new ConflictException('Vehicle with this license plate already exists for this user');
    }

    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      userId: user.id,
    });

    return await this.vehicleRepository.save(vehicle);
  }

  async findAllByUser(userId: string) {
    return await this.vehicleRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: AuthUser) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Check if user owns this vehicle or is admin
    if (vehicle.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only access your own vehicles');
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto, user: AuthUser) {
    const vehicle = await this.findOne(id, user);

    // If updating license plate, check for duplicates
    if (updateVehicleDto.licensePlate && updateVehicleDto.licensePlate !== vehicle.licensePlate) {
      const existingVehicle = await this.vehicleRepository.findOne({
        where: {
          licensePlate: updateVehicleDto.licensePlate,
          userId: user.id,
        },
      });

      if (existingVehicle) {
        throw new ConflictException('Vehicle with this license plate already exists for this user');
      }
    }

    await this.vehicleRepository.update(id, updateVehicleDto);
    return await this.findOne(id, user);
  }

  async remove(id: string, user: AuthUser) {
    const vehicle = await this.findOne(id, user);
    await this.vehicleRepository.remove(vehicle);
    return { message: 'Vehicle deleted successfully' };
  }

  async findAllVehicles(page: number = 1, limit: number = 10): Promise<IPaginationResponse<UserVehicle>> {
    const skip = (page - 1) * limit;
    
    const [vehicles, total] = await this.vehicleRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: vehicles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVehicleStats() {
    const [totalVehicles, activeVehicles, vehiclesByType] = await Promise.all([
      this.vehicleRepository.count(),
      this.vehicleRepository.count({ where: { isActive: true } }),
      this.vehicleRepository
        .createQueryBuilder('v')
        .select('v.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('v.type')
        .getRawMany(),
    ]);

    return {
      totalVehicles,
      activeVehicles,
      inactiveVehicles: totalVehicles - activeVehicles,
      vehiclesByType: vehiclesByType.reduce((acc, curr) => {
        acc[curr.type] = parseInt(curr.count);
        return acc;
      }, {}),
    };
  }
}
