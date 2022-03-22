import { PASSWORD_PATTERN, NAME_PATTERN } from "tps/constants";
import isEmail from "validator/lib/isEmail";
import { ApiAccountLoginRequest, Capacity } from "./types";

export class ApiAccountLoginPayload implements ApiAccountLoginRequest {
  _valid = false;
  _message = "valid";
  _useCredential: "name" | "email" = "name";
  name = "";
  email = "";
  password = "";
  capacity: Capacity = Capacity.User;
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

    if (Object.values(Capacity).includes(capacity as Capacity)) {
      this.capacity = capacity as Capacity;
    } else {
      this._message = "no such capacity";
      return;
    }

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
