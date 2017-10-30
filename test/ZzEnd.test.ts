import * as mocha from 'mocha';

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';

describe("Tear down test suite", () => {
    describe("tear down the test suite", () => {
        it("Should finish the test suite", () => {
            process.kill(process.pid, "SIGINT");
        });
    });
});
