---
title: "添加额外的社交链接"
date: 2024-04-25
draft: false
weight: 5
categories: ["文档"]
tags: ["社交链接", "二维码"]
layout: "docs"
url: "docs/add-social-links"
image: "/images/docs/social-links.webp"
description: "如何配置普通链接和二维码弹窗方式的社交链接的教程"
---

主题默认提供了邮件、Github、X 和微信四种社交链接，但这是远远不够的，不过可以通过重写 `hook_social_links.html` 来添加其他的社交链接。

`hook_social_links.html` 是一个钩子，你可以在站点的 `partials/index` 目录下创建一个同名文件来覆盖默认的实现。

```bash
YourSite/layouts/partials/index/hook_social_links.html
```

## 普通链接

普通链接方式，即点击图标后直接跳转到链接地址。

比如，我需要添加 `Dribbble` 的社交链接，那么在 `hook_social_links.html` 中添加如下代码

```html
<a
  href="#"
  class="text-gray-900 hover:text-blue-700 dark:text-gray-400 dark:hover:text-white"
>
  <svg
    class="size-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fill-rule="evenodd"
      d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z"
      clip-rule="evenodd"
    />
  </svg>
  <span class="sr-only">Dribbble account</span>
</a>
```

需要对一些元素属性说明：

1. `<a>` 标签的 `href` 属性设置为 `#`，需要替换成自己的链接。
2. `<a>` 标签的 `class` 属性设置的值是 Tailwind CSS 的类名，默认可以不用修改。
3. `<svg>` 标签的 `class` 属性设置的值也是 Tailwind CSS 的类名，其中 `size-5` 是图标的大小，默认可以不用修改。

当添加新的 svg 时，需要对里面的一些属性已经移除及添加：

1. 添加 `class="size-5"`
2. 添加 `fill="currentColor"`
3. 移除里面的 `fill="xxxx"`, 因为会根据 `fill="currentColor"` 来设置颜色。
4. 移除里面的 `height` 和 `width` 属性，因为 svg 会根据 class 中的 `size-*` 来设置大小。所以

## 二维码弹窗

二维码弹窗方式，即点击图标后弹出一个弹窗，里面包含二维码。

```html
<div x-data="{ openQC: false }">
  <button
    @click="openQC = !openQC; scrollY = window.scrollY; document.body.style.overflow = 'hidden';"
    class="group relative block text-gray-900 hover:text-blue-700 dark:text-gray-400 dark:hover:text-white"
  >
    <div class="items-endtransition-transform relative flex h-full transform">
      <div
        class="transition-opacity group-hover:absolute group-hover:opacity-0"
      >
        <svg
          class="size-5"
          viewBox="0 0 1184 1024"
          fill="currentColor"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1495"
        >
          <path
            d="M331.424 263.424q0-23.424-14.272-37.728t-37.728-14.272q-24.576 0-43.424 14.56t-18.848 37.44q0 22.272 18.848 36.864t43.424 14.56q23.424 0 37.728-14.016t14.272-37.44zM756 553.152q0-16-14.56-28.576t-37.44-12.576q-15.424 0-28.288 12.864t-12.864 28.288q0 16 12.864 28.864t28.288 12.864q22.848 0 37.44-12.576t14.56-29.152zM621.152 263.424q0-23.424-14.016-37.728t-37.44-14.272q-24.576 0-43.424 14.56t-18.848 37.44q0 22.272 18.848 36.864t43.424 14.56q23.424 0 37.44-14.016t14.016-37.44zM984 553.152q0-16-14.848-28.576t-37.152-12.576q-15.424 0-28.288 12.864t-12.864 28.288q0 16 12.864 28.864t28.288 12.864q22.272 0 37.152-12.576t14.848-29.152zM832 326.272q-17.728-2.272-40-2.272-96.576 0-177.728 44t-127.712 119.136-46.56 164.288q0 44.576 13.152 86.848-20 1.728-38.848 1.728-14.848 0-28.576-0.864t-31.424-3.712-25.44-4-31.136-6.016-28.576-6.016l-144.576 72.576 41.152-124.576q-165.728-116-165.728-280 0-96.576 55.712-177.728t150.848-127.712 207.712-46.56q100.576 0 190.016 37.728t149.728 104.288 78.016 148.864zM1170.272 646.848q0 66.848-39.136 127.712t-106.016 110.56l31.424 103.424-113.728-62.272q-85.728 21.152-124.576 21.152-96.576 0-177.728-40.288t-127.712-109.44-46.56-150.848 46.56-150.848 127.712-109.44 177.728-40.288q92 0 173.152 40.288t130.016 109.728 48.864 150.56z"
            p-id="1496"
          ></path>
        </svg>
      </div>

      <div
        class="absolute opacity-0 transition-opacity group-hover:relative group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-5"
          fill="currentColor"
          viewBox="0 -960 960 960"
        >
          <path
            d="M520-120v-80h80v80h-80Zm-80-80v-200h80v200h-80Zm320-120v-160h80v160h-80Zm-80-160v-80h80v80h-80Zm-480 80v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm360-280v-80h80v80h-80ZM180-660h120v-120H180v120Zm-60 60v-240h240v240H120Zm60 420h120v-120H180v120Zm-60 60v-240h240v240H120Zm540-540h120v-120H660v120Zm-60 60v-240h240v240H600Zm80 480v-120h-80v-80h160v120h80v80H680ZM520-400v-80h160v80H520Zm-160 0v-80h-80v-80h240v80h-80v80h-80Zm40-200v-160h80v80h80v80H400Zm-190-90v-60h60v60h-60Zm0 480v-60h60v60h-60Zm480-480v-60h60v60h-60Z"
          />
        </svg>
      </div>
    </div>
  </button>
  <div
    x-show="openQC"
    @keydown.window.escape="openQC = false; document.body.style.overflow = ''; window.scrollTo(0, scrollY);"
    x-cloak
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 z-50"></div>
    <div class="fixed inset-0 z-50 w-full bg-gray-900/85 backdrop-blur-md">
      <div class="mx-auto flex h-full w-full items-center justify-center">
        <img
          @click.away="openQC = false; document.body.style.overflow = ''; window.scrollTo(0, scrollY);"
          class="object-cover"
          src="#"
          alt=""
        />
      </div>
    </div>
  </div>
</div>
```

二维码的方式相对比较复杂，其中 `<button>` 中有两个 svg 图标，第一个是社交账号图标，第二个是二维码图标。第二个二维码图片建议不用修改。与 `<button>` 用级别的 `<div>` 元素是用来处理二维码弹窗的。

同时，你也可能注意到了里面用到的 Tailwind CSS 的类名外，还有一些 `x-data`、`@click`、`x-show` 和 `x-cloak` 之类的，这些是 `Alpine.js` 的语法，可以参考 [Alpine.js 文档](https://alpinejs.dev/start-here) 来进一步了解，不过不了解也没关系。
