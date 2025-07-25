import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AuthUser } from '@auth/schemas/auth-user.entity';
import { ParkingSlot } from '@parking/schemas/parking-slot.entity';
import { UserVehicle } from '@vehicles/schemas/user-vehicle.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  EXPIRED = 'expired',
}

export enum BookingType {
  HOURLY = 'hourly',
  DAILY = 'daily',
  MONTHLY = 'monthly',
  INSTANT = 'instant',
}

@Entity({ name: 'bookings' })
@Index('idx_booking_user', ['userId'])
@Index('idx_booking_slot', ['slotId'])
@Index('idx_booking_status', ['status'])
@Index('idx_booking_time_range', ['startTime', 'endTime'])
@Index('idx_booking_date_status', ['startTime', 'status'])
@Index('idx_booking_vehicle', ['vehicleId'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  slotId: string;

  @Column({ nullable: true })
  vehicleId: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: BookingType,
    default: BookingType.HOURLY,
  })
  type: BookingType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  baseAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ nullable: true })
  licensePlate: string;

  @Column({ nullable: true })
  qrCode: string;

  @Column({ nullable: true })
  confirmationCode: string;

  @Column({ type: 'text', nullable: true })
  specialInstructions: string;

  @Column({ default: false })
  isExtended: boolean;

  @Column({ nullable: true })
  originalEndTime: Date;

  @Column({ type: 'int', default: 0 })
  extensionMinutes: number;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelledBy: string; // userId who cancelled

  @Column({ nullable: true })
  checkedInAt: Date;

  @Column({ nullable: true })
  checkedOutAt: Date;

  @Column({ nullable: true })
  actualStartTime: Date;

  @Column({ nullable: true })
  actualEndTime: Date;

  @Column({ type: 'int', nullable: true })
  actualDurationMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  overstayAmount: number;

  @Column({ default: false })
  requiresPayment: boolean;

  @Column({ nullable: true })
  paymentDeadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => AuthUser)
  @JoinColumn({ name: 'userId' })
  user: AuthUser;

  @ManyToOne(() => ParkingSlot)
  @JoinColumn({ name: 'slotId' })
  slot: ParkingSlot;

  @ManyToOne(() => UserVehicle)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: UserVehicle;
}

// Booking extensions tracking
@Entity({ name: 'booking_extensions' })
@Index('idx_booking_extensions_booking', ['bookingId'])
export class BookingExtension {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bookingId: string;

  @Column()
  originalEndTime: Date;

  @Column()
  newEndTime: Date;

  @Column({ type: 'int' })
  extensionMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  extensionFee: number;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Booking)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;
}
