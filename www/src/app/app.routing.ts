import { NgModule, ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./component/login.component";

const appRoutes: Routes = [
    // Guest routes
    { path: "login", component: LoginComponent },

    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
