/**
 * 账户表
 */
interface AccountDocument {
  /**
   * 账户全局标识符
   * @type 1～ +1
   */
  id: number;
  /**
   * 账户用户名，用于显示
   * @type 8-12
   */
  name: string;
  /**
   * 邮箱
   * @type 字符串
   */
  email: string;
  /**
   * 密码
   * @type 16位md5加密
   */
  password: string;
  /**
   * 性别
   * @type 数字 0：未知，1：男，2：女
   * @default 0
   */
  gender: number;
  /**
   * 自我介绍
   * @type 0-120
   * @default 留空
   */
  introduction: string;
  /**
   * 用户头像相对路径
   * @type 字符串
   * @default '_default.png'
   */
  avatar: string;
  /**
   * 创建时间
   * @default 当前时间
   */
  createdTime: Date;
  /**
   * 更新时间
   * @default 当前时间
   */
  updatedTime: Date;
}

interface ManagerDocument extends AccountDocument {
  /**
   * 身份
   * @default 0-审查员 1-管理员
   */
  compacity: number;
}

interface ArticleDocument {
  id: number;
  accountId: number;
  title: string;
  introduction: string;
  poster: string;
  createdTime: Date;
  updatedTime: Date;
  body: string;
  tags: Array<{
    name: string;
    desription: string;
  }>;
}

interface ArticleCommentDocument {
  id: number;
  targetArticleId: number;
  targetCommentId: number;
  userId: number;
  body: string;
  upvotedAccountIds: Array<number>;
  downvotedAccountIds: Array<number>;
  createdTime: Date;
  updatedTime: Date;
}
