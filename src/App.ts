import "reflect-metadata";
import * as EventEmitter from "events";
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as fs from 'fs';
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { Config } from './util/Config';
import { DefaultSettingsCheck } from "./util/DefaultSettingsCheck";
import { Response, Request, NextFunction } from 'express';

import AuthRouter from './router/AuthRouter';
import BrokerRouter from './router/BrokerRouter';
import CommentRouter from './router/CommentRouter';
import LicenseKeyRouter from './router/LicenseKeyRouter';
import MailTemplateRouter from './router/MailTemplateRouter';
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
    public version: number = 0;
    private devEnvironment: boolean = false;

    constructor() {
        super();
        if (App.INSTANCE) {
            throw new Error("Call App.getInstance() instead!");
        }
        this.version = parseInt(fs.readFileSync(path.join(process.cwd(), "./VERSION"), "utf8").trim(), 10);
        console.log("Commerce version = %d", this.version);
        this.devEnvironment = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "dev");
        console.log("Dev mode = %s", this.devEnvironment);
        process.on("SIGINT", this.exitOnSignal.bind(this));
        process.on("SIGTERM", this.exitOnSignal.bind(this));
        process.on("uncaughtException", this.handleUnknownException.bind(this));
        process.on("unhandledRejection", this.handleUnknownRejection.bind(this));
        this.express = express();
    }

    public start(): void {
        this.setupOrm().then(connection => {
            this.dbConnection = connection;
            this.express.set("trust proxy", true);
            this.setupMiddleware();
            this.setupRoutes();
            DefaultSettingsCheck.check().then(() => {
                ScheduledTasks.init();
                this.emit("appStarted");
                this.ready = true;
                console.log("Server ready");
            });
        }).catch(error => {
            console.log("TypeORM connection error: ", error);
            process.exit(-1);
        });
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
        let staticFilesPath = path.join(process.cwd(), "./www");
        if (fs.existsSync(path.join(process.cwd(), "./www/index.html"))) {
            console.log("Adding %s as static htdocs folder", staticFilesPath);
            let self = this;
            if (!this.devEnvironment) {
                this.express.get("/", function(request, response) {
                    self.sendFixedIndex(response);
                });
            }
            this.express.use(express.static(staticFilesPath));
            // HTML5 Push State
            this.express.get('*', function(request, response) {
                self.sendFixedIndex(response);
            });
        } else {
            console.log("Not adding %s as static htdocs folder because index.html not found in folder.", staticFilesPath);
        }
    }

    private sendFixedIndex(response: Response): void {
        let basePath = Config.getInstance().get("basePath");
        if (!basePath) {
            basePath = "/";
        }
        let fallbackPath = path.join(process.cwd(), "./www/index.html");
        let buffer: string = fs.readFileSync(fallbackPath, "utf8");
        buffer = buffer.replace('<base href="/"', '<base href="' + basePath + '"');
        response
            .status(200)
            .contentType("text/html; charset=UTF-8")
            .send(buffer);
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
