# Examples

- [`echo-bot`](https://github.com/xTCry/nestjs-vk-samples/tree/master/echo-bot) - sample for begginers
- [`multiple-bots`](https://github.com/xTCry/nestjs-vk-samples/tree/master/multiple-bots) - sample multiple bots
- [`bot-with-redis`](https://github.com/xTCry/nestjs-vk-samples/tree/master/bot-with-redis) - sample bot with `Redis` as `session` storage

# Tips

## Env

1. `BOT_TOKEN` - created in vk bot token, see other tutorials
2. `BOT_GROUP_ID` - group id, example `https://vk.com/club219624730` - `219624730`

## Docker

1. Install [docker](https://www.docker.com/)
2. Documentation [docker](https://docs.docker.com/)

## Context

1. `State` of `context` each on `*.update.ts` and `*.scene.ts`

## Session

1. `Session` save data in memory, if process terminated all data deletes, use `session` with some storage e.g. `Redis`
2. `Session` one in all bot, (same `session` in `*.update.ts` and `*.scene.ts`)

### Scenes

1. `constructor()` calls once
2. `destructor()` calls once
3. `@SceneEnter()` calls on each message
4. `@SceneLeave()` calls once
5. `@AddStep()` calls on each message, `if (ctx.scene.step === <current-step>)`
6. You can specify `AddStep(<step-number>)`, but it's optionaly, first in top class method, last in bottom class method
7. If `AddStep(10)` and `<current-step>` is `7` and calls `ctx.scene.step.next()` next step is `AddStep(10)`
8. `@Hear()`, `@HearsFallback()` doesn't works in `*.scene.ts`

## Middleware chain

1. `@On('message_new')`
2. `@Hears(`...`)` - if matched
3. `@HearFallback()`

## Common

1. `VkExceptionFilter` catch all `VkException`
2. `AdminGuard` throws `VkException` and `VkExceptionFilter` catched it, and send to user
