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
                recipientEmail: "gmail.user@gmail.com",
                senderEmail: "gmail.user@gmail.com",
                subject: "Hallo Welt",
                text: ""
            });
        });
    });
});