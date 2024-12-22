<p align="center">
  <a href="https://hugoseven.netlify.app/" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://hugoseven.netlify.app/images/logo-footer.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://hugoseven.netlify.app/images/logo.svg">
      <img alt="Hugo theme Seven" src="https://hugoseven.netlify.app/images/logo.svg" width="350" height="70" style="max-width: 100%;">
    </picture>
  </a>
</p>

<p align="center">
  一款使用了 Tailwind CSS 构建的简洁、漂亮的 Hugo 主题
</p>

---

[English](./README.md) | 中文

<img alt="Hugo theme Seven" src="https://hugoseven.netlify.app/images/screenshot.webp" width="600">

## 示例

→ [示例网站](https://hugoseven.netlify.app/)

## 前提条件

在开始使用本Hugo主题之前，请确保符合以下要求：

1. 已经安装 [Go](https://go.dev/dl/)
2. 确保 `Hugo >= v0.128.0`

## 快速体验

### 1. 克隆本仓库

```sh
git clone https://github.com/mrhelloboy/seven.git
```

### 2. 进入 exampleSite 目录

```sh
cd exampleSite
```

### 3. 执行命令

```sh
cd hugo-theme-seven-demo

hugo mod npm pack

npm install

hugo server
```

## 从零开始

### 1. 安装 Go 和 Hugo

### 2. 创建站点

```sh
hugo new site [sitename]

cd [sitename]

rm -rf themes
```

### 3. 初始化 Hugo 模块

```sh
hugo mod init github.com/[username]/[sitename]
```

### 4. 导入主题模块

在 hugo.toml 中配置主题

```toml
[module]
[[module.imports]]
   path = 'github.com/mrhelloboy/seven'
```

> 因为主题需要额外的配置参数，为了避免出错，建议先使用 exampleSite 的配置文件，然后再按需修改。
>
> 更多 hugo 模块的说明及使用，请参考 [Hugo Modules](https://gohugo.io/hugo-modules/)

### 5. 安装依赖及启动

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

1. 在站点上创建 `netlify.toml` 文件，并赋值以下内容：

   ```toml
   [build.environment]
   HUGO_VERSION = "0.128.0"

   [build]
   publish = "public"
   command = "hugo --gc --minify"

   [context.deploy-preview]
   command = "hugo --minify -D -F -b $DEPLOY_PRIME_URL"

   [context.branch-deploy]
   command = "hugo --minify --gc -b $DEPLOY_PRIME_URL"
   ```

2. 注册并登录 Netlify

3. 导入 GitHub 项目，Netlify 会读取 `netlify.toml` 文件自动构建

## 维护者

[@mrhelloboy](https://github.com/mrhelloboy)

## 使用许可

[MIT © mrhelloboy.](./LICENSE)
