import { ApiGetProfileResponse, AuthenticateRes } from "@/../typings/api";
import type { NextApiRequest, NextApiResponse, GetServerSidePropsContext } from "next";

export async function cookiePost<Req, Res>(
  req: NextApiRequest,
  res: NextApiResponse<Res>,
  url: string,
  data: Req
): Promise<Res> {
  const cookie = req.headers.cookie;
  const headers: HeadersInit =
    typeof cookie === "string"
      ? { "Content-Type": "application/json", cookie: cookie }
      : { "Content-Type": "application/json" };
  const option: RequestInit = {
    method: "post",
    headers: headers,
    body: JSON.stringify(data),
  };
  const response = await fetch(url, option);
  const setCookie = response.headers.get("set-cookie");
  if (typeof setCookie === "string") res.setHeader("set-cookie", setCookie);
  const result = (await response.json()) as Res;
  return result;
}

export async function getProfileSSR(
  req: GetServerSidePropsContext["req"],
  res: GetServerSidePropsContext["res"]
): Promise<AuthenticateRes> {
  // const authResult = await cookiePost(req, res, "", {});
  const cookie = req.headers.cookie;
  const headers: HeadersInit =
    typeof cookie === "string"
      ? { "Content-Type": "application/json", cookie: cookie }
      : { "Content-Type": "application/json" };
  const option: RequestInit = {
    method: "get",
    headers: headers,
  };
  const response = await fetch("http://localhost:1337/api/authenticate", option);
  const setCookie = response.headers.get("set-cookie");
  if (typeof setCookie === "string") res.setHeader("set-cookie", setCookie);
  const result = (await response.json()) as AuthenticateRes;
  console.log(result);
  return result;
}
