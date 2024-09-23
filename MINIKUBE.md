# INSTALLING MINIKUBE

**First open aws search EC2 then Launch Instance and select 22.04 AMI then select t2.xlarge instance type then select keypair then configure storage to 30 GB then enable all traffic in network and Launch.**

**Now connect it with putty and login into it by writing ubuntu**

### Now put some commands

```
curl -sL https://github.com/ShubhamTatvamasi/docker-install/raw/master/docker-install.sh | bash
```
**it will install docker**




```
sudo usermod -aG docker $USER
```
```
newgrp docker
```

**it will Add your local user to docker group so that your local user run docker commands**






```
sudo snap install kubectl --classic
```
**it will intall kubernetes**





```
kubectl version --client
```
**it checks the version**

### Installing Minikube

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
```
```
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

#
#
```
minikube version
```
**it checks its version**

### Starting Minikube with Docker Driver

```
minikube start --driver=docker
```







**# If you encounter root privileges error, run:**
```
minikube start --driver=docker --force
```

```
minikube status
```
**it checks its status**







```
kubectl cluster-info
```
**it checks cluster info**



```
kubectl config view
```
**it will  show the config**







```
kubectl get nodes
```
**it will display  nodes in it**


```
kubectl get pods
```
**it will show pods in it**


```
kubectl create deployment nginx-web --image=nginx
```
```
kubectl expose deployment nginx-web --type NodePort --port=80
```
```
kubectl get deployment,pod,svc
```
**it will deploy a sample nginx deployment**


```
minikube addons list
```
**It will display all addons**







```
minikube addons enable dashboard
minikube addons enable ingress
```
**this  enables these addons**











```
minikube dashboard --url**
```
**it will get the url and run the dashboard of MiniKube**






```
kubectl proxy --address='0.0.0.0' --disable-filter=true &
```
**This will enable port :8001 to access it on your public ip**






```
http://server_ip:8001/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/#/workloads?namespace=default
```
### Now got above link and replace server_ip with your public ip and it will show you like :

![minik8s](https://github.com/user-attachments/assets/f92e7dca-a8c0-4c8e-aae8-4a0c88c5443e)


