import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ViewEntity, ViewColumn } from 'typeorm';

// User Profile View (excluding sensitive data)
@ViewEntity({
  name: 'user_profiles',
  expression: `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.mobile,
      u.role,
      u.status,
      u.profile_image,
      u.wallet_balance,
      u.is_email_verified,
      u.is_mobile_verified,
      u.created_at,
      u.updated_at,
      COUNT(v.id) as vehicle_count,
      COUNT(b.id) as booking_count
    FROM users u
    LEFT JOIN user_vehicles v ON u.id = v."userId" AND v."isActive" = true
    LEFT JOIN bookings b ON u.id = b."userId"
    GROUP BY u.id
  `,
})
export class UserProfile {
  @ViewColumn()
  id: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  mobile: string;

  @ViewColumn()
  role: string;

  @ViewColumn()
  status: string;

  @ViewColumn()
  profileImage: string;

  @ViewColumn()
  walletBalance: number;

  @ViewColumn()
  isEmailVerified: boolean;

  @ViewColumn()
  isMobileVerified: boolean;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  updatedAt: Date;

  @ViewColumn()
  vehicleCount: number;

  @ViewColumn()
  bookingCount: number;
}

// User Activity Logs
@Entity({ name: 'user_activity_logs' })
@Index('idx_users_activity_user', ['userId'])
@Index('idx_users_activity_type', ['activityType'])
@Index('idx_users_activity_date', ['createdAt'])
export class UserActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  activityType: string; // 'login', 'logout', 'profile_update', 'booking', etc.

  @Column('jsonb', { nullable: true })
  metadata: any;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;
}
