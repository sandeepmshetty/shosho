import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SocialPlatform } from '../entities/social-account.entity';

@Injectable()
export class FacebookService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getPlatform(): SocialPlatform {
    return SocialPlatform.FACEBOOK;
  }

  getAuthorizationUrl(): string {
    // Get typed configuration values
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const redirectUri = this.configService.get<string>('FACEBOOK_REDIRECT_URI');

    if (!clientId || !redirectUri) {
      throw new Error('Missing required Facebook configuration');
    }

    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=public_profile,email`;
  }

  // Add other Facebook-specific methods here
}
