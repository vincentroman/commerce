import { Router, Request, Response, NextFunction } from 'express';

class ProductRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    private init() {
        this.router.get('/', this.getAll);
    }

    private getAll(req: Request, res: Response, next: NextFunction): void {
        let all = ['1abc'];
        res.send(all);
    }
}

export default new ProductRouter().router;
