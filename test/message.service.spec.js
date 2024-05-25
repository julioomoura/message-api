import { describe, it, mock, afterEach } from "node:test";
import assert from "node:assert";
import MessageService from "../src/message.service.js";

describe("Message Service", () => {
  const cacheClient = {
    GET: mock.fn(),
    SET: mock.fn(),
    DEL: mock.fn(),
  };
  const randomDadJokesAPI = {
    getRandomJoke: mock.fn(),
  };
  const service = new MessageService({
    cacheClient: cacheClient,
    randomDadJokesAPI,
  });

  afterEach(() => {
    mock.reset();
  });
  describe("getMessage", () => {
    it("should return message from cache when it is cached", async () => {
      const cachedMessage = "Hello, my friend";

      mock.method(cacheClient, "GET", async () =>
        Promise.resolve(cachedMessage),
      );

      const message = await service.getMessage();
      assert.equal(message, cachedMessage);
    });
    it("should return message from api when it is not cached", async () => {
      const apiMessage = "Random commit message";
      mock.method(randomDadJokesAPI, "getRandomJoke", async () =>
        Promise.resolve(apiMessage),
      );
      const message = await service.getMessage();
      assert.equal(message, apiMessage);
    });
  });

  describe("cacheMessage", () => {
    it("should cache the given message", async () => {
      const message = "message";
      mock.method(cacheClient, "DEL", async () => Promise.resolve());
      await service.cacheMessage(message);
      assert.deepStrictEqual(cacheClient.SET.mock.calls[0].arguments, [
        "message",
        message,
        { EX: 60 },
      ]);
    });
  });

  describe("flushCache", () => {
    it("should flush the cache", async () => {
      await service.flushCache();
      assert.deepStrictEqual(cacheClient.DEL.mock.callCount(), 1);
    });
  });
});
