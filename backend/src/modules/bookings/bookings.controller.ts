import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, ExtendBookingDto, CancelBookingDto, CheckInBookingDto, CheckOutBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthUser } from '@auth/schemas/auth-user.entity';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 404, description: 'Parking slot not found' })
  @ApiResponse({ status: 409, description: 'Slot not available or time conflict' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user bookings' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.findAll(user, page, limit);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get booking history' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Booking history retrieved successfully' })
  async getHistory(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.getBookingHistory(user, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Cannot update booking in current status' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.update(id, updateBookingDto, user);
  }

  @Post(':id/extend')
  @ApiOperation({ summary: 'Extend booking duration' })
  @ApiResponse({ status: 200, description: 'Booking extended successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Cannot extend booking in current status' })
  async extend(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() extendBookingDto: ExtendBookingDto,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.extend(id, extendBookingDto, user);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Cannot cancel booking in current status' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelBookingDto: CancelBookingDto,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.cancel(id, cancelBookingDto, user);
  }

  @Post(':id/checkin')
  @ApiOperation({ summary: 'Check in for booking' })
  @ApiResponse({ status: 200, description: 'Checked in successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Cannot check in for booking in current status' })
  async checkIn(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() checkInDto: CheckInBookingDto,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.checkIn(id, checkInDto, user);
  }

  @Post(':id/checkout')
  @ApiOperation({ summary: 'Check out from booking' })
  @ApiResponse({ status: 200, description: 'Checked out successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Cannot check out for booking in current status' })
  async checkOut(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() checkOutDto: CheckOutBookingDto,
    @GetUser() user: AuthUser,
  ) {
    return this.bookingsService.checkOut(id, checkOutDto, user);
  }
}
