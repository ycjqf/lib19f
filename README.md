# 待办事项

- [ ] 登陆注册 JWT 状态的存储和过期 安全使用 https 来保证 包含普通用户 超级管理员 审核员
  - [ ] 用户 管理员 审核员 登陆 数据模型的确定
  - [ ] 前后端登陆注册的接口规范
  - [ ] 登陆和注册逻辑的实现以及验证

# 接口文档

## 数据库文档

## 交互接口

### 登陆 /api/login

三个身份的用户都通过此接口登录

**请求**

| 字段名        | 名称         | 限制                     |
| ------------- | ------------ | ------------------------ |
| email \| name | 邮箱或用户名 | 无特殊字符               |
| password      | 密码         | 于注册密码同样要求       |
| capacity      | 登记         | NORMAL(默认) CHECK ADMIN |

**响应**

| 字段名 | 名称     | 限制                         |
| ------ | -------- | :--------------------------- |
| code   | 登录状态 | 0:成功 1:逻辑错误 2:系统错误 |
| msg    | 错误标识 | 枚举见下方                   |

错误标识枚举

- `NO_SUCH_USER_OR_WRONG_PASSWORD`:给定的用户名/账户在数据库中不存在 或者密码错误
- `NAME_WRONG_PATTERN` 登录名
- `PASSWORD_WRONG_PATTERN`
- `OK`
- `INTERNAL_ERROR`

### 注册 /api/register

注册新用户，在网站创建的默认是普通用户，其他身份如超管和审查员在后端由专人添加。

**请求**

| 字段名         | 名称         | 限制                         |
| -------------- | ------------ | ---------------------------- |
| name           | 用户名       | 💎:唯一 1-120 数字字母下划线 |
| email          | 登录邮箱     | 💎:唯一 1-50                 |
| password       | 注册密码     | 16-20 数字字母下划线         |
| passwordRepeat | 确认注册密码 | 同上                         |

**响应**

| 字段名 | 名称     | 限制                         |
| ------ | -------- | ---------------------------- |
| code   | 状态码   | 0:成功 1:逻辑错误 2:其他错误 |
| msg    | 错误信息 | 枚举见下方                   |

- `EMAIL_TAKEN` 邮箱被占用
- `NAME_TAKEN` 名称被占用
- `NAME_WRONG_PATTERN` 名称类型不对 比如长度错误或者为空 或者包含不允许的字符
- `PASSWORD_WRONG_PATTERN` 同上
- `PASSWORD_UNMATCH` 密码不重
- `OK`
- `INTERNAL_ERROR`

这里给出的只是模糊的信息，具体的样式错误信息和检查在前端进行，`typings`文件夹下会将验证的常量和函数共享。

# 数据模型

所有字段尽量不使用限制，验证逻辑在服务器完成；枚举类型使用数字代替，部分语义较强的可以暂时使用字符串。

## 账户

三种用户三张表，但有公共的字段，不同的，不同层级的用户可以重名，因为是在不同的表，只是登录的时候需要区分不同的等级。

| 字段名      | 类型   | 特殊说明                                   |
| ----------- | ------ | ------------------------------------------ |
| name        | string | unique                                     |
| id          | Number | unique 插件自增                            |
| email       | string | unique                                     |
| password    | string | 无                                         |
| createdTime | Date   | 无                                         |
| updatedTime | Date   | 无                                         |
| capacity    | String | User:普通用户 reviewer:审核员 admin:管理员 |
| avatar      | string | 相对根 初次创建根据等级划分默认头像        |

**用户:公共字段**

| 字段名       | 类型   | 特殊说明 |
| :----------- | ------ | -------- |
| gender       | String |          |
| introduction | string | 自我介绍 |

**用户:普通用户** User

用户点赞的评论和文章暂时不做镜像，在评论区和文章表内查询。

**用户:审查员 **Reviewer

审查的条目在对应下面的表，通过`id`查询；除确认是审查外表内暂不存储其他数据。

**用户:管理员** Admin

可以查看系统日志（未实现），记录在数据库；除确认是管理员外表内暂不存储其他数据。

| 字段名      | 类型 | 特殊说明 |
| ----------- | ---- | -------- |
| title       |      |          |
| description |      |          |
| userId      |      |          |
| createdTime |      |          |
| body        |      |          |
| updatedTime |      |          |
| id          |      |          |
| poster      |      |          |

**文章 Article**

对应的评论在 comments 表搜类型为 article，id 为文章 id。

| 字段名      | 类型   | 特殊说明        |
| ----------- | ------ | --------------- |
| id          | number |                 |
| targetType  | String | comment article |
| targetId    | string |                 |
| body        | string |                 |
| userId      | Number |                 |
| createdTime | Date   |                 |
| updatedTime | Date   |                 |

**评论和回复 Comment**

- 回复功能待实现
- 只有普通用户才有评论功能

# 技术实现

## 认证手续

登录成功后返回 jwt 的 token，存到 localstorage。之后请求无论需要认证的页面或接口的时候都带上这个 token 放在 header，不存在的话就前端提示需要登录。
比如文件上传，主页显示不同内容，大部分的 post 请求，私密文件的拦截，类似 stash。
