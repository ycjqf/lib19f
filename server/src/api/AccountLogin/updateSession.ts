import { Request } from "express";
import { generateSessionId, gRedisClient } from "svr/util";
import { ApiAccountLoginPayload } from "./payload";

export default async function updateSession(
  req: Request,
  payload: ApiAccountLoginPayload,
  id: number
): Promise<{
  status: "error" | "logged" | "ok";
  message: string;
}> {
  if (!gRedisClient) {
    return {
      status: "error",
      message: `redis is not connected`,
    };
  }

  const { session } = req;
  const v4 = gRedisClient.v4 as Omit<typeof gRedisClient, "v4">;
  const keys = await v4.keys(`sess:${generateSessionId(req)}/*`);

  if (gRedisClient && keys.length !== 0 && payload.relog === false)
    return {
      status: "logged",
      message: `${payload.capacity} is already logged in`,
    };

  if (keys.length !== 0 && payload.relog === true) {
    const removeKeys = keys.map(async key => {
      v4.del(key);
    });
    await Promise.all(removeKeys);
  }

  session.data = { id, capacity: payload.capacity };
  return {
    status: "ok",
    message: `logged success`,
  };
}
