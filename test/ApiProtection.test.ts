import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';
import { TestUtil } from "./TestUtil";
import { Container } from "typedi";
import { UserDao } from "../src/dao/UserDao";
import { CustomerDao } from "../src/dao/CustomerDao";
import { DefaultSettingsCheck } from "../src/util/DefaultSettingsCheck";

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
        Container.get(UserDao).removeAll().then(() => {
            Container.get(CustomerDao).removeAll().then(() => {
                DefaultSettingsCheck.check().then(() => done());
            });
        });
    });

    describe('Publicly available endpoints should be reachable without auth', () => {
        callUrls([
            {url: "/api/v1/auth/login", expectForbidden: false, method: "post"},
            {url: "/api/v1/auth/pwreset", expectForbidden: false, method: "post"},
            {url: "/api/v1/ordernotification/abcdef", expectForbidden: false, method: "post"}
        ]);
    });

    describe('Protected endpoints should not be reachable without auth', () => {
        callUrls([
            {url: "/api/v1/auth/logout", expectForbidden: true, method: "post"},

            {url: "/api/v1/broker/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/broker/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/broker/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/broker/save", expectForbidden: true, method: "put"},

            {url: "/api/v1/brokerproductvariant/abcdef/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/brokerproductvariant/abcdef/save", expectForbidden: true, method: "put"},

            {url: "/api/v1/customer/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/customer/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/customer/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/customer/save", expectForbidden: true, method: "put"},
            {url: "/api/v1/customer/suggest", expectForbidden: true, method: "get"},

            {url: "/api/v1/comment/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/comment/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/comment/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/comment/save", expectForbidden: true, method: "put"},

            {url: "/api/v1/licensekey/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/licensekey/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/licensekey/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/licensekey/save", expectForbidden: true, method: "put"},
            {url: "/api/v1/licensekey/my", expectForbidden: true, method: "get"},
            {url: "/api/v1/licensekey/getmyone/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/licensekey/assign", expectForbidden: true, method: "put"},
            {url: "/api/v1/licensekey/generate", expectForbidden: true, method: "post"},
            {url: "/api/v1/licensekey/issue/abcdef", expectForbidden: true, method: "post"},

            {url: "/api/v1/mailtemplate/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/mailtemplate/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/mailtemplate/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/mailtemplate/save", expectForbidden: true, method: "put"},

            {url: "/api/v1/purchaseitem/abcdef/list", expectForbidden: true, method: "get"},

            {url: "/api/v1/purchase/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/purchase/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/purchase/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/purchase/save", expectForbidden: true, method: "put"},

            {url: "/api/v1/product/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/product/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/product/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/product/save", expectForbidden: true, method: "put"},

            {url: "/api/v1/productvariant/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/productvariant/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/productvariant/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/productvariant/save", expectForbidden: true, method: "put"},
            {url: "/api/v1/productvariant/list/abcdef", expectForbidden: true, method: "get"},

            {url: "/api/v1/supportticket/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/supportticket/save", expectForbidden: true, method: "put"},
            {url: "/api/v1/supportticket/my", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/getmyone/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/comments/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/supportticket/assign", expectForbidden: true, method: "put"},
            {url: "/api/v1/supportticket/open/abcdef", expectForbidden: true, method: "post"},
            {url: "/api/v1/supportticket/close/abcdef", expectForbidden: true, method: "post"},
            {url: "/api/v1/supportticket/addcomment/abcdef", expectForbidden: true, method: "post"},

            {url: "/api/v1/systemsetting/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/systemsetting/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/systemsetting/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/systemsetting/save", expectForbidden: true, method: "put"},

            {url: "/api/v1/user/get/abcdef", expectForbidden: true, method: "get"},
            {url: "/api/v1/user/list", expectForbidden: true, method: "get"},
            {url: "/api/v1/user/delete/abcdef", expectForbidden: true, method: "delete"},
            {url: "/api/v1/user/save", expectForbidden: true, method: "put"},
            {url: "/api/v1/user/me", expectForbidden: true, method: "get"}
        ]);
    });

    describe('Admin endpoints should be reachable for admins', () => {
        callUrls([
            {url: "/api/v1/broker/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/broker/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/broker/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/broker/save", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/brokerproductvariant/abcdef/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/brokerproductvariant/abcdef/save", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/customer/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/customer/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/customer/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/customer/save", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/customer/suggest", expectForbidden: false, method: "get", jwt: "admin"},

            {url: "/api/v1/comment/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/comment/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/comment/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/comment/save", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/licensekey/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/licensekey/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/licensekey/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/licensekey/save", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/licensekey/assign", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/licensekey/generate", expectForbidden: false, method: "post", jwt: "admin"},

            {url: "/api/v1/mailtemplate/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/mailtemplate/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/mailtemplate/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/mailtemplate/save", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/purchaseitem/abcdef/list", expectForbidden: false, method: "get", jwt: "admin"},

            {url: "/api/v1/purchase/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/purchase/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/purchase/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/purchase/save", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/product/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/product/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/product/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/product/save", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/productvariant/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/productvariant/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/productvariant/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/productvariant/save", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/productvariant/list/abcdef", expectForbidden: false, method: "get", jwt: "admin"},

            {url: "/api/v1/supportticket/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/supportticket/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/supportticket/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/supportticket/save", expectForbidden: false, method: "put", jwt: "admin"},
            {url: "/api/v1/supportticket/assign", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/systemsetting/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/systemsetting/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/systemsetting/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/systemsetting/save", expectForbidden: false, method: "put", jwt: "admin"},

            {url: "/api/v1/user/get/abcdef", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/user/list", expectForbidden: false, method: "get", jwt: "admin"},
            {url: "/api/v1/user/delete/abcdef", expectForbidden: false, method: "delete", jwt: "admin"},
            {url: "/api/v1/user/save", expectForbidden: false, method: "put", jwt: "admin"}
        ]);
    });

    describe('Admin endpoints should not be reachable for customers', () => {
        callUrls([
            {url: "/api/v1/broker/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/broker/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/broker/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/broker/save", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/brokerproductvariant/abcdef/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/brokerproductvariant/abcdef/save", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/customer/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/customer/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/customer/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/customer/save", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/customer/suggest", expectForbidden: true, method: "get", jwt: "customer"},

            {url: "/api/v1/comment/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/comment/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/comment/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/comment/save", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/licensekey/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/licensekey/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/licensekey/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/licensekey/save", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/licensekey/assign", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/licensekey/generate", expectForbidden: true, method: "post", jwt: "customer"},

            {url: "/api/v1/mailtemplate/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/mailtemplate/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/mailtemplate/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/mailtemplate/save", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/purchaseitem/abcdef/list", expectForbidden: true, method: "get", jwt: "customer"},

            {url: "/api/v1/purchase/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/purchase/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/purchase/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/purchase/save", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/product/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/product/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/product/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/product/save", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/productvariant/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/productvariant/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/productvariant/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/productvariant/save", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/productvariant/list/abcdef", expectForbidden: true, method: "get", jwt: "customer"},

            {url: "/api/v1/supportticket/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/supportticket/save", expectForbidden: true, method: "put", jwt: "customer"},
            {url: "/api/v1/supportticket/assign", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/systemsetting/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/systemsetting/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/systemsetting/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/systemsetting/save", expectForbidden: true, method: "put", jwt: "customer"},

            {url: "/api/v1/user/get/abcdef", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/user/list", expectForbidden: true, method: "get", jwt: "customer"},
            {url: "/api/v1/user/delete/abcdef", expectForbidden: true, method: "delete", jwt: "customer"},
            {url: "/api/v1/user/save", expectForbidden: true, method: "put", jwt: "customer"}
        ]);
    });

    describe('Customer endpoints should be reachable with a valid JWT', () => {
        callUrls([
            {url: "/api/v1/auth/logout", expectForbidden: false, method: "post", jwt: "customer"},

            {url: "/api/v1/licensekey/my", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/licensekey/getmyone/abcdef", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/licensekey/issue/abcdef", expectForbidden: false, method: "post", jwt: "customer"},

            {url: "/api/v1/supportticket/my", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/getmyone/abcdef", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/comments/abcdef", expectForbidden: false, method: "get", jwt: "customer"},
            {url: "/api/v1/supportticket/open/abcdef", expectForbidden: false, method: "post", jwt: "customer"},
            {url: "/api/v1/supportticket/close/abcdef", expectForbidden: false, method: "post", jwt: "customer"},
            {url: "/api/v1/supportticket/addcomment/abcdef", expectForbidden: false, method: "post", jwt: "customer"},

            {url: "/api/v1/user/me", expectForbidden: false, method: "get", jwt: "customer"}
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
