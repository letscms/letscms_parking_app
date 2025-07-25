import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum VehicleType {
  CAR = 'car',
  BIKE = 'bike',
  BICYCLE = 'bicycle',
  TRUCK = 'truck',
  BUS = 'bus',
}

@Entity({ name: 'user_vehicles' })
@Index('idx_vehicles_user', ['userId'])
@Index('idx_vehicles_license_user', ['licensePlate', 'userId'])
@Index('idx_vehicles_type_active', ['type', 'isActive'])
export class UserVehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  licensePlate: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
  })
  type: VehicleType;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  color: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('jsonb', { nullable: true })
  specifications: {
    year?: number;
    engineType?: string;
    fuelType?: string;
    transmission?: string;
  };

  @Column('simple-array', { nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Vehicle Usage Statistics
@Entity({ name: 'vehicle_usage_stats' })
@Index('idx_vehicles_stats_vehicle', ['vehicleId'])
@Index('idx_vehicles_stats_date', ['date'])
export class VehicleUsageStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column()
  userId: string;

  @Column('date')
  date: Date;

  @Column({ default: 0 })
  bookingCount: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ default: 0 })
  totalHours: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
