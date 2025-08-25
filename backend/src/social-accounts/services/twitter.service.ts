import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import {
  SocialPlatform,
  AccountStatus,
} from '../entities/social-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '../entities/social-account.entity';
import { lastValueFrom } from 'rxjs';
import {
  TwitterTokenResponse,
  TwitterUserResponse,
  TwitterAnalyticsResponse,
} from '../interfaces/twitter.interface';

@Injectable()
export class TwitterService {
  private readonly twitterTokenUrl: string;
  private readonly twitterOAuthUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
  ) {
    this.twitterTokenUrl = this.configService.getOrThrow('TWITTER_TOKEN_URL');
    this.twitterOAuthUrl = this.configService.getOrThrow('TWITTER_OAUTH_URL');
    this.clientId = this.configService.getOrThrow('TWITTER_CLIENT_ID');
    this.clientSecret = this.configService.getOrThrow('TWITTER_CLIENT_SECRET');
    this.redirectUri = this.configService.getOrThrow('TWITTER_REDIRECT_URI');
  }

  getPlatform(): SocialPlatform {
    return SocialPlatform.TWITTER;
  }

  getAuthorizationUrl(state: string): string {
    const scope =
      'tweet.read tweet.write users.read follows.read follows.write';

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope,
      state,
    });

    return `${this.twitterOAuthUrl}?${params.toString()}`;
  }

  async handleCallback(code: string, userId: string): Promise<SocialAccount> {
    // Exchange code for access token
    const tokenResponse = await lastValueFrom(
      this.httpService.post<TwitterTokenResponse>(
        this.twitterTokenUrl,
        new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code_verifier: 'challenge',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${this.clientId}:${this.clientSecret}`,
            ).toString('base64')}`,
          },
        },
      ),
    );

    // Get user info from Twitter
    const userResponse = await lastValueFrom(
      this.httpService.get<TwitterUserResponse>(
        'https://api.twitter.com/2/users/me',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
          },
        },
      ),
    );

    // Create or update social account
    const socialAccount = new SocialAccount();
    socialAccount.userId = userId;
    socialAccount.platform = SocialPlatform.TWITTER;
    socialAccount.platformId = userResponse.data.data.id;
    socialAccount.username = userResponse.data.data.username;
    socialAccount.accessToken = tokenResponse.data.access_token;
    socialAccount.refreshToken = tokenResponse.data.refresh_token;
    socialAccount.tokenExpiresAt = new Date(
      Date.now() + tokenResponse.data.expires_in * 1000,
    );
    socialAccount.status = AccountStatus.ACTIVE;

    return this.socialAccountRepository.save(socialAccount);
  }

  async refreshToken(accountId: string): Promise<void> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
    });

    if (!account || !account.refreshToken) {
      throw new UnauthorizedException('Invalid account or refresh token');
    }

    const tokenResponse = await lastValueFrom(
      this.httpService.post<TwitterTokenResponse>(
        this.twitterTokenUrl,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: account.refreshToken,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${this.clientId}:${this.clientSecret}`,
            ).toString('base64')}`,
          },
        },
      ),
    );

    account.accessToken = tokenResponse.data.access_token;
    account.refreshToken = tokenResponse.data.refresh_token;
    account.tokenExpiresAt = new Date(
      Date.now() + tokenResponse.data.expires_in * 1000,
    );

    await this.socialAccountRepository.save(account);
  }

  async getUserAccounts(userId: string): Promise<SocialAccount[]> {
    return this.socialAccountRepository.find({
      where: {
        userId,
        platform: SocialPlatform.TWITTER,
      },
    });
  }

  async getAccountAnalytics(
    accountId: string,
  ): Promise<TwitterAnalyticsResponse> {
    const account = await this.socialAccountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    // Check if token needs refresh
    if (account.needsRefresh()) {
      await this.refreshToken(accountId);
    }

    // Get Twitter analytics data
    const analyticsResponse = await lastValueFrom(
      this.httpService.get<TwitterAnalyticsResponse>(
        `https://api.twitter.com/2/users/${account.platformId}/tweets/metrics/organic`,
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
          },
        },
      ),
    );

    return analyticsResponse.data;
  }
}
