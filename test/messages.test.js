import { describe, it, mock, afterEach } from "node:test";
import assert from "node:assert";
import MessageService from "../src/message.service.js";

describe("Message Service", () => {
    const redisClient = {
        GET: mock.fn(),
        SET: mock.fn(),
        DEL: mock.fn(),
    };
    const randomCommitApi = {
        getRandomCommitMessage: mock.fn(),
    };
    const service = new MessageService({ redisClient, randomCommitApi });

    afterEach(() => {
        mock.reset();
    });
    describe("getMessage", () => {
        it("should return message from cache when it is cached", async () => {
            const cachedMessage = "Hello, my friend";

            mock.method(redisClient, "GET", async () =>
                Promise.resolve(cachedMessage),
            );

            const message = await service.getMessage();
            assert.equal(message, cachedMessage);
        });
        it("should return message from api when it is not cached", async () => {
            const apiMessage = "Random commit message";
            mock.method(randomCommitApi, "getRandomCommitMessage", async () =>
                Promise.resolve(apiMessage),
            );
            const message = await service.getMessage();
            assert.equal(message, apiMessage);
        });
    });

    describe("cacheMessage", () => {
        it("should cache the given message", async () => {
            const message = "message"
            await service.cacheMessage(message)
            assert.deepStrictEqual(redisClient.SET.mock.calls[0].arguments, ["message", message, { EX: 60 }])
        })
    })

    describe("cacheMessage", () => {
        it("should flush the cache", async () => {
            const message = "message"
            await service.flushCache()
            assert.deepStrictEqual(redisClient.DEL.mock.calls[0].arguments, ["message"])
        })
    })
});
