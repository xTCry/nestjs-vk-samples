import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Composer } from 'vk-io';
import { SessionManager } from '@vk-io/session';
import { RedisStorage } from 'vk-io-redis-storage';
import { NextMiddleware, MiddlewareReturn } from 'middleware-io';

import { Context } from 'src/interfaces/context.interface';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class MainMiddleware {
  private readonly sessionManager: SessionManager;
  private readonly redisStorage: RedisStorage;

  constructor(private readonly configService: ConfigService, private readonly metricsService: MetricsService) {
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

    composer.use(this.middlewareMetrics);
    composer.use(this.sessionManager.middleware);

    return composer.compose();
  }

  private get middlewareMetrics() {
    return async (ctx: Context, next: NextMiddleware): Promise<MiddlewareReturn> => {
      const { type: updateType } = ctx;
      const duration = this.metricsService.vkRequestDurationHistogram.startTimer({
        updateType,
      });

      try {
        await next?.();
        this.metricsService.vkRequestCounter.inc({
          updateType,
          status: 'success',
        });
        duration({ status: 'success' });
      } catch (err) {
        this.metricsService.vkRequestCounter.inc({
          updateType,
          status: 'error',
        });
        duration({ status: 'error' });
        throw err;
      } finally {
        // duration();
      }
      return;
    };
  }
}
