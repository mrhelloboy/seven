<p align="center">
  <a href="https://seven-demo.supcat.cn/" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://seven-demo.supcat.cn/images/logo-footer.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://seven-demo.supcat.cn/images/logo.svg">
      <img alt="Hugo theme Seven" src="https://seven-demo.supcat.cn/images/logo.svg" width="350" height="70" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  一款使用了 Tailwind CSS 构建的简洁、漂亮的 Hugo 主题
</p>

---

[English](./README.md) | 中文

<img alt="Seven screenshot" src="https://seven-demo.supcat.cn/images/screenshot/xdr.webp" width="500">

## 示例

→ [示例网站](https://seven-demo.supcat.cn/)

→ [示例代码仓库](https://github.com/mrhelloboy/hugo-theme-seven-demo)

## 前提条件

在开始使用本Hugo主题之前，请确保符合以下要求：

1. 安装了 [Go](https://go.dev/dl/)。参考文档 [Hugo Modules Prerequisite](https://gohugo.io/hugo-modules/use-modules/#prerequisite)
2. 确保 Hugo 版本为 **v0.112.0** 或更新版本。参考文档 [configure-cache-busters](https://gohugo.io/getting-started/configuration/#configure-cache-busters)

## 快速体验

1. 克隆 [示例代码](https://github.com/mrhelloboy/hugo-theme-seven-demo)
   ```sh
   git clone https://github.com/mrhelloboy/hugo-theme-seven-demo.git
   ```
2. 执行命令

   ```sh
   cd hugo-theme-seven-demo

   hugo mod npm pack

   npm install

   hugo server
   ```

## 从零开始

0. 安装 Go 和 Hugo

1. 创建站点

   ```sh
   hugo new site [sitename]
   cd [sitename]
   # 删除站点的 themes 目录
   rm -rf themes
   ```

2. 初始化 Hugo 模块

   ```sh
   hugo mod init github.com/[username]/[sitename]
   ```

3. 导入主题模块

   在 hugo.toml 中配置主题

   ```toml
   [module]
   [[module.imports]]
     path = 'github.com/mrhelloboy/seven'
   ```

   > 因为主题需要额外的配置参数，为了避免出错，建议先使用示例的 [hugo.toml](https://github.com/mrhelloboy/hugo-theme-seven-demo/blob/main/hugo.toml) ，再按需修改。

   **注意：**
   如使用了示例的 hugo.toml。需注释掉 `customSocial = "extra_social.html"`，否则启动时将会出错。

   > 更多 hugo 模块的说明及使用，请参考 [Hugo Modules](https://gohugo.io/hugo-modules/)

4. 安装依赖及启动

   ```sh
   hugo mod npm pack

   npm install

   hugo server
   ```

## 更新主题模块

```bash
hugo mod clean
hugo mod get
hugo mod tidy
```

## 更新 package.json

> 先删除 `package-lock.json`、`package.json`。

```bash
hugo mod npm pack
npm install
```

## 部署

请参考 [Hugo 部署文档](https://gohugo.io/hosting-and-deployment/)

### 部署到 `Netlify` 例子：

1. 复制示例代码的 [`netlify.toml`](https://github.com/mrhelloboy/hugo-theme-seven-demo/blob/main/netlify.toml) 到自己站点及推送到 Github 上

2. 注册并登录 Netlify

3. 导入 GitHub 项目，Netlify 会读取 `netlify.toml` 文件自动构建

## 维护者

[@mrhelloboy](https://github.com/mrhelloboy)

## 使用许可

[MIT © mrhelloboy.](./LICENSE)
