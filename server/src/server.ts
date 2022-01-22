import express from "express";
import { connect } from "mongoose";
import { mongoServerString } from "@/util";
import API from "@/api/_router";

connect(mongoServerString)
  .then(startServer)
  .catch(error => {
    return console.log("数据库启动出错出错了，检查后再起启动吧", error);
  });

function startServer() {
  console.log(`🟢 数据库连接成功`);

  const PORT = 1337;
  const app = express();
  app.disable("x-powered-by");
  app.use(API);
  app.set("port", PORT);
  app.listen(PORT, () => {
    console.log(`🚀 运行在 http://localhost:${PORT} 模式为 ${app.get("env")}`);
  });
}
