---
title: "Uploading Data to Algolia Search"
date: 2024-04-25
draft: false
weight: 4
categories: ["Documents"]
tags: ["search", "algolia", "ndjson"]
layout: "docs"
url: "docs/upload-data-to-algolia"
image: "/images/docs/search.webp"
description: "How to generate an ndjson format data file and upload it to Algolia"
---

The theme recommends using the Algolia CLI to upload data to Algolia.

The data upload requires using the `algolia objects` command, which expects the uploaded file to be in ndjson format. By default, Hugo doesn't generate ndjson format data files. However, this theme supports generating ndjson format data files by default, making it convenient to use the `algolia objects` command to upload data to Algolia.

First, make sure you have installed the Algolia CLI.

## Steps

1. Execute the following command in the root directory of your site:

```bash
hugo
```

2. Then, locate the `algolia.ndjson` file in the `public` directory and upload it to Algolia.

```bash
algolia objects import 'your_index_name' -F ./public/algolia.ndjson -p 'your_prifile_name'
```

## Further Reading

1. [Algolia CLI Official Documentation](https://www.algolia.com/doc/tools/cli/get-started/overview/).

2. For details on generating ndjson files in Hugo, you can refer to the article [How to output ndjson format files directly in Hugo and upload to Algolia](https://supcat.cn/posts/2023/12/24/output-ndjson-file-in-hugo-and-upload-to-algolia/).
