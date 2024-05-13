import { createClient } from "redis";

export class CacheClient {
  #redisClient;
  constructor(redisClient) {
    this.#redisClient = redisClient;
  }

  getRedisClient() {
    return this.#redisClient;
  }
}

export async function createRedisClient() {
  return await createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  })
    .on("connect", () => console.log("Redis Client Connected"))
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
}
