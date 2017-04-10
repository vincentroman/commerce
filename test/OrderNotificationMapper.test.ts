import * as mocha from 'mocha';
import * as chai from 'chai';
import { Container } from "typedi";

import { Broker } from "../src/entity/Broker";
import { Order } from "../src/entity/Order";
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
    let broker1: Broker, broker2: Broker;

    before((done) => {
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
        brokerDao.save(broker1).then(() => {
            brokerDao.save(broker2).then(() => {
                let p1: Product = new Product();
                p1.title = "WP Ajaxify Comments";
                productDao.save(p1).then(() => {
                    let pv1: ProductVariant = new ProductVariant();
                    pv1.product = p1;
                    pv1.type = ProductVariantType.LimitedLicense;
                    productVariantDao.save(pv1).then(() => {
                        bpvDao.add(broker2, pv1, "wpac-support-ticket").then(() => {
                            bpvDao.add(broker1, pv1, "55305-9").then(() => {
                                done();
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
            let input = {
                "id": "WEW150414-9157-20105",
                "items": [
                    {
                        "productName": "wpac-support-ticket",
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
                expect(order).to.be.not.null;
                expect(order.referenceId).to.equal("WEW150414-9157-20105");
                expect(order.customer).to.be.not.null;
                expect(order.customer.firstname).to.equal("John");
                expect(order.customer.lastname).to.equal("Doe");
                expect(order.customer.company).to.equal("");
                expect(order.customer.email).to.equal("no-reply@weweave.net");
                expect(order.items).to.be.not.null;
                expect(order.items).to.be.instanceOf(Array);
                expect(order.items).to.have.lengthOf(1);
                expect(order.items[0].quantity).to.equal(1);
                expect(order.items[0].productVariant).to.be.not.null;
                expect(order.items[0].productVariant.product).to.be.not.null;
                expect(order.items[0].productVariant.product.title).to.equal("WP Ajaxify Comments");
                done();
            }).catch((e) => done(e));
        });

        it("Should map a DNN Store Order correctly", (done) => {
            let input = '<?xml version="1.0" encoding="utf-8" ?>'+
                '<order-notification>'+
                '    <order id="1227037271-23207-250782" is-test="true" is-gift="false">'+
                '        <event>'+
                '            <event-name>order</event-name>'+
                '            <event-date>2008-11-18T13:41:11-06:00</event-date>'+
                '        </event>'+
                '        <order-status>Test</order-status>'+
                '        <order-date>2008-11-18T13:41:11-06:00</order-date>'+
                '        <order-item id="1227037271-23207-250782">'+
                '            <product id="55305-9">'+
                '                <name>DNN Dynamic Roles</name>'+
                '            </product>'+
                '            <quantity>2</quantity>'+
                '            <tax>3.13</tax>'+
                '            <total>53.13</total>'+
                '            <reginfo />'+
                '            <profit>0</profit>'+
                '            <affiliate-commission />'+
                '            <coupon-code />'+
                '        </order-item>'+
                '        <customer id="1226354950-348-707099">'+
                '            <address>'+
                '                <first-name>Joe</first-name>'+
                '                <last-name>Goe</last-name>'+
                '                <company>DR</company>'+
                '                <address1>550 W. Van Buren</address1>'+
                '                <address2 />'+
                '                <city>Chicago</city>'+
                '                <region>IL</region>'+
                '                <postal-code>60607</postal-code>'+
                '                <country>US</country>'+
                '                <phone>312-3255555</phone>'+
                '                <email>no-reply@weweave.net</email>'+
                '                <language-chosen>EN</language-chosen>'+
                '            </address>'+
                '        </customer>'+
                '        <referrer>QA Test Account</referrer>'+
                '        <custom-referrer />'+
                '        <link-location>Unknown</link-location>'+
                '        <name-on-card>Test Order</name-on-card>'+
                '        <ip>208.79.252.140</ip>'+
                '    </order>'+
                '</order-notification>';
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
    });
});
