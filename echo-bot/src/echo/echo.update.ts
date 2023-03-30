import { UseFilters, UseGuards } from '@nestjs/common';
import { InjectVkApi, Update, On, Ctx, Next, Message, Hears, HearFallback } from 'nestjs-vk';
import { MessageContext, VK } from 'vk-io';
import { NextMiddleware } from 'middleware-io';

import { EchoService } from './echo.service';
import { Context } from '../interfaces/context.interface';
import { VkExceptionFilter, AdminGuard, ReverseTextPipe } from '../common';

@Update()
@UseFilters(VkExceptionFilter)
export class EchoUpdate {
  public groupId: number;

  constructor(
    @InjectVkApi()
    private readonly bot: VK,
    private readonly echoService: EchoService,
  ) {}

  async onModuleInit() {
    try {
      const [group] = await this.bot.api.groups.getById({});
      this.groupId = group.id;
    } catch (err) {
      console.error(err);
    }
  }

  @Hears(['Start', 'start'])
  async onStartCommand(@Ctx() ctx: Context, @Next() next: NextMiddleware) {
    if (ctx.session.isAuth) {
      return await next(); // next middleware is onHearFallback
    }

    ctx.session.isAuth = true;
    return 'Send any message';
  }

  @On('message_new')
  async onNewMessage(@Ctx() ctx: MessageContext, @Next() next: NextMiddleware) {
    console.log('ctx session:', ctx.session);
    ctx.session.counter = (ctx.session.counter || 0) + 1;

    // if we write to bot 'Start' or 'start', next middleware is onStartCommand
    // in other cases next middleware is onHearFallback
    await next();
  }

  @Hears('/sub')
  async onSubscriberCommand(@Ctx() ctx: MessageContext) {
    const isSib = await this.bot.api.groups.isMember({
      group_id: String(this.groupId),
      user_id: ctx.senderId,
    });
    return isSib ? 'You sub' : 'No sub';
  }

  @Hears('/admin')
  @UseGuards(AdminGuard)
  onAdminCommand(@Ctx() ctx: MessageContext) {
    ctx.send({ sticker_id: 5 });
  }

  @HearFallback()
  onHearFallback(@Ctx() ctx: MessageContext, @Message('text', new ReverseTextPipe()) reversedText: string) {
    if (!ctx.session.isAuth) return;

    if (reversedText) {
      return this.echoService.echo(reversedText);
    } else if (ctx.hasAttachments('sticker')) {
      ctx.send({ sticker_id: ctx.getAttachments('sticker')[0].id % 24 }); // reply on all stickers just firs 24 sticker (Spotti dog)
      return;
    }

    return 'What?..';
  }
}
