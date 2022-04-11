import { defaultHeader } from "_/config/request";
import {
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_PATTERN,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN,
} from "_/config/validates";
import { Alert, Button, Collapse,TextField, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputingPassword, setInputingPassword] = useState(false);
  const [result, setResult] = useState<AccountLoginResponse | undefined>(undefined);
  const [loginForm, setLoginForm] = useState<AccountLoginRequest>({
    email: "",
    name: "",
    password: "",
    capacity: "user",
    relog: true,
  });

  document.title = `${t("NavLogin")} - ${t("global.title")}`;

  const onFail = () => {
    loginForm.password = "";

    const from = searchParams.get("from");
    if (typeof from === "string") {
      return setSearchParams({ from });
    }
    return setSearchParams({});
  };

  const submit = () => {
    axios
      .post<AccountLoginResponse>("/api/account/login", loginForm, {
        headers: defaultHeader,
      })
      .then((response) => {
        if (response.data.code === "OK") {
          localStorage.setItem("isLoggedIn", "true");
          const from = searchParams.get("from");
          navigate(from || "/");
          window.location.reload();
          return;
        }
        setResult(response.data);
        onFail();
      })
      .catch((error: AxiosError<AccountRegisterReqsponse>) => {
        onFail();
      });
  };

  useEffect(() => {
    const editing = searchParams.get("editing");
    const isEditingPassword = typeof editing === "string" && editing === "password";
    const nameValid = NAME_PATTERN.test(loginForm.name);
    if (isEditingPassword && nameValid) {
      setResult(undefined);
      setInputingPassword(true);
      return;
    }
    if (isEditingPassword && !nameValid) setSearchParams({});
    setInputingPassword(false);
  }, [loginForm.name, searchParams, setSearchParams]);

  return (
    <div className="absolute z-10 w-screen h-screen flex items-center justify-center">
      <div className="absolute w-screen h-screen bg-[#f0f0f0]" />
      <div
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
                {result ? result.message : "error"}
              </Alert>
            </Collapse>
            <Typography variant="h5" className="mb-4 after:block after:mb-1">
              登陆
            </Typography>
            <Typography variant="body1">登陆到{t("global.title")}</Typography>
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
                onChange={(event) => {
                  loginForm.name = event.target.value;
                  setLoginForm({ ...loginForm });
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
                onChange={(event) => {
                  loginForm.password = event.target.value;
                  setLoginForm({ ...loginForm });
                }}
              />
            </SwipeableViews>
          </div>
          <div className="flex">
            <Link to="/forget">
              <Typography color="primary" variant="button">
                忘记密码？
              </Typography>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/register">
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
              onClick={submit}
            >
              提交
            </Button>
          ) : (
            <Button
              variant="contained"
              className="w-fit"
              type="button"
              disabled={!NAME_PATTERN.test(loginForm.name)}
              onClickCapture={(event) => {
                event.preventDefault();
                const from = searchParams.get("from");
                if (typeof from === "string") {
                  return setSearchParams({ editing: "password", from });
                }
                return setSearchParams({ editing: "password" });
              }}
            >
              下一步
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// export default function Login() {
//   const [loginForm, setLoginForm] = useState<AccountLoginRequest>({
//     name: "zhangyoucai",
//     email: "",
//     password: "zhangyoucai",
//     capacity: "user",
//     relog: true,
//   });

//   const login = () => {
//     axios
//       .post<AccountLoginResponse>("/api/account/login", loginForm, {
//         headers: defaultHeader,
//       })
//       .then(response => {
//         if (response.data.code === "OK") {
//           localStorage.setItem("isLoggedIn", "true");
//         }
//       })
//       .catch((error: AxiosError<AccountRegisterReqsponse>) => {
//         console.log("error");
//         if (error.response?.status === 400) {
//           // wrong format request
//           // usually validations need to be done in front end
//           alert(error.response.data.message);
//           return;
//         }
//         console.log(error);
//       });
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={loginForm.name}
//         placeholder="name"
//         onChange={event =>
//           setLoginForm(prev => ({
//             ...prev,
//             name: event.target.value,
//           }))
//         }
//       />
//       <input
//         type="email"
//         value={loginForm.email}
//         placeholder="email"
//         onChange={event =>
//           setLoginForm(prev => ({
//             ...prev,
//             email: event.target.value,
//           }))
//         }
//       />
//       <input
//         type="password"
//         placeholder="password"
//         value={loginForm.password}
//         onChange={event =>
//           setLoginForm(prev => ({
//             ...prev,
//             password: event.target.value,
//           }))
//         }
//       />
//       <button onClick={login}>login</button>
//     </div>
//   );
// }
