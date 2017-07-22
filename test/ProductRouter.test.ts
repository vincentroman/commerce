import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';
import { TestUtil } from "./TestUtil";

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/api/v1/product/';

describe('Router '+endpoint, () => {
    let putId: string;
    let jwt: string;

    before(done => TestUtil.waitForAppToStartAndLoginAdmin((result) => {
        jwt = result;
        done();
    }));

    describe('GET '+endpoint+'list (before inserting any)', () => {
        it('should be an empty json array', () => {
            return chai.request(App.getInstance().express).get(endpoint+'list')
            .set("Authorization", "Bearer " + jwt)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(0);
            });
        });
    });

    describe('PUT '+endpoint+'save', () => {
        it('should save a new product', () => {
            let product = {
                title: "Product A",
                licenseKeyIdentifier: "PA"
            };
            return chai.request(App.getInstance().express).put(endpoint+'save')
            .set("Authorization", "Bearer " + jwt)
            .send(product)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.be.string;
                putId = res.body.uuid;
            });
        });

        it('should should update an existing product', () => {
            let product = {
                uuid: putId,
                title: "Product B",
                licenseKeyIdentifier: "PB"
            };
            return chai.request(App.getInstance().express).put(endpoint+'save')
            .set("Authorization", "Bearer " + jwt)
            .send(product)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.equal(putId);
            });
        });
    });

    describe('GET '+endpoint+'get', () => {
        it('should return the previously inserted product', () => {
            return chai.request(App.getInstance().express).get(endpoint+'get/'+putId)
            .set("Authorization", "Bearer " + jwt)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.equal(putId);
                expect(res.body.title).to.equal("Product B");
            });
        });
    });

    describe('GET '+endpoint+'list (after inserting one)', () => {
        it('should return the previously inserted product', () => {
            return chai.request(App.getInstance().express).get(endpoint+'list')
            .set("Authorization", "Bearer " + jwt)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(1);
                expect(res.body[0].uuid).to.equal(putId);
                expect(res.body[0].title).to.equal("Product B");
            });
        });
    });

    describe('DELETE '+endpoint+'delete', () => {
        it('should delete the previously inserted product', () => {
            return chai.request(App.getInstance().express).del(endpoint+'delete/'+putId)
            .set("Authorization", "Bearer " + jwt)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
            });
        });
    });

    describe('GET '+endpoint+'list (after deleting)', () => {
        it('should be an empty json array', () => {
            return chai.request(App.getInstance().express).get(endpoint+'list')
            .set("Authorization", "Bearer " + jwt)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(0);
            });
        });
    });

    describe('GET '+endpoint+'get (after deleting)', () => {
        it('should return a 404', () => {
            return chai.request(App.getInstance().express).get(endpoint+'get/'+putId)
            .set("Authorization", "Bearer " + jwt)
            .catch(res => {
                expect(res.status).to.equal(404);
            });
        });
    });
});
