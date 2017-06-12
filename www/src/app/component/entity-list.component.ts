import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CrudService } from "../service/crud.service";
import { RestModel } from "../model/rest-model";

export abstract class EntityListComponent<T extends RestModel<T>> implements OnInit {
    entities: T[];

    constructor(
        protected router: Router,
        protected crudService: CrudService<T>
    ) {}

    protected abstract getEditPath(): string;

    protected loadList(): void {
        this.crudService.list().then(entities => this.entities = entities);
    }

    ngOnInit(): void {
        this.loadList();
    }

    showEntity(uuid: string): void {
        this.router.navigate([this.getEditPath(), uuid]);
    }
}
