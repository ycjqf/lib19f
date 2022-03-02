import { Response } from "express";

import {
  DATABASE__DOMAIN,
  DATABASE__PASSWORD,
  DATABASE__USERNAME,
  DATABASE__NAME,
} from "svr/psw.json";

export const mongoServerString = `mongodb+srv://${DATABASE__USERNAME}:${DATABASE__PASSWORD}@${DATABASE__DOMAIN}/${DATABASE__NAME}?retryWrites=true&w=majority`;
export const sendJSONStatus = <T = void, U extends T = T>(
  res: Response,
  data: U,
  code = 200
) => {
  res.status(code);
  res.json(data).end();
};
