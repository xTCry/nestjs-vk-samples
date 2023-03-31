import { UseFilters, UseGuards } from '@nestjs/common';
import { InjectVkApi, Update, Ctx, Hears } from 'nestjs-vk';
import { MessageContext, getRandomId, VK } from 'vk-io';

import { VkExceptionFilter, AdminGuard } from '../common';
import { ScenesIds } from 'src/common/enums/scenens-ids.enum';

@Update()
@UseFilters(VkExceptionFilter)
export class BotFirstlUpdate {
  constructor(
    @InjectVkApi('firstBot')
    private readonly firstBot: VK,
    @InjectVkApi('secondBot')
    private readonly secondBot: VK,
  ) {}

  @Hears('/info')
  onInfoCommand(@Ctx() ctx: MessageContext) {
    const message = `
    bot1:
    Info:
    • user: ${JSON.stringify(ctx.session.user).slice(0, 150)}
    `;

    return message;
  }

  @Hears(['Start', 'start'])
  async onStart(@Ctx() ctx: MessageContext) {
    return `bot1: Hey`;
  }

  @Hears('signup')
  async onSignup(@Ctx() ctx: MessageContext) {
    ctx.scene.enter(ScenesIds.signup);
  }

  @Hears('/admin')
  @UseGuards(AdminGuard)
  onAdminCommand(@Ctx() ctx: MessageContext) {
    ctx.send('bot1: admin, welcome!');
  }

  @Hears('/all')
  async onAllCommand(@Ctx() ctx: MessageContext) {
    const message = `Hello, ${ctx.session.user.firstName} ${ctx.session.user.age} old. (${ctx.createdAt})`;

    await this.firstBot.api.messages.send({
      peer_ids: ctx.peerId,
      message: `bot1: ${message}`,
      random_id: getRandomId(),
    });

    await this.secondBot.api.messages.send({
      peer_ids: ctx.peerId,
      message: `bot2: ${message}`,
      random_id: getRandomId(),
    });
  }
}
