---
title: "Important configuration instructions"
date: 2024-04-25
draft: false
weight: 3
categories: ["Documents"]
tags:
  [
    "parameter",
    "logo",
    "favicon",
    "comment",
    "search",
    "background",
    "society link",
    "analytics",
    "page view",
    "Waline",
    "Twikoo",
    "Algolia",
    "goatcounter",
  ]
layout: "docs"
emoji: ":star_struck:"
url: "docs/configuation"
image: "/images/docs/configuation.webp"
description: "Explain some important configuration parameters for configuring the theme."
---

Here is a list of important parameters that need to be configured during the process of configuring the theme.

If you find some problems during the process, please feel free to raise an issue on [Github](https://github.com/mrhelloboy/seven/issues) or communicate with me further.

## Website Icons Favicon

The theme recommends using **svg** as favicon, but of course traditional formats are also supported.

The configuration parameters are as follows:

```toml
[app]
  noFavicon = false  # Whether to disable the favicon
  svgFavicon = "/favicon.svg"  # Configure the path to the svg favicon
  iconColor = "#ffffff"  # Configure the color of the Safari mask icon
  themeColor = "#ffffff"  # Configure the Android browser theme color
```

When storing favicon related resources, it is required to be in the `static` directory:

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

The associated favicon icon can be generated using the Favicon generator. Recommended [RealFaviconGenerator](https://realfavicongenerator.net/)

## Website Logo

The theme supports using either images or text as a logo, but using an image is highly recommended.

When configuring an image logo, adjustments to the width and height of the image are supported, but there is a limitation on the height:

> The height cannot exceed 56px. If it's greater than 56px, it will automatically adjust to 56px.

Since the theme supports a dark mode, when configuring an image logo, you need to simultaneously configure a logo for dark mode.

Here's an example:

```toml
[logo]
  img = "/images/logo.svg"
  img_dark = "/images/logo-footer.svg"
  customLogoHeight = "56"
  customLogoWidth = "120"
```

You need to store the logo images in the `static` directory.

## Website Background

The theme supports background images, which are enabled by default, and provides a default background image.

To customize the background image, you can configure the following parameters:

```toml
[backgroundImage]
   enable = true
   light = ""
   dark = ""
```

You need to store the background image in the `static` directory.

If you don't want to use a background image, you can configure it as `enable = false`. After disabling the background image, the background color defaults to white in light mode and dark gray in dark mode.

## Follow Links

The theme defaultly supports email, Github, WeChat, and X (originally Twitter). Additionally, the theme supports a pop-up QR code feature, which only requires configuring the `QRCodeUrl` parameter in the settings.

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

If you wish to add other links, you can achieve this by overriding the `hook_follow_me.html` template. For detailed instructions, please refer to [Customizing Social Links](docs/social-links).

## Comments

Currently, the theme supports only three types of comment systems: [Waline](https://waline.js.org/), [Twikoo](https://twikoo.js.org/), and [Disqus](https://disqus.com/).

This theme defaults to using Waline as the comment system, and it's also recommended. It's powerful, and it's been customized to match the design style of the theme, making it more aesthetically pleasing.

Here's how to configure Waline or Twikoo:

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

When enabling the Waline or Twikoo comment systems, you need to set `comment.enable` to `true`.

When using Waline, the `serverURL` parameter is required, while other parameters are optional. When using Twikoo, the `envID` parameter is required, while others are optional. For specific configuration details, please refer to the official documentation.

**Note: Waline allows anonymous comments by default, but the theme has disabled this feature, requiring users to log in before commenting.**

The `comment.enableCounts` parameter is used to display the comment count in the article.

When configuring the Disqus comment system, you only need to set the `shortname` parameter. For detailed instructions, please refer to the official documentation.

```toml
[services]
  [services.disqus]
    shortname = ""
```

When enabling the Disqus comment system, you need to set `comment.enable` to `false`.

## Search

This theme only supports using [Algolia](https://www.algolia.com/) as the search system. If you want to enable the search functionality, you need to set `search.enable` to `true`.

Here are the parameters required for configuring Algolia.

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

To enable Algolia search functionality, you need to provide the `app_id`, `api_key`, and `index` parameters. These credentials can be obtained by registering and applying on the Algolia official website.

The `snippet_attr` and `highlight_attr` parameters are used to configure the attributes displayed in the search results.

For example, in the given sample, `snippet_attr` is configured as `description`, indicating that the article descriptions will be displayed in the search results, while `highlight_attr` is configured as `title`, indicating that the article titles will also be displayed in the search results.

![snippet attr and highlight attr](result-snippet-highlight.en.png "Figure 1: snippet attr and highlight attr")

In the search results, the attributes configured in `snippet_attr` and `highlight_attr` must match the attributes configured in the `vars` parameter.

The values configured in the `vars` and `params` parameters indicate which data from the articles is uploaded to the Algolia search system.

The `type` parameter indicates the content type uploaded to the Algolia search system. For example, if you create a `posts` directory under the `content` directory, the value configured for the `type` parameter would be `posts`.

For instructions on how to upload articles to the Algolia search system, please refer to the article [Uploading Data to Algolia](docs/search).

## Website Analytics

The theme utilizes `goatcounter` as the site's analytics system. Here are the configuration parameters required:

```toml
[analytics]
  [analytics.goatcounter]
    enable = false
    code = ""
```

To enable GoatCounter analytics, you only need to set `enable` to `true` and configure the `code` parameter. The value of the `code` parameter should be configured according to the instructions provided by [GoatCounter](https://www.goatcounter.com/).

## Article Read Count Statistics

If you want to enable the article read count statistics feature, you need to set `enablePageView` to `true` and also enable either the `Waline` or `Twikoo` comment system. This is because the article read count is recorded through the relevant interfaces of `Waline` or `Twikoo`.

```toml
[articleMeta]
  enablePageView = true
```

## Article Code Block Highlighting

The code block highlighting feature provided by Hugo does not adequately address the issue of code block highlighting in dark mode. Therefore, this theme provides its own code block highlighting functionality. It's enabled by default, but if you need to disable it, you can set `enableHighlight` to `false`.

## Disabling Comments for a Article

To disable comments for a specific article, you need to configure the `disableComment` parameter in the Front Matter of that article and set it to `true`.

```yaml
---
title: "Quick Start"
date: 2024-04-25
params:
  disableComment: true
url: "docs/quick-start"
---
```

## Disabling Article Table of Contents

To disable the table of contents for a specific article, you need to configure the `disableToc` parameter in the Front Matter of that article and set it to `true`.

By default, if the article word count is less than 300 words, the table of contents will not be displayed.
