import { Request, Response } from "express";
import { createClient } from "redis";

import {
  DATABASE__DOMAIN,
  DATABASE__PASSWORD,
  DATABASE__USERNAME,
  DATABASE__NAME,
} from "svr/psw.json";
import { accountCapacities } from "tps/api";
import { NAME_PATTERN } from "tps/constants";

export const mongoServerString = `mongodb+srv://${DATABASE__USERNAME}:${DATABASE__PASSWORD}@${DATABASE__DOMAIN}/${DATABASE__NAME}?retryWrites=true&w=majority`;
export const sendJSONStatus = <T = void, U extends T = T>(
  res: Response,
  data: U,
  code = 200
) => {
  res.status(code);
  res.json(data).end();
};

export let gRedisClient: ReturnType<typeof createClient> | undefined = undefined;
export let gRedisMessage = "";

export const generateSessionId = (req: Request) => {
  const capacity =
    typeof req.body.capacity === "string" &&
    accountCapacities.find(_capacity => req.body.capacity === _capacity) !== undefined
      ? req.body.capacity
      : "_visitor";
  const name =
    typeof req.body.name === "string" && NAME_PATTERN.test(req.body.name)
      ? req.body.name
      : "_unknown";
  return `${capacity}-${name}`;
};

export async function initRedis(): Promise<boolean> {
  try {
    const redisClient = createClient({
      url: "redis://127.0.0.1:6379/0",
      legacyMode: true,
    });
    await redisClient.connect();

    gRedisClient = redisClient;
    gRedisMessage = "redis connected";
    return true;
  } catch (e) {
    gRedisClient = undefined;
    gRedisMessage = `failed to connect to redis: ${
      e instanceof Error ? e.message : "unknown error"
    }`;
    return false;
  }
}
