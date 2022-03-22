export interface ApiAccountRegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export interface ApiAccountRegisterResponse {
  code: BaseResponseCode | "NAME_TAKEN" | "EMAIL_TAKEN";
  message: string;
}
