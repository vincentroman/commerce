import * as fs from "fs";
import * as path from 'path';

export class Config {
    private static INSTANCE: Config = new Config();
    private config: Object;

    constructor() {
        if (Config.INSTANCE) {
            throw new Error("Call Config.getInstance() instead!");
        }
        this.loadConfig();
    }

    public get(key: string): any {
        return this.config[key];
    }

    private loadConfig(): void {
        let filePath: string = path.join(process.cwd(), "./config.json");;
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
