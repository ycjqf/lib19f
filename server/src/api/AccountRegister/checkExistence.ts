import User from "svr/models/User";
import ApiAccountRegisterPayload from "./payload";

export default async function checkExistence(payload: ApiAccountRegisterPayload): Promise<{
  status: "error" | "email" | "name" | "valid";
  message: string;
}> {
  try {
    if (await User.exists({ name: payload.name })) {
      return {
        status: "name",
        message: `name is taken`,
      };
    }
    if (await User.exists({ email: payload.email })) {
      return {
        status: "email",
        message: `email ${payload.email} is taken`,
      };
    }
    return {
      status: "valid",
      message: `valid`,
    };
  } catch (e) {
    return {
      status: "error",
      message: `${e instanceof Error ? e.message : "unknown error"}`,
    };
  }
}
