import * as mocha from 'mocha';
import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as objectMapper from 'object-mapper';

const expect = chai.expect;

describe("ObjectMapper", () => {
    it("Should map correctly for a DNN Store Structure", () => {
        let src: any = JSON.parse(fs.readFileSync(path.join(process.cwd(), "./test/res/dnnstore.json"), "utf8"));
        let map: any = JSON.parse(fs.readFileSync(path.join(process.cwd(), "./test/res/dnnstore.map.json"), "utf8"));
        let dest: any = objectMapper(src, map);
        expect(dest).to.be.not.null;
        expect(dest).to.be.an.instanceOf(Object);
        expect(dest.id).to.equal(src.InvoiceID);
        expect(dest.customer).to.be.not.null;
        expect(dest.customer).to.be.an.instanceOf(Object);
        expect(dest.customer.firstname).to.equal(src.BillToFirstName);
        expect(dest.customer.lastname).to.equal(src.BillToLastName);
        expect(dest.customer.email).to.equal(src.BillToEmail);
        expect(dest.items).to.be.not.null;
        expect(dest.items).to.be.an.instanceOf(Array);
        expect(dest.items).to.have.lengthOf(1);
        expect(dest.items[0].id).to.equal(src.OptionID);
        expect(dest.items[0].quantity).to.equal(src.Quantity);
    });

    it("Should map correctly for a FastSpring Structure", () => {
        let src: any = JSON.parse(fs.readFileSync(path.join(process.cwd(), "./test/res/fastspring.json"), "utf8"));
        let map: any = JSON.parse(fs.readFileSync(path.join(process.cwd(), "./test/res/fastspring.map.json"), "utf8"));
        let dest: any = objectMapper(src, map);
        expect(dest).to.be.not.null;
        expect(dest).to.be.an.instanceOf(Object);
        expect(dest.id).to.equal(src.id);
        expect(dest.customer).to.be.not.null;
        expect(dest.customer).to.be.an.instanceOf(Object);
        expect(dest.customer.firstname).to.equal(src.customer.firstName);
        expect(dest.customer.lastname).to.equal(src.customer.lastName);
        expect(dest.customer.company).to.equal(src.customer.company);
        expect(dest.customer.email).to.equal(src.customer.email);
        expect(dest.items).to.be.not.null;
        expect(dest.items).to.be.an.instanceOf(Array);
        expect(dest.items).to.have.lengthOf(1);
        expect(dest.items[0].id).to.equal(src.items[0].productName);
        expect(dest.items[0].quantity).to.equal(src.items[0].quantity);
    });
});

