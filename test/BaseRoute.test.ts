import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/login';

describe('GET '+endpoint, () => {
    before(done => {
        if (App.getInstance().ready) { done(); }
        App.getInstance().on("appStarted", () => { done(); });
    });

    it('should be html', () => {
        return chai.request(App.getInstance().express).get(endpoint)
        .then(res => {
            expect(res).to.have.header('content-type', /^text\/html/);
        });
    });
});
