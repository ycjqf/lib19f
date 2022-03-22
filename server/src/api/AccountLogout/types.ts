export interface ApiAccountLogoutResponse {
  code: BaseResponseCode | "NOT_LOGGED_IN";
  message: string;
}
