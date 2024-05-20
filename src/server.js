import Fastify from "fastify";
import { CacheClient, createRedisClient } from "./redis.js";
import MessageService from "./message.service.js";
import RandomCommitAPI from "./random-commit.api.js";
import { fastifyView } from "@fastify/view";
import * as ejs from "ejs";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
});

const redisClient = await createRedisClient();
const cacheClient = new CacheClient(redisClient).getRedisClient();
const randomCommitApi = new RandomCommitAPI();
const messageService = new MessageService({ cacheClient, randomCommitApi });

fastify.get("/", async function handler(_req, _reply) {
  return { hello: "world" };
});

fastify.get("/messages", async (_, reply) => {
  const message = await messageService.getMessage();
  reply.code = 200;
  return { message };
});

fastify.post("/messages", async (req, reply) => {
  messageService.cacheMessage(req.body.message);
  reply.code(201);
  return;
});

fastify.delete("/messages", async (_req, reply) => {
  messageService.flushCache();
  reply.code(204);
});

fastify.get("/ui/message", async (request, reply) => {
  const message = await messageService.getMessage();
  return reply.viewAsync("./src/ui/message.ejs", {
    message,
  });
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log(err);
  process.exit(1);
}
