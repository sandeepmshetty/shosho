import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  Query,
  Post,
} from '@nestjs/common';
import { SocialAccountsService } from './social-accounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocialPlatform } from './entities/social-account.entity';
import { TwitterService } from './services/twitter.service';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string; [key: string]: any };
}

@Controller('social-accounts')
@UseGuards(JwtAuthGuard)
export class SocialAccountsController {
  constructor(
    private readonly socialAccountsService: SocialAccountsService,
    private readonly twitterService: TwitterService,
  ) {}

  @Get()
  async getUserAccounts(@Req() req: RequestWithUser) {
    return this.socialAccountsService.findUserAccounts(req.user.id);
  }

  @Get(':platform')
  async getPlatformAccounts(
    @Req() req: RequestWithUser,
    @Param('platform') platform: SocialPlatform,
  ) {
    return this.socialAccountsService.findUserAccounts(req.user.id, platform);
  }

  @Delete(':id')
  async deleteAccount(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.socialAccountsService.deleteSocialAccount(req.user.id, id);
  }

  // Twitter-specific endpoints
  @Get('twitter/auth')
  async getTwitterAuthUrl(@Req() req: RequestWithUser) {
    const state = `${req.user.id}-${Date.now()}`;
    const authUrl = this.twitterService.getAuthorizationUrl(state);
    return { authUrl, state };
  }

  @Post('twitter/callback')
  async handleTwitterCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: RequestWithUser,
  ) {
    // Verify state parameter contains user ID
    const userId = state.split('-')[0];
    if (userId !== req.user.id) {
      throw new Error('Invalid state parameter');
    }

    return this.twitterService.handleCallback(code, req.user.id);
  }

  @Get('twitter')
  async getTwitterAccounts(@Req() req: RequestWithUser) {
    return this.twitterService.getUserAccounts(req.user.id);
  }

  @Get('twitter/:accountId/analytics')
  async getTwitterAnalytics(
    @Req() req: RequestWithUser,
    @Param('accountId') accountId: string,
  ) {
    return this.twitterService.getAccountAnalytics(accountId);
  }
}
