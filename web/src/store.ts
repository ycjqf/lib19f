import { ref } from "vue";
import { ApiGetProfileResponse } from "@typings/api";
import axios from "axios";
import { Router } from "vue-router";
import { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";

export const libraryName = "云库";
export const librarySlogan = "云上共享，自在如我。";
export const USER_PROFILE = ref<ApiGetProfileResponse["profile"]>(undefined);

export async function checkTokenAndGetProfile(router: Router, messager: MessageApiInjection) {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  if (!accessToken || !refreshToken) return;

  const parsedPayload = JSON.parse(atob(accessToken.split(".")[1]));
  if (!parsedPayload.id) return;
  const result = await axios.post<ApiGetProfileResponse>("/api/get/profile", {
    id: parsedPayload.id,
  });
  if (result.data.code !== "OK") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push({ name: "login" });
    messager.error("登陆ID无效，请重新登陆");
    return;
  }
  USER_PROFILE.value = result.data.profile;
}

export function logout(messager: MessageApiInjection) {
  USER_PROFILE.value = undefined;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  messager.success("登陆退出成功");
}
