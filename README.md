# weweave Commerce
weweave Commerce is an open source web platform for selling digital goods. It relies on external brokers performing the actual transaction and provides a order notification API for those.

![Screenshot weweave Commerce](./htdocs/screenshot-home.png)

Features:
* Backend for handling order notifications from brokers
* Domain-based license key generation (incl. RSA-based public/private key signature)
* Automatic customer account creation upon order notification
* Administration portal:
  * Management of products, product variants, brokers and customers
  * Handling support requests
  * Manual license key generation and assigning license keys to customers
* Customer portal for:
  * License key management
  * Support ticket management
  * Purchase assistant

The software consists of two parts:
* A backend providing REST APIs, written in TypeScript, based on Node.js (this project)
* A frontend for customers and administrators, written in TypeScript, based on Angular (see [this project](https://github.com/weweave/commerce-www))

<a href="./htdocs/screenshot-login.png"><img src="./htdocs/screenshot-login.png" width="200" /></a>
<a href="./htdocs/screenshot-orders.png"><img src="./htdocs/screenshot-orders.png" width="200" /></a>
<a href="./htdocs/screenshot-verify-data.png"><img src="./htdocs/screenshot-verify-data.png" width="200" /></a>
<a href="./htdocs/screenshot-add-key.png"><img src="./htdocs/screenshot-add-key.png" width="200" /></a>
<a href="./htdocs/screenshot-edit-broker.png"><img src="./htdocs/screenshot-edit-broker.png" width="200" /></a>
<a href="./htdocs/screenshot-persons.png"><img src="./htdocs/screenshot-persons.png" width="200" /></a>

## Setup
The easiest way of getting weweave Commerce up and running is to use our pre-built Docker images. However, you can of course choose to build from source.

### Using Docker
1. Create a ```config.json``` file (see below).
1. Run the image like this (assuming you want to link it with your MySQL container):
    ```
    docker run \
        -p 3000:3000 \
        --name commerce \
        --link mysql:mysql \
        -v /tmp/config.json:/usr/src/app/config.json \
        weweave/commerce
    ```
1. Access the web frontend at port 3000. Default username is "admin@admin.local", password is "admin".
1. After logging in with the admin account, change the username and/or password under "Persons" and configure the system further under "Settings".

### Using with docker-compose
1. Create a ```config.json``` file (see below). Password should be changed from `root` to `my-secret-pw`.
1. Bring up the compose file with the followign command: `docker-compose up -d`
1. Access web frontend at: http://commerce.docker.localhost

### Building from source
1. Make sure you have [Node.js](https://nodejs.org) installed (tested with Node.js v8).
1. Check out the source code and build it:
    ```
    git clone https://github.com/weweave/commerce.git
    cd commerce
    npm install
    npm run build-prod
    ```
1. Update ```config.json``` to match your environment (see below).
1. Run the server:
    ```
    node dist/server.js
    ```
1. Access the web frontend at port 3000. Default username is "admin@admin.local", password is "admin".
1. After logging in with the admin account, change the username and/or password under "Persons" and configure the system further under "Settings".

## Configuration
The settings required on server start are in ```config.json```. Make sure to change this file before starting the server.
```
{
    "database": {
        "driver": {
            "type": "mysql",
            "host": "mysql",
            "port": 3306,
            "username": "root",
            "password": "root",
            "database": "commerce"
        },
        "logging": ["error", "warn"]
    },
    "basePath": "/",
    "session": {
        "secret": "fkj49l7WwjUtqcfLZKlLA269J28kC4uL",
        "issuer": "https://change.me",
        "lifetime": "12h"
    },
    "importTldListOnStart": true
}
```

More settings can be changed at runtime by logging in with an administrator account and navigating to "Settings".

## Adding the web frontend
If you just set up this project, you'll just get the backend up and running. The frontend must be set up separately.

### Docker Compose
Please use a cloud native edge router like [Traefik](https://traefik.io/) (or nginx or haproxy):

* Route all incoming requests to ```/api/``` to the backend.
* Route all other incoming requests to the frontend.

If your frontend is not running at the root path, you must change the base href by setting the frontend's docker environment variable ```BASE_HREF```.

### Building from source
1. Make sure you have [Node.js](https://nodejs.org) installed (tested with Node.js v8).
1. Make sure you have Angular CLI installed:
    ```
    npm install -g @angular/cli
    ```
1. Check out the source code and build it:
    ```
    git clone https://github.com/weweave/commerce-www.git
    cd commerce-www
    npm install
    ng build --prod
    ```
1. Copy the contents of the ```dist/commerce-www/``` folder to the ```www/``` folder of the previously built backend project.

## Demo Mode
Just want to sneak a peek with some demo data prepared for you?

If you start weweave Commerce with environment variable DEMO=1, the server automatically uses an SQLite In-Memory Database and generates some random sample data. The easiest way to run weweave Commerce in Demo Mode is to use the Docker image like this:
```
docker run -e "DEMO=1" -p 3000:3000 -it weweave/commerce
```

Afterwards, open your browser and go to: http://localhost:3000

## Documentation
Check out the documentation at: https://weweave.net/products/commerce/documentation/
