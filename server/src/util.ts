import { Response } from "express";

import {
  DATABASE__DOMAIN,
  DATABASE__PASSWORD,
  DATABASE__USERNAME,
  DATABASE__NAME,
} from "@/psw.json";

export const mongoServerString = `mongodb+srv://${DATABASE__USERNAME}:${DATABASE__PASSWORD}@${DATABASE__DOMAIN}/${DATABASE__NAME}?retryWrites=true&w=majority`;
// export const mongoServerString = `mongodb://localhost?retryWrites=true&w=majority`;
export const sendJSONStatus = <T = void, U extends T = T>(res: Response, data: U, code: number) => {
  res.status(code);
  res.json(data).end();
};
