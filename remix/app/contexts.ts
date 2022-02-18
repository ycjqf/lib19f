import { createContext } from "react";
import { ApiGetProfileResponse } from "~typings/api";
import { AccountCommon } from "~typings/ducument";

export interface ProfileContextType {
  id: AccountCommon["id"] | undefined;
  capacity: "user";
}
export const ProfileContext = createContext<ProfileContextType>({ id: undefined, capacity: "user" });

export function checkProfile(): void {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  console.log(accessToken, refreshToken);
}

export function logout(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
