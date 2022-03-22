import Admin from "svr/models/Admin";
import Reviewer from "svr/models/Reviewer";
import User from "svr/models/User";
import { ApiAccountLoginPayload } from "./payload";

export default async function findAccount(payload: ApiAccountLoginPayload): Promise<{
  status: "error" | "yes" | "no";
  message: string;
  id: number;
}> {
  try {
    const credential =
      payload._useCredential === "email"
        ? { email: payload.email, password: payload.password }
        : { name: payload.name, password: payload.password };

    let account;
    switch (payload.capacity) {
      case "reviewer":
        account = await Reviewer.findOne(credential);
        break;
      case "admin":
        account = await Admin.findOne(credential);
        break;
      default:
        account = await User.findOne(credential);
        break;
    }
    if (!account) {
      return {
        id: 0,
        status: "no",
        message: `${payload.capacity} ${payload._useCredential} or password is wrong`,
      };
    }
    return {
      id: account.id,
      status: "yes",
      message: `${payload.capacity} successfully logged in`,
    };
  } catch (e) {
    return {
      id: 0,
      status: "error",
      message: `error wehen validate account existence ${e instanceof Error && e.message}`,
    };
  }
}
