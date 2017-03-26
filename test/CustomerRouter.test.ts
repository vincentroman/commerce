import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/api/v1/customer/';

describe('Router '+endpoint, () => {
    let putId: string;

    before(done => {
        if (App.getInstance().ready) { done(); }
        App.getInstance().on("appStarted", () => { done(); });
    });

    describe('GET '+endpoint+'list (before inserting any)', () => {
        it('should be an empty json array', () => {
            return chai.request(App.getInstance().express).get(endpoint+'list')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(0);
            });
        });
    });

    describe('PUT '+endpoint+'save', () => {
        it('should save a new customer', () => {
            let customer = {
                company: "weweave",
                firstname: "John",
                lastname: "Doe",
                email: "no-reply@weweave.net",
                country: "DE"
            };
            return chai.request(App.getInstance().express).put(endpoint+'save')
            .send(customer)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.be.string;
                putId = res.body.uuid;
            });
        });

        it('should should update an existing customer', () => {
            let customer = {
                uuid: putId,
                company: "some Company Ltd.",
                firstname: "Max",
                lastname: "Miller",
                email: "somewhere@weweave.net",
                country: "US"
            };
            return chai.request(App.getInstance().express).put(endpoint+'save')
            .send(customer)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.equal(putId);
            });
        });
    });

    describe('GET '+endpoint+'get', () => {
        it('should return the previously inserted customer', () => {
            return chai.request(App.getInstance().express).get(endpoint+'get/'+putId)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.equal(putId);
                expect(res.body.company).to.equal("some Company Ltd.");
                expect(res.body.firstname).to.equal("Max");
                expect(res.body.lastname).to.equal("Miller");
                expect(res.body.email).to.equal("somewhere@weweave.net");
                expect(res.body.country).to.equal("US");
                expect(res.body.createDate).to.be.string;
                expect(res.body.lastUpdate).to.be.string;
            });
        });
    });

    describe('GET '+endpoint+'list (after inserting one)', () => {
        it('should return the previously inserted customer', () => {
            return chai.request(App.getInstance().express).get(endpoint+'list')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(1);
                expect(res.body[0].uuid).to.equal(putId);
                expect(res.body[0].company).to.equal("some Company Ltd.");
            });
        });
    });

    describe('DELETE '+endpoint+'delete', () => {
        it('should delete the previously inserted customer', () => {
            return chai.request(App.getInstance().express).del(endpoint+'delete/'+putId)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
            });
        });
    });

    describe('GET '+endpoint+'list (after deleting)', () => {
        it('should be an empty json array', () => {
            return chai.request(App.getInstance().express).get(endpoint+'list')
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
            .catch(res => {
                expect(res.status).to.equal(404);
            });
        });
    });
});
