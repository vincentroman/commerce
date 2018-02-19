import * as mocha from 'mocha';
import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chaiHttp = require('chai-http');
import { App } from '../src/App';
import { TestUtil } from "./TestUtil";

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/api/v1/systemsetting/';

describe('Router '+endpoint, () => {
    before(done => TestUtil.waitForAppToStartAndLoginAdmin((result) => {
        done();
    }));

    after(done => {
        done();
    });

    describe('GET '+endpoint+'version', () => {
        it('should return the correct version as plaintext', () => {
            let version: string = fs.readFileSync(path.join(process.cwd(), "./VERSION"), "utf8");
            return chai.request(App.getInstance().express).get(endpoint + "/version")
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.text;
                expect(res.text).to.equal(version);
            });
        });
    });

    describe('GET '+endpoint+'public', () => {
        it('should return the publicly available parameters', () => {
            let version: number = parseInt(fs.readFileSync(path.join(process.cwd(), "./VERSION"), "utf8"), 10);
            return chai.request(App.getInstance().express).get(endpoint + "/public")
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.version).to.equal(version);
                expect(res.body.siteImprintUrl).to.be.empty;
                expect(res.body.sitePrivacyPolicyUrl).to.be.empty;
                expect(res.body.siteContactUrl).to.be.empty;
            });
        });
    });
});
