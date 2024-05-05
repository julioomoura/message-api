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
  return await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
}
