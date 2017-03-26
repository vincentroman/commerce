import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/';

describe('GET '+endpoint, () => {
    before(done => {
        if (App.getInstance().ready) { done(); }
        App.getInstance().on("appStarted", () => { done(); });
    });

    it('should be json', () => {
        return chai.request(App.getInstance().express).get(endpoint)
        .then(res => {
            expect(res.type).to.eql('application/json');
        });
    });

    it('should have a message prop', () => {
        return chai.request(App.getInstance().express).get(endpoint)
        .then(res => {
            expect(res.body.message).to.eql('Hello World!');
        });
    });
});
