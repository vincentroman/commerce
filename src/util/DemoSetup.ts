import * as fs from "fs";
import * as path from "path";
import { Person } from "../entity/Person";
import { Container } from "typedi/Container";
import { PersonDao } from "../dao/PersonDao";

export class DemoSetup {
    private input: any;

    constructor() {
        this.loadInput();
    }

    public async setup(): Promise<void> {
        for (let i=1; i <= 10; i++) {
            let person: Person = await this.createCustomer();
            console.log("...created customer uuid = %s (%s %s, %s)",
                person.uuid, person.firstname, person.lastname, person.company);
        }
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
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
        person.email = "????";
        return Container.get(PersonDao).save(person);
    }

    private getRandom(path: string[]): string {
        let numItems: number = path.length;
        let i: number = Math.floor(Math.random() * (numItems - 0) + 0);
        return path[i];
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
