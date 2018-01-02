import * as mocha from 'mocha';
import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chaiHttp = require('chai-http');

import { Container } from "typedi";
import { Broker } from "../src/entity/Broker";
import { Purchase } from "../src/entity/Purchase";
import { PurchaseItem } from "../src/entity/PurchaseItem";
import { Product } from "../src/entity/Product";
import { ProductVariant, ProductVariantType } from "../src/entity/ProductVariant";
import { OrderNotificationMapper } from "../src/util/OrderNotificationMapper";
import { BrokerDao } from "../src/dao/BrokerDao";
import { PurchaseDao } from "../src/dao/PurchaseDao";
import { ProductDao } from "../src/dao/ProductDao";
import { ProductVariantDao } from "../src/dao/ProductVariantDao";
import { BrokerProductVariantDao } from "../src/dao/BrokerProductVariantDao";
import { App } from '../src/App';
import { LicenseKey } from "../src/entity/LicenseKey";
import { LicenseKeyDao } from "../src/dao/LicenseKeyDao";
import { DefaultSettingsCheck } from "../src/util/DefaultSettingsCheck";
import { PersonDao } from "../src/dao/PersonDao";

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/api/v1/ordernotification/';

describe('Router '+endpoint, () => {
    let broker1: Broker, broker2: Broker, broker3: Broker;

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

    afterEach(done => {
        Container.get(LicenseKeyDao).removeAll().then(() => {
            Container.get(PurchaseDao).removeAll().then(() => {
                Container.get(PersonDao).removeAll().then(() => {
                    Container.get(BrokerProductVariantDao).removeAll().then(() => {
                        Container.get(ProductVariantDao).removeAll().then(() => {
                            Container.get(ProductDao).removeAll().then(() => {
                                Container.get(BrokerDao).removeAll().then(() => {
                                    DefaultSettingsCheck.check().then(() => done());
                                }).catch(e => done(e));
                            }).catch(e => done(e));
                        }).catch(e => done(e));
                    }).catch(e => done(e));
                }).catch(e => done(e));
            }).catch(e => done(e));
        }).catch(e => done(e));
    });

    describe('POST '+endpoint, () => {
        it("Should successfully accept a valid JSON", () => {
            let input = fs.readFileSync(path.join(process.cwd(), "./test/res/fastspring.json"), "utf8");
            return chai.request(App.getInstance().express).post(endpoint + broker2.uuid)
            .set('Content-Type', 'application/json')
            .send(input)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.be.string;
                let orderDao: PurchaseDao = Container.get(PurchaseDao);
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
                    expect(order.items[0]).to.be.an.instanceOf(PurchaseItem);
                    expect(order.items[0].quantity).to.be.equal(2);
                    expect(order.items[0].productVariant).to.be.not.null;
                    expect(order.items[0].productVariant).to.be.not.undefined;
                    expect(order.items[0].productVariant.type).to.be.not.null;
                    expect(order.items[0].productVariant.type).to.be.not.undefined;
                    expect(order.items[0].productVariant.type).to.be.equal(ProductVariantType.LimitedLicense);
                    expect(order.items[0].productVariant.product).to.be.not.null;
                    expect(order.items[0].productVariant.product).to.be.not.undefined;
                    expect(order.items[0].productVariant.product.title).to.equal("WP Ajaxify Comments");
                });
            });
        });
    });
});
