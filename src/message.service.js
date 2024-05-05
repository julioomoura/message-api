export default class MessageService {
  #cacheClient;
  #randomCommitApi;

  constructor({ cacheClient, randomCommitApi }) {
    this.#cacheClient = cacheClient;
    this.#randomCommitApi = randomCommitApi;
  }

  async getMessage() {
    return (
      (await this.#cacheClient.GET("message")) ??
      (await this.#randomCommitApi.getRandomCommitMessage())
    );
  }

  async cacheMessage(message) {
    await this.#cacheClient.SET("message", message, { EX: 60 });
  }

  async flushCache() {
    await this.#cacheClient.DEL("message");
  }
}
