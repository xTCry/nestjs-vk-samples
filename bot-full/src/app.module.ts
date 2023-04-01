import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VkModule } from 'nestjs-vk';

import { BotModule } from './bot/bot.module';
import { MainMiddleware } from './common/middleware/main.middleware';
import { MetricsModule } from './metrics/metrics.module';
import { RedisModule } from './redis/redis.module';

@Global()
@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MetricsModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        appName: configService.get<string>('APP_NAME'),
        prometheusEnabled: configService.get<boolean>('PROMETHEUS_ENABLED'),
      }),
    }),
    VkModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, MainMiddleware],
      useFactory: async (configService: ConfigService, mainMiddleware: MainMiddleware) => ({
        token: configService.get<string>('BOT_TOKEN'),
        options: {
          pollingGroupId: configService.get<number>('BOT_GROUP_ID'),
          apiMode: 'sequential',
        },
        useSessionManager: false,
        notReplyMessage: true,
        middlewaresBefore: [mainMiddleware.middlewaresBefore],
        include: [BotModule],
      }),
    }),
    BotModule,
    RedisModule,
  ],
  providers: [MainMiddleware],
  exports: [MainMiddleware],
})
export class AppModule {}
