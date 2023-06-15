---
layout: post
title: "如何从外部访问Kubernetes集群中的应用？"
subtitle: ""
description: "我们知道，kubernetes的Cluster Network属于私有网络，只能在cluster Network内部才能访问部署的应用，那如何才能将Kubernetes集群中的应用暴露到外部网络，为外部用户提供服务呢？本文探讨了从外部网络访问kubernetes cluster中应用的几种实现方式。"
date: 2017-11-28 12:00:00
author: "赵化冰"
image: "/images/1-1.jpg"
published: true
tags:
  - Kubernetes
URL: "/2017/11/28/access-application-from-outside/"
categories: [Tech]
---

## 前言

我们知道，kubernetes 的 Cluster Network 属于私有网络，只能在 cluster Network 内部才能访问部署的应用，那如何才能将 Kubernetes 集群中的应用暴露到外部网络，为外部用户提供服务呢？本文探讨了从外部网络访问 kubernetes cluster 中应用的几种实现方式。

<!--more-->

> 本文尽量试着写得比较容易理解，但要做到“深入浅出”，把复杂的事情用通俗易懂的语言描述出来是非常需要功力的，个人自认尚未达到此境界，唯有不断努力。此外，kubernetes 本身是一个比较复杂的系统，无法在本文中详细解释涉及的所有相关概念，否则就可能脱离了文章的主题，因此假设阅读此文之前读者对 kubernetes 的基本概念如 docker，container，pod 已有所了解。

另外此文中的一些内容是自己的理解，由于个人的知识范围有限，可能有误，如果读者对文章中的内容有疑问或者勘误，欢迎大家指证。

## Pod 和 Service

我们首先来了解一下 Kubernetes 中的 Pod 和 Service 的概念。

Pod(容器组),英文中 Pod 是豆荚的意思，从名字的含义可以看出，Pod 是一组有依赖关系的容器，Pod 包含的容器都会运行在同一个 host 节点上，共享相同的 volumes 和 network namespace 空间。Kubernetes 以 Pod 为基本操作单元，可以同时启动多个相同的 pod 用于 failover 或者 load balance。

![Pod](/img/access-application-from-outside/pod.PNG)

Pod 的生命周期是短暂的，Kubernetes 根据应用的配置，会对 Pod 进行创建，销毁，根据监控指标进行缩扩容。kubernetes 在创建 Pod 时可以选择集群中的任何一台空闲的 Host，因此其网络地址是不固定的。由于 Pod 的这一特点，一般不建议直接通过 Pod 的地址去访问应用。

为了解决访问 Pod 不方便直接访问的问题，Kubernetes 采用了 Service 的概念，Service 是对后端提供服务的一组 Pod 的抽象，Service 会绑定到一个固定的虚拟 IP 上，该虚拟 IP 只在 Kubernetes Cluster 中可见，但其实该 IP 并不对应一个虚拟或者物理设备，而只是 IPtable 中的规则，然后再通过 IPtable 将服务请求路由到后端的 Pod 中。通过这种方式，可以确保服务消费者可以稳定地访问 Pod 提供的服务，而不用关心 Pod 的创建、删除、迁移等变化以及如何用一组 Pod 来进行负载均衡。

Service 的机制如下图所示，Kube-proxy 监听 kubernetes master 增加和删除 Service 以及 Endpoint 的消息，对于每一个 Service，kube proxy 创建相应的 iptables 规则，将发送到 Service Cluster IP 的流量转发到 Service 后端提供服务的 Pod 的相应端口上。
![Pod和Service的关系](/img/access-application-from-outside/services-iptables-overview.png)

> 备注：虽然可以通过 Service 的 Cluster IP 和服务端口访问到后端 Pod 提供的服务，但该 Cluster IP 是 Ping 不通的，原因是 Cluster IP 只是 iptable 中的规则，并不对应到一个网络设备。

## Service 的类型

Service 的类型(ServiceType)决定了 Service 如何对外提供服务，根据类型不同，服务可以只在 Kubernetes cluster 中可见，也可以暴露到 Cluster 外部。Service 有三种类型，ClusterIP，NodePort 和 LoadBalancer。其中 ClusterIP 是 Service 的缺省类型，这种类型的服务会提供一个只能在 Cluster 内才能访问的虚拟 IP，其实现机制如上面一节所述。

## 通过 NodePort 提供外部访问入口

通过将 Service 的类型设置为 NodePort，可以在 Cluster 中的主机上通过一个指定端口暴露服务。注意通过 Cluster 中每台主机上的该指定端口都可以访问到该服务，发送到该主机端口的请求会被 kubernetes 路由到提供服务的 Pod 上。采用这种服务类型，可以在 kubernetes cluster 网络外通过主机 IP：端口的方式访问到服务。

> 注意：官方文档中说明了 Kubernetes clusterIp 的流量转发到后端 Pod 有 Iptable 和 kube proxy 两种方式。但对 Nodeport 如何转发流量却语焉不详。该图来自网络，从图来看是通过 kube proxy 转发的，我没有去研究过源码。欢迎了解的同学跟帖说明。

![Pod和Service的关系](/img/access-application-from-outside/nodeport.PNG)

下面是通过 NodePort 向外暴露服务的一个例子，注意可以指定一个 nodePort，也可以不指定。在不指定的情况下，kubernetes 会从可用的端口范围内自动分配一个随机端口。

```
kind: Service
apiVersion: v1
metadata:
  name: influxdb
spec:
  type: NodePort
  ports:
    - port: 8086
      nodePort: 30000
  selector:
    name: influxdb
```

通过 NodePort 从外部访问有下面的一些问题，自己玩玩或者进行测试时可以使用该方案，但不适宜用于生产环境。

- Kubernetes cluster host 的 IP 必须是一个 well-known IP，即客户端必须知道该 IP。但 Cluster 中的 host 是被作为资源池看待的，可以增加删除，每个 host 的 IP 一般也是动态分配的，因此并不能认为 host IP 对客户端而言是 well-known IP。

- 客户端访问某一个固定的 host IP 存在单点故障。假如一台 host 宕机了，kubernetes cluster 会把应用 reload 到另一节点上，但客户端就无法通过该 host 的 nodeport 访问应用了。

- 该方案假设客户端可以访问 Kubernetes host 所在网络。在生产环境中，客户端和 Kubernetes host 网络可能是隔离的。例如客户端可能是公网中的一个手机 APP，是无法直接访问 host 所在的私有网络的。

因此，需要通过一个网关来将外部客户端的请求导入到 Cluster 中的应用中，在 kubernetes 中，这个网关是一个 4 层的 load balancer。

## 通过 Load Balancer 提供外部访问入口

通过将 Service 的类型设置为 LoadBalancer，可以为 Service 创建一个外部 Load Balancer。Kubernetes 的文档中声明该 Service 类型需要云服务提供商的支持，其实这里只是在 Kubernetes 配置文件中提出了一个要求，即为该 Service 创建 Load Balancer，至于如何创建则是由 Google Cloud 或 Amazon Cloud 等云服务商提供的，创建的 Load Balancer 不在 Kubernetes Cluster 的管理范围中。kubernetes 1.6 版本中，WS, Azure, CloudStack, GCE and OpenStack 等云提供商已经可以为 Kubernetes 提供 Load Balancer.下面是一个 Load balancer 类型的 Service 例子：

```
kind: Service
apiVersion: v1
metadata:
  name: influxdb
spec:
  type: LoadBalancer
  ports:
    - port: 8086
  selector:
    name: influxdb
```

部署该 Service 后，我们来看一下 Kubernetes 创建的内容

```
$ kubectl get svc influxdb
NAME       CLUSTER-IP     EXTERNAL-IP     PORT(S)          AGE
influxdb   10.97.121.42   10.13.242.236   8086:30051/TCP   39s
```

Kubernetes 首先为 influxdb 创建了一个集群内部可以访问的 ClusterIP 10.97.121.42。由于没有指定 nodeport 端口，kubernetes 选择了一个空闲的 30051 主机端口将 service 暴露在主机的网络上，然后通知 cloud provider 创建了一个 load balancer，上面输出中的 EEXTERNAL-IP 就是 load balancer 的 IP。

测试使用的 Cloud Provider 是 OpenStack，我们通过 neutron lb-vip-show 可以查看创建的 Load Balancer 详细信息。

```
$ neutron lb-vip-show 9bf2a580-2ba4-4494-93fd-9b6969c55ac3
+---------------------+--------------------------------------------------------------+
| Field               | Value                                                        |
+---------------------+--------------------------------------------------------------+
| address             | 10.13.242.236                                                |
| admin_state_up      | True                                                         |
| connection_limit    | -1                                                           |
| description         | Kubernetes external service a6ffa4dadf99711e68ea2fa163e0b082 |
| id                  | 9bf2a580-2ba4-4494-93fd-9b6969c55ac3                         |
| name                | a6ffa4dadf99711e68ea2fa163e0b082                             |
| pool_id             | 392917a6-ed61-4924-acb2-026cd4181755                         |
| port_id             | e450b80b-6da1-4b31-a008-280abdc6400b                         |
| protocol            | TCP                                                          |
| protocol_port       | 8086                                                         |
| session_persistence |                                                              |
| status              | ACTIVE                                                       |
| status_description  |                                                              |
| subnet_id           | 73f8eb91-90cf-42f4-85d0-dcff44077313                         |
| tenant_id           | 4d68886fea6e45b0bc2e05cd302cccb9                             |
+---------------------+--------------------------------------------------------------+

$ neutron lb-pool-show 392917a6-ed61-4924-acb2-026cd4181755
+------------------------+--------------------------------------+
| Field                  | Value                                |
+------------------------+--------------------------------------+
| admin_state_up         | True                                 |
| description            |                                      |
| health_monitors        |                                      |
| health_monitors_status |                                      |
| id                     | 392917a6-ed61-4924-acb2-026cd4181755 |
| lb_method              | ROUND_ROBIN                          |
| members                | d0825cc2-46a3-43bd-af82-e9d8f1f85299 |
|                        | 3f73d3bb-bc40-478d-8d0e-df05cdfb9734 |
| name                   | a6ffa4dadf99711e68ea2fa163e0b082     |
| protocol               | TCP                                  |
| provider               | haproxy                              |
| status                 | ACTIVE                               |
| status_description     |                                      |
| subnet_id              | 73f8eb91-90cf-42f4-85d0-dcff44077313 |
| tenant_id              | 4d68886fea6e45b0bc2e05cd302cccb9     |
| vip_id                 | 9bf2a580-2ba4-4494-93fd-9b6969c55ac3 |
+------------------------+--------------------------------------+

$ neutron lb-member-list
+--------------------------------------+--------------+---------------+--------+----------------+--------+
| id                                   | address      | protocol_port | weight | admin_state_up | status |
+--------------------------------------+--------------+---------------+--------+----------------+--------+
| 3f73d3bb-bc40-478d-8d0e-df05cdfb9734 | 10.13.241.89 |         30051 |      1 | True           | ACTIVE |
| d0825cc2-46a3-43bd-af82-e9d8f1f85299 | 10.13.241.10 |         30051 |      1 | True           | ACTIVE |
+--------------------------------------+--------------+---------------+--------+----------------+--------
```

可以看到 OpenStack 使用 VIP 10.13.242.236 在端口 8086 创建了一个 Load Balancer，Load Balancer 对应的 Lb pool 里面有两个成员 10.13.241.89 和 10.13.241.10，正是 Kubernetes 的 host 节点，进入 Load balancer 流量被分发到这两个节点对应的 Service Nodeport 30051 上。

但是如果客户端不在 Openstack Neutron 的私有子网上，则还需要在 load balancer 的 VIP 上关联一个 floating IP，以使外部客户端可以连接到 load balancer。

部署 Load balancer 后，应用的拓扑结构如下图所示（注：本图假设 Kubernetes Cluster 部署在 Openstack 私有云上）。
![外部Load balancer](/img/access-application-from-outside/load-balancer.PNG)

> 备注：如果 kubernetes 环境在 Public Cloud 上，Loadbalancer 类型的 Service 创建出的外部 Load Balancer 已经带有公网 IP 地址，是可以直接从外部网络进行访问的，不需要绑定 floating IP 这个步骤。例如在 AWS 上创建的 Elastic Load Balancing (ELB)，有兴趣可以看一下这篇文章：[Expose Services on your AWS Quick Start Kubernetes cluster](http://docs.heptio.com/content/tutorials/aws-qs-services-elb.html)。

如果 Kubernetes Cluster 是在不支持 LoadBalancer 特性的 cloud provider 或者裸机上创建的，可以实现 LoadBalancer 类型的 Service 吗？应该也是可以的。Kubernetes 本身并不直接支持 Loadbalancer，但我们可以通过对 Kubernetes 进行扩展来实现，可以监听 kubernetes Master 的 service 创建消息，并根据消息部署相应的 Load Balancer（如 Nginx 或者 HAProxy），来实现 Load balancer 类型的 Service。

通过设置 Service 类型提供的是四层 Load Balancer，当只需要向外暴露一个服务的时候，可以直接采用这种方式。但在一个应用需要对外提供多个服务时，采用该方式会为每一个服务（IP+Port）都创建一个外部 load balancer。如下图所示
![创建多个Load balancer暴露应用的多个服务](/img/access-application-from-outside/multiple-load-balancer.PNG)
一般来说，同一个应用的多个服务/资源会放在同一个域名下，在这种情况下，创建多个 Load balancer 是完全没有必要的，反而带来了额外的开销和管理成本。直接将服务暴露给外部用户也会导致了前端和后端的耦合，影响了后端架构的灵活性，如果以后由于业务需求对服务进行调整会直接影响到客户端。可以通过使用 Kubernetes Ingress 进行 L7 load balancing 来解决该问题。

## 采用 Ingress 作为七层 load balancer

首先看一下引入 Ingress 后的应用拓扑示意图（注：本图假设 Kubernetes Cluster 部署在 Openstack 私有云上）。
![采用Ingress暴露应用的多个服务](/img/access-application-from-outside/ingress.PNG)
这里 Ingress 起到了七层负载均衡器和 Http 方向代理的作用，可以根据不同的 url 把入口流量分发到不同的后端 Service。外部客户端只看到 foo.bar.com 这个服务器，屏蔽了内部多个 Service 的实现方式。采用这种方式，简化了客户端的访问，并增加了后端实现和部署的灵活性，可以在不影响客户端的情况下对后端的服务部署进行调整。

下面是 Kubernetes Ingress 配置文件的示例，在虚拟主机 foot.bar.com 下面定义了两个 Path，其中/foo 被分发到后端服务 s1，/bar 被分发到后端服务 s2。

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test
  annotations:
    ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: s1
          servicePort: 80
      - path: /bar
        backend:
          serviceName: s2
          servicePort: 80
```

注意这里 Ingress 只描述了一个虚拟主机路径分发的要求，可以定义多个 Ingress，描述不同的 7 层分发要求，而这些要求需要由一个 Ingress Controller 来实现。Ingress Contorller 会监听 Kubernetes Master 得到 Ingress 的定义，并根据 Ingress 的定义对一个 7 层代理进行相应的配置，以实现 Ingress 定义中要求的虚拟主机和路径分发规则。Ingress Controller 有多种实现，Kubernetes 提供了一个[基于 Nginx 的 Ingress Controller](https://github.com/kubernetes/ingress-nginx)。需要注意的是，在部署 Kubernetes 集群时并不会缺省部署 Ingress Controller，需要我们自行部署。

下面是部署 Nginx Ingress Controller 的配置文件示例，注意这里为 Nginx Ingress Controller 定义了一个 LoadBalancer 类型的 Service，以为 Ingress Controller 提供一个外部可以访问的公网 IP。

```
apiVersion: v1
kind: Service
metadata:
  name: nginx-ingress
spec:
  type: LoadBalancer
  ports:
    - port: 80
      name: http
    - port: 443
      name: https
  selector:
    k8s-app: nginx-ingress-lb
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: nginx-ingress-controller
spec:
  replicas: 2
  revisionHistoryLimit: 3
  template:
    metadata:
      labels:
        k8s-app: nginx-ingress-lb
    spec:
      terminationGracePeriodSeconds: 60
      containers:
        - name: nginx-ingress-controller
          image: gcr.io/google_containers/nginx-ingress-controller:0.8.3
          imagePullPolicy: Always
    //----omitted for brevity----
```

> 备注：Google Cloud 直接支持 Ingress 资源，如果应用部署在 Google Cloud 中，Google Cloud 会自动为 Ingress 资源创建一个 7 层 load balancer，并为之分配一个外部 IP，不需要自行部署 Ingress Controller。

## 结论

采用 Ingress 加上 Load balancer 的方式可以将 Kubernetes Cluster 中的应用服务暴露给外部客户端。这种方式比较灵活，基本可以满足大部分应用的需要。但如果需要在入口处提供更强大的功能，如有更高的效率要求，需求进行安全认证，日志记录，或者需要一些应用的定制逻辑，则需要考虑采用微服务架构中的 API Gateway 模式，采用一个更强大的 API Gateway 来作为应用的流量入口。

## 参考

- [Accessing Kubernetes Pods from Outside of the Cluster](http://alesnosek.com/blog/2017/02/14/accessing-kubernetes-pods-from-outside-of-the-cluster/)

- [Kubernetes nginx-ingress-controller](https://daemonza.github.io/2017/02/13/kubernetes-nginx-ingress-controller/)

- [Using Kubernetes external load balancer feature](https://docs.openstack.org/magnum/ocata/dev/kubernetes-load-balancer.html)

- [Expose Services on your AWS Quick Start Kubernetes cluster](http://docs.heptio.com/content/tutorials/aws-qs-services-elb.html)
