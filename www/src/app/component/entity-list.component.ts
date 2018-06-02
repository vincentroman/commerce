import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CrudService } from "../service/crud.service";
import { RestModel } from "../model/rest-model";

export abstract class EntityListComponent<T extends RestModel<T>> implements OnInit {
    entities: T[];
    skip: number;
    maxResults: number;
    fetching: boolean;
    enableFetchMore: boolean;
    search: string;
    searchTimeout: number;

    constructor(
        protected router: Router,
        protected crudService: CrudService<T>
    ) {}

    protected abstract getEditPath(): string;

    protected getListFunction(): Function {
        return this.crudService.list;
    }

    protected loadList(): void {
        this.getListFunction().call(this.crudService, this.maxResults, this.skip, this.search).then(entities => {
            this.entities = entities;
            this.enableFetchMore = (this.entities.length === this.maxResults);
        });
    }

    ngOnInit(): void {
        this.skip = 0;
        this.maxResults = 25;
        this.fetching = false;
        this.enableFetchMore = true;
        this.search = "";
        this.loadList();
    }

    showEntity(uuid: string): void {
        this.router.navigate([this.getEditPath(), uuid]);
    }

    fetchMore(): void {
        this.fetching = true;
        this.skip += this.maxResults;
        this.getListFunction().call(this.crudService, this.maxResults, this.skip, this.search).then(entities => {
            let prevLen = entities.length;
            this.entities = this.entities.concat(entities);
            this.fetching = false;
            this.enableFetchMore = ((this.entities.length > prevLen) && (this.entities.length % this.maxResults === 0));
        });
    }

    onSearchChange(): void {
        window.clearTimeout(this.searchTimeout);
        this.searchTimeout = window.setTimeout(() => {
            this.loadList();
        }, 250);
    }
}
