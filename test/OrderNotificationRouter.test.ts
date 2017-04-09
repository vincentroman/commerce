import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import { Container } from "typedi";
import { Broker } from "../src/entity/Broker";
import { Order } from "../src/entity/Order";
import { OrderItem } from "../src/entity/OrderItem";
import { Product } from "../src/entity/Product";
import { ProductVariant } from "../src/entity/ProductVariant";
import { OrderNotificationMapper } from "../src/util/OrderNotificationMapper";
import { BrokerDao } from "../src/dao/BrokerDao";
import { OrderDao } from "../src/dao/OrderDao";
import { ProductDao } from "../src/dao/ProductDao";
import { ProductVariantDao } from "../src/dao/ProductVariantDao";
import { BrokerProductVariantDao } from "../src/dao/BrokerProductVariantDao";

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/api/v1/ordernotification/';

describe('Router '+endpoint, () => {
    let broker1: Broker, broker2: Broker;

    before(done => {
        if (App.getInstance().ready) { done(); }
        App.getInstance().on("appStarted", () => { done(); });
    });

    beforeEach(done => {
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        let productDao: ProductDao = Container.get(ProductDao);
        let productVariantDao: ProductVariantDao = Container.get(ProductVariantDao);
        let bpvDao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        broker1 = new Broker();
        broker1.mappingTemplate = JSON.stringify({
            "id": {
                "path": "order-notification.order._attributes.id"
            },
            "customer": {
                "path": "order-notification.order.customer",
                "nested": {
                    "firstname": {
                        "path": "address.first-name._text"
                    },
                    "lastname": {
                        "path": "address.last-name._text"
                    },
                    "company": {
                        "path": "address.company._text"
                    },
                    "email": {
                        "path": "address.email._text"
                    }
                }
            },
            "items": {
                "path": "order-notification.order.order-item",
                "nested": {
                    "id": "product._attributes.id",
                    "quantity": "quantity._text"
                }
            }
        });
        broker1.name = "DNN Store";
        broker2 = new Broker();
        broker2.mappingTemplate = JSON.stringify({
            "id": {
                "path": "id"
            },
            "customer": {
                "path": "customer",
                "nested": {
                    "firstname": {
                        "path": "firstName"
                    },
                    "lastname": {
                        "path": "lastName"
                    },
                    "company": {
                        "path": "company"
                    },
                    "email": {
                        "path": "email"
                    }
                }
            },
            "items": {
                "path": "items",
                "nested": {
                    "id": "productName",
                    "quantity": "quantity"
                }
            }
        });
        broker2.name = "FastSpring";
        brokerDao.save(broker1).then((broker) => {
            brokerDao.save(broker2).then((broker2) => {
                let p1: Product = new Product();
                p1.title = "WP Ajaxify Comments";
                productDao.save(p1).then((p1) => {
                    let pv1: ProductVariant = new ProductVariant();
                    pv1.product = p1;
                    productVariantDao.save(pv1).then((pv1) => {
                        bpvDao.add(broker2, pv1, "wpac-support-ticket").then(() => {
                            bpvDao.add(broker1, pv1, "55305-9").then(() => {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    afterEach(done => {
        Container.get(OrderDao).removeAll().then(() => {
            Container.get(BrokerProductVariantDao).removeAll().then(() => {
                Container.get(ProductVariantDao).removeAll().then(() => {
                    Container.get(ProductDao).removeAll().then(() => {
                        Container.get(BrokerDao).removeAll().then(() => {
                            done();
                        }).catch(e => done(e));
                    }).catch(e => done(e));
                }).catch(e => done(e));
            }).catch(e => done(e));
        }).catch(e => done(e));
    });

    describe('POST '+endpoint, () => {
        it("Should successfully accept a valid JSON", () => {
            let input = '{'+
                '"id": "WEW150414-9157-20105",'+
                '"items": ['+
                    '{'+
                        '"productName": "wpac-support-ticket",'+
                        '"priceTotalUSD": 22.81,'+
                        '"quantity": 1'+
                    '}'+
                '],'+
                '"customer": {'+
                    '"firstName": "John",'+
                    '"lastName": "Doe",'+
                    '"company": "",'+
                    '"email": "no-reply@weweave.net"'+
                '}'+
            '}';
            return chai.request(App.getInstance().express).post(endpoint + broker2.uuid)
            .set('Content-Type', 'application/json')
            .send(input)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.be.string;
                let orderDao: OrderDao = Container.get(OrderDao);
                return orderDao.getByUuid(res.body.uuid).then(order => {
                    expect(order).to.be.not.null;
                    expect(order).to.be.not.undefined;
                    expect(order.uuid).to.equal(res.body.uuid);
                    expect(order.broker).to.be.not.null;
                    expect(order.broker).to.be.not.undefined;
                    expect(order.broker.id).to.equal(broker2.id);
                    expect(order.broker.name).to.equal(broker2.name);
                    expect(order.items).to.be.not.null;
                    expect(order.items).to.be.not.undefined;
                    expect(order.items).to.be.an('array');
                    expect(order.items).to.have.lengthOf(1);
                    expect(order.items[0]).to.be.not.null;
                    expect(order.items[0]).to.be.not.undefined;
                    expect(order.items[0]).to.be.an.instanceOf(OrderItem);
                    expect(order.items[0].quantity).to.be.equal(1);
                    expect(order.items[0].productVariant).to.be.not.null;
                    expect(order.items[0].productVariant).to.be.not.undefined;
                    expect(order.items[0].productVariant.product).to.be.not.null;
                    expect(order.items[0].productVariant.product).to.be.not.undefined;
                    expect(order.items[0].productVariant.product.title).to.equal("WP Ajaxify Comments");
                });
            });
        });
    });
});