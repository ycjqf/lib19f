import { Router } from "express";
import User from "svr/models/User";
import Reviewer from "svr/models/Reviewer";
import Admin from "svr/models/Admin";
import { generateSessionId, gRedisClient, gRedisMessage, sendJSONStatus } from "svr/util";
import { ApiLoginResponse, accountCapacities, SessionData, AccountCapacity } from "tps/api";
import { NAME_PATTERN, PASSWORD_PATTERN } from "tps/constants";
import isEmail from "validator/lib/isEmail";

export default Router().post("/", async (req, res): Promise<void> => {
  // ⌨️ check grammer correct
  const payload = new ApiAccountLoginPayload({
    name: req.body.name,
    capacity: req.body.capacity,
    password: req.body.password,
    email: req.body.email,
    relog: req.body.relog,
  });
  if (!payload._valid) {
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "BAD_FORM",
      message: payload._message,
    });
  }

  try {
    // 🔒 authenticate wheter account exist
    const credential =
      payload._useCredential === "email"
        ? { email: payload.email, password: payload.password }
        : { name: payload.name, password: payload.password };
    // let account:
    //   | ReturnType<typeof Admin["findOne"]>
    //   | ReturnType<typeof Reviewer["findOne"]>
    //   | ReturnType<typeof User["findOne"]>
    //   | null = null;
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
      return sendJSONStatus<ApiLoginResponse>(res, {
        code: "WRONG_CREDENTIAL",
        message: `${payload.capacity} ${payload._useCredential} or password is wrong`,
      });
    }

    // 🔑 whether account already logged
    if (!gRedisClient) {
      return sendJSONStatus<ApiLoginResponse>(res, {
        code: "INTERNAL_ERROR",
        message: `redis is not connected: ${gRedisMessage}`,
      });
    }

    const session = req.session as typeof req.session & { data: SessionData | undefined };
    const v4 = gRedisClient.v4 as Exclude<typeof gRedisClient, "v4">;
    const keys = await v4.keys(`sess:${generateSessionId(req)}/*`);

    if (gRedisClient && keys.length !== 0 && payload.relog === false) {
      return sendJSONStatus<ApiLoginResponse>(res, {
        code: "LOGGED",
        message: `${payload.capacity} is already logged in`,
      });
    }

    if (keys.length !== 0 && payload.relog === true) {
      const removeKeys = keys.map(async key => {
        v4.del(key);
      });
      await Promise.all(removeKeys);
      session.data = { id: account.id, capacity: payload.capacity };
      return sendJSONStatus<ApiLoginResponse>(res, {
        code: "OK",
        message: `relogged success`,
      });
    }

    session.data = { id: account.id, capacity: payload.capacity };
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "OK",
      message: `success`,
    });
  } catch (e) {
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "INTERNAL_ERROR",
      message: `login failed ${e instanceof Error ? e.message : "unknwonw error"}`,
    });
  }
});

class ApiAccountLoginPayload {
  _valid = false;
  _message = "valid";
  _useCredential: "name" | "email" = "name";
  name = "";
  email = "";
  password = "";
  capacity: AccountCapacity = "user";
  relog = false;

  constructor({
    name,
    email,
    password,
    capacity,
    relog,
  }: {
    name: unknown;
    email: unknown;
    password: unknown;
    capacity: unknown;
    relog: unknown;
  }) {
    // capacity must be correct
    if (typeof capacity !== "string") {
      this._message = "capacity is not a string";
      return;
    }
    if (accountCapacities.find(_capacity => capacity === _capacity) === undefined) {
      this._message = "no such capacity";
      return;
    }
    this.capacity = capacity as AccountCapacity;

    // check password
    if (typeof password !== "string") {
      this._message = "password is not a string";
      return;
    }
    if (!PASSWORD_PATTERN.test(password)) {
      this._message = "wrong password pattern";
      return;
    }
    this.password = password;

    // check credential method
    const emailValid = typeof email === "string" && isEmail(email);
    if (emailValid) {
      this._useCredential = "email";
      this.email = email;
    } else {
      const nameValid = typeof name === "string" && NAME_PATTERN.test(name);
      if (nameValid) {
        this._useCredential = "name";
        this.name = name;
      } else {
        // name and email both invalid
        this._message = "must provide a valid name or email";
        return;
      }
    }

    if (typeof relog === "boolean") this.relog = relog;

    this._valid = true;
  }
}
