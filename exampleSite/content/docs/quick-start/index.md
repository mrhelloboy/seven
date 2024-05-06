---
title: "快速体验主题"
date: 2024-04-25
draft: false
weight: 1
categories: ["文档"]
tags: ["seven", "体验", "github"]
layout: "docs"
emoji: 🐳
url: "docs/quick-start"
image: "/images/docs/quick-start.webp"
description: "介绍了快速体验 seven 主题的步骤。"
---

这篇文章介绍如何快速体验 seven 主题。

## 前提条件

- 下载 [Hugo](https://gohugo.io/installation/), 版本要求 >= 0.124.0
- 下载 [Go](https://go.dev/dl/)
- 下载 [Node.js](https://nodejs.org/en)

## 克隆主题仓库

```bash
git clone https://github.com/mrhelloboy/seven.git
```

## 下载依赖及初始化

```bash
cd seven/exampleSite

hugo mod npm pack

npm install
```

## 启动服务

```bash
hugo server
```

## 开始访问之旅

在浏览器中访问地址：

```bash
http://localhost:1313/
```
