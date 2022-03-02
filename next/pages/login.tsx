/* eslint-disable react-hooks/exhaustive-deps */
import { Button, TextField, Typography, Alert, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import { ApiLoginRequest, ApiLoginResponse } from "tps/api";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_PATTERN,
} from "tps/constants";
import { LIBRARY_NAME } from "tps/constants";
import { useRouter } from "next/router";
import Link from "next/link";
import SwipeableViews from "react-swipeable-views";
import { NextPage } from "next";

const Login: NextPage = () => {
  const router = useRouter();
  const [inputingPassword, setInputingPassword] = useState(false);
  const [result, setResult] = useState<ApiLoginResponse | undefined>(undefined);
  const [loginForm, setLoginForm] = useState<ApiLoginRequest>({
    email: "",
    name: "",
    password: "",
    capacity: "user",
  });

  useEffect(() => {
    const isEditingPassword =
      typeof router.query.editing === "string" && router.query.editing === "password";
    const nameValid = NAME_PATTERN.test(loginForm.name);
    if (isEditingPassword && nameValid) {
      setResult(undefined);
      return setInputingPassword(true);
    }
    if (isEditingPassword && !nameValid) router.push({ query: {} });
    setInputingPassword(false);
  }, [router.query]);

  return (
    <div className="absolute z-10 w-screen h-screen flex items-center justify-center">
      <div className="absolute w-screen h-screen bg-[#f0f0f0]"></div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const response = await fetch("/api/login", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginForm),
          });
          const result = (await response.json()) as ApiLoginResponse;
          if (result.code === "OK") return router.push("/");
          router.push({ query: {} });
          setResult(result);
          loginForm.password = "";
          setLoginForm(Object.assign({}, loginForm));
        }}
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
            <SwipeableViews
              index={inputingPassword ? 1 : 0}
              style={{ overflowX: "clip" }}
              slideStyle={{ overflow: "unset" }}
            >
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
            <Link href={"/forget"} passHref>
              <Typography color="primary" variant="button">
                忘记密码？
              </Typography>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href="/register" passHref>
            <Button className="relative -left-2" variant="text">
              创建账号
            </Button>
          </Link>
          {inputingPassword ? (
            <Button
              variant="contained"
              className="w-fit"
              type="submit"
              disabled={!PASSWORD_PATTERN.test(loginForm.password)}
            >
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
                const from = router.query.from;
                if (typeof from === "string") {
                  return router.push({ query: { editing: "password", from: from } });
                }
                router.push({ query: { editing: "password" } });
              }}
            >
              下一步
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
