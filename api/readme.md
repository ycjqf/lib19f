# /v0/api

## /account

### 🪐 /register

Request <u>AccountRegisterRequest</u>

|                | Description                 | Syntax                                         |
| -------------- | --------------------------- | ---------------------------------------------- |
| name           | account name                | **string** letter/number/underscore [2-20]     |
| email          | account email address       | **string** match mail format and max length 50 |
| password       | account password for loggin | **string** letter/number/underscore [6-20]     |
| passwordRepeat | password confirmation       | **string** should be same as password supplied |

Response <u>ApiBaseResponse</u>

|         | Description                              |
| ------- | ---------------------------------------- |
| code    | **string** result of this access         |
| message | **string** message for development usage |

Response Code Enums

|                | Description                                   | Status |
| -------------- | --------------------------------------------- | ------ |
| BAD_REQUEST    | syntax error or damaged json                  | 400    |
| INTERNAL_ERROR | internal error,etc cannot connect to database | 500    |
| NAME_TAKEN     | name is being used already                    | 200    |
| EMAIL_TAKEN    | email is being used already                   | 200    |
| OK             | account registered successfully               | 200    |

#### 🪐 /check-email

Request <u>AccountRegisterCheckEmailRequestRequest</u>

|       | Description            | Syntax     |
| ----- | ---------------------- | ---------- |
| email | user email to register | **string** |

Response <u>AccountRegisterCheckCommonRequestResponse</u>

|         | Description                              |
| ------- | ---------------------------------------- |
| status  | **string** result of this access         |
| message | **string** message for development usage |

Response Status Enums

|       | Description                               | Status |
| ----- | ----------------------------------------- | ------ |
| error | decode error, etc received a damaged json | 400    |
| error | internal error, etc database connection   | 500    |
| wrong | syntax error                              | 500    |
| taken | this email is being used already          | 200    |
| valid | this email is valid                       | 200    |

#### 🪐 /check-name

Request <u>AccountRegisterCheckNameRequestRequest</u>

|      | Description           | Syntax     |
| ---- | --------------------- | ---------- |
| name | user name to register | **string** |

Response <u>AccountRegisterCheckCommonRequestResponse</u>

|         | Description                              |
| ------- | ---------------------------------------- |
| status  | **string** result of this access         |
| message | **string** message for development usage |

Response Status Enums

|       | Description                               | Status |
| ----- | ----------------------------------------- | ------ |
| error | decode error, etc received a damaged json | 400    |
| error | internal error, etc database connection   | 500    |
| wrong | syntax error                              | 500    |
| taken | this name is being used already           | 200    |
| valid | this name is valid                        | 200    |

### 🪐 /login

Request <u>AccountLoginRequest</u>

|          | Description         | Syntax                                                       |
| -------- | ------------------- | ------------------------------------------------------------ |
| name     | account name        | **string** letter/number/underscore [2-20], only check and use if email invalid |
| email    | account email       | **string** match mail format and max length 50               |
| password | account password    | **string** letter/number/underscore [6-20]                   |
| capacity | login account level | **'user' \| 'reviewer' \| 'admin'** case sensitive           |
| relog    | logout other log in | **boolean**                                                  |

Response <u>AccountLoginResponse</u>

|          | Description                                                  |
| -------- | ------------------------------------------------------------ |
| code     | **string** result of this access                             |
| message  | **string** message for development usage                     |
| id       | **number** logged in account id                              |
| capacity | **string **login account level 'user' \|'reviewer' \|'admin' |

Response Code Enums

|                  | Description                                     | Status |
| ---------------- | ----------------------------------------------- | ------ |
| BAD_REQUEST      | syntax error or damaged json                    | 400    |
| INTERNAL_ERROR   | internal error,etc cannot connect to database   | 500    |
| WRONG_CREDENTIAL | wrong password or name, or not exist            | 200    |
| OK               | loggin success                                  | 200    |
| LOGGED           | logged in somewhere else yet **relog** is false | 200    |

**Side Effects** 

+ if code is OK, create **Set-Cookie** with expiration **10min**

### 🪐 /logout

**WILL NOT REFRESH SESSION**

Request Authentication

+ ACTION:

Response <u>ApiBaseResponse</u>

|         | Description                              |
| ------- | ---------------------------------------- |
| code    | **string** result of this access         |
| message | **string** message for development usage |

Response Code Enums

|                  | Description                                     | Status |
| ---------------- | ----------------------------------------------- | ------ |
| BAD_REQUEST      | syntax error or damaged json                    | 400    |
| INTERNAL_ERROR   | internal error,etc cannot connect to database   | 500    |
| WRONG_CREDENTIAL | wrong password or name, or not exist            | 200    |
| OK               | loggin success                                  | 200    |
| LOGGED           | logged in somewhere else yet **relog** is false | 200    |

**Side Effects**

+ clear cookie if code is OK

## /article

### 🪐 /get

Request <u>IdCommonRequest</u>

|      | Description              | Syntax                   |
| ---- | ------------------------ | ------------------------ |
| id   | get article with this id | **number** integer not 0 |

Response <u>GetArticleResponseWithArticle</u>

|          | Description                                      |
| -------- | ------------------------------------------------ |
| code     | **string** result of this access                 |
| message  | **string** message for development usage         |
| ?article | **ClientArticle** found article, only when found |

Response Code Enums

|                | Description                                   | Status |
| -------------- | --------------------------------------------- | ------ |
| BAD_REQUEST    | syntax error or damaged json                  | 400    |
| INTERNAL_ERROR | internal error,etc cannot connect to database | 500    |
| NOT_FOUND      | can not found this article                    | 404    |
| OK             | success                                       | 200    |

```typescript
type GetArticleResponse = (
  | {
      code:
        | "BAD_REQUEST" // 400
        | "INTERNAL_ERROR" // 500
        | "NOT_FOUND"; // 404
    }
  | {
      code: "OK"; // 200
      article: Article;
    }
) & {
  message: string;
  total: number;
  current: number;
  pageSize: number;
};
```



### 🪐 /add 🔒

Request <u>AddArticleRequest</u>

|             | Description | Syntax                              |
| ----------- | ----------- | ----------------------------------- |
| title       |             | **string** trimmed length [5,50]    |
| description |             | **string** trimmed max length 140   |
| body        |             | **string** trimmed length [5,10000] |

Response <u>AddArticleResponse</u>

|         | Description                               |
| ------- | ----------------------------------------- |
| code    | **string** result of this access          |
| message | **string** message for development usage  |
| id      | **number** uploaded article 0 when not OK |

Response Code Enums

|                | Description                                   | Status |
| -------------- | --------------------------------------------- | ------ |
| BAD_REQUEST    | syntax error or damaged json                  | 400    |
| INTERNAL_ERROR | internal error,etc cannot connect to database | 500    |
| OK             | success                                       | 200    |
| UNAUTHORIZED   | cookie invalid / not user                     | 401    |

### 🪐 /set 🔒

Request <u>AddArticleRequest</u>

|             | Description | Syntax                              |
| ----------- | ----------- | ----------------------------------- |
| title       |             | **string** trimmed length [5,50]    |
| description |             | **string** trimmed max length 140   |
| body        |             | **string** trimmed length [5,10000] |

Response <u>AddArticleResponse</u>

|         | Description                               |
| ------- | ----------------------------------------- |
| code    | **string** result of this access          |
| message | **string** message for development usage  |
| id      | **number** uploaded article 0 when not OK |

Response Code Enums

|                | Description                                   | Status |
| -------------- | --------------------------------------------- | ------ |
| BAD_REQUEST    | syntax error or damaged json                  | 400    |
| INTERNAL_ERROR | internal error,etc cannot connect to database | 500    |
| OK             | success                                       | 200    |
| NOT_FOUND      | can not found this article                    | 404    |
| UNAUTHORIZED   | cookie invalid / not user / not owner         | 401    |

### 🪐 /del 🔒

Request <u>IdCommonRequest</u>

|      | Description                 | Syntax                   |
| ---- | --------------------------- | ------------------------ |
| id   | delete article with this id | **number** integer not 0 |

Response <u>ApiBaseResponse</u>

|          | Description                                      |
| -------- | ------------------------------------------------ |
| code     | **string** result of this access                 |
| message  | **string** message for development usage         |

Response Code Enums

|                | Description                                   | Status |
| -------------- | --------------------------------------------- | ------ |
| BAD_REQUEST    | syntax error or damaged json                  | 400    |
| INTERNAL_ERROR | internal error,etc cannot connect to database | 500    |
| NOT_FOUND      | can not found this article                    | 404    |
| OK             | success                                       | 200    |
| UNAUTHORIZED   | cookie invalid / not user / not owner         | 401    |

**Side Effects**

## /articles

### 🪐 /get

Request <u>GetArticlesRequest</u>

|               | Description           | Syntax                           |
| ------------- | --------------------- | -------------------------------- |
| page = 1      | get user with this id | **number** integer bigger than 0 |
| pageSize = 10 | articles max per page | **number** integer [1,100]       |
| search 🚧      |                       | **string**                       |
| userId 🚧      |                       | **number**                       |
| userName 🚧    |                       | **string**                       |
| since 🚧       |                       | **number**                       |
| Till 🚧        |                       | **number**                       |
| status 🚧      |                       | **string**                       |
| sort 🚧        |                       | **string**                       |

Response <u>GetArticelsResponse</u>

|          | Description                                      |
| -------- | ------------------------------------------------ |
| code     | **string** result of this access                 |
| message  | **string** message for development usage         |
| articles | **ClientArticle** found article, only when found |
| total    | **number**                                       |
| pageSize | **number**                                       |
| current  | **number**                                       |

Response Code Enums

|                | Description                                   | Status |
| -------------- | --------------------------------------------- | ------ |
| BAD_REQUEST    | syntax error or damaged json                  | 400    |
| INTERNAL_ERROR | internal error,etc cannot connect to database | 500    |
| OK             | success                                       | 200    |

```typescript
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
```



## /profile

### 🪐 /get

Request <u>IdCommonRequest</u>

|      | Description           | Syntax                   |
| ---- | --------------------- | ------------------------ |
| id   | get user with this id | **number** integer not 0 |

Response <u>GetUserResponseWithUser</u>

|         | Description                               |
| ------- | ----------------------------------------- |
| code    | **string** result of this access          |
| message | **string** message for development usage  |
| ?user   | **ClienUser** found user, only when found |

Response Code Enums

|                | Description                                   | Status |
| -------------- | --------------------------------------------- | ------ |
| BAD_REQUEST    | syntax error or damaged json                  | 400    |
| INTERNAL_ERROR | internal error,etc cannot connect to database | 500    |
| NOT_FOUND      | can not found this article                    | 404    |
| OK             | success                                       | 200    |

## /review

## /admin

### 🪐 /dashboard

## 🪐 /authenticate 🔒

Response <u>GetUserResponseWithUser</u>

|         | Description                              |
| ------- | ---------------------------------------- |
| code    | **string** result of this access         |
| message | **string** message for development usage |
| ?user   | **ClienUser** found user, only when found |

Response Code Enums

|                | Description                                   | Status |
| -------------- | --------------------------------------------- | ------ |
| INTERNAL_ERROR | internal error,etc cannot connect to database | 500    |
| OK             | success                                       | 200    |
| UNAUTHORIZED   | cookie invalid                                | 401    |

# TODOS

## /about ✅

## /home ✅



## /article/:id ✅

+ /api/article/get

## /articles ✅

+ /api/articles/get

## /login ✅

## /register ✅

## /review/dashboard

## /admin/dashboard

## /upload

## /update

