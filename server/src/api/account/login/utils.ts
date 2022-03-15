import { Request } from "express";
import Admin from "svr/models/Admin";
import Reviewer from "svr/models/Reviewer";
import User from "svr/models/User";
import { generateSessionId, gRedisClient } from "svr/util";
import { SessionData } from "tps/api";
import { ApiAccountLoginPayload } from "./payload";

export async function findAccount(payload: ApiAccountLoginPayload): Promise<{
  status: "ERROR" | "YES" | "NO";
  message: string;
  id: number;
}> {
  try {
    const credential =
      payload._useCredential === "email"
        ? { email: payload.email, password: payload.password }
        : { name: payload.name, password: payload.password };

    let account;
    switch (payload.capacity) {
      case "reviewer":
        account = await Reviewer.findOne(credential);
        break;
      case "admin":
        account = await Admin.findOne(credential);
        break;
      default:
        account = await User.findOne(credential);
        break;
    }
    if (!account) {
      return {
        id: 0,
        status: "NO",
        message: `${payload.capacity} ${payload._useCredential} or password is wrong`,
      };
    }
    return {
      id: account.id,
      status: "YES",
      message: `${payload.capacity} successfully logged in`,
    };
  } catch (e) {
    return {
      id: 0,
      status: "ERROR",
      message: `error wehen validate account existence ${e instanceof Error && e.message}`,
    };
  }
}

export async function updateSession(
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

  const session = req.session as typeof req.session & { data: SessionData | undefined };
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
