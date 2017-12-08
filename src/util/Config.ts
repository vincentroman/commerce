import * as fs from "fs";
import * as path from 'path';

export class Config {
    private static INSTANCE: Config = new Config();
    private config: Object;

    constructor() {
        if (Config.INSTANCE) {
            throw new Error("Call Config.getInstance() instead!");
        }
        let filePath: string = path.join(process.cwd(), "./config.json");
        this.loadConfig(filePath);
    }

    public get(key: string): any {
        return this.config[key];
    }

    public loadTestConfig(): void {
        let filePath: string = path.join(process.cwd(), "./test/config.test.json");
        this.loadConfig(filePath);
    }

    public loadDemoConfig(): void {
        let filePath: string = path.join(process.cwd(), "./res/config.demo.json");
        this.loadConfig(filePath);
    }

    private loadConfig(filePath: string): void {
        console.log("Loading config from " + filePath);
        let buffer: string = fs.readFileSync(filePath, "utf8");
        try {
            this.config = JSON.parse(buffer);
        } catch (e) {
            throw new Error("Could not parse config.json");
        }
    }

    public static getInstance(): Config {
        return Config.INSTANCE;
    }
}
