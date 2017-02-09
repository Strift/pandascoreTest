#Pandascore technical test Web Application

##Installation

###Requirements

The installation processed below is detailed for Ubuntu 16.04 LTS, but it should be quite similar on any Unix-based OS. The only difference should be the package manager that you use.

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

###Running the server

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