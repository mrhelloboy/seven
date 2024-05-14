---
title: "Quickly Experience the Theme"
date: 2024-04-25
draft: false
weight: 2
categories: ["Documents"]
tags: ["seven", "demo", "github"]
layout: "docs"
url: "docs/quick-start"
image: "/images/docs/quick-start.webp"
description: "Introduces the steps to quickly experience the seven theme."
---

This article describes how to quickly experience the seven theme.

## Prerequisites

- Install [Hugo](https://gohugo.io/installation/), with a version requirement of >= 0.124.0.
- Install [Go](https://go.dev/dl/).
- Install [Node.js](https://nodejs.org/en).

## Clone Repository

```bash
git clone https://github.com/mrhelloboy/seven.git
```

## Install Dependencies

```bash
cd seven/exampleSite

hugo mod npm pack

npm install
```

## Run Hugo Server

```
hugo server
```

## Open Browser

Access [http://localhost:1313](http://localhost:1313) in your browser.
