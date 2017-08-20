import * as mocha from 'mocha';
import * as chai from 'chai';
import { Container } from "typedi";

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';
import { NotificationBacklogItemDao } from "../src/dao/NotificationBacklogItemDao";
import { NotificationBacklogItem, NotificationType } from "../src/entity/NotificationBacklogItem";
import { Person } from "../src/entity/Person";
import { PersonDao } from "../src/dao/PersonDao";
import * as moment from "moment";

const expect = chai.expect;

describe("NotificationBacklogItemDao", () => {
    let person: Person;

    before(done => {
        let customer: Person = new Person();
        customer.firstname = "Max";
        customer.lastname = "Miller";
        customer.email = "no-reply-NotificationBacklogItemDao@weweave.net";
        Container.get(PersonDao).save(customer).then(customer => {
            person = customer;
            done();
        });
    });

    after(done => {
        Container.get(PersonDao).delete(person).then(() => {
            done();
        });
    });

    afterEach(done => {
        Container.get(NotificationBacklogItemDao).removeAll().then(() => {
            done();
        });
    });

    describe("create and load items", () => {
        it("Should load items with dueDate <= today", (done) => {
            let dao: NotificationBacklogItemDao = Container.get(NotificationBacklogItemDao);
            let item1: NotificationBacklogItem = new NotificationBacklogItem();
            let item2: NotificationBacklogItem = new NotificationBacklogItem();
            let item3: NotificationBacklogItem = new NotificationBacklogItem();

            item1.dueDate = moment().subtract(2, "days").toDate();
            item1.person = person;
            item1.type = NotificationType.REMIND_EXPIRY;

            item2.dueDate = moment().toDate();
            item2.person = person;
            item2.type = NotificationType.REMIND_EXPIRY;

            item3.dueDate = moment().add(1, "days").toDate();
            item3.person = person;
            item3.type = NotificationType.REMIND_EXPIRY;

            dao.save(item1).then(item1 => {
                dao.save(item2).then(item2 => {
                    dao.save(item3).then(item3 => {
                        dao.getItemsDueToday(NotificationType.REMIND_EXPIRY).then(items => {
                            expect(items).to.have.length(2);
                            expect(items[0].id).to.equal(item1.id);
                            expect(items[1].id).to.equal(item2.id);
                            done();
                        }).catch(e => done(e));
                    }).catch(e => done(e));
                }).catch(e => done(e));
            }).catch(e => done(e));
        });

        it("Should only load the specified type", (done) => {
            let dao: NotificationBacklogItemDao = Container.get(NotificationBacklogItemDao);
            let item1: NotificationBacklogItem = new NotificationBacklogItem();
            let item2: NotificationBacklogItem = new NotificationBacklogItem();

            item1.dueDate = moment().subtract(2, "days").toDate();
            item1.person = person;
            item1.type = NotificationType.REMIND_EXPIRY;

            item2.dueDate = moment().subtract(2, "days").toDate();
            item2.person = person;
            item2.type = NotificationType.REMIND_EVAL_BUY;

            dao.save(item1).then(item1 => {
                dao.save(item2).then(item2 => {
                    dao.getItemsDueToday(NotificationType.REMIND_EXPIRY).then(items => {
                        expect(items).to.have.length(1);
                        expect(items[0].id).to.equal(item1.id);
                        done();
                    }).catch(e => done(e));
                }).catch(e => done(e));
            }).catch(e => done(e));
        });
    });
});
