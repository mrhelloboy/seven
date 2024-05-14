---
title: "安装主题"
date: 2024-04-25
draft: false
weight: 6
categories: ["文档"]
tags: ["安装"]
layout: "docs"
url: "docs/installation"
image: "/images/docs/installation.webp"
description: "从零开始安装主题"
---

从零开始安装主题。

## 前提条件

- 下载 [Hugo](https://gohugo.io/installation/), 版本要求 >= 0.124.0
- 下载 [Go](https://go.dev/dl/)
- 下载 [Node.js](https://nodejs.org/en)

## 创建站点

```sh
hugo new site [sitename]

cd [sitename]

# 删除站点的 themes 目录
rm -rf themes
```

## 初始化 Hugo 模块

```sh
hugo mod init github.com/[username]/[sitename]
```

## 导入主题模块

在 hugo.toml 中配置主题

```toml
[module]
[[module.imports]]
  path = 'github.com/mrhelloboy/seven'
```

> 因为主题需要额外的配置参数，为了避免出错，建议先使用本示例的配置文件，然后再按需修改。

更多 hugo 模块的说明及使用，请参考 [Hugo Modules](https://gohugo.io/hugo-modules/)

## 安装依赖及启动

```sh
hugo mod npm pack

npm install

hugo server
```
