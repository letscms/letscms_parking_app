import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthUser } from '@auth/schemas';
import { UserActivityLog } from '@users/schemas';

@Module({
  imports: [TypeOrmModule.forFeature([AuthUser, UserActivityLog])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
