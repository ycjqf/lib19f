import { AccountCommon } from "./ducument";

export const accountCapacities = ["user", "reviewer", "admin"] as const;
type accountCapacity = typeof accountCapacities[number];

export type ApiLoginRequest =
  | {
      email: AccountCommon["email"];
      password: AccountCommon["password"];
      capacity: accountCapacity;
    }
  | {
      name: AccountCommon["name"];
      password: AccountCommon["password"];
      capacity: accountCapacity;
    };

type loginCode =
  | "OK"
  | "CREDENTIAL_PATTERN_UNMATCH"
  | "WRONG_CREDENTIAL"
  | "INTERNAL_ERROR"
  | "TODO";
export type ApiLoginResponse =
  | {
      code: "OK";
    }
  | {
      code: loginCode;
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
