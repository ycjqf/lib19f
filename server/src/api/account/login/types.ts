export interface ApiAccountLoginRequest {
  name: string;
  email: string;
  password: string;
  capacity: Capacity;
  relog: boolean;
}

export enum Capacity {
  User = "user",
  Admin = "admin",
  Reviewer = "reviewer",
}

export interface ApiAccountLoginResponse {
  code: BaseResponseCode;
  message: string;
}
