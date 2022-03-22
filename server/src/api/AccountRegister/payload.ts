import validator from "validator";
import { NAME_PATTERN, PASSWORD_PATTERN } from "tps/constants";
import { ApiAccountRegisterRequest } from "./types";

export default class ApiAccountRegisterPayload implements ApiAccountRegisterRequest {
  _valid = false;
  _message = "valid";
  name = "";
  email = "";
  password = "";
  passwordRepeat = "";

  constructor({
    name,
    email,
    password,
    passwordRepeat,
  }: {
    name: unknown;
    email: unknown;
    password: unknown;
    passwordRepeat: unknown;
  }) {
    if (typeof name !== "string" || !NAME_PATTERN.test(name)) {
      this._message = "name valid";
      return;
    }
    this.name = name;

    if (typeof email !== "string" || !validator.isEmail(email)) {
      this._message = "email valid";
      return;
    }
    this.email = email;

    // check password
    if (typeof password !== "string" || !PASSWORD_PATTERN.test(password)) {
      this._message = "password invalid";
      return;
    }
    this.password = password;

    if (typeof passwordRepeat !== "string" || password !== passwordRepeat) {
      this._message = "password unmatch";
      return;
    }
    this.passwordRepeat = passwordRepeat;

    this._valid = true;
  }
}
