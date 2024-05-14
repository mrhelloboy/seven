---
title: "上传数据到 Algolia"
date: 2024-04-25
draft: false
weight: 4
categories: ["文档"]
tags: ["搜索", "algolia", "ndjson"]
layout: "docs"
url: "docs/upload-data-to-algolia"
image: "/images/docs/search.webp"
description: "如何生成 ndjson 格式数据文件并上传到 Algolia"
---

主题推荐使用 Algolia CLI 方式将数据上传到 Algolia。

上传数据需要用到 `algolia objects` 命令，而该命令要求上传的文件是 `ndjson` 格式，但默认情况下，Hugo 不会生成 `ndjson` 格式的数据文件, 而本主题默认支持生成 `ndjson` 格式的数据文件，以方便使用 `algolia objects` 命令上传数据到 Algolia。

首先，确保你已经安装了 Algolia CLI。

## 步骤

1. 在站点根目录下执行以下命令：

```bash
hugo
```

2. 然后在`public`目录下找到`algolia.ndjson`文件，将其上传到 Algolia。

```bash
algolia objects import 'your_index_name' -F ./public/algolia.ndjson -p 'your_prifile_name'
```

## 扩展阅读

1. [Algolia CLI 官方文档](https://www.algolia.com/doc/tools/cli/get-started/overview/)。

2. Hugo 生成 `ndjson` 文件细节，可以参考文章[在Hugo中如何直接输出ndjson格式文件并上传到Algolia](https://supcat.cn/posts/2023/12/24/output-ndjson-file-in-hugo-and-upload-to-algolia/)。
