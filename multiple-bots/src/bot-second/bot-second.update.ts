import { UseFilters } from '@nestjs/common';
import { Update, Ctx, Hears } from 'nestjs-vk';
import { MessageContext } from 'vk-io';

import { VkExceptionFilter } from '../common';

@Update()
@UseFilters(VkExceptionFilter)
export class BotSecondlUpdate {
  @Hears('/second')
  onSecondCommand(@Ctx() ctx: MessageContext) {
    ctx.send('bot2: I second bot');
  }
}
