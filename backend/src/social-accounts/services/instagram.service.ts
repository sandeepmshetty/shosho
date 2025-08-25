import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { SocialPlatform } from '../entities/social-account.entity';

@Injectable()
export class InstagramService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getPlatform(): SocialPlatform {
    return SocialPlatform.INSTAGRAM;
  }

  getAuthorizationUrl(): string {
    // Get typed configuration values
    const clientId = this.configService.get<string>('INSTAGRAM_CLIENT_ID');
    const redirectUri = this.configService.get<string>(
      'INSTAGRAM_REDIRECT_URI',
    );

    if (!clientId || !redirectUri) {
      throw new Error('Missing required Instagram configuration');
    }

    return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
  }

  // Add other Instagram-specific methods here
}
