import { Button, TextField, Typography, Alert, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import { Form, ActionFunction, MetaFunction, Link, useActionData, redirect } from "remix";
import { ApiRegisterRequest, ApiRegisterResponse } from "~typings/api";
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH, NAME_PATTERN, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_PATTERN } from "~typings/constants";
import { LIBRARY_NAME } from "~typings/constants";
import validator from "validator";

export const meta: MetaFunction = () => {
  return {
    title: `注册`,
    describe: `注册${LIBRARY_NAME}`,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const form = {
    email: body.get("email"),
    name: body.get("name"),
    password: body.get("password"),
    passwordRepeat: body.get("passwordRepeat"),
    capacity: "user",
  } as ApiRegisterRequest;
  const result = (await (
    await fetch("http://localhost:1337/api/account/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
  ).json()) as ApiRegisterResponse;
  if (result.code === "OK") return redirect("/login");
  return result;
};

export default function Login() {
  const [registerForm, setRegisterForm] = useState<ApiRegisterRequest>({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
    capacity: "user",
  });
  const canRegister =
    validator.matches(registerForm.name, NAME_PATTERN) &&
    validator.matches(registerForm.password, PASSWORD_PATTERN) &&
    validator.isEmail(registerForm.email) &&
    registerForm.password === registerForm.passwordRepeat;
  const result = useActionData() as ApiRegisterResponse | undefined;

  useEffect(() => {
    if (typeof result === "undefined") return;
    if (result.code !== "OK") return;
    console.log(result);
  }, [result]);

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
            md:w-[528px] md:h-auto
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
              注册
            </Typography>
            <Typography variant="body1">注册{LIBRARY_NAME}账号</Typography>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col gap-y-4 mb-2">
              <TextField
                autoFocus
                error={registerForm.name !== "" && !NAME_PATTERN.test(registerForm.name)}
                helperText={`${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH}位，仅含字母数字和下划线`}
                fullWidth
                name="name"
                label="用户名"
                variant="outlined"
                type="text"
                size="small"
                value={registerForm.name}
                onChange={event => {
                  registerForm.name = event.target.value;
                  setRegisterForm(Object.assign({}, registerForm));
                }}
              />
              <TextField
                error={registerForm.email !== "" && !validator.isEmail(registerForm.email)}
                helperText={`请输入邮箱地址`}
                fullWidth
                name="email"
                label="邮箱"
                variant="outlined"
                type="email"
                size="small"
                value={registerForm.email}
                onChange={event => {
                  registerForm.email = event.target.value;
                  setRegisterForm(Object.assign({}, registerForm));
                }}
              />
            </div>
            <div className="flex mb-8">
              <a href="https://mail.163.com/register/" target="_blank">
                <Typography color="primary" variant="button">
                  创建一个网易邮箱
                </Typography>
              </a>
            </div>
            <div className="flex flex-col gap-y-4 md:flex-row gap-x-4">
              <TextField
                error={registerForm.password !== "" && !PASSWORD_PATTERN.test(registerForm.password)}
                helperText={`${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH}位，仅含字母数字和下划线`}
                fullWidth
                name="password"
                label="密码"
                variant="outlined"
                type="password"
                size="small"
                value={registerForm.password}
                onChange={event => {
                  registerForm.password = event.target.value;
                  setRegisterForm(Object.assign({}, registerForm));
                }}
              />
              <TextField
                error={registerForm.passwordRepeat !== registerForm.password}
                helperText={`确认密码一致`}
                fullWidth
                name="passwordRepeat"
                label="确认"
                variant="outlined"
                type="password"
                size="small"
                value={registerForm.passwordRepeat}
                onChange={event => {
                  registerForm.passwordRepeat = event.target.value;
                  setRegisterForm(Object.assign({}, registerForm));
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Link to="/login" className="relative -left-2">
            <Button variant="text">已有账号？</Button>
          </Link>
          <Button variant="contained" className="w-fit" type="submit" disabled={!canRegister}>
            注册
          </Button>
        </div>
      </Form>
    </div>
  );
}
