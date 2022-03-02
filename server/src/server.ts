import express from "express";
import { connect } from "mongoose";
import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";
import moment from "moment";
import { SessionData } from "tps/api";
import API from "svr/api/_router";
import { mongoServerString } from "svr/util";

const PORT = 1337;

const strA: Array<string> = [];
console.log(strA);

void init();
async function init(): Promise<void> {
  await connect(mongoServerString);
  console.log(`mongodb is connected`);

  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  await redisClient.connect();
  console.log("redis is connected");

  const app = express();
  const mode: unknown = app.get("env");

  moment.locale("zh-cn");
  app.use(express.json());
  app.use(
    session({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: "keyboasrd cat",
      resave: false,
      cookie: {
        sameSite: false,
        maxAge: 1000 * 60 * 60 * 3,
        secure: false,
        domain: "localhost",
      },
    })
  );

  app.use((req, res, next) => {
    const session = req.session as typeof req.session & { data: SessionData | undefined };
    console.log(
      `${req.method} [${moment().format("YYYY-MM-DD HH:mm:ss")}] ${req.url}
      body ${JSON.stringify(req.body)}
      session ${JSON.stringify(session.data)}`
    );
    next();
  });

  app.disable("x-powered-by").use(API).listen(PORT);

  console.log(
    `🚀 server is running at port ${PORT} in ${
      typeof mode === "string" ? mode : "unknown"
    } mode, view http://localhost:${PORT}`
  );
}
