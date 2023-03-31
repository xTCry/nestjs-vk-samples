import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { VkModule } from 'nestjs-vk';

import { BotFirstModule } from './bot-first/bot-first.module';
import { BotSecondlModule } from './bot-second/bot-second.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    VkModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      vkName: 'firstBot',
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN_1'),
        options: {
          pollingGroupId: configService.get<number>('BOT_GROUP_ID_1'),
          apiMode: 'sequential',
        },
        notReplyMessage: true,
        include: [BotFirstModule],
      }),
    }),
    VkModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      vkName: 'secondBot',
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN_2'),
        options: {
          pollingGroupId: configService.get<number>('BOT_GROUP_ID_2'),
          apiMode: 'sequential',
        },
        notReplyMessage: true,
        include: [BotSecondlModule],
      }),
    }),
    BotFirstModule,
    BotSecondlModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
