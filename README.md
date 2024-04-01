# 图书管理系统

# 简介

图书管理系统基于 **react、nextjs、antd** 技术栈实现的。

**通过这个项目可以学习到：**

1. 如何使用 nextjs 开发一个真实项目
2. react 的基本语法以及 react hook 的使用
3. react 项目是如何请求数据
4. axios 的封装
5. react 的组件如何封装



# 启动

1. 下载代码，终端进入该项目目录下
2. 下载依赖包，执行

   ```shell
   npm install
   ```

3. 若连接启动 mock 服务，打开根目录下的 next.config.js 文件，确认以下代码不在注释中

   ```
   destination: `https://mock.apifox.cn/m1/2398938-0-default/api/:path*`,
   ```

4. 若期望连接本地服务，打开根目录下的 next.config.js 文件，确认以下代码不在注释中

   ```javascript
   destination: `http://localhost:3001/api/:path*`,
   ```

5. 运行项目

   ```shell
   npm run dev
   ```

6. 访问 localhost:3000/login
7. 看到如下页面，表明启动成功
   ![](https://raw.githubusercontent.com/calmound/book-admin-react/master/screenshot/2.png)
8. 账号，管理员（账号：admin,密码：admin），用户（账号：user，密码：user）
