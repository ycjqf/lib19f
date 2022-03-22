import { ApiGetProfileResponse, SessionData } from "tps/api";

export type ApiAuthenticateResponse = {
  code: BaseResponseCode;
  isLogged: boolean;
  message: string;
  data?: SessionData;
  profile?: ApiGetProfileResponse["profile"];
};
