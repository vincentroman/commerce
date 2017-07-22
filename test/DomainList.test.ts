import * as mocha from 'mocha';
import * as chai from 'chai';

import { DomainList } from "../src/util/DomainList";

const expect = chai.expect;

describe("DomainList", () => {
    describe("getRegex()", () => {
        it("Should generate correct regex", () => {
            let dl: DomainList = new DomainList();
            dl.addDomain("weweave.net");
            dl.addDomain("microsoft.de");
            let regex: RegExp = dl.getRegex();
            expect(regex.test("localhost")).to.be.true;
            expect(regex.test("dev.localhost")).to.be.true;
            expect(regex.test("somehost.local")).to.be.true;
            expect(regex.test("some.host.local")).to.be.true;
            expect(regex.test("weweave.net")).to.be.true;
            expect(regex.test("www.weweave.net")).to.be.true;
            expect(regex.test("microsoft.de")).to.be.true;
            expect(regex.test("some.sub.site.microsoft.de")).to.be.true;
            expect(regex.test("microsoft.com")).to.be.false;
            expect(regex.test("www.microsoft.com")).to.be.false;
        });
    });

    describe("testGetTldFromDomain()", () => {
        it("Should extract the correct portion of a domain", () => {
            expect(DomainList.getTldFromDomain("de")).to.equal("");
            expect(DomainList.getTldFromDomain("test.de")).to.equal("de");
            expect(DomainList.getTldFromDomain("test.com")).to.equal("com");
            expect(DomainList.getTldFromDomain("testwebsite.accident-investigation.aero")).to.equal("accident-investigation.aero");
            expect(DomainList.getTldFromDomain("test.co.uk")).to.equal("co.uk");
            expect(DomainList.getTldFromDomain("test.ap-southeast-2.compute.amazonaws.com"))
                .to.equal("ap-southeast-2.compute.amazonaws.com");
            expect(DomainList.getTldFromDomain(".")).to.equal("");
        });
    });

    describe("addDomain()", () => {
        it("Should throw an Error for invalid subdomain levels", () => {
            let dl: DomainList = new DomainList();
            expect(dl.addDomain.bind(dl, "test.weweave.net")).to.throw(Error);
        });

        it("Should throw an Error for missing TLD", () => {
            let dl: DomainList = new DomainList();
            expect(dl.addDomain.bind(dl, "weweave")).to.throw(Error);
        });

        it("Should throw an Error for empty domain", () => {
            let dl: DomainList = new DomainList();
            expect(dl.addDomain.bind(dl, "")).to.throw(Error);
        });

        it("Should throw an Error for invalid characters in domain", () => {
            let dl: DomainList = new DomainList();
            expect(dl.addDomain.bind(dl, "w[ewea]ve.net")).to.throw(Error);
            expect(dl.addDomain.bind(dl, "w(ewea)ve.net")).to.throw(Error);
        });
    });

    describe("extractDomains()", () => {
        it("Should extract the correct domain names", () => {
            let dl: DomainList = new DomainList();
            dl.addDomain("weweave.net");
            dl.addDomain("microsoft.de");
            let regex: RegExp = dl.getRegex();
            dl = new DomainList(undefined, regex);
            let domains = dl.domains;
            expect(domains.length).to.equal(4);
            expect(domains[0]).to.equal("localhost");
            expect(domains[1]).to.equal("*.local");
            expect(domains[2]).to.equal("*.weweave.net");
            expect(domains[3]).to.equal("*.microsoft.de");
        });
    });
});
