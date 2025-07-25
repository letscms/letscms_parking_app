import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ParkingLocation } from './parking-location.entity';

export enum SlotType {
  REGULAR = 'regular',
  COMPACT = 'compact',
  LARGE = 'large',
  HANDICAPPED = 'handicapped',
  ELECTRIC = 'electric',
  MOTORCYCLE = 'motorcycle',
}

export enum SlotStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out_of_order',
}

@Entity({ name: 'parking_slots' })
@Index('idx_parking_slot_location', ['locationId'])
@Index('idx_parking_slot_status', ['status'])
@Index('idx_parking_slot_type', ['type'])
@Index('idx_parking_slot_number_location', ['slotNumber', 'locationId'])
export class ParkingSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  locationId: string;

  @Column()
  slotNumber: string;

  @Column()
  floor: string;

  @Column()
  section: string;

  @Column({
    type: 'enum',
    enum: SlotType,
    default: SlotType.REGULAR,
  })
  type: SlotType;

  @Column({
    type: 'enum',
    enum: SlotStatus,
    default: SlotStatus.AVAILABLE,
  })
  status: SlotStatus;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  customHourlyRate: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  customDailyRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  length: number; // in meters

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  width: number; // in meters

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  currentBookingId: string;

  @Column({ nullable: true })
  lastOccupiedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  features: string; // JSON string of slot features

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ParkingLocation)
  @JoinColumn({ name: 'locationId' })
  location: ParkingLocation;
}

// Slot occupancy tracking
@Entity({ name: 'slot_occupancy_logs' })
@Index('idx_slot_occupancy_slot', ['slotId'])
@Index('idx_slot_occupancy_date', ['occupiedAt'])
export class SlotOccupancyLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  slotId: string;

  @Column({ nullable: true })
  bookingId: string;

  @Column()
  occupiedAt: Date;

  @Column({ nullable: true })
  vacatedAt: Date;

  @Column({ type: 'int', nullable: true })
  durationMinutes: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  revenue: number;

  @Column({ default: false })
  wasReserved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => ParkingSlot)
  @JoinColumn({ name: 'slotId' })
  slot: ParkingSlot;
}
