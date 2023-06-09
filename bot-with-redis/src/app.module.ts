import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VkModule } from 'nestjs-vk';

import { BotModule } from './bot/bot.module';
import { MainMiddleware } from './common/middleware/main.middleware';

@Global()
@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
  ],
  providers: [MainMiddleware],
  exports: [MainMiddleware],
})
export class AppModule {}
