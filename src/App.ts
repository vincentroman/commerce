import "reflect-metadata";
import * as EventEmitter from "events";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createConnection, Connection } from "typeorm";
import { Config } from './util/Config';

import AuthRouter from './router/AuthRouter';
import BrokerRouter from './router/BrokerRouter';
import CustomerRouter from './router/CustomerRouter';
import CommentRouter from './router/CommentRouter';
import OrderItemRouter from './router/OrderItemRouter';
import OrderNotificationRouter from './router/OrderNotificationRouter';
import OrderRouter from './router/OrderRouter';
import ProductRouter from './router/ProductRouter';
import ProductVariantRouter from './router/ProductVariantRouter';
import UserRouter from './router/UserRouter';

export class App extends EventEmitter {
    private static readonly INSTANCE: App = new App();
    public readonly express: express.Application;
    public ready: boolean = false;

    constructor() {
        super();
        if (App.INSTANCE) {
            throw new Error("Call App.getInstance() instead!");
        }
        this.express = express();
        this.setupOrm().then(connection => {
            this.setupMiddleware();
            this.setupRoutes();
            this.emit("appStarted");
            this.ready = true;
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
        this.express.use('/api/v1/auth', AuthRouter);
        this.express.use('/api/v1/broker', BrokerRouter);
        this.express.use('/api/v1/customer', CustomerRouter);
        this.express.use('/api/v1/comment', CommentRouter);
        this.express.use('/api/v1/orderitem', OrderItemRouter);
        this.express.use('/api/v1/ordernotification', OrderNotificationRouter);
        this.express.use('/api/v1/order', OrderRouter);
        this.express.use('/api/v1/product', ProductRouter);
        this.express.use('/api/v1/productvariant', ProductVariantRouter);
        this.express.use('/api/v1/user', UserRouter);
    }

    private async setupOrm(): Promise<Connection> {
        return createConnection({
            driver: Config.getInstance().get("database"),
            entities: [
                __dirname + "/entity/*.js",
                __dirname + "/entity/*.ts"
            ],
            logging: {
                //logQueries: true
            },
            autoSchemaSync: true
        });
    }

    public static getInstance(): App {
        return App.INSTANCE;
    }
}
