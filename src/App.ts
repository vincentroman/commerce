import "reflect-metadata";
import * as EventEmitter from "events";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { Config } from './util/Config';
import { DefaultSettingsCheck } from "./util/DefaultSettingsCheck";

import AuthRouter from './router/AuthRouter';
import BrokerRouter from './router/BrokerRouter';
import CommentRouter from './router/CommentRouter';
import LicenseKeyRouter from './router/LicenseKeyRouter';
import MailTemplateRouter from './router/MailTemplateRouter';
import PurchaseItemRouter from './router/PurchaseItemRouter';
import OrderNotificationRouter from './router/OrderNotificationRouter';
import PersonRouter from './router/PersonRouter';
import PurchaseRouter from './router/PurchaseRouter';
import ProductRouter from './router/ProductRouter';
import ProductVariantRouter from './router/ProductVariantRouter';
import BrokerProductVariantRouter from "./router/BrokerProductVariantRouter";
import SupportTicketRouter from "./router/SupportTicketRouter";
import SystemSettingRouter from "./router/SystemSettingRouter";
import TopLevelDomainRouter from "./router/TopLevelDomainRouter";
import { ScheduledTasks } from "./util/ScheduledTasks";
import { Server } from "http";

export class App extends EventEmitter {
    private static readonly INSTANCE: App = new App();
    public readonly express: express.Application;
    public server: Server;
    public ready: boolean = false;
    public dbConnection: Connection = null;
    private devEnvironment: boolean = false;

    constructor() {
        super();
        if (App.INSTANCE) {
            throw new Error("Call App.getInstance() instead!");
        }
        this.devEnvironment = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "dev");
        console.log("Dev mode = %s", this.devEnvironment);
        process.on("SIGINT", this.exitOnSignal.bind(this));
        process.on("SIGTERM", this.exitOnSignal.bind(this));
        process.on("uncaughtException", this.handleUnknownException.bind(this));
        process.on("unhandledRejection", this.handleUnknownRejection.bind(this));
        this.express = express();
        this.setupOrm().then(connection => {
            this.dbConnection = connection;
            this.setupMiddleware();
            this.setupRoutes();
            DefaultSettingsCheck.check().then(() => {
                ScheduledTasks.init();
                this.emit("appStarted");
                this.ready = true;
                console.log("Server ready");
            });
        }).catch(error => console.log("TypeORM connection error: ", error));
    }

    private exitOnSignal(): void {
        console.log("Received exit signal...");
        if (this.server) {
            console.log("Closing http listener...");
            this.server.close();
        }
        if (this.dbConnection) {
            console.log("Closing database connection...");
            this.dbConnection.close().then(() => {
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    }

    private handleUnknownException(e: Error): void {
        console.error("Unhandled exception: %s", e);
    }

    private handleUnknownRejection(reason: Error, p: Promise<any>): void {
        console.error("Unhandled rejection: %s", reason);
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
        this.express.use('/', router);
        this.express.use('/api/v1/auth', AuthRouter);
        this.express.use('/api/v1/broker', BrokerRouter);
        this.express.use('/api/v1/brokerproductvariant', BrokerProductVariantRouter);
        this.express.use('/api/v1/comment', CommentRouter);
        this.express.use('/api/v1/licensekey', LicenseKeyRouter);
        this.express.use('/api/v1/mailtemplate', MailTemplateRouter);
        this.express.use('/api/v1/purchaseitem', PurchaseItemRouter);
        this.express.use('/api/v1/ordernotification', OrderNotificationRouter);
        this.express.use('/api/v1/person', PersonRouter);
        this.express.use('/api/v1/purchase', PurchaseRouter);
        this.express.use('/api/v1/product', ProductRouter);
        this.express.use('/api/v1/productvariant', ProductVariantRouter);
        this.express.use('/api/v1/supportticket', SupportTicketRouter);
        this.express.use('/api/v1/systemsetting', SystemSettingRouter);
        this.express.use('/api/v1/topleveldomain', TopLevelDomainRouter);
        this.addStaticFilesRoutes();
    }

    private addStaticFilesRoutes(): void {
        let router = express.Router();

        let staticFilesPaths = [
            path.join(__dirname, "../www/dist"),
            path.join(__dirname, "../www/src")
        ];
        staticFilesPaths.forEach(staticFilesPath => {
            console.log("Adding static files path %s", staticFilesPath);
            this.express.use(express.static(staticFilesPath));
        });

        // node_modules
        let nodePath = path.join(__dirname, "../www/node_modules");
        console.log("Adding route to node_modules in %s", nodePath);
        this.express.use('/node_modules', express.static(nodePath));

        // HTML5 Push State
        let fallbackPath = path.join(__dirname, "../www/dist/index.html");
        if (this.devEnvironment) {
            fallbackPath = path.join(__dirname, "../www/src/index.html");
        }
        console.log("Adding fallback route to index.html as %s", fallbackPath);
        this.express.get('*', function(request, response) {
            response.sendFile(fallbackPath);
        });
    }

    private async setupOrm(): Promise<Connection> {
        let config = Config.getInstance().get("database");
        let options: Object = {};
        Object.assign(options, config.driver, {
            entities: [
                __dirname + "/entity/*.js",
                __dirname + "/entity/*.ts"
            ],
            logging: config.logging,
            synchronize: true
        });
        return createConnection(<ConnectionOptions>options);
    }

    public static getInstance(): App {
        return App.INSTANCE;
    }
}
