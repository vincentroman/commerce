import * as mocha from 'mocha';
import * as chai from 'chai';
import { Container } from "typedi";
import { App } from '../src/App';
import { Broker } from "../src/entity/Broker";
import { Purchase } from "../src/entity/Purchase";
import { BrokerDao } from "../src/dao/BrokerDao";
import { PurchaseDao } from "../src/dao/PurchaseDao";

const expect = chai.expect;

describe("PurchaseDao", () => {
    after(done => {
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        let orderDao: PurchaseDao = Container.get(PurchaseDao);
        orderDao.removeAll().then(() => {
            brokerDao.removeAll().then(() => {
                done();
            });
        });
    });

    describe("store and load with dependencies", () => {
        it("Should work", () => {
            let brokerDao: BrokerDao = Container.get(BrokerDao);
            let orderDao: PurchaseDao = Container.get(PurchaseDao);
            let broker = new Broker();
            broker.name = "Some dummy broker";
            broker.mappingTemplate = "{}";
            return brokerDao.save(broker).then((broker) => {
                let order = new Purchase();
                order.broker = broker;
                order.referenceId = "abcdef";
                return orderDao.save(order).then((order) => {
                    return orderDao.getByUuid(order.uuid).then(orderLoaded => {
                        expect(orderLoaded).to.be.not.null;
                        expect(orderLoaded).to.be.not.undefined;
                        expect(orderLoaded.referenceId).to.equal("abcdef");
                        expect(orderLoaded.broker).to.be.not.null;
                        expect(orderLoaded.broker).to.be.not.undefined;
                        expect(orderLoaded.broker.uuid).to.equal(broker.uuid);
                    }).catch(e => { throw e; });
                }).catch(e => { throw e; });
            }).catch(e => { throw e; });
        });
    });
});
