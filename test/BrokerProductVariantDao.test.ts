import * as mocha from 'mocha';
import * as chai from 'chai';
import { Container } from "typedi";

import { Config } from '../src/util/Config';
Config.getInstance().loadTestConfig();
import { App } from '../src/App';
import { BrokerDao } from "../src/dao/BrokerDao";
import { ProductDao } from "../src/dao/ProductDao";
import { ProductVariantDao } from "../src/dao/ProductVariantDao";
import { BrokerProductVariantDao } from "../src/dao/BrokerProductVariantDao";
import { Broker } from "../src/entity/Broker";
import { Product } from "../src/entity/Product";
import { ProductVariant, ProductVariantType } from "../src/entity/ProductVariant";
import { BrokerProductVariant } from "../src/entity/BrokerProductVariant";

const expect = chai.expect;

describe("BrokerProductVariantDao", () => {
    after(done => {
        let brokerDao: BrokerDao = Container.get(BrokerDao);
        let productDao: ProductDao = Container.get(ProductDao);
        let productVariantDao: ProductVariantDao = Container.get(ProductVariantDao);
        let brokerProductVariantDao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);
        brokerProductVariantDao.removeAll().then(() => {
            productVariantDao.removeAll().then(() => {
                productDao.removeAll().then(() => {
                    brokerDao.removeAll().then(() => {
                        done();
                    });
                });
            });
        });
    });

    describe("addOrReplace()", () => {
        it("Should add, remove and replace entries", async function() {
            let brokerDao: BrokerDao = Container.get(BrokerDao);
            let productDao: ProductDao = Container.get(ProductDao);
            let productVariantDao: ProductVariantDao = Container.get(ProductVariantDao);
            let brokerProductVariantDao: BrokerProductVariantDao = Container.get(BrokerProductVariantDao);

            let broker1: Broker = new Broker();
            let broker2: Broker = new Broker();
            let product: Product = new Product();
            let pv1: ProductVariant = new ProductVariant();
            let pv2: ProductVariant = new ProductVariant();

            broker1.name = "Broker 1";
            broker2.name = "Broker 2";

            product.title = "Product 1";
            product.licenseKeyIdentifier = "P1";

            broker1 = await brokerDao.save(broker1);
            broker2 = await brokerDao.save(broker2);
            product = await productDao.save(product);

            pv1.title = "PV 1";
            pv1.product = product;
            pv1.type = ProductVariantType.LimitedLicense;
            pv1.numDomains = 1;
            pv1.numSupportYears = 1;
            pv1.price = 99;

            pv2.title = "PV 2";
            pv2.product = product;
            pv2.type = ProductVariantType.LimitedLicense;
            pv2.numDomains = 1;
            pv2.numSupportYears = 1;
            pv2.price = 99;

            pv1 = await productVariantDao.save(pv1);
            pv2 = await productVariantDao.save(pv2);

            await brokerProductVariantDao.addOrReplace(broker1, pv1, "b1-pv1");
            await brokerProductVariantDao.addOrReplace(broker1, pv2, "b1-pv2");
            await brokerProductVariantDao.addOrReplace(broker2, pv1, "b2-pv1");
            await brokerProductVariantDao.addOrReplace(broker2, pv2, "b2-pv2");

            await brokerProductVariantDao.addOrReplace(broker2, pv1, "b2-pv1 v2");
            await brokerProductVariantDao.addOrReplace(broker1, pv2, "");

            let list: BrokerProductVariant[] = await brokerProductVariantDao.getByProduct(product);
            expect(list).to.be.not.null.and.not.undefined;
            expect(list.length).to.equal(3);

            expect(list[0]).to.be.not.null.and.not.undefined;
            expect(list[0].idForBroker).to.equal("b1-pv1");

            expect(list[1]).to.be.not.null.and.not.undefined;
            expect(list[1].idForBroker).to.equal("b2-pv1 v2");

            expect(list[2]).to.be.not.null.and.not.undefined;
            expect(list[2].idForBroker).to.equal("b2-pv2");
        });
    });
});
