import { Container } from "typedi";
import { App } from "../src/App";
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { Person } from "../src/entity/Person";
import { PersonDao } from "../src/dao/PersonDao";

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

    public static createCustomerUser(email: string, password: string): Promise<Person> {
        return new Promise((resolve, reject) => {
            let customer: Person = new Person();
            customer.email = email;
            customer.firstname = "Sample";
            customer.lastname = "Sample";
            customer.roleCustomer = true;
            customer.setPlainPassword(password);
            Container.get(PersonDao).save(customer).then(customer => resolve(customer));
        });
    }
}
