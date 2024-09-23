# CONTENTS -
- 1. USING EC2 IN AWS
- 2. USING CONTAINER IN VM and adding nginx server by Docker
- 3. USING MINIKUBE
  
# 1. using EC2 in aws

**First open aws search EC2 then Launch Instance and there select keypair in putty or pem then download it**

### By using pem file for linux
```
ssh -i /path/to/your/pemfile.pem ec2-user@your-ec2-public-ip
```


### By using putty

**after that Launch it and run putty and paste public id on HOST NAME and open that downloaded key pair for putty in SSH then Auth then Credentials and open there**

**after that run it and write username as ubuntu as selected os and then type following commands**


```
sudo apt update
```

```
sudo apt install apache2
```
**to install a web server on ip then**

```
sudo su
```
 **for convert $ into # for getting admin role then**

```
cd /var/www/html/
```
   
   **then**

```
ls
```
  **for list of html file in it**

**then copy that html file name and write**
```
rm index.html
```
**rm means remove command**

```
vi index.html
```
 **this will open a notepad like and write html code there like (vi is editor) -**

![Screenshot 2024-09-10 225017](https://github.com/user-attachments/assets/ae2e7ceb-b9e6-4f82-a7ff-80b2bc47861c)




**then press ctrl+c then shift+colon then write wq and enter**

**now copy your public ip and paste it on browser you will see the texts written by you (by using html above)**


# 2. USING CONTAINER IN VM and adding nginx server by Docker

**First open aws search EC2 then Launch Instance and there select keypair in putty then download it**

**after that edit network setting and click on add security group rule and select TCP,UDP,ALL TRAFFIC AND SELECT EVERYWHERE SOURCE TYPE IN THEM then Launch it and run putty and paste public id on HOST NAME and open that downloaded key pair for putty in SSH then Auth then Credentials and open there**

**after that run it and write username as ubuntu as selected os and then type following commands**
```
curl -sL https://github.com/ShubhamTatvamasi/docker-install/raw/master/docker-install.sh | bash
```
**this will install and run docker in your vm**

```
newgrp docker
```
**this command will help us to use docker**

```
docker ps
```
**this will list docker**

```
docker --version
```
**this will display the version of docker installed**

### now installing nginx

```
docker pull nginx
```
**You can download Nginx from a pre-built Docker image, with a default Nginx configuration, by above command.
This downloads all the necessary components for the container.**

```
docker run --name docker-nginx -p 80:80 nginx
```
**Nginx installed, you can configure the container so that it’s publicly accessible as a web server.**

**run is the command to create a new container**

**The --name flag is how you specify the name of the container. If left blank, a generated name like nostalgic_hopper will be assigned.**

**-p specifies the port you are exposing in the format of -p local-machine-port:internal-container-port. In this case, you are mapping port :80 in the container to port :80 on the server.**

**nginx is the name of the image on Docker Hub.**


### now this will show this on your public ip
![Screenshot 2024-09-17 185925](https://github.com/user-attachments/assets/bb2255a5-8c0b-4d5b-81ee-a1c6a552f5da)



#### In your terminal, enter CTRL+C to stop the container from running.


```
docker ps -a
```
**verify the container status with this command**

```
docker rm docker-nginx
```
**Remove the existing  container**

```
docker run --name docker-nginx -p 80:80 -d nginx
```
**Create a new, detached Nginx container,By attaching the -d flag, you are running this container in the background.**


```
docker ps
```
**this will obtain info about your container**


```
docker stop docker-nginx
```
**Stop the container**


```
docker rm docker-nginx
```
**remove the container**


## Building a Web Page to Serve on Nginx


```
mkdir -p ~/docker-nginx/html
```
**Create a new directory for your website content within the home directory**


```
cd ~/docker-nginx/html
```
**by this you navigate into this**


```
vi index.html
```
**now press i and write your code in html like**

![Screenshot 2024-09-10 225017](https://github.com/user-attachments/assets/ae2e7ceb-b9e6-4f82-a7ff-80b2bc47861c)

**then press ctrl+c then shift+colon then write wq and enter**


```
docker run --name docker-nginx -p 80:80 -d -v ~/docker-nginx/html:/usr/share/nginx/html nginx
```
**Linking the Container to the Local Filesystem**

**open your public ip in browser you will see as the content as  your html code**


## Using Your Own Nginx Configuration File

```
cd ~/docker-nginx
```

```
docker cp docker-nginx:/etc/nginx/conf.d/default.conf default.conf
```
**Copy the Nginx config directory into your project folder**



```
docker stop docker-nginx
```


```
docker rm docker-nginx
```
**to rebuild the container stop the container then remove it**



```
docker run --name docker-nginx -p 80:80 -v ~/docker-nginx/html:/usr/share/nginx/html -v ~/docker-nginx/default.conf:/etc/nginx/conf.d/default.conf -d nginx
```
**This command links the custom website pages to the container.**




```
docker restart docker-nginx
```
**you need to restart your container to reflect changes  on the associated pages.**





# 3. USING MINIKUBE IN AWS

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












