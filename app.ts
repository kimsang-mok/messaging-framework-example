import express from "express";
import v1Route from "./route";
import { morganMiddleware } from "./src/middlewares/morgan";
import dotenv from "dotenv";

import { createMessagingContext } from "rabbitmq-stream";

dotenv.config();

const app = express();

app.set("port", process.env.PORT);

app.use(morganMiddleware());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", v1Route);

createMessagingContext({
  connection: {
    uri: process.env.RABBITMQ_URI || "amqp://localhost",
    reconnectStrategy: "fixed",
    reconnectIntervalMs: 5000,
  },
  binder: {
    inputs: {
      userCreatedInput: {
        queue: "user.created.queue",
        exchange: "user.delayed.exchange",
        exchangeType: "x-delayed-message",
        exchangeArguments: {
          "x-delayed-type": "topic",
        },
        routingKey: "user.created",
        retry: {
          strategy: "exponential",
          maxAttempts: 5,
        },
      },
    },
    outputs: {
      userPublisher: {
        exchange: "user.delayed.exchange",
        exchangeType: "x-delayed-message",
        defaultRoutingKey: "user.created",
        delay: {
          strategy: "plugin",
          xDelayedType: "topic",
        },
      },
    },
  },
  observability: {
    logLevel: "info",
  },
});

export default app;
