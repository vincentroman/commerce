import * as mocha from 'mocha';
import * as chai from 'chai';
import { App } from '../src/App';
import { Person } from '../src/entity/Person';

const expect = chai.expect;

describe("Person", () => {
    describe("isPasswordValid", () => {
        it("should correctly validate passwords", () => {
            let person: Person = new Person();
            person.setPlainPassword("thisIsATest1234");
            expect(person.isPasswordValid("test1234")).to.be.false;
            expect(person.isPasswordValid("thisIsATest1234")).to.be.true;
        });
    });
});
