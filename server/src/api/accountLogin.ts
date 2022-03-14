import { Router } from "express";
import User from "svr/models/User";
import Reviewer from "svr/models/Reviewer";
import Admin from "svr/models/Admin";
import { sendJSONStatus } from "svr/util";
import { ApiLoginResponse, accountCapacities, SessionData, AccountCapacity } from "tps/api";
import { NAME_PATTERN, PASSWORD_PATTERN } from "tps/constants";
import isEmail from "validator/lib/isEmail";

export default Router().post("/", async (req, res): Promise<void> => {
  const payload = new ApiAccountLoginPayload({
    name: req.body.name,
    capacity: req.body.capacity,
    password: req.body.password,
    email: req.body.email,
  });
  if (!payload._valid) {
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "BAD_FORM",
      message: payload._message,
    });
  }

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
      return sendJSONStatus<ApiLoginResponse>(res, {
        code: "WRONG_CREDENTIAL",
        message: `${payload.capacity} ${payload._useCredential} or password is wrong`,
      });
    }

    const session = req.session as typeof req.session & { data: SessionData | undefined };
    if (session.data) {
      req.session.regenerate(() => {
        return sendJSONStatus<ApiLoginResponse>(res, {
          code: "OK",
          message: `relogged`,
        });
      });
      return;
    }
    session.data = { id: account.id, capacity: payload.capacity };
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "OK",
      message: `success`,
    });
  } catch (e) {
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "OK",
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

  constructor({
    name,
    email,
    password,
    capacity,
  }: {
    name: unknown;
    email: unknown;
    password: unknown;
    capacity: unknown;
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

    this._valid = true;
  }
}
