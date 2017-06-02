import { NgModule, ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./component/home.component";
import { LoginComponent } from "./component/login.component";
import { GuestGuard } from "./guard/guest-guard.service";
import { AuthGuard } from "./guard/auth-guard.service";
import { AdminGuard } from "./guard/admin-guard.service";
import { BrokerListComponent } from "./component/broker-list.component";
import { BrokerEditComponent } from "./component/broker-edit.component";
import { CustomerListComponent } from "./component/customer-list.component";
import { CustomerEditComponent } from "./component/customer-edit.component";
import { ProductListComponent } from "./component/product-list.component";
import { ProductEditComponent } from "./component/product-edit.component";
import { ProductVariantEditComponent } from "./component/product-variant-edit.component";
import { MailTemplateListComponent } from "./component/mail-template-list.component";
import { MailTemplateEditComponent } from "./component/mail-template-edit.component";

const appRoutes: Routes = [
    // Guest routes
    { path: "login", component: LoginComponent, canActivate: [GuestGuard] },

    // Authenticated routes
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },

    // Admin routes
    { path: "brokers", component: BrokerListComponent, canActivate: [AdminGuard] },
    { path: "brokers/new", component: BrokerEditComponent, canActivate: [AdminGuard] },
    { path: "brokers/edit/:uuid", component: BrokerEditComponent, canActivate: [AdminGuard] },

    { path: "customers", component: CustomerListComponent, canActivate: [AdminGuard] },
    { path: "customers/new", component: CustomerEditComponent, canActivate: [AdminGuard] },
    { path: "customers/edit/:uuid", component: CustomerEditComponent, canActivate: [AdminGuard] },

    { path: "mailtemplates", component: MailTemplateListComponent, canActivate: [AdminGuard] },
    { path: "mailtemplates/new", component: MailTemplateEditComponent, canActivate: [AdminGuard] },
    { path: "mailtemplates/edit/:uuid", component: MailTemplateEditComponent, canActivate: [AdminGuard] },

    { path: "products", component: ProductListComponent, canActivate: [AdminGuard] },
    { path: "products/new", component: ProductEditComponent, canActivate: [AdminGuard] },
    { path: "products/edit/:uuid", component: ProductEditComponent, canActivate: [AdminGuard] },
    { path: "products/edit/:productUuid/variants/new", component: ProductVariantEditComponent, canActivate: [AdminGuard] },
    { path: "products/edit/:productUuid/variants/edit/:uuid", component: ProductVariantEditComponent, canActivate: [AdminGuard] },

    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
