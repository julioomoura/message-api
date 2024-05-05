import { describe, it, mock, afterEach } from "node:test";
import assert from "node:assert";
import MessageService from "../src/message.service.js";

describe("getMessage", () => {
    const redisClient = {
        GET: mock.fn(),
    };
    const randomCommitApi = {
        getRandomCommitMessage: mock.fn(),
    };
    const service = new MessageService({ redisClient, randomCommitApi });

    afterEach(() => {
        mock.reset();
    });

    it("should return message from cache when it is cached", async () => {
        const cachedMessage = "Hello, my friend";

        mock.method(redisClient, "GET", async () => Promise.resolve(cachedMessage));

        const teste = await service.getMessage();
        assert.equal(teste, cachedMessage);
    });
    it("should return message from api when it is not cached", async () => {
        const apiMessage = "Random commit message";
        mock.method(randomCommitApi, "getRandomCommitMessage", async () =>
            Promise.resolve(apiMessage),
        );
        const teste = await service.getMessage();
        assert.equal(teste, apiMessage);
    });
});
