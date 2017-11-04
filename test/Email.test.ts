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
            let s = "Hello {{firstname}} {{lastname}}!";
            let result = Email.renderParamString(s, params);
            expect(result).to.equal("Hello John Doe!");
        });

        it("should work well for a real-world subject", () => {
            let params = {
                firstname: "John",
                lastname: "Doe",
                siteUrl: "https://weweave.net",
                daysRemaining: 30,
                product: "DNN Google Analytics Advanced"
            };
            let s = "Your License Key for {{product}} will expire in {{daysRemaining}} days";
            let result = Email.renderParamString(s, params);
            expect(result).to.equal("Your License Key for DNN Google Analytics Advanced will expire in 30 days");
        });

        it("should handle null params", () => {
            let payload: any = {
                daysRemainings: 5
            };
            let params = {
                firstname: "John",
                lastname: "Doe",
                siteUrl: "https://weweave.net",
                daysRemaining: payload.daysRemaining,
                product: "DNN Google Analytics Advanced"
            };
            let s = "Your License Key for {{product}} will expire in {{daysRemaining}} days";
            let result = Email.renderParamString(s, params);
            expect(result).to.equal("Your License Key for DNN Google Analytics Advanced will expire in undefined days");
        });
    });
});
