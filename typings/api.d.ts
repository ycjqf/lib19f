export interface ApiAccountRegisterRespond {
  /** 0 注册成功 1 不符合要求 2 注册时服务出错 */
  code: 0 | 1 | 2;
  message: string;
  errors?: Array<validationError>;
}
export interface ApiAccountRegisterRequest {
  name: string;
  nickname: string;
  password: string;
  passwordRepeat: string;
}
interface validationError {
  field: string;
  message: string;
}
export interface ApiAccountLoginRespond {
  /** 0 登陆成功 1 密码错误或用户不存在 2 登陆时服务出错 */
  code: 0 | 1 | 2;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}
export interface ApiAccountLoginRequest {
  name: string;
  password: string;
}
