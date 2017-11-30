import * as fs from "fs";
import * as path from "path";
import * as uuid from 'uuid/v4';
import * as moment from "moment";
import { Person } from "../entity/Person";
import { Container } from "typedi/Container";
import { PersonDao } from "../dao/PersonDao";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { SystemSettingId } from "../entity/SystemSetting";
import { Broker } from "../entity/Broker";
import { BrokerDao } from "../dao/BrokerDao";
import { Product } from "../entity/Product";
import { ProductDao } from "../dao/ProductDao";
import { ProductVariant, ProductVariantType } from "../entity/ProductVariant";
import { ProductVariantDao } from "../dao/ProductVariantDao";
import { Purchase } from "../entity/Purchase";
import { PurchaseDao } from "../dao/PurchaseDao";
import { PurchaseItem } from "../entity/PurchaseItem";
import { PurchaseItemDao } from "../dao/PurchaseItemDao";
import { SupportTicket, SupportRequestStatus } from "../entity/SupportTicket";
import { SupportTicketDao } from "../dao/SupportTicketDao";
import { LicenseKey } from "../entity/LicenseKey";
import { LicenseKeyDao } from "../dao/LicenseKeyDao";
import { LicenseKeyEncoder, DomainList } from "commerce-key";

export class DemoSetup {
    private static LOREM_IPSUM: string =
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor " +
        "invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam " +
        "et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est " +
        "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed " +
        "diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam "+
        "voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd " +
        "gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

    private input: any;
    private privateKey: string;
    private brokers: Broker[] = [];
    private productVariants: ProductVariant[] = [];

    constructor() {
        this.loadInput();
    }

    public async setup(): Promise<void> {
        // Set demo settings
        await this.updateSystemSettings();
        // Create brokers
        for (let i=1; i <= 2; i++) {
            let broker: Broker = await this.createBroker(i);
            this.brokers.push(broker);
            console.log("...created broker uuid = %s (%s)", broker.uuid, broker.name);
        }
        // Create products
        for (let i=1; i <= 5; i++) {
            let product: Product = await this.createProduct();
            console.log("...created product uuid = %s (%s)", product.uuid, product.title);
            // Create product variants
            for (let j=1; j <= 3; j++) {
                let pv: ProductVariant = await this.createProductVariant(product, j);
                this.productVariants.push(pv);
            }
        }
        // Create customers
        for (let i=1; i <= 100; i++) {
            let customer: Person = await this.createCustomer();
            console.log("...created customer uuid = %s (%s %s, %s)",
                customer.uuid, customer.firstname, customer.lastname, customer.company);
            let numSales: number = this.getRandomNumber(1, 5);
            for (let j=0; j <= numSales; j++) {
                await this.createPurchase(customer);
            }
        }
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

    private async updateSystemSettings() {
        let dao: SystemSettingDao = Container.get(SystemSettingDao);
        this.privateKey = fs.readFileSync(path.join(process.cwd(), "./res/private.pem"), "utf8");
        let publicKey: string = fs.readFileSync(path.join(process.cwd(), "./res/public.pem"), "utf8");
        dao.updateSetting(SystemSettingId.MailServer_LogAndDiscard, "0");
        dao.updateSetting(SystemSettingId.LicenseKey_PrivateKey, this.privateKey);
        dao.updateSetting(SystemSettingId.LicenseKey_PublicKey, publicKey);
    }

    private createBroker(i: number): Promise<Broker> {
        let broker: Broker = new Broker();
        broker.name = "Broker " + i;
        return Container.get(BrokerDao).save(broker);
    }

    private createCustomer(): Promise<Person> {
        let person: Person = new Person();
        person.firstname = this.getRandom(this.input.firstnames);
        person.lastname = this.getRandom(this.input.lastnames);
        person.company =
            this.getRandom(this.input.adjectives) + " " +
            this.getRandom(this.input.things) + " " +
            this.getRandom(this.input.legalForms);
        person.roleAdmin = false;
        person.roleCustomer = true;
        person.setPlainPassword("test1234");
        person.email = uuid() + "@weweave.local";
        return Container.get(PersonDao).save(person);
    }

    private createProduct(): Promise<Product> {
        let product: Product = new Product();
        product.title =
            this.getRandom(this.input.adjectives) + " " +
            this.getRandom(this.input.things);
        product.licenseKeyIdentifier = product.title.replace(" ", "_").toUpperCase();
        return Container.get(ProductDao).save(product);
    }

    private createProductVariant(product: Product, i: number): Promise<ProductVariant> {
        let pv: ProductVariant = new ProductVariant();
        pv.product = product;
        if (i <= 2) {
            pv.title = "License Key for " + i + " domains";
            pv.numDomains = i;
            pv.numSupportYears = 1;
            pv.type = ProductVariantType.LimitedLicense;
            pv.price = 99 * i;
        } else {
            pv.title = "Support Ticket for one support request";
            pv.numDomains = 0;
            pv.numSupportYears = 0;
            pv.type = ProductVariantType.SupportTicket;
            pv.price = 79;
        }
        return Container.get(ProductVariantDao).save(pv);
    }

    private createPurchase(customer: Person): Promise<Purchase> {
        let purchase: Purchase = new Purchase();
        purchase.customer = customer;
        purchase.broker = this.getRandomBroker();
        purchase.referenceId = uuid();
        return Container.get(PurchaseDao).save(purchase).then(purchase => {
            let item: PurchaseItem = new PurchaseItem();
            item.purchase = purchase;
            item.productVariant = this.getRandomProductVariant();
            item.quantity = this.getRandomNumber(1, 3);
            return Container.get(PurchaseItemDao).save(item).then(item => {
                if (item.productVariant.type === ProductVariantType.SupportTicket) {
                    let ticket: SupportTicket = new SupportTicket();
                    ticket.productVariant = item.productVariant;
                    ticket.purchaseItem = item;
                    ticket.customer = customer;
                    ticket.status = this.getRandomNumber(1, SupportRequestStatus.CLOSED + 1);
                    if (ticket.status !== SupportRequestStatus.NEW) {
                        ticket.text = DemoSetup.LOREM_IPSUM;
                        ticket.sendDate = new Date();
                    }
                    return Container.get(SupportTicketDao).save(ticket).then(ticket => purchase);
                } else {
                    let key: LicenseKey = new LicenseKey();
                    key.productVariant = item.productVariant;
                    key.purchaseItem = item;
                    key.customer = customer;
                    if (this.getRandomBool()) {
                        key.issueDate = new Date();
                        key.expiryDate = moment().add(item.productVariant.numSupportYears, "years").toDate();
                        this.addLicenseKey(key);
                    }
                    return Container.get(LicenseKeyDao).save(key).then(key => purchase);
                }
            });
        });
    }

    private addLicenseKey(key: LicenseKey): void {
        let dl: DomainList = new DomainList();
        dl.addDomain("weweave.local", false, false);
        let encoder: LicenseKeyEncoder = new LicenseKeyEncoder();
        encoder.issueDate = new Date();
        encoder.expiryDate = key.expiryDate;
        encoder.description = key.productVariant.product.title +
            " (" + key.productVariant.numDomains + " domains)";
        encoder.onlineVerification = false;
        encoder.uuid = "";
        encoder.owner = key.customer.printableName();
        encoder.product = key.productVariant.product.licenseKeyIdentifier;
        encoder.subject = dl.getRegex().source;
        encoder.type = "limited";
        let licenseKey = encoder.toString(this.privateKey);
        key.licenseKey = licenseKey;
    }

    private getRandomBroker(): Broker {
        let numItems: number = this.brokers.length;
        return this.brokers[this.getRandomNumber(0, numItems)];
    }

    private getRandomProductVariant(): ProductVariant {
        let numItems: number = this.productVariants.length;
        return this.productVariants[this.getRandomNumber(0, numItems)];
    }

    private getRandom(path: string[]): string {
        let numItems: number = path.length;
        return path[this.getRandomNumber(0, numItems)];
    }

    private getRandomNumber(minInclusive: number, maxExclusive: number): number {
        return Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive);
    }

    private getRandomBool(): boolean {
        return (this.getRandomNumber(0, 2) === 1);
    }

    private loadInput(): void {
        let filePath: string = path.join(process.cwd(), "./res/demo.json");
        let buffer: string = fs.readFileSync(filePath, "utf8");
        try {
            this.input = JSON.parse(buffer);
        } catch (e) {
            throw new Error("Could not parse demo.json");
        }
    }
}
