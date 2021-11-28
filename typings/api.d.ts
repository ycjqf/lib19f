// lib19f 的前后端交互api接口类型声明
// 项目地址: https://github.com/ycjqf/lib19f

/* =================== 注意事项 ==================

    服务端接口传递数据时类型使用 application/json

 =============================================== */

/**
 *  /api/account/register 请求体
 */
interface ApiAccountRegisterRequest {
  name: AccountDocument["name"];
  email: AccountDocument["email"];
  password: AccountDocument["password"];
  passwordRepeat: AccountDocument["password"];
}
/**
 *  /api/account/register 响应体
 */
interface ApiAccountRegisterRespond {
  /** 0 注册成功 1 不符合要求 2 注册时服务出错 */
  code: 0 | 1 | 2;
  message: string;
  errors?: Array<ApiFormValidateError>;
}

/**
 *  /api/account/login 请求体
 */

type ApiAccountLoginRequest =
  | {
      name: AccountDocument["name"];
      password: AccountDocument["password"];
    }
  | {
      email: AccountDocument["email"];
      password: AccountDocument["password"];
    };

/**
 *  /api/account/login 响应体
 */
interface ApiAccountLoginRespond {
  /** 0 登陆成功 1 密码错误或用户不存在 2 登陆时服务出错 */
  code: 0 | 1 | 2;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}
/**
 * /api/account/logout 请求体
 */
export interface ApiAccountLogoutRespond {
  /** 0 登陆成功 1 密码错误或用户不存在 2 登陆时服务出错 */
  code: 0 | 1 | 2;
  message: string;
}
/**
 * /api/account/logout 响应体
 */
export interface ApiAccountLogoutRequest {
  token: string;
}

// 其他接口的通用部分

/**
 * 表单的验证错误
 */
interface ApiFormValidateError {
  field: string;
  message: string;
}
