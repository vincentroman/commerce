import { User } from "../src/entity/User";
import { Container } from "typedi";
import { UserDao } from "../src/dao/UserDao";
import { App } from "../src/App";
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { Customer } from "../src/entity/Customer";
import { CustomerDao } from "../src/dao/CustomerDao";

chai.use(chaiHttp);

export class TestUtil {
    public static waitForAppToStart(cb) {
        if (App.getInstance().ready) { cb(); }
        App.getInstance().on("appStarted", () => cb());
    }

    public static waitForAppToStartAndLoginAdmin(cb) {
        let initJwt = function() {
            TestUtil.authAdminGetJwt().then(result => {
                cb(result);
            }).catch(e => console.error(e));
        };
        TestUtil.waitForAppToStart(initJwt);
    }

    public static authAdminGetJwt(): Promise<string> {
        return TestUtil.authGetJwt("admin@admin.local", "admin");
    }

    public static authGetJwt(email: string, password: string): Promise<string> {
        let payload = {
            email: email,
            password: password
        };
        return new Promise((resolve, reject) => {
            chai.request(App.getInstance().express).post("/api/v1/auth/login")
                .set('Content-Type', 'application/json')
                .send(payload)
                .then(res => resolve(res["text"]))
                .catch(e => reject(e));
        });
    }

    public static createCustomerUser(email: string, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            let customer: Customer = new Customer();
            customer.email = email;
            customer.firstname = "Sample";
            customer.lastname = "Sample";
            Container.get(CustomerDao).save(customer).then(customer => {
                let user: User = new User();
                user.email = email;
                user.customer = customer;
                user.roleCustomer = true;
                user.setPlainPassword(password).then(() => {
                    Container.get(UserDao).save(user).then(user => resolve(user));
                });
            });
        });
    }
}