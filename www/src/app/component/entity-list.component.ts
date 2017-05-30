import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CrudService } from "../service/crud.service";
import { RestModel } from "../model/rest-model";
import { Serializable } from "../model/serializable";

export abstract class EntityListComponent<T extends RestModel & Serializable<T>> implements OnInit {
    entities: T[];

    constructor(
        protected router: Router,
        protected crudService: CrudService<T>
    ) {}

    protected abstract getEditPath(): string;

    ngOnInit(): void {
        this.crudService.list().then(entities => this.entities = entities);
    }

    showEntity(uuid: string): void {
        this.router.navigate([this.getEditPath(), uuid]);
    }
}
