import * as mocha from 'mocha';
import * as chai from 'chai';
import { Container } from "typedi";
import { App } from '../src/App';
import * as moment from "moment";
import { PendingActionDao } from '../src/dao/PendingActionDao';
import { PendingAction, ActionType } from '../src/entity/PendingAction';

const expect = chai.expect;

describe("PendingActionDao", () => {
    afterEach(done => {
        Container.get(PendingActionDao).removeAll().then(() => {
            done();
        }).catch(e => done(e));
    });

    describe("delete expired pending actions", () => {
        it("should delete pending actions with expiry <= today", (done) => {
            let dao: PendingActionDao = Container.get(PendingActionDao);
            let action1: PendingAction = dao.createConfirmOrderAction();
            let action2: PendingAction = dao.createConfirmOrderAction();
            action1.expiry = moment().subtract(1, "days").toDate();
            action1.setPayload({});
            action2.expiry = moment().subtract(2, "days").toDate();
            action2.setPayload({});
            dao.save(action1).then(() => {
                dao.save(action2).then(() => {
                    dao.deleteExpired().then(num => {
                        expect(num).to.equal(2);
                        done();
                    }).catch(e => done(e));
                }).catch(e => done(e));
            }).catch(e => done(e));
        });

        it("should not delete pending actions with expiry >= today", (done) => {
            let dao: PendingActionDao = Container.get(PendingActionDao);
            let action: PendingAction = dao.createConfirmOrderAction();
            action.setPayload({});
            dao.save(action).then(() => {
                dao.deleteExpired().then(num => {
                    expect(num).to.equal(0);
                    done();
                }).catch(e => done(e));
            }).catch(e => done(e));
        });

        it("should ignore pending actions will expiry = null | undefined", (done) => {
            let dao: PendingActionDao = Container.get(PendingActionDao);
            let action1: PendingAction = dao.createConfirmOrderAction();
            let action2: PendingAction = dao.createConfirmOrderAction();
            let action3: PendingAction = dao.createConfirmOrderAction();
            action1.expiry = null;
            action1.setPayload({});
            action2.expiry = moment().subtract(2, "days").toDate();
            action2.setPayload({});
            action3.expiry = undefined;
            action3.setPayload({});
            dao.save(action1).then(() => {
                dao.save(action2).then(() => {
                    dao.save(action3).then(() => {
                        dao.deleteExpired().then(num => {
                            expect(num).to.equal(1);
                            done();
                        }).catch(e => done(e));
                    }).catch(e => done(e));
                }).catch(e => done(e));
            }).catch(e => done(e));
        });
    });
});
