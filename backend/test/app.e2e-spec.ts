import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
          dropSchema: true,
          autoLoadEntities: true,
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as Server;
  }, 10000);

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(httpServer).get('/').expect(200).expect('Hello World!');
  });
});
