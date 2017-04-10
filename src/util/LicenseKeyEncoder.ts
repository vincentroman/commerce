import * as moment from 'moment';
import * as crypto from 'crypto';

export class LicenseKeyEncoder {
    public static readonly TYPE_TRIAL: string = "trial";
    public static readonly TYPE_LIMITED: string = "limited";
    public static readonly TYPE_LIFETIME: string = "lifetime";

    product: string;
    description: string;
    owner: string;
    subject: string;
    issueDate: Date;
    expiryDate: Date;
    type: string = "";
    uuid: string = "";
    onlineVerification: boolean = false;

    /**
     * Creates a signed license key from the provided details.
     * @param privateKey
     */
    public toString(privateKey: string): string {
        let details = {
            version:            2,
            description:        this.description,
            type:               this.type,
            uuid:               this.uuid,
            onlineVerification: this.onlineVerification,
            product:            this.product,
            issueDate:          moment(this.issueDate).format("yyyy-MM-dd"),
            expiryDate:         moment(this.expiryDate).format("yyyy-MM-dd"),
            subject:            this.subject,
            owner:              this.owner
        };
        let detailsBase64: string = new Buffer(JSON.stringify(details)).toString('base64');
        let signature: string = LicenseKeyEncoder.getSignature(detailsBase64, privateKey);
        let result = {
            signature: signature,
            details: detailsBase64
        };
        return new Buffer(JSON.stringify(result)).toString('base64');
    }

    /**
     * Checks if a provided RSA-SHA1 signature is valid.
     * @param s The string which signature is to be checked
     * @param signature The provided signature
     * @param publicKey Public key
     */
    public static isSignatureValid(s: string, signature: string, publicKey: string): boolean {
        let verify = crypto.createVerify('RSA-SHA1');
        verify.update(s);
        return verify.verify(publicKey, signature, 'base64');
    }

    /**
     * Generates an RSA-SHA1 signature for the provided Base&4 String.
     * @param s String to sign
     * @param privateKey Private Key
     */
    public static getSignature(s: string, privateKey: string): string {
        let sign = crypto.createSign('RSA-SHA1');
        sign.update(s);
        return sign.sign(privateKey, 'base64');
    }

    public static factory(licenseKey: string, publicKey: string): LicenseKeyEncoder {
        let json: any = JSON.parse(Buffer.from(licenseKey, 'base64').toString());
        if (!LicenseKeyEncoder.isSignatureValid(json.details, json.signature, publicKey)) {
            throw new Error("Invalid signature");
        }
        let detailsDecoded: any = JSON.parse(Buffer.from(json.details, 'base64').toString());
        let key: LicenseKeyEncoder = new LicenseKeyEncoder();
        key.description = detailsDecoded.description;
        key.expiryDate = moment(detailsDecoded.expiryDate, "YYYY-MM-DD").toDate();
        key.issueDate = moment(detailsDecoded.issueDate, "YYYY-MM-DD").toDate();
        key.onlineVerification = detailsDecoded.onlineVerification;
        key.owner = detailsDecoded.owner;
        key.product = detailsDecoded.product;
        key.subject = detailsDecoded.subject;
        key.type = detailsDecoded.type;
        key.uuid = detailsDecoded.uuid;
        return key;
    }
}
