import { createContext } from "react";

const ProfileContext = createContext<ProfileContextType>({ loading: true });
export { ProfileContext };

export type ProfileContextType = {
  capacity?: string;
  account?: Article["user"];
  loading: boolean;
};
