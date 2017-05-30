import { Component, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CrudService } from "../service/crud.service";
import { RestModel } from "../model/rest-model";
import { Serializable } from "../model/serializable";

export abstract class EntityEditComponent<T extends RestModel & Serializable<T>> implements OnInit {
    entity: T = this.newTypeInstance();
    submitting: boolean = false;
    success: boolean = false;
    error: boolean = false;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected crudService: CrudService<T>
    ) {}

    protected abstract newTypeInstance(): T;

    protected abstract getListPath(): string;

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let uuid: string = params["uuid"];
            if (uuid) {
                this.crudService.get(uuid).then(entity => this.entity = entity);
            }
        });
    }

    submit(): void {
        this.submitting = true;
        this.success = false;
        this.crudService.save(this.entity)
            .then(entity => {
                this.entity = entity;
                this.submitting = false;
                this.success = true;
            });
    }

    delete(uuid: string): void {
        if (confirm("Delete this record?")) {
            this.submitting = true;
            this.success = false;
            this.crudService.delete(this.entity.uuid)
                .then(res => this.router.navigate([this.getListPath()]));
        }
    }
}
