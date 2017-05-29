import { NgModule, ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./component/home.component";
import { LoginComponent } from "./component/login.component";
import { GuestGuard } from "./guard/guest-guard.service";
import { AuthGuard } from "./guard/auth-guard.service";
import { AdminGuard } from "./guard/admin-guard.service";

const appRoutes: Routes = [
    // Guest routes
    { path: "login", component: LoginComponent, canActivate: [GuestGuard] },

    // Authenticated routes
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },

    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
