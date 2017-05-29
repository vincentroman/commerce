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
import MailTemplateRouter from './router/MailTemplateRouter';
import PurchaseItemRouter from './router/PurchaseItemRouter';
import OrderNotificationRouter from './router/OrderNotificationRouter';
import PurchaseRouter from './router/PurchaseRouter';
import ProductRouter from './router/ProductRouter';
import ProductVariantRouter from './router/ProductVariantRouter';
import UserRouter from './router/UserRouter';
import { DefaultSettingsCheck } from "./util/DefaultSettingsCheck";

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
            DefaultSettingsCheck.check().then(() => {
                this.emit("appStarted");
                this.ready = true;
                console.log("Server ready");
            });
        }).catch(error => console.log("TypeORM connection error: ", error));
    }

    private setupMiddleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            next();
        });
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
        this.express.use('/api/v1/mailtemplate', MailTemplateRouter);
        this.express.use('/api/v1/purchaseitem', PurchaseItemRouter);
        this.express.use('/api/v1/ordernotification', OrderNotificationRouter);
        this.express.use('/api/v1/purchase', PurchaseRouter);
        this.express.use('/api/v1/product', ProductRouter);
        this.express.use('/api/v1/productvariant', ProductVariantRouter);
        this.express.use('/api/v1/user', UserRouter);
    }

    private async setupOrm(): Promise<Connection> {
        let config = Config.getInstance().get("database");
        return createConnection({
            driver: config.driver,
            entities: [
                __dirname + "/entity/*.js",
                __dirname + "/entity/*.ts"
            ],
            logging: config.logging,
            autoSchemaSync: true
        });
    }

    public static getInstance(): App {
        return App.INSTANCE;
    }
}
