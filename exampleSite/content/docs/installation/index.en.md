---
title: "Install the Theme"
date: 2024-04-25
draft: false
weight: 6
categories: ["Docments"]
tags: ["installation"]
layout: "docs"
url: "docs/installation"
image: "/images/docs/installation.webp"
description: "Installing the Theme from Scratch"
---

Installing the theme from scratch.

## Prerequisites

- Download [Hugo](https://gohugo.io/installation/), version required >= 0.124.0
- Download [Go](https://go.dev/dl/)
- Download [Node.js](https://nodejs.org/en)

## Creating a Site

```sh
hugo new site [sitename]

cd [sitename]

# Deleting the Themes Directory from the Site
rm -rf themes
```

## Initializing Hugo Modules

```sh
hugo mod init github.com/[username]/[sitename]
```

## Importing the Theme Module

Configure the theme in hugo.toml

```toml
[module]
[[module.imports]]
  path = 'github.com/mrhelloboy/seven'
```

> Because the theme requires additional configuration parameters, it's recommended to use the configuration file provided in this example to avoid errors, and then modify it as needed.

For more information on Hugo Modules and their usage, please refer to [Hugo Modules](https://gohugo.io/hugo-modules/)

## Installing Dependencies and Starting

```sh
hugo mod npm pack

npm install

hugo server
```
