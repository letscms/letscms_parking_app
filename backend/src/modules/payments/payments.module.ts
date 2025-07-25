import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Payment, WalletTransaction } from '@payments/schemas';
import { Booking } from '@bookings/schemas/booking.entity';
import { AuthUser } from '@auth/schemas/auth-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      WalletTransaction,
      Booking,
      AuthUser,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
