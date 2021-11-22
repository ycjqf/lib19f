import { Response } from 'express';

import { DATABASE__PASSWORD, DATABASE__USERNAME } from '@/psw.json';

export const mongoServerString = `mongodb+srv://${DATABASE__USERNAME}:${DATABASE__PASSWORD}@cluster0.o77xs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
export const sendJSONStatus = <T = void, U extends T = T>(res: Response, data: U) => {
  res.json(data).end();
};

