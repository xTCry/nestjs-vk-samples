import { Module } from '@nestjs/common';

import { BotFirstlUpdate } from './bot-first.update';
import { BestScene } from './scenes/signup/signup.scene';

@Module({
  providers: [BotFirstlUpdate, BestScene],
})
export class BotFirstModule {}
