export default class MessageService {
  #redisClient
  #randomCommitApi

  constructor({ redisClient, randomCommitApi }) {
    this.#redisClient = redisClient
    this.#randomCommitApi = randomCommitApi
  }

  async getMessage() {
    const cachedMessage = await this.#redisClient.GET("message");
    if (cachedMessage) {
      return cachedMessage
    }
    const apiMessage = await this.#randomCommitApi.getRandomCommitMessage();
    return apiMessage;
  }

  async cacheMessage(message) {
    await this.#redisClient.SET("message", message, { EX: 60 });
  }

  async flushCache() {
    await this.#redisClient.DEL("message");
  }
}

