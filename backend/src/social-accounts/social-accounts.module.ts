import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SocialAccount } from './entities/social-account.entity';
import { SocialAccountsService } from './social-accounts.service';
import { SocialAccountsController } from './social-accounts.controller';
import { TwitterService } from './services/twitter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialAccount]),
    ConfigModule,
    HttpModule,
  ],
  providers: [SocialAccountsService, TwitterService],
  controllers: [SocialAccountsController],
  exports: [SocialAccountsService],
})
export class SocialAccountsModule {}
