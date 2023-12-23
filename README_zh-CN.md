<p align="center">
  <a href="https://seven-demo.supcat.cn/" target="_blank">
    <img alt="Seven Logo" src="https://seven-demo.supcat.cn/images/logo-footer.svg" width="350" height="70" style="max-width: 100%;">
  </a>
</p>

<p align="center">
  一款使用了 Tailwind CSS 构建的简洁、漂亮的 Hugo 主题
</p>

---

[English](./README.md) | 中文

<img alt="Seven screenshot" src="https://seven-demo.supcat.cn/images/screenshot/xdr.webp" width="500">

## 示例

链接：[Demo](https://snazzy-jelly-839142.netlify.app/)

示例代码在另外一个 GitHub 仓库：[hugo-theme-seven-demo](https://github.com/mrhelloboy/hugo-theme-seven-demo)

## 前提条件

1. 需要使用 Hugo Modules 功能。所以需要在本地下载 Go。具体细节请参考文档 [Hugo Modules Prerequisite](https://gohugo.io/hugo-modules/use-modules/#prerequisite)
2. Hugo 版本至少需要 `v0.112.0`。**建议使用最新版本的 Go 和 Hugo**。参考文档 [configure-cache-busters](https://gohugo.io/getting-started/configuration/#configure-cache-busters)

## 使用说明

1. 已有 Hugo 站点使用本主题，需要删掉 themes 目录及相关文件（如果有的话）

2. 将站点初始化为 module。在自己站点根目录下执行命令：

   ```bash
   hugo mod init github/[username]/[sitename]
   ```

   请将上面中的 `username` 和 `sitename` 替换成自己的

3. 建议从 [hugo-theme-seven-demo 仓库](https://github.com/mrhelloboy/hugo-theme-seven-demo) 复制 `hugo.toml` 文件到自己站点根目录上。

   如果不使用 Demo 的 `hugo.toml` 文件，请复制下面的配置到自己的 `hugo.toml` 文件里：

   ```toml
   [module]
     # Recommend Chinese users to use this proxy configuration
     # proxy = 'https://goproxy.cn,direct'
     [[module.imports]]
       path = 'github.com/mrhelloboy/seven'
     [module.hugoVersion]
       extended = false
       min      = "0.112.0"
     [[module.mounts]]
       source = "assets"
       target = "assets"
     [[module.mounts]]
       source = "hugo_stats.json"
       target = "assets/watching/hugo_stats.json"

   [build]
     writeStats = true
     [[build.cachebusters]]
       source = "assets/watching/hugo_stats\\.json"
       target = "styles\\.css"
     [[build.cachebusters]]
       source = "(postcss|tailwind)\\.config\\.js"
       target = "css"
     [[build.cachebusters]]
       source = "assets/.*\\.(js|ts|jsx|tsx)"
       target = "js"
     [[build.cachebusters]]
       source = "assets/.*\\.(.*)$"
       target = "$1"
   ```

   主题需要用到的其他配置参数请参考 Demo 的 `hugo.toml`

4. 执行命令

   ```bash
   hugo mod npm pack
   ```

   会生成文件 `package.json`、`package.hugo.json` 并导入 module 及更新 `go.mod` 和 `go.sum` 文件等。

5. 执行命令下载需要的依赖

   ```bash
   npm install
   ```

6. 启动本地服务

   ```bash
   hugo server
   ```

   或者：

   ```bash
   hugo server --disableLiveReload --minify --gc -D
   ```

## 部署

请参考 [Hugo 部署文档](https://gohugo.io/hosting-and-deployment/)

### 部署到 `Netlify` 为例：

1. 复制 Demo 仓库中的 `netlify.toml` 到自己站点及推送到 Github 上

2. 注册并登录 Netlify

3. 导入 GitHub 项目，Netlify 会读取 `netlify.toml` 文件自动构建

## 维护者

[@mrhelloboy](https://github.com/mrhelloboy)

## 使用许可

[MIT © mrhelloboy.](./LICENSE)
