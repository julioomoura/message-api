export default class MessageService {
  #cacheClient;
  #randomDadJokesAPI;

  constructor({ cacheClient, randomDadJokesAPI }) {
    this.#cacheClient = cacheClient;
    this.#randomDadJokesAPI = randomDadJokesAPI;
  }

  async getMessage() {
    return (
      (await this.#cacheClient.GET("message")) ??
      (await this.#randomDadJokesAPI.getRandomJoke())
    );
  }

  async cacheMessage(message) {
    await this.#cacheClient.SET("message", message, { EX: 60 });
  }

  async flushCache() {
    await this.#cacheClient.DEL("message");
  }
}
