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
  A clean and beautiful Hugo theme, which built using Tailwind CSS.
</p>

---

English | [中文](./README_zh-CN.md)

<img alt="Hugo theme Seven" src="https://hugoseven.netlify.app/images/screenshot.webp" width="600">

## Examples

→ [Example Website](https://hugoseven.netlify.app/en)

## Prerequisites

Before starting to use this Hugo theme, please ensure the following requirements are met:

1. [Go](https://go.dev/dl/) is installed
2. Ensure `Hugo >= v0.128.0`

## Quick Start

### 1. Clone this repository

```sh
git clone https://github.com/mrhelloboy/seven.git
```

### 2. Navigate to the exampleSite directory

```sh
cd exampleSite
```

### 3. Run the following commands

```sh
cd hugo-theme-seven-demo

hugo mod npm pack

npm install

hugo server
```

## Starting from Scratch

### 1. Install Go and Hugo

### 2. Create a Site

```sh
hugo new site [sitename]

cd [sitename]

rm -rf themes
```

### 3. Initialize Hugo Modules

```sh
hugo mod init github.com/[username]/[sitename]
```

### 4. Import the Theme Module

Configure the theme in hugo.toml

```toml
[module]
[[module.imports]]
   path = 'github.com/mrhelloboy/seven'
```

> Because the theme requires additional configuration parameters, it's recommended to use the configuration file provided in exampleSite first, and then modify it as needed.
>
> For more information on Hugo Modules and their usage, please refer to [Hugo Modules](https://gohugo.io/hugo-modules/)

### 5. Install Dependencies and Start

```sh
hugo mod npm pack

npm install

hugo server
```

## Updating Theme Module

```bash
hugo mod clean

hugo mod get

hugo mod tidy
```

## Updating package.json

> First delete `package-lock.json` and `package.json`.

```bash
hugo mod npm pack

npm install
```

## Deployment

Please refer to the [Hugo Deployment Documentation](https://gohugo.io/hosting-and-deployment/)

### Example of deploying to `Netlify`:

1. Create a `netlify.toml` file in your site with the following content:

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

2. Register and log in to Netlify

3. Import your GitHub project, and Netlify will automatically build it based on the `netlify.toml` file.

## Maintainers

[@mrhelloboy](https://github.com/mrhelloboy)

## License

[MIT © mrhelloboy.](./LICENSE)
