import { NgModule, ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./component/home.component";
import { LoginComponent } from "./component/login.component";
import { GuestGuard } from "./guard/guest-guard.service";
import { AuthGuard } from "./guard/auth-guard.service";
import { AdminGuard } from "./guard/admin-guard.service";
import { BrokerListComponent } from "./component/broker-list.component";
import { BrokerEditComponent } from "./component/broker-edit.component";

const appRoutes: Routes = [
    // Guest routes
    { path: "login", component: LoginComponent, canActivate: [GuestGuard] },

    // Authenticated routes
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },

    // Admin routes
    { path: "brokers", component: BrokerListComponent, canActivate: [AdminGuard] },
    { path: "brokers/new", component: BrokerEditComponent, canActivate: [AdminGuard] },
    { path: "brokers/edit/:id", component: BrokerEditComponent, canActivate: [AdminGuard] },

    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
