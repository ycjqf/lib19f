import express from "express";
import { connect } from "mongoose";
import session from "express-session";
import connectRedis from "connect-redis";
import API from "svr/api/_router";
import {
  generateSessionId,
  mongoServerString,
  initRedis,
  gRedisClient,
  gRedisMessage,
} from "svr/util";

const PORT = 1337;

void init();
async function init(): Promise<void> {
  await connect(mongoServerString);
  console.log(`mongodb is connected`);

  await initRedis();
  if (!gRedisClient) throw new Error(gRedisMessage);
  console.log(gRedisMessage);

  const app = express();
  const mode: unknown = app.get("env");
  const RedisStore = connectRedis(session);

  app.use(express.json());
  app.use(
    session({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: new RedisStore({ client: gRedisClient }),
      saveUninitialized: false,
      secret: "keyboasrd cat",
      resave: false,
      cookie: {
        sameSite: false,
        maxAge: 1000 * 60 * 60 * 3,
        secure: false,
        domain: "localhost",
      },
      genid: req => `${generateSessionId(req)}/${Date.now()}`,
    })
  );

  app.disable("x-powered-by").use(API).listen(PORT);

  console.log(
    `🚀 server is running at port ${PORT} in ${
      typeof mode === "string" ? mode : "unknown"
    } mode, view http://localhost:${PORT}`
  );
}
