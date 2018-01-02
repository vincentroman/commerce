import * as mocha from 'mocha';
import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { Container } from "typedi";

import { Broker } from "../src/entity/Broker";
import { Purchase } from "../src/entity/Purchase";
import { Product } from "../src/entity/Product";
import { ProductVariant, ProductVariantType } from "../src/entity/ProductVariant";
import { OrderNotificationMapper } from "../src/util/OrderNotificationMapper";
import { BrokerDao } from "../src/dao/BrokerDao";
import { ProductDao } from "../src/dao/ProductDao";
import { ProductVariantDao } from "../src/dao/ProductVariantDao";
import { BrokerProductVariantDao } from "../src/dao/BrokerProductVariantDao";

const expect = chai.expect;

/**
 * Example Target Structure:
 * {
 *     id: <String>,
 *     customer: {
 *         firstname: <String>,
 *         lastname: <String>,
 *         company: <String>,
 *         email: <String>,
 *         country: <String>
 *     },
 *     items: [
 *         {
 *             id: <String>,
 *             quantity: <Number>
 *         }
 *     ]
 * }
 */

describe("OrderNotificationMapper", () => {
    let broker1: Broker, broker2: Broker, broker3: Broker;

    before((done) => {
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        let productDao: ProductDao = Container.get(ProductDao);
        let productVariantDao: ProductVariantDao = Container.get(ProductVariantDao);
        let bpvDao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        broker1 = new Broker();
        broker1.mappingTemplate = fs.readFileSync(path.join(process.cwd(), "./test/res/xmlstore.map.json"), "utf8");
        broker1.name = "XML Store";
        broker2 = new Broker();
        broker2.mappingTemplate = fs.readFileSync(path.join(process.cwd(), "./test/res/fastspring.map.json"), "utf8");
        broker2.name = "FastSpring";
        broker3 = new Broker();
        broker3.mappingTemplate = fs.readFileSync(path.join(process.cwd(), "./test/res/dnnstore.map.json"), "utf8");
        broker3.name = "DNN Store";
        brokerDao.save(broker1).then(() => {
            brokerDao.save(broker2).then(() => {
                brokerDao.save(broker3).then(() => {
                    let p1: Product = new Product();
                    p1.title = "WP Ajaxify Comments";
                    p1.licenseKeyIdentifier = "WpAjaxifyComments";
                    productDao.save(p1).then(() => {
                        let pv1: ProductVariant = new ProductVariant();
                        pv1.product = p1;
                        pv1.title = "PV 1";
                        pv1.type = ProductVariantType.LimitedLicense;
                        pv1.numDomains = 1;
                        pv1.numSupportYears = 1;
                        pv1.price = 99;
                        productVariantDao.save(pv1).then(() => {
                            bpvDao.addOrReplace(broker2, pv1, "wpac-support-ticket").then(() => {
                                bpvDao.addOrReplace(broker1, pv1, "55305-9").then(() => {
                                    bpvDao.addOrReplace(broker3, pv1, "3").then(() => {
                                        done();
                                    }).catch(e => done(e));
                                }).catch(e => done(e));
                            }).catch(e => done(e));
                        }).catch(e => done(e));
                    }).catch(e => done(e));
                }).catch(e => done(e));
            }).catch(e => done(e));
        }).catch(e => done(e));
    });

    after((done) => {
        Container.get(BrokerProductVariantDao).removeAll().then(() => {
            Container.get(ProductVariantDao).removeAll().then(() => {
                Container.get(ProductDao).removeAll().then(() => {
                    Container.get(BrokerDao).removeAll().then(() => {
                        done();
                    }).catch(e => done(e));
                }).catch(e => done(e));
            }).catch(e => done(e));
        }).catch(e => done(e));
    });

    describe("map()", () => {
        it("Should map a FastSpring Order correctly", (done) => {
            let input = fs.readFileSync(path.join(process.cwd(), "./test/res/fastspring.json"), "utf8");
            OrderNotificationMapper.map(input, broker2).then((order) => {
                expect(order).to.be.not.null;
                expect(order.referenceId).to.equal("WEW150414-9157-20105");
                expect(order.customer).to.be.not.null;
                expect(order.customer.firstname).to.equal("John");
                expect(order.customer.lastname).to.equal("Doe");
                expect(order.customer.company).to.equal("weweave");
                expect(order.customer.email).to.equal("no-reply@weweave.net");
                expect(order.items).to.be.not.null;
                expect(order.items).to.be.instanceOf(Array);
                expect(order.items).to.have.lengthOf(1);
                expect(order.items[0].quantity).to.equal(2);
                expect(order.items[0].productVariant).to.be.not.null;
                expect(order.items[0].productVariant.product).to.be.not.null;
                expect(order.items[0].productVariant.product.title).to.equal("WP Ajaxify Comments");
                done();
            }).catch((e) => done(e));
        });

        it("Should map an XML correctly", (done) => {
            let input = fs.readFileSync(path.join(process.cwd(), "./test/res/xmlstore.xml"), "utf8");
            OrderNotificationMapper.map(input, broker1).then((order) => {
                expect(order).to.be.not.null;
                expect(order.referenceId).to.equal("1227037271-23207-250782");
                expect(order.customer).to.be.not.null;
                expect(order.customer.firstname).to.equal("Joe");
                expect(order.customer.lastname).to.equal("Goe");
                expect(order.customer.company).to.equal("DR");
                expect(order.customer.email).to.equal("no-reply@weweave.net");
                expect(order.items).to.be.not.null;
                expect(order.items).to.be.instanceOf(Array);
                expect(order.items).to.have.lengthOf(1);
                expect(order.items[0].quantity).to.equal(2);
                expect(order.items[0].productVariant).to.be.not.null;
                expect(order.items[0].productVariant.type).to.be.not.null;
                expect(order.items[0].productVariant.type).to.be.not.undefined;
                expect(order.items[0].productVariant.type).to.be.equal(ProductVariantType.LimitedLicense);
                expect(order.items[0].productVariant.product).to.be.not.null;
                expect(order.items[0].productVariant.product.title).to.equal("WP Ajaxify Comments");
                done();
            }).catch((e) => done(e));
        });

        it("Should reject for invalid product name", (done) => {
            let input = {
                "id": "WEW150414-9157-20105",
                "items": [
                    {
                        "productName": "wpac-x-ticket",
                        "priceTotalUSD": 22.81,
                        "quantity": 1
                    }
                ],
                "customer": {
                    "firstName": "John",
                    "lastName": "Doe",
                    "company": "",
                    "email": "no-reply@weweave.net"
                }
            };
            OrderNotificationMapper.map(input, broker2).then((order) => {
                done(new Error("Should not get here"));
            }).catch((e) => done());
        });

        it("Should map a DNN Order Notification correctly", (done) => {
            let input = fs.readFileSync(path.join(process.cwd(), "./test/res/dnnstore.json"), "utf8");
            OrderNotificationMapper.map(input, broker3).then((order) => {
                expect(order).to.be.not.null;
                expect(order.referenceId).to.equal("c167f59f-439f-4138-bbe2-a9bada34eeba");
                expect(order.customer).to.be.not.null;
                expect(order.customer.firstname).to.equal("Mary");
                expect(order.customer.lastname).to.equal("Smith");
                expect(order.customer.company).to.be.undefined;
                expect(order.customer.email).to.equal("test@test.com");
                expect(order.items).to.be.not.null;
                expect(order.items).to.be.instanceOf(Array);
                expect(order.items).to.have.lengthOf(1);
                expect(order.items[0].quantity).to.equal(1);
                expect(order.items[0].productVariant).to.be.not.null;
                expect(order.items[0].productVariant.type).to.be.not.null;
                expect(order.items[0].productVariant.type).to.be.not.undefined;
                expect(order.items[0].productVariant.type).to.be.equal(ProductVariantType.LimitedLicense);
                expect(order.items[0].productVariant.product).to.be.not.null;
                expect(order.items[0].productVariant.product.title).to.equal("WP Ajaxify Comments");
                done();
            }).catch((e) => done(e));
        });
    });
});
