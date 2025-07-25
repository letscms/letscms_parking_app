import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser, UserRole, UserStatus } from '@auth/schemas';
import { UpdateProfileDto, UpdateUserStatusDto, UpdateUserRoleDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(AuthUser)
    private userRepository: Repository<AuthUser>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, role?: string): Promise<{
    users: AuthUser[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    
    const queryBuilder = this.userRepository.createQueryBuilder('u')
      .select([
        'u.id',
        'u.name',
        'u.email',
        'u.mobile',
        'u.role',
        'u.status',
        'u.isEmailVerified',
        'u.isMobileVerified',
        'u.profileImage',
        'u.walletBalance',
        'u.createdAt',
        'u.updatedAt'
      ])
      .skip(skip)
      .take(limit)
      .orderBy('u.createdAt', 'DESC');

    if (role) {
      queryBuilder.where('u.role = :role', { role });
    }

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'name',
        'email',
        'mobile',
        'role',
        'status',
        'isEmailVerified',
        'isMobileVerified',
        'profileImage',
        'walletBalance',
        'createdAt',
        'updatedAt'
      ],
      relations: ['vehicles', 'bookings', 'parkingLocations'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email/mobile already exists (if being updated)
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateProfileDto.email },
      });
      if (existingUser) {
        throw new ForbiddenException('Email already exists');
      }
    }

    if (updateProfileDto.mobile && updateProfileDto.mobile !== user.mobile) {
      const existingUser = await this.userRepository.findOne({
        where: { mobile: updateProfileDto.mobile },
      });
      if (existingUser) {
        throw new ForbiddenException('Mobile number already exists');
      }
    }

    await this.userRepository.update(userId, updateProfileDto);
    
    return this.findOne(userId);
  }

  async updateStatus(userId: string, updateStatusDto: UpdateUserStatusDto, adminUser: AuthUser) {
    // Only admin can update user status
    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update user status');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, { status: updateStatusDto.status });
    
    return this.findOne(userId);
  }

  async updateRole(userId: string, updateRoleDto: UpdateUserRoleDto, adminUser: AuthUser) {
    // Only admin can update user role
    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update user roles');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, { role: updateRoleDto.role });
    
    return this.findOne(userId);
  }

  async deleteUser(userId: string, adminUser: AuthUser) {
    // Only admin can delete users
    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    
    return { message: 'User deleted successfully' };
  }

  async getUserStats() {
    const [totalUsers, totalVendors, activeUsers] = await Promise.all([
      this.userRepository.count({ where: { role: UserRole.USER } }),
      this.userRepository.count({ where: { role: UserRole.VENDOR } }),
      this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
    ]);

    return {
      totalUsers,
      totalVendors,
      activeUsers,
      inactiveUsers: totalUsers + totalVendors - activeUsers,
    };
  }
}
