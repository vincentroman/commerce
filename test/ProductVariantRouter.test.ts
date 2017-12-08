import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { App } from '../src/App';
import { ProductDao } from "../src/dao/ProductDao";
import { Product } from "../src/entity/Product";
import { Container } from "typedi";
import { ProductVariant } from "../src/entity/ProductVariant";
import { ProductVariantDao } from "../src/dao/ProductVariantDao";
import { TestUtil } from "./TestUtil";

chai.use(chaiHttp);
const expect = chai.expect;
let endpoint = '/api/v1/productvariant/';

describe('Router '+endpoint, () => {
    let p1uuid: string = "";
    let putId: string = "";
    let jwt: string;

    before(done => TestUtil.waitForAppToStartAndLoginAdmin((result) => {
        jwt = result;
        done();
    }));

    before(done => {
        let productDao: ProductDao = Container.get(ProductDao);
        let p1: Product = new Product();
        p1.title = "WP Ajaxify Comments";
        p1.licenseKeyIdentifier = "WpAjaxifyComments";
        productDao.save(p1).then((p1) => {
            p1uuid = p1.uuid;
            done();
        }).catch(e => done(e));
    });

    after(done => {
        Container.get(ProductVariantDao).removeAll().then(() => {
            Container.get(ProductDao).removeAll().then(() => {
                done();
            }).catch(e => done(e));
        }).catch(e => done(e));
    });

    describe('PUT '+endpoint+'save', () => {
        it('should save a new product variant', () => {
            let pv1 = {
                title: "Product Variant WP.1",
                type: 5,
                numDomains: 1,
                numSupportYears: 1,
                price: 99,
                product: {
                    uuid: p1uuid
                }
            };
            return chai.request(App.getInstance().express).put(endpoint+'save')
            .set("Authorization", "Bearer " + jwt)
            .send(pv1)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.be.string;
                putId = res.body.uuid;
            });
        });
    });

    describe('GET '+endpoint+'get', () => {
        it('should return the previously inserted variant', () => {
            return chai.request(App.getInstance().express).get(endpoint+'get/'+putId)
            .set("Authorization", "Bearer " + jwt)
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body.uuid).to.equal(putId);
                expect(res.body.title).to.equal("Product Variant WP.1");
            });
        });
    });
});
