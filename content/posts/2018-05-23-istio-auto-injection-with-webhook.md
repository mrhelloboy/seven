---
layout: post

title: "Istio Sidecar自动注入原理"
subtitle: "Kubernetes webhook扩展机制解析"
description: "Kubernets 1.9版本引入了Admission Webhook(web 回调)扩展机制，通过Webhook,开发者可以非常灵活地对Kubernets API Server的功能进行扩展，在API Server创建资源时对资源进行验证或者修改。 Istio 0.7版本就利用了Kubernets webhook实现了sidecar的自动注入。"
excerpt: "Kubernets 1.9版本引入了Admission Webhook(web 回调)扩展机制，通过Webhook,开发者可以非常灵活地对Kubernets API Server的功能进行扩展，在API Server创建资源时对资源进行验证或者修改。 Istio 0.7版本就利用了Kubernets webhook实现了sidecar的自动注入。"
date: 2018-05-23
author:     "赵化冰"
image: "/images/1-1.jpg"
published: true
tags:
  - Kubernetes
  - Istio
  - service Mesh
URL: "/2018/05/23/istio-auto-injection-with-webhook/"
categories: [Tech]
---

## 前言

---

Kubernets 1.9 版本引入了 Admission Webhook(web 回调)扩展机制，通过 Webhook,开发者可以非常灵活地对 Kubernets API Server 的功能进行扩展，在 API Server 创建资源时对资源进行验证或者修改。

使用 webhook 的优势是不需要对 API Server 的源码进行修改和重新编译就可以扩展其功能。插入的逻辑实现为一个独立的 web 进程，通过参数方式传入到 kubernets 中，由 kubernets 在进行自身逻辑处理时对扩展逻辑进行回调。

Istio 0.7 版本就利用了 Kubernets webhook 实现了 sidecar 的自动注入。

<!--more-->

## 什么是 Admission

---

Admission 是 Kubernets 中的一个术语，指的是 Kubernets API Server 资源请求过程中的一个阶段。如下图所示，在 API Server 接收到资源创建请求时，首先会对请求进行认证和鉴权，然后经过 Admission 处理，最后再保存到 etcd。
![](/img/2018-4-25-istio-auto-injection-with-webhook/admission-phase.png)
从图中看到，Admission 中有两个重要的阶段，Mutation 和 Validation，这两个阶段中执行的逻辑如下：

- Mutation

  Mutation 是英文“突变”的意思,从字面上可以知道在 Mutation 阶段可以对请求内容进行修改。

- Validation

  在 Validation 阶段不允许修改请求内容，但可以根据请求的内容判断是继续执行该请求还是拒绝该请求。

## Admission webhook

---

通过 Admission webhook,可以加入 Mutation 和 Validation 两种类型的 webhook 插件，这些插件和 Kubernets 提供的预编译的 Admission 插件具有相同的能力。可以想到的用途包括：

- 修改资源。例如 Istio 就通过 Admin Webhook 在 Pod 资源中增加了 Envoy sidecar 容器。
- 自定义校验逻辑，例如对资源名称有一些特殊要求。或者对自定义资源的合法性进行校验。

## 采用 Webhook 自动注入 Istio Sidecar

---

### Kubernets 版本要求

webhook 支持需要 Kubernets1.9 或者更高的版本,使用下面的命令确认 kube-apiserver 的 Admin webhook 功能已启用。

```
kubectl api-versions | grep admissionregistration

admissionregistration.k8s.io/v1beta1
```

### 生成 sidecar injection webhook 的密钥和证书

Webhook 使用数字证书向 kube-apiserver 进行身份认证，因此需要先使用工具生成密钥对，并向 Istio CA 申请数字证书。

```
./install/kubernetes/webhook-create-signed-cert.sh /
    --service istio-sidecar-injector /
    --namespace istio-system /
    --secret sidecar-injector-certs
```

### 将生成的数字证书配置到 webhook 中

```
cat install/kubernetes/istio-sidecar-injector.yaml | /
     ./install/kubernetes/webhook-patch-ca-bundle.sh > /
     install/kubernetes/istio-sidecar-injector-with-ca-bundle.yaml
```

### 创建 sidecar injection configmap

```
kubectl apply -f install/kubernetes/istio-sidecar-injector-configmap-release.yaml
```

### 部署 sidecar injection webhook

```
kubectl apply -f install/kubernetes/istio-sidecar-injector-with-ca-bundle.yaml
```

通过命令查看部署好的 webhook injector

````
kubectl -n istio-system get deployment -listio=sidecar-injector
Copy
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
istio-sidecar-injector   1         1         1            1           1d
```

### 开启需要自动注入sidecar的namespace

```
kubectl label namespace default istio-injection=enabled

kubectl get namespace -L istio-injection

NAME           STATUS    AGE       ISTIO-INJECTION
default        Active    1h        enabled
istio-system   Active    1h
kube-public    Active    1h
kube-system    Active    1h
```

## 参考

* [Extensible Admission is Beta](https://kubernetes.io/blog/2018/01/extensible-admission-is-beta)
* [Installing the Istio Sidecar](https://istio.io/docs/setup/kubernetes/sidecar-injection.html)
````
