import RandomDadJokesAPI from "./random-dad-jokes.api.js";
import { RedisClient } from "./redis.js";

export default class MessageService {
  #cacheClient: RedisClient;
  #randomDadJokesAPI;

  constructor(cacheClient: RedisClient, randomDadJokesAPI: RandomDadJokesAPI) {
    this.#cacheClient = cacheClient;
    this.#randomDadJokesAPI = randomDadJokesAPI;
  }

  async getMessage(): Promise<string> {
    return (
      (await this.#cacheClient.GET("message")) ??
      (await this.#randomDadJokesAPI.getRandomJoke())
    );
  }

  async cacheMessage(message: string): Promise<void> {
    await this.#cacheClient.SET("message", message, { EX: 60 });
  }

  async flushCache(): Promise<void> {
    await this.#cacheClient.DEL("message");
  }
}
