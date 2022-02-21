import { Button, TextField, Typography, Alert, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import { Form, ActionFunction, MetaFunction, Link, useActionData, useSearchParams, redirect } from "remix";
import { ApiLoginRequest, ApiLoginResponse } from "~typings/api";
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH, NAME_PATTERN, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_PATTERN } from "~typings/constants";
import { LIBRARY_NAME } from "~typings/constants";
// @ts-ignore
import SwipeableViews from "react-swipeable-views";

export const meta: MetaFunction = () => {
  return {
    title: `登陆`,
    describe: `登陆到${LIBRARY_NAME}`,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const form = {
    email: "",
    name: body.get("name"),
    password: body.get("password"),
    capacity: "user",
  } as ApiLoginRequest;
  const response = await fetch("http://localhost:1337/api/account/login", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  const result = await (response.json() as Promise<ApiLoginResponse>);
  if (result.code === "OK")
    return redirect("/", {
      headers: {
        "set-cookie": `${response.headers.get("set-cookie")}`,
      },
    });
  return result;
};

export default function Login() {
  const [loginForm, setLoginForm] = useState<ApiLoginRequest>({
    email: "",
    name: "",
    password: "",
    capacity: "user",
  });
  const [params, setParams] = useSearchParams();
  const [inputingPassword, setInputingPassword] = useState(false);
  const result = useActionData() as ApiLoginResponse | undefined;

  useEffect(() => {
    if (typeof result === "undefined") return;
    if (result.code !== "OK") {
      loginForm.password = "";
      setLoginForm(Object.assign({}, loginForm));
      return;
    }
    localStorage.setItem("access_token", `${result.accessToken}`);
    localStorage.setItem("refresh_token", `${result.refreshToken}`);
    window.location.href = "/";
  }, [result]);

  useEffect(() => {
    const isEditingPassword = !!params.get("editing") && params.get("editing") === "password";
    const nameValid = NAME_PATTERN.test(loginForm.name);
    if (isEditingPassword && nameValid) return setInputingPassword(true);
    if (isEditingPassword && !nameValid) return setParams({});
    setInputingPassword(false);
  }, [params]);

  return (
    <div className="absolute z-10 w-screen h-screen flex items-center justify-center">
      <div className="absolute w-screen h-screen bg-[#f0f0f0]"></div>

      <Form
        method="post"
        className={`flex flex-col z-10
            justify-between
            bg-[#f0f0f0]
            border-[#dadce0] border-[1px]
            px-16
            py-24
            w-full
            h-screen
            md:rounded md:shadow md:min-h-[500px]
            md:w-[448px] md:h-auto
            md:px-12 ${result && result.code !== "OK" ? "md:py-8" : "md:py-16"}
            transition-all
            duration-150
            ease-out`}
      >
        <div className="mb-4 flex-1 flex flex-col">
          <div className="mb-8">
            <Collapse in={result && result.code !== "OK"}>
              <Alert severity="error" variant="filled" className="mb-8">
                {result?.message}
              </Alert>
            </Collapse>
            <Typography variant="h5" className="mb-4 after:block after:mb-1">
              登陆
            </Typography>
            <Typography variant="body1">登陆到{LIBRARY_NAME}</Typography>
          </div>
          <div className="flex flex-col gap-y-8 mb-4">
            <SwipeableViews index={inputingPassword ? 1 : 0} style={{ overflowX: "clip" }} slideStyle={{ overflow: "unset" }}>
              <TextField
                autoFocus
                error={loginForm.name !== "" && !NAME_PATTERN.test(loginForm.name)}
                helperText={`${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH}位，仅含字母数字和下划线`}
                fullWidth
                name="name"
                label="用户名"
                variant="outlined"
                type="text"
                value={loginForm.name}
                onChange={event => {
                  loginForm.name = event.target.value;
                  setLoginForm(Object.assign({}, loginForm));
                }}
              />
              <TextField
                error={loginForm.password !== "" && !PASSWORD_PATTERN.test(loginForm.password)}
                helperText={`${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH}位，仅含字母数字和下划线`}
                fullWidth
                name="password"
                label="密码"
                variant="outlined"
                type="password"
                value={loginForm.password}
                onChange={event => {
                  loginForm.password = event.target.value;
                  setLoginForm(Object.assign({}, loginForm));
                }}
              />
            </SwipeableViews>
          </div>
          <div className="flex">
            <Link to={"/forget"}>
              <Typography color="primary" variant="button">
                忘记密码？
              </Typography>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/register" className="relative -left-2">
            <Button variant="text">创建账号</Button>
          </Link>
          {inputingPassword ? (
            <Button variant="contained" className="w-fit" type="submit" disabled={!PASSWORD_PATTERN.test(loginForm.password)}>
              提交
            </Button>
          ) : (
            <Button
              variant="contained"
              className="w-fit"
              type="button"
              disabled={!NAME_PATTERN.test(loginForm.name)}
              onClickCapture={event => {
                event.preventDefault();
                setParams({ editing: "password" });
              }}
            >
              下一步
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
