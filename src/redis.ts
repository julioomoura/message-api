import {
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts,
  createClient,
} from "redis";

export class CacheClient {
  #redisClient: RedisClient;
  constructor(redisClient: RedisClient) {
    this.#redisClient = redisClient;
  }

  getRedisClient() {
    return this.#redisClient;
  }
}

export async function createRedisClient(): Promise<RedisClient> {
  return await createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  })
    .on("connect", () => console.log("Redis Client Connected"))
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
}

export type RedisClient = RedisClientType<
  RedisDefaultModules & RedisModules,
  RedisFunctions,
  RedisScripts
>;
