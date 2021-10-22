import { Response } from "express";

export const sendJSONStatus = <T = void, U extends T = T>(res: Response, data: U) => {
  res.json(data).end();
};
