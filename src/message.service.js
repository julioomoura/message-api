export default class MessageService {
  #cacheClient;
  #randomCommitApi;

  constructor({ cacheClient, randomCommitApi }) {
    this.#cacheClient = cacheClient;
    this.#randomCommitApi = randomCommitApi;
  }

  async getMessage() {
    const cachedMessage = await this.#cacheClient.GET("message");
    if (cachedMessage) {
      return cachedMessage;
    }
    const apiMessage = await this.#randomCommitApi.getRandomCommitMessage();
    return apiMessage;
  }

  async cacheMessage(message) {
    await this.#cacheClient.SET("message", message, { EX: 60 });
  }

  async flushCache() {
    await this.#cacheClient.DEL("message");
  }
}
