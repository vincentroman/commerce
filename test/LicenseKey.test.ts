import * as mocha from 'mocha';
import * as chai from 'chai';
import * as fs from "fs";
import * as path from 'path';

import { LicenseKey } from "../src/util/LicenseKey";

const expect = chai.expect;

describe("LicenseKey", () => {
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
