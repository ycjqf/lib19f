import express, { Response, Request, NextFunction } from "express";
import { connect } from "mongoose";
import moment from "moment";
import session from "express-session";
import connectRedis from "connect-redis";
import API from "svr/api/_router";
import { ApiLoginResponse, SessionData } from "tps/api";
import {
  generateSessionId,
  mongoServerString,
  initRedis,
  gRedisClient,
  gRedisMessage,
  sendJSONStatus,
} from "svr/util";

moment.locale("zh-cn");
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

  app.use((req, res, next) => {
    const session = req.session as typeof req.session & { data: SessionData | undefined };
    console.log(
      `${req.method} [${moment().format("YYYY-MM-DD HH:mm:ss")}] ${req.url}
      body ${JSON.stringify(req.body)}
      session ${JSON.stringify(session)}`
    );
    next();
  });

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError) {
      return sendJSONStatus<ApiLoginResponse>(res, {
        code: "BAD_FORM",
        message: "bad format of json",
      });
    }
    if (err)
      return sendJSONStatus<ApiLoginResponse>(res, {
        code: "BAD_FORM",
        message: "bad form",
      });
    next();
  });

  app.disable("x-powered-by").use(API).listen(PORT);

  console.log(
    `🚀 server is running at port ${PORT} in ${
      typeof mode === "string" ? mode : "unknown"
    } mode, view http://localhost:${PORT}`
  );
}
