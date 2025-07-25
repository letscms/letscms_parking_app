import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ParkingService } from './parking.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { UserRole } from '@auth/schemas/auth-user.entity';
import { CreateParkingLocationDto, UpdateParkingLocationDto, CreateParkingSlotDto, UpdateParkingSlotDto } from './dto/parking.dto';

@ApiTags('Parking')
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  // Location endpoints
  @Post('locations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new parking location' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @ApiResponse({ status: 403, description: 'Only vendors can create locations' })
  async createLocation(
    @Body() createLocationDto: CreateParkingLocationDto,
    @Request() req: any,
  ) {
    return this.parkingService.createLocation(createLocationDto, req.user);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get all parking locations with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search in name, description, or address' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filter by city' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by parking type' })
  @ApiQuery({ name: 'latitude', required: false, type: Number, description: 'User latitude for nearby search' })
  @ApiQuery({ name: 'longitude', required: false, type: Number, description: 'User longitude for nearby search' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Search radius in kilometers' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  async findAllLocations(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius?: number,
  ) {
    return this.parkingService.findAllLocations(
      page,
      limit,
      search,
      city,
      type,
      latitude,
      longitude,
      radius,
    );
  }

  @Get('locations/:id')
  @ApiOperation({ summary: 'Get parking location by ID' })
  @ApiResponse({ status: 200, description: 'Location retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async findLocationById(@Param('id', ParseUUIDPipe) id: string) {
    return this.parkingService.findLocationById(id);
  }

  @Put('locations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update parking location' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 403, description: 'You can only update your own locations' })
  async updateLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocationDto: UpdateParkingLocationDto,
    @Request() req: any,
  ) {
    return this.parkingService.updateLocation(id, updateLocationDto, req.user);
  }

  @Delete('locations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete parking location' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete location with occupied slots' })
  async deleteLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.parkingService.deleteLocation(id, req.user);
  }

  @Get('vendor/locations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor locations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Vendor locations retrieved successfully' })
  async getVendorLocations(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.parkingService.getVendorLocations(req.user.id, page, limit);
  }

  @Get('locations/:id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get location statistics' })
  @ApiResponse({ status: 200, description: 'Location stats retrieved successfully' })
  async getLocationStats(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.parkingService.getLocationStats(id, req.user);
  }

  // Slot endpoints
  @Post('locations/:locationId/slots')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new parking slot' })
  @ApiResponse({ status: 201, description: 'Slot created successfully' })
  @ApiResponse({ status: 409, description: 'Slot number already exists' })
  async createSlot(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Body() createSlotDto: CreateParkingSlotDto,
    @Request() req: any,
  ) {
    return this.parkingService.createSlot(locationId, createSlotDto, req.user);
  }

  @Get('locations/:locationId/slots')
  @ApiOperation({ summary: 'Get all slots for a location' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by slot type' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by slot status' })
  @ApiResponse({ status: 200, description: 'Slots retrieved successfully' })
  async findLocationSlots(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.parkingService.findLocationSlots(locationId, page, limit, type, status);
  }

  @Get('slots/:id')
  @ApiOperation({ summary: 'Get parking slot by ID' })
  @ApiResponse({ status: 200, description: 'Slot retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Slot not found' })
  async findSlotById(@Param('id', ParseUUIDPipe) id: string) {
    return this.parkingService.findSlotById(id);
  }

  @Put('slots/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update parking slot' })
  @ApiResponse({ status: 200, description: 'Slot updated successfully' })
  @ApiResponse({ status: 403, description: 'You can only update slots in your own locations' })
  async updateSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSlotDto: UpdateParkingSlotDto,
    @Request() req: any,
  ) {
    return this.parkingService.updateSlot(id, updateSlotDto, req.user);
  }

  @Delete('slots/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.VENDOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete parking slot' })
  @ApiResponse({ status: 200, description: 'Slot deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete occupied slot' })
  async deleteSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.parkingService.deleteSlot(id, req.user);
  }

  @Get('locations/:locationId/availability')
  @ApiOperation({ summary: 'Get available slots for a location and time range' })
  @ApiQuery({ name: 'startTime', required: true, type: String, description: 'Start time (ISO string)' })
  @ApiQuery({ name: 'endTime', required: true, type: String, description: 'End time (ISO string)' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by slot type' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully' })
  async getAvailableSlots(
    @Param('locationId', ParseUUIDPipe) locationId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('type') type?: string,
  ) {
    return this.parkingService.getAvailableSlots(
      locationId,
      new Date(startTime),
      new Date(endTime),
      type,
    );
  }
}
