#Pandascore technical test Web Application

The installation and deployment processes below are detailed for Ubuntu 16.04 LTS, but it should be quite similar on any Unix-based OS.

##Installation

###Requirements

- Install Git.
- Install Node.js and NPM.

###Getting started

- Clone this repository.

```
git clone https://github.com/Strift/pandascoreTest.git
```

- Get inside the folder and install dependencies.

```
cd pandascoreTest
npm install
```

###Running the server in local

To run the server, simply use NPM start.

```
npm start
```

##Deployment

Check the 'Installation' process above and follow instructions in the 'Requirements' and 'Getting started' parts, then:

- Install PM2, which is a process manager for Node.js applications.

```
sudo npm install -g pm2
```

- Create a daemon monitoring the application.

```
pm2 start index.js
```

- Generate the startup script to launch PM2 and its managed processed on server boots.

```
pm2 startup systemd
```
The last line of the resulting output may include a command that you must run with superuser privileges.

We're almost done! Now we only need to configure a Nginx web server as reverse proxy.

- Install Nginx if you necessary.

```
sudo apt-get install nginx
```

- Edit the '/etc/nginx/sites-available/default' file with your favorite editor and set its content to:

```
server {
    listen 80;

    server_name example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- Restart Nginx.

```
sudo systemctl restart nginx
```

- Allow traffic to Nginx through the firewall, if you have it enabled.

```
sudo ufw allow 'Nginx Full'

```

We're done!

##Dockerization

Please note that the docker configuration exists only on the 'docker' branch.

###Requirements

- Install Docker.

###Building the image

Go to the application directory where the Dockerfile is located and run the following command to build the Docker image.

```
sudo docker build -t panda-showcase .
```

###Running the image

To run the docker image, we should redirect a public port, let's say 49160, to the private port 2020 inside the container. Use the command below to run the image in the background.

Note: I chose not to save the port mapping in the Dockerfile, as it would make it impossible to run several instances of the app on the host. 

```
docker run -p 49160:2020 -d pandascore
```

And it's done ! Enjoy.

Any issues? Reach me out at lau.cazanove@gmail.com :)