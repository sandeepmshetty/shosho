import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export enum SocialPlatform {
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REVOKED = 'revoked',
  ERROR = 'error',
}

@Entity('social_accounts')
@Index(['userId', 'platform'], { unique: true })
@Index(['platformId', 'platform'], { unique: true })
export class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  platformId: string; // The user's ID on the platform (e.g., Twitter user ID)

  @Column()
  @IsNotEmpty()
  @IsString()
  username: string; // The username on the platform

  @Column({
    type: 'enum',
    enum: SocialPlatform,
  })
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @Column({ select: false }) // Exclude from default selects for security
  accessToken: string;

  @Column({ nullable: true, select: false }) // Exclude from default selects for security
  refreshToken: string;

  @Column({ nullable: true })
  tokenExpiresAt: Date;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  @IsEnum(AccountStatus)
  status: AccountStatus;

  @Column({ nullable: true })
  lastSyncedAt: Date;

  @Column({ nullable: true })
  errorMessage: string;

  @ManyToOne(() => User, (user) => user.socialAccounts)
  user: User;

  @Column()
  @IsUUID()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper methods
  isTokenExpired(): boolean {
    if (!this.tokenExpiresAt) return true;
    return new Date() > this.tokenExpiresAt;
  }

  needsRefresh(): boolean {
    if (!this.tokenExpiresAt) return true;
    // Refresh if token expires in less than 1 hour
    const oneHourFromNow = new Date(new Date().getTime() + 60 * 60 * 1000);
    return this.tokenExpiresAt < oneHourFromNow;
  }

  isActive(): boolean {
    return this.status === AccountStatus.ACTIVE;
  }
}
