import axios, { AxiosResponse } from "axios";
import { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
import { AccountCommon, UserDocument } from "@typings/ducument";

export function postWithCredential<Req, Res>(url: string, data: Req): Promise<AxiosResponse<Res, any>> {
  // post body with token
  return axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });
}

export function refreshCredential(message: MessageApiInjection) {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  const user = accessToken ? JSON.parse(decodeURIComponent(escape(window.atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))))) : undefined;
  message.info(user);
}

export function credentialEmpty(): boolean {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  return !accessToken || accessToken === "" || !refreshToken || refreshToken === "";
}
