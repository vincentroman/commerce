import * as express from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { createConnection } from "typeorm";

import ProductRouter from './router/ProductRouter';

import { Product } from './entity/Product';

class App {
    public express: express.Application;
    db: any;

    constructor() {
        this.express = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupOrm();
    }

    private setupMiddleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    private setupRoutes(): void {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello World!'
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/product', ProductRouter);
    }

    private setupOrm(): void {
        createConnection({
            driver: {
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: "root",
                password: "admin",
                database: "test"
            },
            entities: [
                Product
            ],
            autoSchemaSync: true
        }).then(connection => {
            this.db = connection;
        }).catch(error => {
            console.log(error);
        });
    }
}

export default new App().express;
