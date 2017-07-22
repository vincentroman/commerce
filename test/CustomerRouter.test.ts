import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';
import { CustomerDao } from "../src/dao/CustomerDao";
import { Container } from "typedi";
import { TestUtil } from "./TestUtil";

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/api/v1/customer/';

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
        it('should save a new customer', () => {
            let customer = {
                company: "weweave",
                firstname: "John",
                lastname: "Doe",
                email: "no-reply@weweave.net",
                country: "DE"
            };
            return chai.request(App.getInstance().express).put(endpoint+'save')
            .set("Authorization", "Bearer " + jwt)
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
            .set("Authorization", "Bearer " + jwt)
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
            .set("Authorization", "Bearer " + jwt)
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
            .set("Authorization", "Bearer " + jwt)
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

    describe('GET '+endpoint+'suggest', () => {
        let c1uuid = "";

        after(done => {
            let customerDao: CustomerDao = Container.get(CustomerDao);
            customerDao.removeAll().then(() => {
                done();
            });
        });

        it('should return an empty list without any customers', () => {
            return chai.request(App.getInstance().express).get(endpoint+'suggest')
            .set("Authorization", "Bearer " + jwt)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(Object.keys(res.body)).to.have.lengthOf(0);
            });
        });

        it('should return an ordered list of all customers without keyword and exclude', () => {
            let customer1 = {
                company: "weweave",
                firstname: "John",
                lastname: "Doe",
                email: "no-reply@weweave.net",
                country: "DE"
            };
            let customer2 = {
                company: "",
                firstname: "Andrew",
                lastname: "Miller",
                email: "no-reply@weweave.net",
                country: "DE"
            };
            let customer3 = {
                company: "",
                firstname: "Bernd",
                lastname: "Mustermann",
                email: "no-reply@mustermann.net",
                country: "DE"
            };
            return chai.request(App.getInstance().express).put(endpoint+'save')
            .set("Authorization", "Bearer " + jwt).send(customer1).then((res) => {
                c1uuid = res.body.uuid;
                return chai.request(App.getInstance().express).put(endpoint+'save')
                .set("Authorization", "Bearer " + jwt).send(customer2).then(() => {
                    return chai.request(App.getInstance().express).put(endpoint+'save')
                    .set("Authorization", "Bearer " + jwt).send(customer3).then(() => {
                        return chai.request(App.getInstance().express).get(endpoint+'suggest')
                        .set("Authorization", "Bearer " + jwt)
                            .then(res => {
                                expect(res.status).to.equal(200);
                                expect(res).to.be.json;
                                expect(res.body).to.be.an('object');
                                expect(Object.keys(res.body)).to.have.lengthOf(3);
                                let uuids = Object.keys(res.body);
                                expect(res.body[uuids[0]]).to.equal("Andrew Miller");
                                expect(res.body[uuids[1]]).to.equal("Bernd Mustermann");
                                expect(res.body[uuids[2]]).to.equal("John Doe (weweave)");
                            });
                    });
                });
            });
        });

        it('should return an ordered list (1) of a subset of customers with keyword provided', () => {
            return chai.request(App.getInstance().express).get(endpoint+'suggest?s=mill')
                    .set("Authorization", "Bearer " + jwt)
                    .then(res => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');
                        expect(Object.keys(res.body)).to.have.lengthOf(1);
                        let uuids = Object.keys(res.body);
                        expect(res.body[uuids[0]]).to.equal("Andrew Miller");
                    });
        });

        it('should return an ordered list (2) of a subset of customers with keyword provided', () => {
            return chai.request(App.getInstance().express).get(endpoint+'suggest?s=w')
                    .set("Authorization", "Bearer " + jwt)
                    .then(res => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');
                        expect(Object.keys(res.body)).to.have.lengthOf(2);
                        let uuids = Object.keys(res.body);
                        expect(res.body[uuids[0]]).to.equal("Andrew Miller");
                        expect(res.body[uuids[1]]).to.equal("John Doe (weweave)");
                    });
        });

        it('should return an ordered list of a subset of customers with exclude parameter provided', () => {
            return chai.request(App.getInstance().express).get(endpoint+'suggest?exclude='+c1uuid)
                    .set("Authorization", "Bearer " + jwt)
                    .then(res => {
                        expect(res.status).to.equal(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('object');
                        expect(Object.keys(res.body)).to.have.lengthOf(2);
                        let uuids = Object.keys(res.body);
                        expect(res.body[uuids[0]]).to.equal("Andrew Miller");
                        expect(res.body[uuids[1]]).to.equal("Bernd Mustermann");
                    });
        });
    });
});
