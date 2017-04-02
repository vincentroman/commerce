import * as mocha from 'mocha';
import * as chai from 'chai';
import * as fs from "fs";
import * as path from 'path';
import * as moment from 'moment';
import * as uuid from 'uuid/v4';

import { LicenseKey } from "../src/util/LicenseKey";

const expect = chai.expect;

describe("LicenseKey", () => {
    describe("toString()", () => {
        it("Should generate a valid license key", () => {
            let filePathPrivate: string = path.join(process.cwd(), "../weweave-rest-api/src/main/resources/private.pem");
            let privateKey: string = fs.readFileSync(filePathPrivate, "utf8").toString();
            let key: LicenseKey = new LicenseKey();
            key.product = "DnnDynamicRoles";
            key.description = "Das ist eine Test-Lizenz mit Ümlauten";
            key.owner = "Microsoft GmbH & Co. KG";
            key.subject = "^(.*\.)?example\.com|mysite\.com|(.*\.)?something\.de$";
            key.issueDate = moment().toDate();
            key.expiryDate = moment().add(1, 'months').toDate();
            key.type = LicenseKey.TYPE_TRIAL;
            key.uuid = uuid();
            key.onlineVerification = false;
            let keyString: string = key.toString(privateKey);
            console.log(keyString);
        });
    });

    describe("factory()", () => {
        it("Should successfully initialize for a valid provided license key", () => {
            let filePathPublic: string = path.join(process.cwd(), "../weweave-rest-api/src/main/resources/public.pem");
            let publicKey: string = fs.readFileSync(filePathPublic, "utf8").toString();
            let s = "eyJzaWduYXR1cmUiOiJNVUhreEdjbjRZNzRmekp1SjFld29mRkxJZ0FmODVvTVl2bytPL0ZhWE5o"+
                    "cGhITFQzeVRPSjJRb21LY25VZUJkYW5VNzFnWldlakMxXG5neW02SU9zU05IeUtwZWZzQ2pwb1NK"+
                    "bzdUVG1iTWN5dGR6R3RwTnk0MVZtM1BjdDVTWUFuSjZNQ0V0RUExSVB1dGVmSU5nbEFYUmdBXG5G"+
                    "ZzFMSG50NTNJcEhndWtEdlRLKy9uNUgxdUd1eVJNNC83a3JGQXJUcyszeW1HWFhOcVFTckVJclgz"+
                    "UFBjM3J1Qyt3dFhZTEJ3ME9FXG4yaFBmRCswb2lhM2xhaXZDSlJMRFJqQ1p0UERzQ1IxUnZZSVNu"+
                    "d3dKa0FjYlNyL0FGNjcyUWdhQS96M0NQbHVKRGdaSDZXcWdveGVzXG5laFMrZVBXTHRWd2Y5Ri9k"+
                    "dWRVOGNzWGpEbzFFTk5wRmlNVktDZz09IiwiZGV0YWlscyI6ImV5SmxlSEJwY25sRVlYUmxJam9p"+
                    "TWpBeE9TMHdOQzB3TWlJc0ltOTNibVZ5SWpvaVRXbGpjbTl6YjJaMElFZHRZa2dnSmlCRGJ5NGdc"+
                    "blMwY2lMQ0p3Y205a2RXTjBJam9pUkc1dVJIbHVZVzFwWTFKdmJHVnpJaXdpYzNWaWFtVmpkQ0k2"+
                    "SWw0b0xpcGNYQzRwUDJWNFlXMXdcbmJHVmNYQzVqYjIxOGJYbHphWFJsWEZ3dVkyOXRmQ2d1S2x4"+
                    "Y0xpay9jMjl0WlhSb2FXNW5YRnd1WkdVa0lpd2laR1Z6WTNKcGNIUnBcbmIyNGlPaUpFWVhNZ2FY"+
                    "TjBJR1ZwYm1VZ1ZHVnpkQzFNYVhwbGJub2diV2wwSU1PY2JXeGhkWFJsYmlJc0ltOXViR2x1WlZa"+
                    "bGNtbG1cbmFXTmhkR2x2YmlJNmRISjFaU3dpZEhsd1pTSTZJbXhwYldsMFpXUWlMQ0pwYzNOMVpV"+
                    "UmhkR1VpT2lJeU1ERTNMVEEwTFRBeUlpd2lcbmRtVnljMmx2YmlJNk1pd2lkWFZwWkNJNklqZzJa"+
                    "V1ZoTWpReUxXVmpaVGt0TkdSbE55MDRaVEZrTFdZM1kyVXhNamcyWXpCak9TSjlcbiJ9";
            let key: LicenseKey = LicenseKey.factory(s, publicKey);
            expect(key).to.be.not.null;
            expect(key.description).to.equal("Das ist eine Test-Lizenz mit Ümlauten");
            expect(key.onlineVerification).to.equal(true);
            expect(key.owner).to.equal("Microsoft GmbH & Co. KG");
            expect(key.product).to.equal("DnnDynamicRoles");
            expect(key.subject).to.equal("^(.*\\.)?example\\.com|mysite\\.com|(.*\\.)?something\\.de$");
            expect(key.type).to.equal(LicenseKey.TYPE_LIMITED);
            expect(key.uuid).to.be.not.empty;
            expect(key.issueDate).to.be.instanceOf(Date);
            expect(moment(key.issueDate).format("YYYY-MM-DD")).to.equal("2017-04-02");
            expect(key.expiryDate).to.be.instanceOf(Date);
            expect(moment(key.expiryDate).format("YYYY-MM-DD")).to.equal("2019-04-02");
        });
    });

    describe("getSignature()", () => {
        it("Should generate a valid signature", () => {
            let filePathPrivate: string = path.join(process.cwd(), "../weweave-rest-api/src/main/resources/private.pem");
            let filePathPublic: string = path.join(process.cwd(), "../weweave-rest-api/src/main/resources/public.pem");
            let privateKey: string = fs.readFileSync(filePathPrivate, "utf8").toString();
            let publicKey: string = fs.readFileSync(filePathPublic, "utf8").toString();
            let s = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
            let signature = LicenseKey.getSignature(s, privateKey);
            expect(signature).to.be.not.empty;
            let result = LicenseKey.isSignatureValid(s, signature, publicKey);
            expect(result).to.be.true;
        });
    });

    describe("isSignatureValid()", () => {
        it("Should positively verify a valid signature", () => {
            let filePath: string = path.join(process.cwd(), "../weweave-rest-api/src/main/resources/public.pem");
            let publicKey: string = fs.readFileSync(filePath, "utf8").toString();
            let s = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
            let signature = "TgZJoQh9iFpyFs1n6IJ6wz1CKl9CKTTvlG3LC0YE0KqcXDayM9AECQDRnQ35pVrRv9VLz5prZTkeOoWglakO+Q3TZOWilfHUY+VnZXwNbX992IFpzdi+ObLNe05zXYw4yATZCiwa4UjCPNVxCgiUhYOsSUgw6bZdhZdp8QIv4PFSyQ3L5QLSt+Z9/kCVGZniBzAt5F8vB//cZ1/keFPLi9A0kHrdSJkxoIGcghpqWqHUC2aOeL76czgBfVxFNeNlzv9tP4nCjaNUYj/TMQ8FF3FPH6Llf8gpJJRgEXh3z5ZQ76MaVyLi0AiZHoJR8WtqBMvxEW8Y8Dx5o86muCuTbg==";
            let result = LicenseKey.isSignatureValid(s, signature, publicKey);
            expect(result).to.be.true;
        });

        it("Should negatively verify an invalid signature", () => {
            let filePath: string = path.join(process.cwd(), "../weweave-rest-api/src/main/resources/public.pem");
            let publicKey: string = fs.readFileSync(filePath, "utf8").toString();
            let s = "Lorem 2 ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
            let signature = "TgZJoQh9iFpyFs1n6IJ6wz1CKl9CKTTvlG3LC0YE0KqcXDayM9AECQDRnQ35pVrRv9VLz5prZTkeOoWglakO+Q3TZOWilfHUY+VnZXwNbX992IFpzdi+ObLNe05zXYw4yATZCiwa4UjCPNVxCgiUhYOsSUgw6bZdhZdp8QIv4PFSyQ3L5QLSt+Z9/kCVGZniBzAt5F8vB//cZ1/keFPLi9A0kHrdSJkxoIGcghpqWqHUC2aOeL76czgBfVxFNeNlzv9tP4nCjaNUYj/TMQ8FF3FPH6Llf8gpJJRgEXh3z5ZQ76MaVyLi0AiZHoJR8WtqBMvxEW8Y8Dx5o86muCuTbg==";
            let result = LicenseKey.isSignatureValid(s, signature, publicKey);
            expect(result).to.be.false;
        });

        it("Should positively verify another valid signature", () => {
            let filePath: string = path.join(process.cwd(), "../weweave-rest-api/src/main/resources/public.pem");
            let publicKey: string = fs.readFileSync(filePath, "utf8").toString();
            let s = "";
            let signature = "A/kEgDymoTChUvLodTsuvqCb9LbsWy+uVLJnxtw0p275WPa0gpl/C9j/rDdIr/FLpGXGw1GR31/EM0meWNKGtbYRayNwUuhgH+00MPiO32Wxfdvxp2q356xguCvHx1lKW6ngPJdHmqdw9DppJc+LMgW3cu7IlpBQU2HUluqpAVgfKz8rEz3EHQlxxfGWLfFwKexO3+5FGL1+NJn9JcYKh04sMM6pYuHcIkfPBVe85vCpZ7xbUI7libVK1bwAkkeFtNQxE7hSfzQyzIudJ6glApvReD7JlNt0v9G5i51jw5/kRszhrwL53P4dHzxj2IN/w+QcADZ+gl7I6P1fn/i5+A==";
            let result = LicenseKey.isSignatureValid(s, signature, publicKey);
            expect(result).to.be.true;
        });
    });
});
