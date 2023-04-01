# Description

Example of bot with `Redis` as `session` storage

# Configuration

Configure `.env` file

# Installation

```bash
$ yarn install
```

Install [docker](https://www.docker.com/)

# Running the app

```bash
# docker
$ docker compose up -d

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# Tips

## Env

1. `BOT_TOKEN` - created in vk bot token, see other tutorials
2. `BOT_GROUP_ID` - group id, example `https://vk.com/club219624730` - `219624730`

## Docker

1. Install [docker](https://www.docker.com/)
2. Documentation [docker](https://docs.docker.com/)

## Session

1. `Session` save data in memory, if process terminated all data deletes, use `session` with some storage e.g. `Redis`
2. `Session` one in all bot, (same `session` in `*.update.ts` and `*.scene.ts`)

## Context

1. `State` of `context` each on `*.update.ts` and `*.scene.ts`

## Common

1. `VkExceptionFilter` catch all `VkException`
2. `AdminGuard` throws `VkException` and `VkExceptionFilter` catched it, and send to user

## Libs

1. (@nestjs/config)[https://docs.nestjs.com/techniques/configuration]
2. (ioredis)[https://www.npmjs.com/package//ioredis]
3. (redlock)[https://www.npmjs.com/package/redlock]
4. (@digikare/nestjs-prom)[https://www.npmjs.com/package/@digikare/nestjs-prom]
5. (vk-io-redis-storage)[https://socket.dev/npm/package/vk-io-redis-storage]
