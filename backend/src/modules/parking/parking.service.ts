import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { ParkingLocation, LocationStatus } from '@parking/schemas/parking-location.entity';
import { ParkingSlot, SlotStatus } from '@parking/schemas/parking-slot.entity';
import { AuthUser, UserRole } from '@auth/schemas/auth-user.entity';
import { CreateParkingLocationDto, UpdateParkingLocationDto, CreateParkingSlotDto, UpdateParkingSlotDto } from './dto/parking.dto';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(ParkingLocation)
    private locationRepository: Repository<ParkingLocation>,
    @InjectRepository(ParkingSlot)
    private slotRepository: Repository<ParkingSlot>,
  ) {}

  // Location methods
  async createLocation(createLocationDto: CreateParkingLocationDto, vendor: AuthUser): Promise<ParkingLocation> {
    if (vendor.role !== UserRole.VENDOR && vendor.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only vendors can create parking locations');
    }

    // Check if location name already exists for this vendor
    const existingLocation = await this.locationRepository.findOne({
      where: { name: createLocationDto.name, vendorId: vendor.id },
    });

    if (existingLocation) {
      throw new ConflictException('Location with this name already exists');
    }

    const location = this.locationRepository.create({
      ...createLocationDto,
      vendorId: vendor.id,
    });

    return this.locationRepository.save(location);
  }

  async findAllLocations(
    page: number = 1,
    limit: number = 10,
    search?: string,
    city?: string,
    type?: string,
    latitude?: number,
    longitude?: number,
    radius?: number,
  ): Promise<{
    locations: ParkingLocation[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    let queryBuilder = this.locationRepository.createQueryBuilder('location')
      .where('location.status = :status', { status: LocationStatus.ACTIVE })
      .leftJoinAndSelect('location.vendor', 'vendor');

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(location.name ILIKE :search OR location.description ILIKE :search OR location.address ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (city) {
      queryBuilder = queryBuilder.andWhere('location.city ILIKE :city', { city: `%${city}%` });
    }

    if (type) {
      queryBuilder = queryBuilder.andWhere('location.type = :type', { type });
    }

    // Geolocation-based search
    if (latitude && longitude && radius) {
      queryBuilder = queryBuilder.andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(location.latitude)) * cos(radians(location.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(location.latitude)))) <= :radius`,
        { lat: latitude, lng: longitude, radius }
      );
    }

    const [locations, total] = await queryBuilder
      .orderBy('location.rating', 'DESC')
      .addOrderBy('location.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      locations,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findLocationById(id: string): Promise<ParkingLocation> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });

    if (!location) {
      throw new NotFoundException('Parking location not found');
    }

    return location;
  }

  async updateLocation(id: string, updateLocationDto: UpdateParkingLocationDto, user: AuthUser): Promise<ParkingLocation> {
    const location = await this.findLocationById(id);

    if (location.vendorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own locations');
    }

    await this.locationRepository.update(id, updateLocationDto);
    return this.findLocationById(id);
  }

  async deleteLocation(id: string, user: AuthUser): Promise<void> {
    const location = await this.findLocationById(id);

    if (location.vendorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own locations');
    }

    // Check if there are active bookings
    const activeSlots = await this.slotRepository.count({
      where: { locationId: id, status: SlotStatus.OCCUPIED },
    });

    if (activeSlots > 0) {
      throw new BadRequestException('Cannot delete location with occupied slots');
    }

    await this.locationRepository.update(id, { status: LocationStatus.INACTIVE });
  }

  async getVendorLocations(vendorId: string, page: number = 1, limit: number = 10): Promise<{
    locations: ParkingLocation[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [locations, total] = await this.locationRepository.findAndCount({
      where: { vendorId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      locations,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Slot methods
  async createSlot(locationId: string, createSlotDto: CreateParkingSlotDto, user: AuthUser): Promise<ParkingSlot> {
    const location = await this.findLocationById(locationId);

    if (location.vendorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only add slots to your own locations');
    }

    // Check if slot number already exists in this location
    const existingSlot = await this.slotRepository.findOne({
      where: { locationId, slotNumber: createSlotDto.slotNumber },
    });

    if (existingSlot) {
      throw new ConflictException('Slot number already exists in this location');
    }

    const slot = this.slotRepository.create({
      ...createSlotDto,
      locationId,
    });

    const savedSlot = await this.slotRepository.save(slot);

    // Update location total slots count
    await this.updateLocationSlotCounts(locationId);

    return savedSlot;
  }

  async findLocationSlots(
    locationId: string,
    page: number = 1,
    limit: number = 10,
    type?: string,
    status?: string,
  ): Promise<{
    slots: ParkingSlot[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const where: any = { locationId, isActive: true };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    const [slots, total] = await this.slotRepository.findAndCount({
      where,
      relations: ['location'],
      order: { slotNumber: 'ASC' },
      skip,
      take: limit,
    });

    return {
      slots,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findSlotById(id: string): Promise<ParkingSlot> {
    const slot = await this.slotRepository.findOne({
      where: { id },
      relations: ['location'],
    });

    if (!slot) {
      throw new NotFoundException('Parking slot not found');
    }

    return slot;
  }

  async updateSlot(id: string, updateSlotDto: UpdateParkingSlotDto, user: AuthUser): Promise<ParkingSlot> {
    const slot = await this.findSlotById(id);

    if (slot.location.vendorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update slots in your own locations');
    }

    await this.slotRepository.update(id, updateSlotDto);

    // Update location slot counts if status changed
    if (updateSlotDto.status) {
      await this.updateLocationSlotCounts(slot.locationId);
    }

    return this.findSlotById(id);
  }

  async deleteSlot(id: string, user: AuthUser): Promise<void> {
    const slot = await this.findSlotById(id);

    if (slot.location.vendorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete slots in your own locations');
    }

    if (slot.status === SlotStatus.OCCUPIED) {
      throw new BadRequestException('Cannot delete occupied slot');
    }

    await this.slotRepository.update(id, { isActive: false });
    await this.updateLocationSlotCounts(slot.locationId);
  }

  async getAvailableSlots(
    locationId: string,
    startTime: Date,
    endTime: Date,
    type?: string,
  ): Promise<ParkingSlot[]> {
    let queryBuilder = this.slotRepository.createQueryBuilder('slot')
      .leftJoin('slot.bookings', 'booking')
      .where('slot.locationId = :locationId', { locationId })
      .andWhere('slot.isActive = true')
      .andWhere('slot.status = :status', { status: SlotStatus.AVAILABLE });

    if (type) {
      queryBuilder = queryBuilder.andWhere('slot.type = :type', { type });
    }

    // Exclude slots with conflicting bookings
    queryBuilder = queryBuilder.andWhere(
      `NOT EXISTS (
        SELECT 1 FROM bookings b 
        WHERE b.slotId = slot.id 
        AND b.status IN ('confirmed', 'active') 
        AND b.startTime < :endTime 
        AND b.endTime > :startTime
      )`,
      { startTime, endTime }
    );

    return queryBuilder
      .orderBy('slot.slotNumber', 'ASC')
      .getMany();
  }

  private async updateLocationSlotCounts(locationId: string): Promise<void> {
    const totalSlots = await this.slotRepository.count({
      where: { locationId, isActive: true },
    });

    const availableSlots = await this.slotRepository.count({
      where: { locationId, isActive: true, status: SlotStatus.AVAILABLE },
    });

    await this.locationRepository.update(locationId, {
      totalSlots,
      availableSlots,
    });
  }

  async getLocationStats(locationId: string, user: AuthUser): Promise<any> {
    const location = await this.findLocationById(locationId);

    if (location.vendorId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only view stats for your own locations');
    }

    const stats = await this.slotRepository
      .createQueryBuilder('slot')
      .select([
        'COUNT(*) as totalSlots',
        'COUNT(CASE WHEN slot.status = :available THEN 1 END) as availableSlots',
        'COUNT(CASE WHEN slot.status = :occupied THEN 1 END) as occupiedSlots',
        'COUNT(CASE WHEN slot.status = :reserved THEN 1 END) as reservedSlots',
      ])
      .where('slot.locationId = :locationId', { locationId })
      .andWhere('slot.isActive = true')
      .setParameters({
        available: SlotStatus.AVAILABLE,
        occupied: SlotStatus.OCCUPIED,
        reserved: SlotStatus.RESERVED,
      })
      .getRawOne();

    return {
      location,
      stats,
    };
  }
}
