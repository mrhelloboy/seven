---
title: "重要配置说明"
date: 2024-04-25
draft: false
weight: 3
categories: ["文档"]
tags:
  [
    "参数",
    "logo",
    "favicon",
    "评论",
    "搜索",
    "背景",
    "社交链接",
    "分析",
    "阅读量",
    "Waline",
    "Twikoo",
    "Algolia",
    "goatcounter",
  ]
layout: "docs"
emoji: ":star_struck:"
url: "docs/configuation"
image: "/images/docs/configuation.webp"
description: "对配置主题的一些重要配置参数进行说明"
---

下面列出了在配置主题过程中需要配置的重要参数。

如果在使用过程中，发现了一些问题，欢迎在 [Github](https://github.com/hugo-sid/hugo-theme-dream) 上提 issue，或者跟我进一步交流。

## 网站图标 Favicon

主题是建议使用 **svg** 作为 favicon 的，当然也支持传统的格式。

参数如下：

```toml
[app]
  noFavicon = false  # 是否禁用 favicon
  svgFavicon = "/favicon.svg"  # 配置 svg favicon 路径
  iconColor = "#ffffff"  # 配置 Safari mask icon 的颜色
  themeColor = "#ffffff"  # 配置 Android browser theme 颜色
```

存放 favicon 相关资源时，要求在 `static` 目录下：

```bash
.
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── apple-touch-icon.png
├── browserconfig.xml
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
├── favicon.svg
├── safari-pinned-tab.svg
└── site.webmanifest
```

可以使用 Favicon 生成器生成相关的 favicon 图标。 推荐使用 [RealFaviconGenerator](https://realfavicongenerator.net/)

## 网站 Logo

主题是支持使用图片或者文字作为 Logo，但更加推荐使用图片。
在配置图片 Logo时，支持图片的宽高调整，但高度有限制要求：

> 高度不能大于 56px，一旦大于 56px，会自动调整成 56px

主题支持夜间模式，所以配置图片 Logo时，需要同时配置夜间模式下的 Logo：

示例如下：

```toml
[logo]
  img = "/images/logo.svg"
  img_dark = "/images/logo-footer.svg"
  customLogoHeight = "56"  # 自定义 Logo 的高度
  customLogoWidth = "120"  # 自定义 Logo 的宽度
```

需要存放Logo图片在 `static` 目录

## 网站背景

主题支持背景图片，并且默认开启及提供了默认的背景图片。

如果需要自定义背景图片，可以配置如下参数：

```toml
[backgroundImage]
   enable = true
   light = ""
   dark = ""
```

需要存放背景图片在 `static` 目录。

如果不想使用背景图片，可以配置为 `enable = false`。关闭背景图片后，背景色默认为白色、夜间模式下是深灰色。

## 关注链接

主题默认只支持邮箱、Github、微信 和 X（原 twitter）。并且主题支持弹出二维码方式，只需要在配置中配置 `QRCodeUrl` 参数。

```toml {hl_lines=["11-13"],linenostart=1}
[follow]
  [follow.email]
    enable = false
    url = ""
  [follow.github]
    enable = true
    url = "Your github link"
  [follow.x]
    enable = true
    url = "Your x link"
  [follow.wechat]
    enable = true
    QRCodeUrl = "Your img of wechat qrcode"
```

如果想添加其他链接，可以通过重写 `hook_follow_me.html` 模板来实现。详细请阅读[自定义社交链接](docs/social-links)。

## 评论

目前主题支持只支持三种评论系统：[Waline](https://waline.js.org/)、[Twikoo](https://twikoo.js.org/)、[Disqus](https://disqus.com/)。

本主题默认使用 Waline 作为评论系统，也推荐使用 Waline。其功能强大，而且根据主题设计风格进行了定制，更加地美观。

Waline 或者 Kwikoo 的配置如下：

```toml
[comment]
  enable = false
  enableCounts = false  # Note: only works if waline or twikoo is enabled.
  [comment.waline]
    enable = false
    serverURL = ""
    lang = "en"
    reaction = true
    search = true
  [comment.twikoo]
    enable = false
    envID = ""
    path = ""
    lang = "en"
    region = ""
```

启用 Waline 或者 Twikoo 评论系统时，需要将 `comment.enable` 设置为 `true`。

当 Waline 启用时，参数 `serverURL` 是必填的，其他参数可选。当 Twikoo 启用时，参数 `envID` 是必填的，其他参数可选，具体如何配置，请参考官方文档。

**注意：Waline 本身允许匿名评论，但主题已经禁止掉，要求登录才可以评论。**

其中 `comment.enableCounts` 参数用于在文章中显示评论数量。

配置 Disqus 评论系统时，仅需要配置 `shortname` 参数，具体如何配置，请参考官网文档。

```toml
[services]
  [services.disqus]
    shortname = ""
```

当启用 Disqus 评论系统时，需要将 `comment.enable` 设置为 `false`。

## 搜索

本主题仅支持使用 [Algolia](https://www.algolia.com/) 作为搜索系统。如果需要启用搜索功能，需要将 `search.enable` 设置为 `true`。

配置 Alogolia 时，需要用到的参数。

```toml
type = []
vars = []
params = []
app_id = ""
api_key = ""
index = ""
snippet_attr = ""
highlight_attr = ""
```

只有配置了 `app_id`、`api_key`、`index` 参数才能正常使用 Algolia 搜索，需要到官网上进行申请注册。

而 `snippet_attr` 和 `highlight_attr` 参数用于配置搜索结果中显示的属性。

比如示例中，`snippet_attr` 配置为 `description`，表示在搜索结果中显示文章的描述，`highlight_attr` 配置为 `title`，表示在搜索结果中同时显示文章的标题。

![snippet attr and highlight attr](result-snippet-highlight.png "图1: snippet attr and highlight attr")

搜索结果中，`snippet_attr` 和 `highlight_attr` 配置的属性，必须与 `vars` 参数配置的属性一致。

而 `vars` 和 `params` 参数配置的值表示文章中哪些数据上传到 Algolia 搜索系统上。

而 `type` 参数表示上传到 Algolia 搜索系统的内容类型，比如你在 `content` 目录下创建了 `posts` 目录，那么 `type` 参数配置的值就是 `posts`。

而如何将文章上传到 Algolia 搜索系统上，请参考 [上传数据到 Algolia](docs/search) 文章。

## 网站统计

主题使用了 `goatcounter` 作为站点的统计系统。需要用到的配置参数如下：

```toml
[analytics]
  [analytics.goatcounter]
    enable = false
    code = ""
```

仅需要将 `enable` 设置为 `true`，并配置 `code` 参数，就可以启用 goatcounter 统计。code 参数的值是如何配置请参考 [goatcounter](https://www.goatcounter.com/)。

## 文章阅读统计

如果需要启用文章阅读统计功能，需要将 `enablePageView` 设置为 `true`, 并且启用 `Waline` 或者 `Twikoo` 评论系统。因为是通过 `Waline` 或者 `Twikoo` 相关接口来记录文章阅读次数的。

```toml
[articleMeta]
  enablePageView = true
```

## 文章代码块高亮

Hugo提供的代码块高亮功能，无法满足在夜间模式下，代码块高亮显示的问题。所以本主题提供了自己一套代码块高亮功能。默认是开启的，如果需要关闭，可以将 `enableHighlight` 设置为 `false`。

## 关闭某文章的评论

如果需要关闭某篇文章的评论，需要在该文章的 Front Matter 中配置 `disableComment` 参数，设置为 `true` 即可。

```yaml
---
title: "快速体验 Seven 主题"
date: 2024-04-25
params:
  disableComment: true
url: "docs/quick-start"
---
```

## 关闭文章目录

如果需要禁用某篇文章的目录，需要在该文章的 Front Matter 中配置 `disableToc` 参数，并设置为 `true`。

默认情况下，如果文章字数不超过300字，则不显示目录。
