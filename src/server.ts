import Fastify from "fastify";
import { z } from "zod";
import { CacheClient, createRedisClient } from "./redis.js";
import RandomDadJokesAPI from "./random-dad-jokes.api.js";
import MessageService from "./message.service.js";

const fastify = Fastify();

const redisClient = await createRedisClient();
const cacheClient = new CacheClient(redisClient).getRedisClient();
const randomDadJokesAPI = new RandomDadJokesAPI();
const messageService = new MessageService(cacheClient, randomDadJokesAPI);

fastify.get("/", async (request, reply) => {
  return { hello: "world" };
});

fastify.get("/messages", async (request, reply) => {
  const message = await messageService.getMessage();
  reply.code(200).send({ message });
});

fastify.post("/messages", async (request, reply) => {
  const message = z.object({
    message: z.string(),
  });

  const body = message.parse(request.body);

  await messageService.cacheMessage(body.message);

  reply.code(201).send();
});

fastify.delete("/messages", async (_req, reply) => {
  await messageService.flushCache();
  reply.code(204);
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
