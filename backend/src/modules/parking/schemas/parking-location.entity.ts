import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { AuthUser } from '@auth/schemas/auth-user.entity';

export enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

export enum LocationType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  COVERED = 'covered',
  STREET = 'street',
}

@Entity({ name: 'parking_locations' })
@Index('idx_parking_location_vendor', ['vendorId'])
@Index('idx_parking_location_status', ['status'])
@Index('idx_parking_location_type', ['type'])
@Index('idx_parking_location_coordinates', ['latitude', 'longitude'])
export class ParkingLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column()
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.OUTDOOR,
  })
  type: LocationType;

  @Column({
    type: 'enum',
    enum: LocationStatus,
    default: LocationStatus.ACTIVE,
  })
  status: LocationStatus;

  @Column()
  vendorId: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  dailyRate: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  monthlyRate: number;

  @Column({ type: 'int', default: 0 })
  totalSlots: number;

  @Column({ type: 'int', default: 0 })
  availableSlots: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ type: 'text', nullable: true })
  amenities: string; // JSON string of amenities

  @Column({ type: 'text', nullable: true })
  operatingHours: string; // JSON string of operating hours

  @Column({ type: 'text', nullable: true })
  images: string; // JSON string array of image URLs

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => AuthUser)
  @JoinColumn({ name: 'vendorId' })
  vendor: AuthUser;
}
