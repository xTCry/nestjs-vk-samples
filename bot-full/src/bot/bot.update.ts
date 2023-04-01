import { UseFilters } from '@nestjs/common';
import { Ctx, Hears, Update } from 'nestjs-vk';

import { VkExceptionFilter } from '../common';
import { MessageContext } from 'vk-io';

@Update()
@UseFilters(VkExceptionFilter)
export class BotUpdate {
  @Hears('start')
  async onStart(@Ctx() ctx: MessageContext) {
    ctx.session.user = { firstName: 'Никита', age: 17 };
  }

  @Hears('/info')
  async onCommandInfo(@Ctx() ctx: MessageContext) {
    console.log(ctx.session);
  }
}
