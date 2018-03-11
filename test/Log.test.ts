import * as mocha from 'mocha';
import * as chai from 'chai';
import { Container } from "typedi";
import { App } from '../src/App';
import { Log } from '../src/util/Log';
import { LogEntryDao } from '../src/dao/LogEntryDao';
import { LogEntryLevel, LogEntryType } from '../src/entity/LogEntry';

const expect = chai.expect;

describe("Log", () => {
    afterEach(done => {
        Container.get(LogEntryDao).removeAll().then(() => {
            done();
        }).catch(e => done(e));
    });

    describe("log messages", () => {
        it("should log info messages correctly", (done) => {
            Log.info("this is an info message").then(entry => {
                expect(entry.id).to.be.not.undefined;
                expect(entry.id).to.be.not.null;
                expect(entry.uuid).to.be.not.undefined;
                expect(entry.uuid).to.be.not.null;
                expect(entry.uuid).to.be.not.empty;
                expect(entry.level).to.equal(LogEntryLevel.Info);
                expect(entry.type).to.equal(LogEntryType.Undefined);
                done();
            }).catch(e => done(e));
        });

        it("should log warning messages correctly", (done) => {
            Log.warn("this is a warning message").then(entry => {
                expect(entry.id).to.be.not.undefined;
                expect(entry.id).to.be.not.null;
                expect(entry.uuid).to.be.not.undefined;
                expect(entry.uuid).to.be.not.null;
                expect(entry.uuid).to.be.not.empty;
                expect(entry.level).to.equal(LogEntryLevel.Warning);
                expect(entry.type).to.equal(LogEntryType.Undefined);
                done();
            }).catch(e => done(e));
        });

        it("should log error messages correctly", (done) => {
            Log.error("this is an error message").then(entry => {
                expect(entry.id).to.be.not.undefined;
                expect(entry.id).to.be.not.null;
                expect(entry.uuid).to.be.not.undefined;
                expect(entry.uuid).to.be.not.null;
                expect(entry.uuid).to.be.not.empty;
                expect(entry.level).to.equal(LogEntryLevel.Error);
                expect(entry.type).to.equal(LogEntryType.Undefined);
                done();
            }).catch(e => done(e));
        });

        it("should log messages with type correctly", (done) => {
            Log.info("this is an info message with type", LogEntryType.OptIn).then(entry => {
                expect(entry.id).to.be.not.undefined;
                expect(entry.id).to.be.not.null;
                expect(entry.uuid).to.be.not.undefined;
                expect(entry.uuid).to.be.not.null;
                expect(entry.uuid).to.be.not.empty;
                expect(entry.level).to.equal(LogEntryLevel.Info);
                expect(entry.type).to.equal(LogEntryType.OptIn);
                done();
            }).catch(e => done(e));
        });
    });
});
