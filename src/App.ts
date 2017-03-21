import * as express from 'express';
import * as bodyParser from 'body-parser';

import ProductRouter from './routes/ProductRouter';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.setupMiddleware();
        this.setupRoutes();
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
}

export default new App().express;
