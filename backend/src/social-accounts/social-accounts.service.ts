import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SocialAccount,
  SocialPlatform,
} from './entities/social-account.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocialAccountsService {
  constructor(
    @InjectRepository(SocialAccount)
    private socialAccountsRepository: Repository<SocialAccount>,
    private configService: ConfigService,
  ) {}

  async findUserAccounts(userId: string, platform?: SocialPlatform) {
    const query = this.socialAccountsRepository
      .createQueryBuilder('social_account')
      .where('social_account.userId = :userId', { userId });

    if (platform) {
      query.andWhere('social_account.platform = :platform', { platform });
    }

    return query.getMany();
  }

  async createSocialAccount(
    userId: string,
    platform: SocialPlatform,
    platformId: string,
    username: string,
    accessToken: string,
    refreshToken?: string,
    tokenExpiresAt?: Date,
  ) {
    const socialAccount = this.socialAccountsRepository.create({
      userId,
      platform,
      platformId,
      username,
      accessToken,
      refreshToken,
      tokenExpiresAt,
    });

    return this.socialAccountsRepository.save(socialAccount);
  }

  async deleteSocialAccount(userId: string, accountId: string) {
    return this.socialAccountsRepository.delete({
      id: accountId,
      userId,
    });
  }

  async refreshTwitterToken(accountId: string) {
    const account = await this.socialAccountsRepository.findOne({
      where: { id: accountId, platform: SocialPlatform.TWITTER },
    });

    if (!account || !account.refreshToken) {
      throw new Error('No refresh token available');
    }

    // Implement Twitter token refresh logic here
    // This will depend on your Twitter API configuration
  }
}
