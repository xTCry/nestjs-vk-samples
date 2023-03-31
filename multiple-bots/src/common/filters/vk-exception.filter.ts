import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { VkArgumentsHost } from 'nestjs-vk';
import { Context } from 'vk-io';

@Catch()
export class VkExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const vkContext = VkArgumentsHost.create(host);
    const ctx = vkContext.getContext<Context>();

    await ctx.send(`Ошибка: ${exception.message}`);
  }
}
