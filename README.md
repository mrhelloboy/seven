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
  A clean and beautiful Hugo theme, which built using Tailwind CSS.
</p>

---

English | [中文](./README_zh-CN.md)

<img alt="Seven screenshot" src="https://seven-demo.supcat.cn/images/screenshot/xdr.webp" width="500">

## Examples

→ [Example Website](https://seven-demo.supcat.cn/)

→ [Example Code Repository](https://github.com/mrhelloboy/hugo-theme-seven-demo)

## Prerequisites

Before using this Hugo theme, ensure that you meet the following requirements:

1. Install [Go](https://go.dev/dl/). Refer to the documentation on [Hugo Modules Prerequisite](https://gohugo.io/hugo-modules/use-modules/#prerequisite).
2. Ensure that your Hugo version is **v0.112.0** or later. Refer to the documentation for [configure-cache-busters](https://gohugo.io/getting-started/configuration/#configure-cache-busters).

## Quick Start

1. Clone the [example code](https://github.com/mrhelloboy/hugo-theme-seven-demo).
   ```sh
   git clone https://github.com/mrhelloboy/hugo-theme-seven-demo.git
   ```
2. Execute the commands:

   ```sh
   cd hugo-theme-seven-demo

   hugo mod npm pack

   npm install

   hugo server
   ```

## Starting from Scratch

0. Install Go and Hugo.

1. Create a new site.

   ```sh
   hugo new site [sitename]
   cd [sitename]
   # Remove the themes directory in the site
   rm -rf themes
   ```

2. Initialize Hugo module.

   ```sh
   hugo mod init github.com/[username]/[sitename]
   ```

3. Import the theme module.

   In the `hugo.toml` file, configure the theme:

   ```toml
   [module]
   [[module.imports]]
     path = 'github.com/mrhelloboy/seven'
   ```

   > As the theme requires additional configuration parameters, to avoid errors, it's recommended to first use the example's [hugo.toml](https://github.com/mrhelloboy/hugo-theme-seven-demo/blob/main/hugo.toml) and then customize as needed.

   **Note:**
   If using the example `hugo.toml`, comment out `customSocial = "extra_social.html"` to prevent an error during startup.

   > For more information about Hugo modules and their usage, please refer to [Hugo Modules](https://gohugo.io/hugo-modules/).

4. Install dependencies and start the server.

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

Refer to the [Hugo Deployment Documentation](https://gohugo.io/hosting-and-deployment/) for details.

### Deploying to `Netlify` Example:

1. Copy the example's [`netlify.toml`](https://github.com/mrhelloboy/hugo-theme-seven-demo/blob/main/netlify.toml) to your own site and push the changes to GitHub.

2. Register and log in to Netlify.

3. Import your GitHub project; Netlify will automatically build based on the `netlify.toml` file.

## Maintainers

[@mrhelloboy](https://github.com/mrhelloboy)

## License

[MIT © mrhelloboy.](./LICENSE)
