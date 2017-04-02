export class DomainList {
    private static LOCAL_DOMAINS: string = "(.*\\.)?localhost|(.*)?\\.local";
    private static DOMAIN_PREFIX: string = "(.*\\.)?";

    domains: string[] = [];
    strict: boolean = true;

    constructor(strict?: boolean, regex?: RegExp|string) {
        if (strict) {
            this.strict = strict;
        }
        if (regex) {
            if (regex instanceof RegExp) {
                this.domains = this.extractDomains(regex.source);
            } else {
                this.domains = this.extractDomains(regex);
            }
        }
    }

    public addDomain(domain: string): void {
        if (domain === undefined || domain == null || domain === "") {
            throw new Error("Domain must not be null or empty");
        }
        if (domain.indexOf(".") === -1) {
            throw new Error("Domain must consist of top and second level domain");
        }
        if (this.strict && domain.indexOf(".") !== domain.lastIndexOf(".")) {
            throw new Error("There must be exactly one dot (.) in the domain name");
        }
        if (new RegExp(".*[\\*\\[\\]\\{\\}\\(\\)\\?\\+].*").test(domain)) {
            throw new Error("Invalid characters in domain name");
        }
        this.domains.push(domain);
    }

    public getRegex(): RegExp {
        let regex: string = "";
        regex += "^" + DomainList.LOCAL_DOMAINS;
        this.domains.forEach(domain => {
            regex += "|" + DomainList.DOMAIN_PREFIX + domain.replace(".", "\\.");
        });
        regex += "$";
        return new RegExp(regex);
    }

    private extractDomains(regex: string): string[] {
        let result: string[] = [];
        if (regex.startsWith("^")) {
            regex = regex.substr(1);
        }
        if (regex.startsWith(DomainList.LOCAL_DOMAINS)) {
            result.push("localhost");
            result.push("*.local");
            regex = regex.substr(DomainList.LOCAL_DOMAINS.length);
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
