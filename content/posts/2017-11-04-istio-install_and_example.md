---
layout: post
title: "Istio及Bookinfo示例程序安装试用笔记"
subtitle: "手把手教你从零搭建Istio及Bookinfo示例程序"
description: "Istio是来自Google，IBM和Lyft的一个Service Mesh（服务网格）开源项目，是Google继Kubernetes之后的又一大作,本文将演示如何从裸机开始从零搭建Istio及Bookinfo示例程序。"
excerpt: "Istio是来自Google，IBM和Lyft的一个Service Mesh（服务网格）开源项目，是Google继Kubernetes之后的又一大作,本文将演示如何从裸机开始从零搭建Istio及Bookinfo示例程序。"
date: 2017-11-04T12:00:00
author: "赵化冰"
image: "/images/1-1.jpg"
tags:
  - Istio
URL: "/2017/11/04/istio-install_and_example/"
categories: ["Tech", "test2"]
---

## 服务网格简介

**服务网格**（Service Mesh）是为解决微服务的通信和治理而出现的一种**架构模式**。

服务网格将服务间通讯以及与此相关的管理控制功能从业务程序中下移到一个基础设施层，从而彻底隔离了业务逻辑和服务通讯两个关注点。采用服务网格后，应用开发者只需要关注并实现应用业务逻辑。服务之间的通信，包括服务发现，通讯的可靠性，通讯的安全性，服务路由等由服务网格层进行处理，并对应用程序透明。

<!--more-->

让我们来回顾一下微服务架构的发展过程。在出现服务网格之前，我们在微服务应用程序进程内处理服务通讯逻辑，包括服务发现，熔断，重试，超时等逻辑，如下图所示：  
![](/img/istio-install_and_example/5-a.png)  
通过对这部分负责服务通讯的逻辑进行抽象和归纳，可以形成一个代码库供应用程序调用。但应用程序还是需要处理和各种语言代码库的调用细节，并且各种代码库互不兼容，导致对应用程序使用的语言和代码框架有较大限制。

如果我们更进一步，将这部分逻辑从应用程序进程中抽取出来，作为一个单独的进程进行部署，并将其作为服务间的通信代理，如下图所示：  
![](/img/istio-install_and_example/6-a.png)  
因为通讯代理进程和应用进程一起部署，因此形象地把这种部署方式称为“sidecar”（三轮摩托的挎斗）。
![](/img/istio-install_and_example/sidecar.jpg)
应用间的所有流量都需要经过代理，由于代理以 sidecar 方式和应用部署在同一台主机上，应用和代理之间的通讯被认为是可靠的。然后由代理来负责找到目的服务并负责通讯的可靠性和安全等问题。

当服务大量部署时，随着服务部署的 sidecar 代理之间的连接形成了一个如下图所示的网格，被称之为 Service Mesh（服务网格），从而得出如下的服务网格定义。

_服务网格是一个基础设施层，用于处理服务间通信。云原生应用有着复杂的服务拓扑，服务网格保证请求可以在这些拓扑中可靠地穿梭。在实际应用当中，服务网格通常是由一系列轻量级的网络代理组成的，它们与应用程序部署在一起，但应用程序不需要知道它们的存在。_

_William Morgan _[_WHAT’S A SERVICE MESH? AND WHY DO I NEED ONE?_](https://buoyant.io/2017/04/25/whats-a-service-mesh-and-why-do-i-need-one/)\_ \_

![](/img/istio-install_and_example/mesh1.png)

了解了服务网格的基本概念，下一步介绍一下[Istio](https://istio.io/)。Istio 是来自 Google，IBM 和 Lyft 的一个 Service Mesh（服务网格）开源项目，是 Google 继 Kubernetes 之后的又一大作，Istio 架构先进，设计合理，刚一宣布就获得了 Linkerd，nginmesh 等其他 Service Mesh 项目的合作以及 Red hat/Pivotal/Weaveworks/Tigera/Datawire 等的积极响应。  
![](/img/istio-install_and_example/Istio-Architecture.PNG)  
可以设想，在不久的将来，微服务的标准基础设施将是采用 kubernetes 进行服务部署和集群管理，采用 Istio 处理服务通讯和治理，两者相辅相成，缺一不可。

## 安装 Kubernetes

Istio 是微服务通讯和治理的基础设施层，本身并不负责服务的部署和集群管理，因此需要和 Kubernetes 等服务编排工具协同工作。

Istio 在架构设计上支持各种服务部署平台，包括 kubernetes，cloud foundry，Mesos 等，但 Istio 作为 Google 亲儿子，对自家兄弟 Kubernetes 的支持肯定是首先考虑的。目前版本的 0.2 版本的手册中也只有 Kubernetes 集成的安装说明，其它部署平台和 Istio 的集成将在后续版本中支持。

从 Istio 控制面 Pilot 的架构图可以看到各种部署平台可以通过插件方式集成到 Istio 中，为 Istio 提供服务注册和发现功能。

![](/img/istio-install_and_example/PilotAdapters.PNG)

kubernetes 集群的部署较为复杂，[Rancher](http://rancher.com)提供了 kubernetes 部署模板，通过一键式安装，可以大大简化 kubernetes 集群的安装部署过程。

本文的测试环境为两台虚机组成的集群，操作系统是 Ubuntu 16.04.3 LTS。两台虚机的地址分别为：  
Rancher Server: 10.12.25.60  
工作节点: 10.12.25.116

通过 Rancher 安装 Kubernetes 集群的简要步骤如下：

### 在 server 和工作节点上安装 docker

因为 k8s 并不支持最新版本的 docker，因此需根据该页面安装指定版本的 docker  
[http://rancher.com/docs/rancher/v1.6/en/hosts/](http://rancher.com/docs/rancher/v1.6/en/hosts/) ,目前是 1.12 版本。

```
curl https://releases.rancher.com/install-docker/1.12.sh | sh
```

如果需要以非 root 用户执行 docker 命令，参考[如何使用非 root 用户执行 docker 命令](http://zhaohuabing.com/2018/02/09/docker-without-sudo/)。

### 启动 Rancher server

```
sudo docker run -d --restart=always -p 8080:8080 rancher/server
```

### 登录 Rancher 管理界面，创建 k8s 集群

Rancher 管理界面的缺省端口为 8080，在浏览器中打开该界面，通过菜单 Default-&gt;Manage Environment-&gt;Add Environment 添加一个 kubernetes 集群。这里需要输入名称 kubernetes，描述，然后选择 kubernetes template，点击 create，创建 Kubernetes 环境。![](/img/istio-install_and_example/Rancher.PNG)

点击菜单切换到 kubernetes Environment，然后点击右上方的 Add a host，添加一台 host 到 kubernetes 集群中。注意添加到集群中的 host 上必须先安装好符合要求的 docker 版本。

然后根据 Rancher 页面上的提示在 host 上执行脚本启动 Rancher agent，以将 host 加入 ranch cluster。注意脚本中包含了 rancher server 的地址，在 host 上必须可以 ping 通该地址。![](/img/istio-install_and_example/Rancher-add-host.PNG)

host 加入 cluster 后 Rancher 会在 host 上 pull kubernetes 的 images 并启动 kubernetes 相关服务，根据安装环境所在网络情况不同需要等待几分钟到几十分钟不等。

### 安装并配置 kubectl

待 Rancher 界面提示 kubernetes 创建成功后，安装 kubernetes 命令行工具 kubectl

```
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.7.4/bin/linux/amd64/kubectl

chmod +x ./kubectl

sudo mv ./kubectl /usr/local/bin/kubectl
```

登录 Rancher 管理界面, 将 All Environments-&gt;kubernetes-&gt;KUBERNETES-&gt;CLI create config 的内容拷贝到~/.kube/config 中，以配置 Kubectl 和 kubernetes server 的连接信息。![](/img/istio-install_and_example/Rancher-kubectl.PNG)

## 安装 Istio

Istio 提供了安装脚本，该脚本会根据操作系统下载相应的 Istio 安装包并解压到当前目录。

```
 curl -L https://git.io/getLatestIstio | sh -
```

根据脚本的提示将 Istio 命令行所在路径加入到系统 PATH 环境变量中

```
export PATH="$PATH:/home/ubuntu/istio-0.2.10/bin"
```

在 kubernetes 集群中部署 Istio 控制面服务

```
kubectl apply -f istio-0.2.10/install/kubernetes/istio.yaml
```

确认 Istio 控制面服务已成功部署。Kubernetes 会创建一个 istio-system namespace，将 Istio 相关服务部署在该 namespace 中。

确认 Istio 相关 Service 的部署状态

```
kubectl get svc -n istio-system
```

```
NAME            CLUSTER-IP      EXTERNAL-IP        PORT(S)                                                  AGE
istio-egress    10.43.192.74    <none>             80/TCP                                                   25s
istio-ingress   10.43.16.24     10.12.25.116,...   80:30984/TCP,443:30254/TCP                               25s
istio-mixer     10.43.215.250   <none>             9091/TCP,9093/TCP,9094/TCP,9102/TCP,9125/UDP,42422/TCP   26s
istio-pilot     10.43.211.140   <none>             8080/TCP,443/TCP                                         25s
```

确认 Istio 相关 Pod 的部署状态

```
kubectl get pods -n istio-system
```

```
NAME                             READY     STATUS    RESTARTS   AGE
istio-ca-367485603-qvbfl         1/1       Running   0          2m
istio-egress-3571786535-gwbgk    1/1       Running   0          2m
istio-ingress-2270755287-phwvq   1/1       Running   0          2m
istio-mixer-1505455116-9hmcw     2/2       Running   0          2m
istio-pilot-2278433625-68l34     1/1       Running   0          2m
```

从上面的输出可以看到，这里部署的主要是 Istio 控制面的服务，而数据面的网络代理要如何部署呢？  
根据前面服务网格的架构介绍可以得知，网络代理是随着应用程序以 sidecar 的方式部署的，在下面部署 Bookinfo 示例程序时会演示如何部署网络代理。

## 部署 Bookinfo 示例程序

在下载的 Istio 安装包的 samples 目录中包含了示例应用程序。

通过下面的命令部署 Bookinfo 应用

```
kubectl apply -f <(istioctl kube-inject -f istio-0.2.10/samples/bookinfo/kube/bookinfo.yaml)
```

确认 Bookinfo 服务已经启动

```
kubectl get services
```

```
NAME          CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
details       10.43.175.204   <none>        9080/TCP   6m
kubernetes    10.43.0.1       <none>        443/TCP    5d
productpage   10.43.19.154    <none>        9080/TCP   6m
ratings       10.43.50.160    <none>        9080/TCP   6m
reviews       10.43.219.248   <none>        9080/TCP   6m
```

在浏览器中打开应用程序页面，地址为 istio-ingress 的 External IP

`http://10.12.25.116/productpage`  
![](/img/istio-install_and_example/Bookinfo.PNG)

## 理解 Istio Proxy 实现原理

服务网格相对于 sprint cloud 等微服务代码库的一大优势是其对应用程序无侵入，在不修改应用程序代码的前提下对应用服务之间的通信进行接管，Istio 是如何做到这点的呢？下面通过示例程序的部署剖析其中的原理。

如果熟悉 kubernetes 的应用部署过程，我们知道 Bookinfo 应用程序的标准部署方式是这样的：

```
kubectl apply -f istio-0.2.10/samples/bookinfo/kube/bookinfo.yaml
```

但从上面的部署过程可以看到，kubectl apply 命令的输入并不是一个 kubernetes yaml 文件，而是`istioctl kube-inject -f istio-0.2.10/samples/bookinfo/kube/bookinfo.yaml`命令的输出。

这段命令在这里起到了什么作用呢？通过单独运行该命令并将输出保存到文件中，我们可以查看 istioctl kube-inject 命令到底在背后搞了什么小动作。

```
istioctl kube-inject -f istio-0.2.10/samples/bookinfo/kube/bookinfo.yaml >> bookinfo_with_sidecar.yaml
```

对比 bookinfo/\_with/\_sidecar.yaml 文件和 bookinfo.yaml，可以看到该命令在 bookinfo.yaml 的基础上做了如下改动：

- 为每个 pod 增加了一个代理 container，该 container 用于处理应用 container 之间的通信，包括服务发现，路由规则处理等。从下面的配置文件中可以看到 proxy container 通过 15001 端口进行监听，接收应用 container 的流量。

- 为每个 pod 增加了一个 init-container，该 container 用于配置 iptable，将应用 container 的流量导入到代理 container 中。

```
  #注入istio 网络代理
  image: docker.io/istio/proxy_debug:0.2.10
        imagePullPolicy: IfNotPresent
        name: istio-proxy
        resources: {}
        securityContext:
          privileged: true
          readOnlyRootFilesystem: false
          runAsUser: 1337
        volumeMounts:
        - mountPath: /etc/istio/proxy
          name: istio-envoy
        - mountPath: /etc/certs/
          name: istio-certs
          readOnly: true
      #使用init container修改iptable
      initContainers:
      - args:
        - -p
        - "15001"
        - -u
        - "1337"
        image: docker.io/istio/proxy_init:0.2.10
        imagePullPolicy: IfNotPresent
        name: istio-init
```

从上面的分析，我们可以看出 Istio 的 kube-inject 工具的用途即是将代理 sidecar 注入了 Bookinfo 的 kubernetes yaml 部署文件中。通过该方式，不需要用户手动修改 kubernetes 的部署文件，即可在部署服务时将 sidecar 和应用一起部署。

通过命令查看 pod 中部署的 docker container，确认是否部署了 Istio 代理

```
kubectl get pods

NAME                              READY     STATUS    RESTARTS   AGE
details-v1-3688945616-8hv8x       2/2       Running   0          1d
productpage-v1-2055622944-cslw1   2/2       Running   0          1d
ratings-v1-233971408-8dcnp        2/2       Running   0          1d
reviews-v1-1360980140-474x6       2/2       Running   0          1d
reviews-v2-1193607610-cfhb5       2/2       Running   0          1d
reviews-v3-3340858212-b5c8k       2/2       Running   0          1d
```

查看 reviews pod 的中的 container，可以看到 pod 中除 reviews container 外还部署了一个 istio-proxy container

```
kubectl get pod reviews-v3-3340858212-b5c8k -o jsonpath='{.spec.containers[*].name}'

reviews istio-proxy
```

而应用 container 的流量是如何被导入到 istio-proxy 中的呢？

原理是 Istio proxy 在端口 15001 进行监听，pod 中应用 container 的流量通过 iptables 规则被重定向到 15001 端口中。下面我们进入 pod 内部，通过相关命令来验证这一点。

先通过命令行找到 ratings-v1-233971408-8dcnp pod 的 PID，以用于查看其 network namespace 內的 iptables 规则。

```
CONTAINER_ID=$(kubectl get po ratings-v1-233971408-8dcnp -o jsonpath='{.status.containerStatuses[0].containerID}' | cut -c 10-21)

PID=$(sudo docker inspect --format '{{ .State.Pid }}' $CONTAINER_ID)
```

可以使用 nsenter 命令来进入 pod 的 network namespace 执行命令。  
使用 netstat 命令可以看到 istio proxy 代理的监听端口 15001

```
sudo nsenter -t ${PID} -n netstat -all | grep 15001

tcp        0      0 *:15001                 *:*                     LISTEN
```

使用 iptables 命令可以查看到下面的规则

```
sudo nsenter -t ${PID} -n iptables -t nat -L -n -v

Chain PREROUTING (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination
   16   960 ISTIO_REDIRECT  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* istio/install-istio-prerouting */

Chain INPUT (policy ACCEPT 16 packets, 960 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 84838 packets, 7963K bytes)
 pkts bytes target     prot opt in     out     source               destination
 1969  118K ISTIO_OUTPUT  tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            /* istio/install-istio-output */

Chain POSTROUTING (policy ACCEPT 84838 packets, 7963K bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain ISTIO_OUTPUT (1 references)
 pkts bytes target     prot opt in     out     source               destination
    0     0 ISTIO_REDIRECT  all  --  *      lo      0.0.0.0/0           !127.0.0.1            /* istio/redirect-implicit-loopback */
 1969  118K RETURN     all  --  *      *       0.0.0.0/0            0.0.0.0/0            owner UID match 1337 /* istio/bypass-envoy */
    0     0 RETURN     all  --  *      *       0.0.0.0/0            127.0.0.1            /* istio/bypass-explicit-loopback */
    0     0 ISTIO_REDIRECT  all  --  *      *       0.0.0.0/0            0.0.0.0/0            /* istio/redirect-default-outbound */

Chain ISTIO_REDIRECT (3 references)
 pkts bytes target     prot opt in     out     source               destination
   16   960 REDIRECT   tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            /* istio/redirect-to-envoy-port */ redir ports 15001
```

从 pod 所在 network namespace 的 iptables 规则中可以看到，pod 的入口和出口流量分别通过 PREROUTING 和 OUTPUT chain 指向了自定义的 ISTIO/\_REDIRECT chain，而 ISTIO/\_REDIRECT chain 中的规则将所有流量都重定向到了 istio proxy 正在监听的 15001 端口中。从而实现了对应用透明的通信代理。

## 测试路由规则

多次刷新 Bookinfo 应用的 productpage 页面，我们会发现该页面中显示的 Book Reviews 有时候有带红星的评价信息，有时有带黑星的评价信息，有时只有文字评价信息。  
这是因为 Bookinfo 应用程序部署了 3 个版本的 Reviews 服务，每个版本的返回结果不同，在没有设置路由规则时，缺省的路由会将请求随机路由到每个版本的服务上，如下图所示：

![](/img/istio-install_and_example/withistio.svg)

通过创建一条路由规则 route-rule.yaml，将请求流量都引导到 Reviews-v1 服务上

```
apiVersion: config.istio.io/v1alpha2
kind: RouteRule
metadata:
  name: reviews-default
spec:
  destination:
    name: reviews
  precedence: 1
  route:
  - labels:
      version: v1
```

启用该路由规则

```
istioctl create -f route-rule.yaml -n default
```

再次打开 productpage 页面, 无论刷新多少次，显示的页面将始终是 v1 版本的输出，即不带星的评价内容。  
![](/img/istio-install_and_example/Bookinfo-no-star.PNG)  
删除该路由规则

```
istioctl delete -f route_rule.yaml -n default
```

继续刷新 productpage 页面,将重新随机出现三个版本的评价内容页面。

## 分布式调用追踪

首先修改安装包中的 `istio-0.2.10/install/kubernetes/addons/zipkin.yaml` 部署文件，增加 Nodeport,以便能在 kubernetes 集群外部访问 zipkin 界面。

```
apiVersion: v1
kind: Service
metadata:
  name: zipkin
  namespace: istio-system
spec:
  ports:
  - name: http
    port: 9411
    nodePort: 30001
  selector:
    app: zipkin
  type: NodePort
```

部署 zipkin 服务。

```
kubectl apply -f istio-0.2.10/install/kubernetes/addons/zipkin.yaml
```

在浏览器中打开 zipkin 页面，可以追踪一个端到端调用经过了哪些服务，以及各个服务花费的时间等详细信息，如下图所示：  
`http://10.12.25.116:30001`  
![](/img/istio-install_and_example/zipkin.PNG)

## 性能指标监控

首先修改安装包中的 `istio-0.2.10/install/kubernetes/addons/grafana.yaml` 部署文件，增加 Nodeport,以便能在 kubernetes 集群外部访问 grafana 界面。

```
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: istio-system
spec:
  ports:
  - port: 3000
    protocol: TCP
    name: http
    nodePort: 30002
  selector:
    app: grafana
  type: NodePort
```

prometheus 用于收集和存储信息指标，grafana 用于将性能指标信息进行可视化呈现，需要同时部署 prometheus 和 grafana 服务。

```
kubectl apply -f istio-0.2.10/install/kubernetes/addons/prometheus.yaml

kubectl apply -f istio-0.2.10/install/kubernetes/addons/grafana.yaml
```

首先在浏览器中打开 Bookinfo 的页面`http://10.12.25.116/productpage`，刷新几次，以制造一些性能指标数据。

然后打开 grafana 页面查看性能指标`http://10.12.25.116:30002/dashboard/db/istio-dashboard`，如下图所示：  
![](/img/istio-install_and_example/grafana.PNG)

## 参考

- [Istio 官方文档](https://istio.io/docs/)
- [Pattern: Service Mesh](http://philcalcado.com/2017/08/03/pattern_service_mesh.html)
- [WHAT’S A SERVICE MESH? AND WHY DO I NEED ONE?](https://buoyant.io/2017/04/25/whats-a-service-mesh-and-why-do-i-need-one/)
- [A Hacker’s Guide to Kubernetes Networking](https://thenewstack.io/hackers-guide-kubernetes-networking/)
