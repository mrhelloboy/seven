<p align="center">
  <a href="https://seven-demo.supcat.cn/" target="_blank">
    <img alt="Seven Logo" src="https://seven-demo.supcat.cn/images/logo-footer.svg" width="350" height="70" style="max-width: 100%;">
  </a>
</p>

<p align="center">
  A clean and beautiful Hugo theme, which built using Tailwind CSS.
</p>

---

English | [中文](./README_zh-CN.md)

## Example

Link: [Demo](https://snazzy-jelly-839142.netlify.app/)

The Demo code is in another GitHub repository: [hugo-theme-seven-demo](https://github.com/mrhelloboy/hugo-theme-seven-demo)

## Prerequisites

1. The Hugo Modules feature is required. So you need to download Go locally. Please refer to the document [Hugo Modules Prerequisite](https://gohugo.io/hugo-modules/use-modules/#prerequisite) for details.
2. Hugo version should be at least `v0.112.0`. **It is recommended to use the latest version of Go and Hugo**. Reference documentation [configure-cache-busters](https://gohugo.io/getting-started/configuration/#configure-cache-busters)

## Usage

1. There are already Hugo sites using this theme, you need to delete the themes directory and related files (if any)

2. Initialize the site to module and execute the command in the root directory of your site:

   ```bash
   hugo mod init github/[username]/[sitename]
   ```

   Replace `username` and `sitename` above with your own

3. It is recommended to copy the `hugo.toml` file from the [hugo-theme-seven-demo repository](https://github.com/mrhelloboy/hugo-theme-seven-demo) to the root of your site.

   If you are not using Demo's `hugo.toml` file, please copy the following configuration to your own `hugo.toml` file:

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

   Please refer to `hugo.toml` in the Demo for other configuration parameters required by the theme

4. Execute the command

   ```bash
   hugo mod npm pack
   ```

   will generate the files `package.json` and `package.hugo.json` and import the module and update the `go.mod` and `go.sum` files, etc.

5. Execute the command to download the required dependencies

   ```bash
   npm install
   ```

6. Start local services

   ```bash
   hugo server
   ```

   Or:

   ```bash
   hugo server --disableLiveReload --minify --gc -D
   ```

## Deployment

Please refer to [Hugo Deployment Documentation](https://gohugo.io/hosting-and-deployment/)

### Deploy to `Netlify` as an example:

1. Copy `netlify.toml` from the Demo repository to your own site and push it to Github

2. Register and login to Netlify

3. Import the GitHub project, Netlify will read the `netlify.toml` file and build it automatically

## Maintainers

[@mrhelloboy](https://github.com/mrhelloboy)

## License

[MIT © mrhelloboy.](./LICENSE)
