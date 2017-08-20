export class DomainList {
    private static DOMAIN_PREFIX: string = "(.*\\.)?";

    domains: string[] = [];

    constructor(regex?: RegExp|string) {
        if (regex !== undefined) {
            if (regex instanceof RegExp) {
                this.domains = this.extractDomains(regex.source);
            } else {
                this.domains = this.extractDomains(regex);
            }
        }
    }

    public addDomain(domain: string, assureIncludeDot?: boolean, assureSingleDot?: boolean): void {
        if (assureIncludeDot === undefined) {
            assureIncludeDot = true;
        }
        if (assureSingleDot === undefined) {
            assureSingleDot = true;
        }
        if (domain === undefined || domain == null || domain === "") {
            throw new Error("Domain must not be null or empty");
        }
        if (assureIncludeDot && domain.indexOf(".") === -1) {
            throw new Error("Domain must consist of top and second level domain");
        }
        if (assureSingleDot && domain.indexOf(".") !== domain.lastIndexOf(".")) {
            throw new Error("There must be exactly one dot (.) in the domain name");
        }
        if (new RegExp(".*[\\*\\[\\]\\{\\}\\(\\)\\?\\+].*").test(domain)) {
            throw new Error("Invalid characters in domain name");
        }
        this.domains.push(domain);
    }

    public getRegex(): RegExp {
        let regex: string = "";
        regex += "^";
        for (let i = 0; i < this.domains.length; i++) {
            if (i > 0) {
                regex += "|";
            }
            let domain = this.domains[i];
            regex += DomainList.DOMAIN_PREFIX + domain.replace(".", "\\.");
        }
        regex += "$";
        return new RegExp(regex);
    }

    private extractDomains(regex: string): string[] {
        let result: string[] = [];
        if (regex.startsWith("^")) {
            regex = regex.substr(1);
        }
        if (regex.endsWith("$")) {
            regex = regex.substr(0, regex.length-1);
        }
        let tokens: string[] = regex.split("|");
        tokens.forEach(token => {
            if (token !== undefined && token != null && token !== "") {
                if (token.startsWith(DomainList.DOMAIN_PREFIX)) {
                    token = token.substr(DomainList.DOMAIN_PREFIX.length);
                }
                let domain: string = "*."+token.replace("\\.", ".");
                result.push(domain);
            }
        });
        return result;
    }

    public static getTldFromDomain(domain: string): string {
        let pos = domain.indexOf(".");
        if (pos === -1) {
            return "";
        }
        return domain.substr(pos+1);
    }
}
