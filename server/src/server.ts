import express, { Response, Request, NextFunction } from "express";
import { connect } from "mongoose";
import moment from "moment";
import session from "express-session";
import connectRedis from "connect-redis";
import API from "svr/api";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import {
  generateSessionId,
  mongoServerString,
  initRedis,
  gRedisClient,
  gRedisMessage,
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

  app.disable("x-powered-by");
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
    const session = req.session;
    console.log(`${req.method} [${moment().format("YYYY-MM-DD HH:mm:ss")}] ${req.url}`);
    console.log("\x1b[36m%s\x1b[0m", ` body ${JSON.stringify(req.body)}`);
    session.data && console.log("\x1b[33m%s\x1b[0m", ` data ${JSON.stringify(session.data)}`);
    next();
  });
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    const _response: BaseResponse = { code: "BAD_REQUEST", message: "" };
    if (err instanceof SyntaxError) {
      _response.message = "invalid json payload";
      res.status(StatusCodes.BAD_REQUEST);
      res.json(_response).end();
      return;
    }
    if (err) {
      _response.code = "INTERNAL_ERROR";
      _response.message = `${err instanceof Error ? err.message : "unknown error"}`;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json(_response).end();
      return;
    }
    next();
  });
  app.use(API);
  app.use("*", (_, res) => {
    res.status(StatusCodes.NOT_FOUND);
    res.json({ code: "NOT_FOUND", message: getReasonPhrase(StatusCodes.NOT_FOUND) });
    res.end();
  });
  app.listen(PORT);

  console.log(
    `🚀 server is running at port ${PORT} in ${
      typeof mode === "string" ? mode : "unknown"
    } mode, view http://localhost:${PORT}`
  );
}

interface BaseResponse {
  code: BaseResponseCode;
  message: string;
}
