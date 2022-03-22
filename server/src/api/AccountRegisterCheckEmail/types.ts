export interface ApiAccountRegisterCheckEmailRequest {
  email: string;
}

export interface ApiAccountRegisterCheckEmailResponse {
  status: "error" | "taken" | "valid" | "wrong";
}
