import * as http from 'http';
import * as debug from 'debug';
import { App } from './App';
import { DemoSetup } from './util/DemoSetup';
import { Config } from './util/Config';

console.log("Starting server...");

debug('ts-express:server');

const port = normalizePort(process.env.PORT || 3000);
const demoMode = (process.env.DEMO && process.env.DEMO === "1");

if (demoMode) {
    console.log("Demo mode enabled");
    Config.getInstance().loadDemoConfig();
}

console.log("Setting port to %d...", port);
App.getInstance().express.set('port', port);
App.getInstance().start();
App.getInstance().on("appStarted", onAppStarted);

const server = http.createServer(App.getInstance().express);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
App.getInstance().server = server;

function normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    } else if (port >= 0) {
        return port;
    } else {
        return false;
    }
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') {
        throw error;
    }
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch(error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}

function onAppStarted(): void {
    if (demoMode) {
        console.log("Setting up demo data...");
        let demo: DemoSetup = new DemoSetup();
        demo.setup().then(() => {
            console.log("Demo data successfully created");
        });
    }
}
