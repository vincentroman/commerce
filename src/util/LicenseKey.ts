import * as moment from 'moment';
import * as crypto from 'crypto';
import * as NodeRSA from 'node-rsa';

export class LicenseKey {
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

    constructor(licenseKey?: string) {

    }

    public toString(): string {
        let details = {
            version:            2,
            description:        this.description,
            type:               this.type,
            uuid:               this.uuid,
            onlineVerification: this.onlineVerification,
            product:            this.product,
            issueDate:          moment(this.issueDate).format(""),
            expiryDate:         moment(this.expiryDate).format(""),
            subject:            this.subject,
            owner:              this.owner
        };
        let detailsBase64: string = new Buffer(JSON.stringify(details)).toString('base64');
        let signature: string = LicenseKey.getSignature(detailsBase64, "");
        console.log("------------_> " + signature);
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
}
