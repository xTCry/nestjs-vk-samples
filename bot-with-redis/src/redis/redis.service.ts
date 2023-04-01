import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedisService {
  public readonly redis: Redis;
  public readonly redlock: Redlock;

  constructor(configService: ConfigService) {
    this.redis = new Redis(configService.get<number>('REDIS_PORT'), configService.get<string>('REDIS_HOST'), {
      keyPrefix: 'bot:',
    });

    this.redlock = new Redlock([this.redis]);
  }
}
