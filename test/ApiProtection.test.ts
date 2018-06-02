import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { App } from '../src/App';
import { TestUtil } from "./TestUtil";
import { Container } from "typedi";
import { DefaultSettingsCheck } from "../src/util/DefaultSettingsCheck";
import { PersonDao } from "../src/dao/PersonDao";

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Protection', () => {
    let jwtAdmin: string;
    let jwtCustomer: string;

    before(done => TestUtil.waitForAppToStartAndLoginAdmin((result) => {
        jwtAdmin = result;
        TestUtil.createCustomerUser("customer@customer.local", "customer").then(customerUser => {
            TestUtil.authGetJwt("customer@customer.local", "customer").then(result => {
                jwtCustomer = result;
                done();
            });
        });
    }));

    after(done => {
        Container.get(PersonDao).removeAll().then(() => {
            DefaultSettingsCheck.check().then(() => done());
        });
    });

    describe('Publicly available endpoints should be reachable without auth', () => {
        callUrls([
            {url: "/api/v1/auth/login", expectForbidden: false, method: "post"},
            {url: "/api/v1/auth/pwreset", expectForbidden: false, method: "post"},
            {url: "/api/v1/ordernotification/abcdef", expectForbidden: false, method: "post"},
            {url: "/api/v1/product/abcdef", expectForbidden: false, method: "get"},
            {url: "/api/v1/product/", expectForbidden: false, method: "get"},
            {url: "/api/v1/productvariant/abcdef", expectForbidden: false, method: "get"},
            {url: "/api/v1/brokerproductvariant/abcdef/list", expectForbidden: false, method: "get"},
            {url: "/api/v1/systemsetting/public", expectForbidden: false, method: "get"},
            {url: "/api/v1/systemsetting/version", expectForbidden: false, method: "get"}
        ]);
    });

    describe('Protected endpoints should not be reachable without auth', () => {
        callUrls([
            {url: "/api/v1/auth/logout", expectForbidden: true, method: "post"},

            {url: "/api/v1/broker/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/broker/", expectForbidden: true, method: "get"},
            {url: "/api/v1/broker/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/broker/", expectForbidden: true, method: "post"},
            {url: "/api/v1/broker/abcef", expectForbidden: true, method: "put"},

            {url: "/api/v1/brokerproductvariant/abcdef/ghijk/get", expectForbidden: true, method: "get"},
            {url: "/api/v1/brokerproductvariant/abcdef/list", expectForbidden: false, method: "get"},
            {url: "/api/v1/brokerproductvariant/abcdef/save", expectForbidden: true, method: "put"},

            {url: "/api/v1/comment/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/comment/", expectForbidden: true, method: "get"},
            {url: "/api/v1/comment/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/comment/", expectForbidden: true, method: "post"},
            {url: "/api/v1/comment/abcdef", expectForbidden: true, method: "put"},

            {url: "/api/v1/licensekey/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/licensekey/", expectForbidden: true, method: "get"},
            {url: "/api/v1/licensekey/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/licensekey/", expectForbidden: true, method: "post"},
            {url: "/api/v1/licensekey/abcdef", expectForbidden: true, method: "put"},
            {url: "/api/v1/licensekey/my", expectForbidden: true, method: "get"},
            {url: "/api/v1/licensekey/assign", expectForbidden: true, method: "put"},
            {url: "/api/v1/licensekey/generate", expectForbidden: true, method: "post"},
            {url: "/api/v1/licensekey/abcdef/issue", expectForbidden: true, method: "post"},

            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/mailtemplate/", expectForbidden: true, method: "get"},
            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/mailtemplate/", expectForbidden: true, method: "post"},
            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: true, method: "put"},

            {url: "/api/v1/person/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/person/", expectForbidden: true, method: "get"},
            {url: "/api/v1/person/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/person/", expectForbidden: true, method: "post"},
            {url: "/api/v1/person/abcdef", expectForbidden: true, method: "put"},
            {url: "/api/v1/person/suggest", expectForbidden: true, method: "get"},
            {url: "/api/v1/person/me", expectForbidden: true, method: "get"},
            
            {url: "/api/v1/purchase/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/purchase/", expectForbidden: true, method: "get"},
            {url: "/api/v1/purchase/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/purchase/", expectForbidden: true, method: "post"},
            {url: "/api/v1/purchase/abcdef", expectForbidden: true, method: "put"},
            {url: "/api/v1/purchase/abcdef/items", expectForbidden: true, method: "get"},

            {url: "/api/v1/product/abcdef", expectForbidden: false, method: "get"},
            {url: "/api/v1/product/", expectForbidden: false, method: "get"},
            {url: "/api/v1/product/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/product/", expectForbidden: true, method: "post"},
            {url: "/api/v1/product/abcdef", expectForbidden: true, method: "put"},
            {url: "/api/v1/product/abcdef/variants", expectForbidden: false, method: "get"},

            {url: "/api/v1/productvariant/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/productvariant/", expectForbidden: true, method: "get"},
            {url: "/api/v1/productvariant/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/productvariant/", expectForbidden: true, method: "post"},
            {url: "/api/v1/productvariant/abcdef", expectForbidden: true, method: "put"},

            {url: "/api/v1/supportticket/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/supportticket/", expectForbidden: true, method: "post"},
            {url: "/api/v1/supportticket/abcdef", expectForbidden: true, method: "put"},
            {url: "/api/v1/supportticket/my", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/abcdef/comments", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/abcdef/comments", expectForbidden: true, method: "post"},
            {url: "/api/v1/supportticket/assign", expectForbidden: true, method: "put"},
            {url: "/api/v1/supportticket/abcdef/open", expectForbidden: true, method: "post"},
            {url: "/api/v1/supportticket/abcdef/close", expectForbidden: true, method: "post"},

            {url: "/api/v1/systemsetting/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/systemsetting/", expectForbidden: true, method: "get"},
            {url: "/api/v1/systemsetting/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/systemsetting/", expectForbidden: true, method: "post"},
            {url: "/api/v1/systemsetting/abcdef", expectForbidden: true, method: "put"},

            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/topleveldomain/", expectForbidden: true, method: "get"},
            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/topleveldomain/", expectForbidden: true, method: "post"},
            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: true, method: "put"}
        ]);
    });

    describe('Admin endpoints should be reachable for admins', () => {
        callUrls([
            {url: "/api/v1/broker/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/broker/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/broker/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/broker/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/broker/abcdef", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/brokerproductvariant/abcdef/ghijk/get", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/brokerproductvariant/abcdef/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/brokerproductvariant/abcdef/save", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/person/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/person/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/person/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/person/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/person/abcdef", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/person/suggest", expectForbidden: false, method: "get", jwt: "admin"},

            {url: "/api/v1/comment/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/comment/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/comment/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/comment/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/comment/abcdef", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/licensekey/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/licensekey/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/licensekey/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/licensekey/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/licensekey/abcdef", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/licensekey/assign", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/licensekey/generate", expectForbidden: false, method: "post", jwt: "admin"},

            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/mailtemplate/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/mailtemplate/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/purchase/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/purchase/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/purchase/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/purchase/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/purchase/abcdef", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/purchase/abcdef/items", expectForbidden: false, method: "get", jwt: "admin"},

            {url: "/api/v1/product/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/product/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/product/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/product/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/product/abcdef", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/product/abcdef/variants", expectForbidden: false, method: "get", jwt: "admin"},

            {url: "/api/v1/productvariant/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/productvariant/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/productvariant/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/productvariant/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/productvariant/abcdef", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/supportticket/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/supportticket/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/supportticket/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/supportticket/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/supportticket/abcdef", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/supportticket/assign", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/systemsetting/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/systemsetting/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/systemsetting/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/systemsetting/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/systemsetting/abcdef", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/topleveldomain/", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/topleveldomain/", expectForbidden: false, method: "post", jwt: "admin"},
            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: false, method: "put", jwt: "admin"}
        ]);
    });

    describe('Admin endpoints should not be reachable for customers', () => {
        callUrls([
            {url: "/api/v1/broker/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/broker/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/broker/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/broker/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/broker/abcdef", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/brokerproductvariant/abcdef/ghijk/get", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/brokerproductvariant/abcdef/list", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/brokerproductvariant/abcdef/save", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/person/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/person/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/person/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/person/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/person/abcdef", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/person/suggest", expectForbidden: true, method: "get", jwt: "customer"},

            {url: "/api/v1/comment/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/comment/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/comment/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/comment/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/comment/abcdef", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/licensekey/abcdef", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/licensekey/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/licensekey/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/licensekey/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/licensekey/abcdef", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/licensekey/assign", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/licensekey/generate", expectForbidden: true, method: "post", jwt: "customer"},

            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/mailtemplate/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/mailtemplate/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/mailtemplate/abcdef", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/purchase/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/purchase/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/purchase/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/purchase/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/purchase/abcdef", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/purchase/abcdef/items", expectForbidden: true, method: "get", jwt: "customer"},

            {url: "/api/v1/product/abcdef", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/product/", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/product/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/product/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/product/abcdef", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/product/abcdef/variants", expectForbidden: false, method: "get", jwt: "customer"},

            {url: "/api/v1/productvariant/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/productvariant/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/productvariant/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/productvariant/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/productvariant/abcdef", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/supportticket/abcdef", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/supportticket/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/supportticket/abcdef", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/supportticket/assign", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/systemsetting/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/systemsetting/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/systemsetting/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/systemsetting/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/systemsetting/abcdef", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/topleveldomain/", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/topleveldomain/", expectForbidden: true, method: "post", jwt: "customer"},
            {url: "/api/v1/topleveldomain/abcdef", expectForbidden: true, method: "put", jwt: "customer"}
        ]);
    });

    describe('Customer endpoints should be reachable with a valid JWT', () => {
        callUrls([
            {url: "/api/v1/auth/logout", expectForbidden: false, method: "post", jwt: "customer"},

            {url: "/api/v1/licensekey/my", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/licensekey/abcdef", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/licensekey/abcdef/issue", expectForbidden: false, method: "post", jwt: "customer"},

            {url: "/api/v1/supportticket/my", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/abcdef", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/abcdef/comments", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/abcdef/open", expectForbidden: false, method: "post", jwt: "customer"},
            {url: "/api/v1/supportticket/abcdef/close", expectForbidden: false, method: "post", jwt: "customer"},
            {url: "/api/v1/supportticket/abcdef/addcomment", expectForbidden: false, method: "post", jwt: "customer"},

            {url: "/api/v1/person/me", expectForbidden: false, method: "get", jwt: "customer"}
        ]);
    });

    function callUrls(urls: any[]) {
        urls.forEach(item => {
            item.method = item.method.toUpperCase();
            it("Expecting " + item.method + " " + item.url + " to " + (item.expectForbidden ? "" : "not ") + "be forbidden", (done) => {
                let handleResponse = function(res) {
                    if (item.expectForbidden) {
                        expect(res.status).to.equal(403);
                    } else {
                        expect(res.status).to.not.equal(403);
                    }
                    done();
                };
                let agent = chai.request(App.getInstance().express);
                let req;
                if (item.method === "POST") {
                    req = agent.post(item.url);
                } else if (item.method === "PUT") {
                    req = agent.put(item.url);
                } else if (item.method === "DELETE") {
                    req = agent.del(item.url);
                } else {
                    req = agent.get(item.url);
                }
                if (item.jwt) {
                    if (item.jwt.toLowerCase() === "customer") {
                        req = req.set("Authorization", "Bearer " + jwtCustomer);
                    } else if (item.jwt.toLowerCase() === "admin") {
                        req = req.set("Authorization", "Bearer " + jwtAdmin);
                    }
                }
                req.then((res) => handleResponse(res))
                    .catch((res) => handleResponse(res));
            });
        });
    }
});
