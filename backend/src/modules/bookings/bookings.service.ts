import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Booking, BookingStatus, BookingExtension } from '@bookings/schemas/booking.entity';
import { ParkingSlot, SlotStatus } from '@parking/schemas/parking-slot.entity';
import { AuthUser } from '@auth/schemas/auth-user.entity';
import { UserVehicle } from '@vehicles/schemas/user-vehicle.entity';
import { CreateBookingDto, UpdateBookingDto, ExtendBookingDto, CancelBookingDto, CheckInBookingDto, CheckOutBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(BookingExtension)
    private extensionRepository: Repository<BookingExtension>,
    @InjectRepository(ParkingSlot)
    private slotRepository: Repository<ParkingSlot>,
    @InjectRepository(UserVehicle)
    private vehicleRepository: Repository<UserVehicle>,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: AuthUser): Promise<Booking> {
    const { slotId, vehicleId, startTime, endTime, type, licensePlate, specialInstructions } = createBookingDto;

    // Validate slot exists and is available
    const slot = await this.slotRepository.findOne({
      where: { id: slotId },
      relations: ['location'],
    });

    if (!slot) {
      throw new NotFoundException('Parking slot not found');
    }

    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new ConflictException('Parking slot is not available');
    }

    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      throw new BadRequestException('Start time cannot be in the past');
    }

    if (end <= start) {
      throw new BadRequestException('End time must be after start time');
    }

    // Check for conflicting bookings
    const conflictingBooking = await this.bookingRepository.findOne({
      where: {
        slotId,
        status: In([BookingStatus.CONFIRMED, BookingStatus.ACTIVE]),
        startTime: Between(start, end),
      },
    });

    if (conflictingBooking) {
      throw new ConflictException('Slot is already booked for this time period');
    }

    // Validate vehicle if provided
    let vehicle: UserVehicle | null = null;
    if (vehicleId) {
      vehicle = await this.vehicleRepository.findOne({
        where: { id: vehicleId, userId: user.id, isActive: true },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found or not active');
      }
    }

    // Calculate pricing
    const durationHours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const baseAmount = slot.customHourlyRate || slot.location.hourlyRate || 0;
    const totalAmount = baseAmount * durationHours;

    // Create booking
    const booking = this.bookingRepository.create({
      userId: user.id,
      slotId,
      vehicleId,
      startTime: start,
      endTime: end,
      type,
      baseAmount: baseAmount * durationHours,
      totalAmount,
      licensePlate: licensePlate || vehicle?.licensePlate,
      specialInstructions,
      confirmationCode: this.generateConfirmationCode(),
      qrCode: this.generateQRCode(),
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Update slot status to reserved
    await this.slotRepository.update(slotId, {
      status: SlotStatus.RESERVED,
      currentBookingId: savedBooking.id,
    });

    return this.findOne(savedBooking.id, user);
  }

  async findAll(user: AuthUser, page: number = 1, limit: number = 10): Promise<{
    bookings: Booking[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { userId: user.id },
      relations: ['slot', 'slot.location', 'vehicle'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      bookings,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: AuthUser): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id, userId: user.id },
      relations: ['slot', 'slot.location', 'vehicle', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, user: AuthUser): Promise<Booking> {
    const booking = await this.findOne(id, user);

    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Cannot update booking in current status');
    }

    // Validate new end time if provided
    if (updateBookingDto.endTime) {
      const newEndTime = new Date(updateBookingDto.endTime);
      if (newEndTime <= booking.startTime) {
        throw new BadRequestException('End time must be after start time');
      }

      // Recalculate pricing
      const durationHours = Math.ceil((newEndTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60));
      const slot = await this.slotRepository.findOne({ where: { id: booking.slotId }, relations: ['location'] });
      if (!slot) {
        throw new NotFoundException('Parking slot not found');
      }
      const baseAmount = slot.customHourlyRate || slot.location.hourlyRate || 0;
      
      await this.bookingRepository.update(id, {
        ...updateBookingDto,
        endTime: newEndTime,
        baseAmount: baseAmount * durationHours,
        totalAmount: baseAmount * durationHours,
      });
    } else {
      await this.bookingRepository.update(id, updateBookingDto);
    }

    return this.findOne(id, user);
  }

  async extend(id: string, extendBookingDto: ExtendBookingDto, user: AuthUser): Promise<Booking> {
    const booking = await this.findOne(id, user);

    if (booking.status !== BookingStatus.ACTIVE && booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Cannot extend booking in current status');
    }

    const { extensionMinutes, reason } = extendBookingDto;
    const originalEndTime = booking.endTime;
    const newEndTime = new Date(originalEndTime.getTime() + extensionMinutes * 60000);

    // Calculate extension fee
    const extensionHours = Math.ceil(extensionMinutes / 60);
    const slot = await this.slotRepository.findOne({ where: { id: booking.slotId }, relations: ['location'] });
    if (!slot) {
      throw new NotFoundException('Parking slot not found');
    }
    const hourlyRate = slot.customHourlyRate || slot.location.hourlyRate || 0;
    const extensionFee = hourlyRate * extensionHours;

    // Update booking
    await this.bookingRepository.update(id, {
      endTime: newEndTime,
      originalEndTime: booking.isExtended ? booking.originalEndTime : originalEndTime,
      isExtended: true,
      extensionMinutes: (booking.extensionMinutes || 0) + extensionMinutes,
      totalAmount: booking.totalAmount + extensionFee,
    });

    // Create extension record
    await this.extensionRepository.save({
      bookingId: id,
      originalEndTime,
      newEndTime,
      extensionMinutes,
      extensionFee,
      reason,
    });

    return this.findOne(id, user);
  }

  async cancel(id: string, cancelBookingDto: CancelBookingDto, user: AuthUser): Promise<Booking> {
    const booking = await this.findOne(id, user);

    if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel booking in current status');
    }

    const now = new Date();
    await this.bookingRepository.update(id, {
      status: BookingStatus.CANCELLED,
      cancellationReason: cancelBookingDto.reason,
      cancelledAt: now,
      cancelledBy: user.id,
    });

    // Free up the slot
    await this.slotRepository.update(booking.slotId, {
      status: SlotStatus.AVAILABLE,
      currentBookingId: undefined,
    });

    return this.findOne(id, user);
  }

  async checkIn(id: string, checkInDto: CheckInBookingDto, user: AuthUser): Promise<Booking> {
    const booking = await this.findOne(id, user);

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Cannot check in for booking in current status');
    }

    const now = new Date();
    await this.bookingRepository.update(id, {
      status: BookingStatus.ACTIVE,
      checkedInAt: now,
      actualStartTime: now,
      licensePlate: checkInDto.actualLicensePlate || booking.licensePlate,
    });

    // Update slot status
    await this.slotRepository.update(booking.slotId, {
      status: SlotStatus.OCCUPIED,
    });

    return this.findOne(id, user);
  }

  async checkOut(id: string, checkOutDto: CheckOutBookingDto, user: AuthUser): Promise<Booking> {
    const booking = await this.findOne(id, user);

    if (booking.status !== BookingStatus.ACTIVE) {
      throw new BadRequestException('Cannot check out for booking in current status');
    }

    const now = new Date();
    const actualDurationMinutes = Math.ceil((now.getTime() - booking.actualStartTime.getTime()) / (1000 * 60));

    // Calculate overstay if any
    let overstayAmount = 0;
    if (now > booking.endTime) {
      const overstayMinutes = Math.ceil((now.getTime() - booking.endTime.getTime()) / (1000 * 60));
      const overstayHours = Math.ceil(overstayMinutes / 60);
      const slot = await this.slotRepository.findOne({ where: { id: booking.slotId }, relations: ['location'] });
      if (!slot) {
        throw new NotFoundException('Parking slot not found');
      }
      const hourlyRate = slot.customHourlyRate || slot.location.hourlyRate || 0;
      overstayAmount = hourlyRate * overstayHours * 1.5; // 50% penalty
    }

    await this.bookingRepository.update(id, {
      status: BookingStatus.COMPLETED,
      checkedOutAt: now,
      actualEndTime: now,
      actualDurationMinutes,
      overstayAmount,
      totalAmount: booking.totalAmount + overstayAmount,
    });

    // Free up the slot
    await this.slotRepository.update(booking.slotId, {
      status: SlotStatus.AVAILABLE,
      currentBookingId: undefined,
      lastOccupiedAt: now,
    });

    return this.findOne(id, user);
  }

  async getBookingHistory(user: AuthUser, page: number = 1, limit: number = 10): Promise<{
    bookings: Booking[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [bookings, total] = await this.bookingRepository.findAndCount({
      where: { 
        userId: user.id,
        status: In([BookingStatus.COMPLETED, BookingStatus.CANCELLED]),
      },
      relations: ['slot', 'slot.location', 'vehicle'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      bookings,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  private generateConfirmationCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generateQRCode(): string {
    return `PARKING-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}
