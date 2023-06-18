---
layout: post
title: "如何配置docker使用HTTP代理"
subtitle: ""
description: "如何配置docker使用HTTP代理"
date: 2018-03-13 18:00:00
author: "赵化冰"
image: ""
published: true
tags:
  - Tips
  - Docker
  - service Mesh
URL: "/2018/03/13/use-docker-behind-http-proxy/"
categories: [Tips]
---

## Ubuntu

### 设置 docker 使用 http proxy

```
sudo /etc/default/docker

export http_proxy="http://127.0.0.1:3128/"
export https_proxy="http://127.0.0.1:3128/"
export HTTP_PROXY="http://127.0.0.1:3128/"
export HTTPS_PROXY="http://127.0.0.1:3128/"
```

<!--more-->

### 加载配置并重启 docker

```
sudo service docker restart
```

## CentOS

### 设置 docker 使用 http proxy

```
sudo mkdir -p /etc/systemd/system/docker.service.d

echo '
[Service]
Environment="HTTP_PROXY=http://proxy.foo.bar.com:80/"
' | sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf
```

### 加载配置并重启 docker

```
sudo systemctl daemon-reload
sudo systemctl restart docker
```
