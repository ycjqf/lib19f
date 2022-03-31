interface BaseResponse {
  code: string;
  message: string;
}

// /api/account/login

interface AccountLoginRequest {
  name: string;
  email: string;
  password: string;
  capacity: "user" | "reviewer" | "admin";
  relog: boolean;
}

interface AccountLoginResponse extends BaseResponse {
  id: number;
  capacity: AccountLoginRequest["capacity"];
}

// /api/account/register

interface AccountRegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

interface AccountRegisterReqsponse extends BaseResponse {}

// /api/account/register/check-name

interface AccountRegisterCheckNameRequest {
  name: string;
}

interface AccountRegisterCheckNameResponse {
  status: "error" | "wrong" | "error" | "taken";
  message: string;
}

// /api/account/register/check-email

interface AccountRegisterCheckEmailRequest {
  email: string;
}

interface AccountRegisterCheckEmailResponse extends AccountRegisterCheckNameResponse {}

// /api/add/article

interface AddArticleRequest {
  title: string;
  description: string;
  body: string;
}

interface AddArticleResponse extends BaseResponse {
  id: number;
}

// /api/get/article

interface GetArticleRequest {
  id: number;
}

interface GetArticleResponse extends BaseResponse {
  articles?: Article[];
  total: number;
  current: number;
  pageSize: number;
}

// /api/delete/article

interface DeleteArticleRequest {
  id: number;
}
interface DeleteArticleResponse extends BaseResponse {}

// /api/update/article
interface UpdateArticleRequest {
  id: number;
  article: AddArticleRequest;
}

interface UpdateArticleResponse extends BaseResponse {}

// /api/get/articles
interface GetArticlesRequest {
  page: number;
  pageSize: number;
  search: string;
  userId: number;
  userName: string;
  since: number;
  till: number;
  status: string;
  sort: string;
}

interface GetArticlesResponse extends BaseResponse {
  total: number;
  articles: Article[];
  current: number;
  pageSize: number;
}

// /api/authenticate

interface AuthenticateResponse extends BaseResponse {
  user: Article["user"];
  capacity: string;
}

interface Article {
  id: number;
  title: string;
  description: string;
  body: string;
  poster: string;
  status: string;
  createdTime: string;
  updatedTime: string;
  user: {
    id: number;
    name: string;
    email: string;
    createdTime: string;
    updatedTime: string;
    avatar: string;
    gender: string;
    introduction: string;
  };
}
