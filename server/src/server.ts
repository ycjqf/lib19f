import express from "express";
import { connect } from "mongoose";
import { mongoServerString } from "@/util";
import API from "@/api/_router";
import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";

(async () => {
  await connect(mongoServerString);
  console.log(`🟢 数据库连接成功`);
  const PORT = 1337;
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  redisClient
    .connect()
    .then(() => {
      console.log("redis connected");
    })
    .catch(console.log);
  app.use(
    session({
      // @ts-ignore
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: "keyboasrd cat",
      resave: false,
      cookie: {
        sameSite: false,
        maxAge: 1000 * 60 * 10,
        secure: false,
      },
    })
  );

  app.disable("x-powered-by");
  app.use(API);
  app.listen(PORT);
  console.log(`🚀 运行在 http://localhost:${PORT} 模式为 ${app.get("env")}`);
})();
