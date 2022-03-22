import { AccountCommon, UserDocument } from "tps/ducument";

export interface ApiGetProfileRequest {
  id?: UserDocument["id"];
  name?: UserDocument["name"];
}
export interface ApiGetProfileResponse {
  code: "OK" | "WRONG_ID" | "NO_SUCH_USER" | "INTERNAL_ERROR";
  message: string;
  profile?: {
    id: AccountCommon["id"];
    name: AccountCommon["name"];
    avatar: AccountCommon["avatar"];
  };
}
