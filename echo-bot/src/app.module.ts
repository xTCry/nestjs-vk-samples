import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { VkModule } from 'nestjs-vk';

import { EchoModule } from './echo/echo.module';

@Global()
@Module({
  imports: [
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    VkModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
        options: {
          pollingGroupId: configService.get<number>('BOT_GROUP_ID'),
          apiMode: 'sequential',
        },
        notReplyMessage: true,
        include: [EchoModule],
      }),
    }),
    EchoModule,
  ],
})
export class AppModule {}
