import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { App } from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/login';

describe('GET '+endpoint, () => {
    before(done => {
        if (App.getInstance().ready) { done(); }
        App.getInstance().on("appStarted", () => { done(); });
    });

    xit('should be html', () => {
        return chai.request(App.getInstance().express).get(endpoint)
        .then(res => {
            expect(res).to.have.header('content-type', /^text\/html/);
        });
    });
});
