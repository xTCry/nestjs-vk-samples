import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Composer } from 'vk-io';
import { SessionManager } from '@vk-io/session';
import { RedisStorage } from 'vk-io-redis-storage';

import { Context } from 'src/interfaces/context.interface';

@Injectable()
export class MainMiddleware {
  private readonly sessionManager: SessionManager;
  private readonly redisStorage: RedisStorage;

  constructor(private readonly configService: ConfigService) {
    this.redisStorage = new RedisStorage({
      redis: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      },
      ttl: 7 * 24 * 3600,
    });

    this.sessionManager = new SessionManager({
      storage: this.redisStorage,
      getStorageKey: (ctx: Context) => `${ctx.peerId}:${ctx.senderId || ctx.userId}`,
    });
  }

  get middlewaresBefore() {
    const composer = Composer.builder<Context>();

    composer.use(this.sessionManager.middleware);

    return composer.compose();
  }
}
