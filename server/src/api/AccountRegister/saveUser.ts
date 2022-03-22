import User from "svr/models/User";
import ApiAccountRegisterPayload from "./payload";

export default async function saveUser(
  payload: ApiAccountRegisterPayload
): Promise<{ status: "error" | "ok"; message: string }> {
  try {
    const newUser = new User({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      avatar: "",
      gender: "unset",
      introduction: "",
    });
    await newUser.save();
    return {
      status: "ok",
      message: "ok",
    };
  } catch (e) {
    return {
      status: "error",
      message: `register failed ${e instanceof Error ? e.message : "unknown error"}`,
    };
  }
}
