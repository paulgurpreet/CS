# 1. using EC2 in aws

**First open aws search EC2 then Launch Instance and there select keypair in putty then download it**

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


# 2. USING DOCKER IN AWS (AND BUILD NGINX WEB SERVER ON IT)

**First open aws search EC2 then Launch Instance and there select keypair in putty then download it**

**after that edit network setting and click on add security group rule and select TCP,UDP,ALL TRAFFIC AND SELECT EVERYWHERE SOURCE TYPE IN THEM then Launch it and run putty and paste public id on HOST NAME and open that downloaded key pair for putty in SSH then Auth then Credentials and open there**

**after that run it and write username as ubuntu as selected os and then type following commands**
```terminal
curl -sL https://github.com/ShubhamTatvamasi/docker-install/raw/master/docker-install.sh | bash
```
**this will install and run docker in your vm**

```terminal
newgrp docker
```
**this will add new group in docker**

```terminal
docker ps
```
**this will list docker**

```terminal
docker --version
```
**this will display the version of docker installed**

### now installing nginx

```terminal
docker pull nginx
```
**You can download Nginx from a pre-built Docker image, with a default Nginx configuration, by above command.
This downloads all the necessary components for the container.**

```terminal
docker run --name docker-nginx -p 80:80 nginx
```
**Nginx installed, you can configure the container so that it’s publicly accessible as a web server.**

**run is the command to create a new container**

**The --name flag is how you specify the name of the container. If left blank, a generated name like nostalgic_hopper will be assigned.**

**-p specifies the port you are exposing in the format of -p local-machine-port:internal-container-port. In this case, you are mapping port :80 in the container to port :80 on the server.**

**nginx is the name of the image on Docker Hub.**


### now this will show this on yoru public ip
![Screenshot 2024-09-17 185925](https://github.com/user-attachments/assets/bb2255a5-8c0b-4d5b-81ee-a1c6a552f5da)



#### In your terminal, enter CTRL+C to stop the container from running.


```terminal
docker ps -a
```
**verify the container status with this command**

```terminal
docker rm docker-nginx
```
**Remove the existing  container**

```terminal
docker run --name docker-nginx -p 80:80 -d nginx
```
**Create a new, detached Nginx container,By attaching the -d flag, you are running this container in the background.**


```terminal
docker ps
```
**this will obtain info about your container**


```terminal
docker stop docker-nginx
```
**Stop the container**


```terminal
docker rm docker-nginx
```
**remove the container**


## Building a Web Page to Serve on Nginx


```terminal
mkdir -p ~/docker-nginx/html
```
**Create a new directory for your website content within the home directory**


```terminal
cd ~/docker-nginx/html
```
**by this you navigate into this**


```terminal
vi index.html
```
**now press i and write your code in html like**

![Screenshot 2024-09-10 225017](https://github.com/user-attachments/assets/ae2e7ceb-b9e6-4f82-a7ff-80b2bc47861c)

**then press ctrl+c then shift+colon then write wq and enter**


```terminal
docker run --name docker-nginx -p 80:80 -d -v ~/docker-nginx/html:/usr/share/nginx/html nginx
```
**Linking the Container to the Local Filesystem**

**open your public ip in browser you will see as the content as  your html code**


## Using Your Own Nginx Configuration File

```terminal
cd ~/docker-nginx
```

```terminal
docker cp docker-nginx:/etc/nginx/conf.d/default.conf default.conf
```
**Copy the Nginx config directory into your project folder**



```terminal
docker stop docker-nginx
```


```terminal
docker rm docker-nginx
```
**to rebuild the container stop the container then remove it**



```terminal
docker run --name docker-nginx -p 80:80 -v ~/docker-nginx/html:/usr/share/nginx/html -v ~/docker-nginx/default.conf:/etc/nginx/conf.d/default.conf -d nginx
```
**This command links the custom website pages to the container.**




```
docker restart docker-nginx
```
**you need to restart your container and your changes should be reflected on the associated pages.**









