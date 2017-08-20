# weweave Commerce
weweave Commerce is an open source web platform for selling digital goods. It relies on external brokers performing the actual transaction and provides a order notification API for those.

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
* A backend providing REST APIs, written in TypeScript, based on Node.js
* A frontend for customers and administrators, written in TypeScript, based on Angular

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
    "session": {
        "secret": "fkj49l7WwjUtqcfLZKlLA269J28kC4uL",
        "issuer": "https://change.me",
        "lifetime": "12h"
    },
    "importTldListOnStart": true
}
```