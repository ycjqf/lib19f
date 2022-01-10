import { AccountCommon } from "./ducument";

export const accountCapacities = ["user", "reviewer", "admin"] as const;
export type accountCapacity = typeof accountCapacities[number];

export interface ApiLoginRequest {
  email: AccountCommon["email"];
  name: AccountCommon["name"];
  password: AccountCommon["password"];
  capacity: accountCapacity;
}

type loginCode =
  | "OK"
  | "CREDENTIAL_PATTERN_UNMATCH"
  | "WRONG_CREDENTIAL"
  | "INTERNAL_ERROR"
  | "TODO";
export type ApiLoginResponse =
  | {
      code: loginCode;
    }
  | {
      code: "OK";
      accessToken: string;
      refreshToken: string;
    };

type registerCode =
  | "OK"
  | "EMAIL_TAKEN"
  | "NAME_TAKEN"
  | "CREDENTIAL_PATTERN_UNMATCH"
  | "INTERNAL_ERROR"
  | "TODO";
export interface ApiRegisterRequest {
  name: AccountCommon["name"];
  email: AccountCommon["email"];
  password: AccountCommon["password"];
  passwordRepeat: AccountCommon["password"];
  capacity: accountCapacity;
}
export interface ApiRegisterResponse {
  code: registerCode;
}
