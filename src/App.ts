import "reflect-metadata";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createConnection, Connection } from "typeorm";
import { Config } from './util/Config';

import ProductRouter from './router/ProductRouter';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.setupOrm().then(connection => {
            this.setupMiddleware();
            this.setupRoutes();
        }).catch(error => console.log("TypeORM connection error: ", error));
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

    private async setupOrm(): Promise<Connection> {
        return createConnection({
            driver: Config.getInstance().get("database"),
            entities: [
                __dirname + "/entity/*.js"
            ],
            autoSchemaSync: true
        });
    }
}

export default new App().express;
