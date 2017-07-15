import { NgModule, ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./component/home.component";
import { LoginComponent } from "./component/login.component";
import { GuestGuard } from "./guard/guest-guard.service";
import { AuthGuard } from "./guard/auth-guard.service";
import { AdminGuard } from "./guard/admin-guard.service";
import { BrokerListComponent } from "./component/admin/broker-list.component";
import { BrokerEditComponent } from "./component/admin/broker-edit.component";
import { CustomerListComponent } from "./component/admin/customer-list.component";
import { CustomerEditComponent } from "./component/admin/customer-edit.component";
import { ProductListComponent } from "./component/admin/product-list.component";
import { ProductEditComponent } from "./component/admin/product-edit.component";
import { ProductVariantEditComponent } from "./component/admin/product-variant-edit.component";
import { MailTemplateListComponent } from "./component/admin/mail-template-list.component";
import { MailTemplateEditComponent } from "./component/admin/mail-template-edit.component";
import { ResetPasswordComponent } from "./component/reset-password.component";
import { SystemSettingListComponent } from "./component/admin/systemsetting-list.component";
import { SystemSettingEditComponent } from "./component/admin/systemsetting-edit.component";
import { LicenseKeyListComponent } from "./component/admin/license-key-list.component";
import { LicenseKeyEditComponent } from "./component/admin/license-key-edit.component";
import { CustomerGuard } from "./guard/customer-guard.service";
import { LicenseKeyMyListComponent } from "./component/customer/license-key-list.component";
import { LicenseKeyMyViewComponent } from "./component/customer/license-key-view.component";
import { LicenseKeyMyGenerateComponent } from "./component/customer/license-key-generate.component";
import { SupportRequestListComponent } from "./component/admin/support-request-list.component";
import { SupportRequestEditComponent } from "./component/admin/support-request-edit.component";
import { TicketsMyListComponent } from "./component/customer/tickets-list.component";
import { TicketsMyViewComponent } from "./component/customer/tickets-view.component";
import { SupportRequestViewComponent } from "./component/admin/support-request-view.component";
import { OrderListComponent } from "./component/admin/order-list.component";

const appRoutes: Routes = [
    // Guest routes
    { path: "login", component: LoginComponent, canActivate: [GuestGuard] },
    { path: "pwreset", component: ResetPasswordComponent, canActivate: [GuestGuard] },

    // Authenticated routes
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },

    // Customer routes
    { path: "customer/licensekeys", component: LicenseKeyMyListComponent, canActivate: [CustomerGuard] },
    { path: "customer/licensekeys/generate/:uuid", component: LicenseKeyMyGenerateComponent, canActivate: [CustomerGuard] },
    { path: "customer/licensekeys/view/:uuid", component: LicenseKeyMyViewComponent, canActivate: [CustomerGuard] },

    { path: "customer/tickets", component: TicketsMyListComponent, canActivate: [CustomerGuard] },
    { path: "customer/tickets/view/:uuid", component: TicketsMyViewComponent, canActivate: [CustomerGuard] },

    // Admin routes
    { path: "admin/brokers", component: BrokerListComponent, canActivate: [AdminGuard] },
    { path: "admin/brokers/new", component: BrokerEditComponent, canActivate: [AdminGuard] },
    { path: "admin/brokers/edit/:uuid", component: BrokerEditComponent, canActivate: [AdminGuard] },

    { path: "admin/customers", component: CustomerListComponent, canActivate: [AdminGuard] },
    { path: "admin/customers/new", component: CustomerEditComponent, canActivate: [AdminGuard] },
    { path: "admin/customers/edit/:uuid", component: CustomerEditComponent, canActivate: [AdminGuard] },

    { path: "admin/licensekeys", component: LicenseKeyListComponent, canActivate: [AdminGuard] },
    { path: "admin/licensekeys/new", component: LicenseKeyEditComponent, canActivate: [AdminGuard] },
    { path: "admin/licensekeys/edit/:uuid", component: LicenseKeyEditComponent, canActivate: [AdminGuard] },

    { path: "admin/supportrequests", component: SupportRequestListComponent, canActivate: [AdminGuard] },
    { path: "admin/supportrequests/new", component: SupportRequestEditComponent, canActivate: [AdminGuard] },
    { path: "admin/supportrequests/view/:uuid", component: SupportRequestViewComponent, canActivate: [AdminGuard] },

    { path: "admin/orders", component: OrderListComponent, canActivate: [AdminGuard] },

    { path: "admin/mailtemplates", component: MailTemplateListComponent, canActivate: [AdminGuard] },
    { path: "admin/mailtemplates/edit/:uuid", component: MailTemplateEditComponent, canActivate: [AdminGuard] },

    { path: "admin/products", component: ProductListComponent, canActivate: [AdminGuard] },
    { path: "admin/products/new", component: ProductEditComponent, canActivate: [AdminGuard] },
    { path: "admin/products/edit/:uuid", component: ProductEditComponent, canActivate: [AdminGuard] },
    { path: "admin/products/edit/:productUuid/variants/new", component: ProductVariantEditComponent, canActivate: [AdminGuard] },
    { path: "admin/products/edit/:productUuid/variants/edit/:uuid", component: ProductVariantEditComponent, canActivate: [AdminGuard] },

    { path: "admin/systemsettings", component: SystemSettingListComponent, canActivate: [AdminGuard] },
    { path: "admin/systemsettings/edit/:uuid", component: SystemSettingEditComponent, canActivate: [AdminGuard] },

    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
