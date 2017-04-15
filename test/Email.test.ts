import * as mocha from 'mocha';
import * as chai from 'chai';

import { Config } from '../src/util/Config';
import { Email } from "../src/util/Email";

Config.getInstance().loadTestConfig();
const expect = chai.expect;

describe("Email", () => {
    describe("send()", () => {
        xit("Should send an email successfully", () => {
            return Email.send({
                recipient: {
                    email: "gmail.user@gmail.com"
                },
                sender: {
                    email: "gmail.user@gmail.com"
                },
                subject: "Hallo Welt",
                text: ""
            });
        });
    });

    describe("renderParamString()", () => {
        it("Should fill in params correctly", () => {
            let params = {
                firstname: "John",
                lastname: "Doe"
            };
            let s = "Hello {firstname} {lastname}!";
            let result = Email.renderParamString(s, params);
            expect(result).to.equal("Hello John Doe!");
        });
    });
});