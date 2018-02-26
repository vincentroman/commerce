import { NgModule, ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./component/home.component";
import { LoginComponent } from "./component/login.component";
import { GuestGuard } from "./guard/guest-guard.service";
import { AuthGuard } from "./guard/auth-guard.service";
import { AdminGuard } from "./guard/admin-guard.service";
import { BrokerListComponent } from "./component/admin/broker-list.component";
import { BrokerEditComponent } from "./component/admin/broker-edit.component";
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
import { BrokerTestComponent } from "./component/admin/broker-test.component";
import { OrderViewComponent } from "./component/admin/order-view.component";
import { UserListComponent } from "./component/admin/user-list.component";
import { UserEditComponent } from "./component/admin/user-edit.component";
import { LicenseKeyViewComponent } from "./component/admin/license-key-view.component";
import { BrokerProductVariantEditComponent } from "./component/admin/brokerproductvariant.component";
import { PurchaseComponent } from "./component/purchase.component";
import { ChangePasswordComponent } from "./component/change-password.component";
import { ProfileComponent } from "./component/profile.component";
import { ConfirmEmailComponent } from "./component/confirm-email.component";
import { ConfirmOrderComponent } from "./component/confirm-order.component";
import { VerifyDataComponent } from "./component/verify-data.component";
import { SendMailComponent } from "./component/admin/send-mail.component";

const appRoutes: Routes = [
    // "Any" routes
    { path: "purchase", component: PurchaseComponent },
    { path: "emailconfirm/:uuid", component: ConfirmEmailComponent },
    { path: "doi/:uuid", component: ConfirmOrderComponent },

    // Guest routes
    { path: "login", component: LoginComponent, canActivate: [GuestGuard] },
    { path: "pwreset", component: ResetPasswordComponent, canActivate: [GuestGuard] },
    { path: "pwchange/:uuid", component: ChangePasswordComponent, canActivate: [GuestGuard] },

    // Authenticated routes
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
    { path: "profile/verify", component: VerifyDataComponent, canActivate: [AuthGuard] },

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
    { path: "admin/brokers/test/:uuid", component: BrokerTestComponent, canActivate: [AdminGuard] },

    { path: "admin/licensekeys", component: LicenseKeyListComponent, canActivate: [AdminGuard] },
    { path: "admin/licensekeys/new", component: LicenseKeyEditComponent, canActivate: [AdminGuard] },
    { path: "admin/licensekeys/edit/:uuid", component: LicenseKeyEditComponent, canActivate: [AdminGuard] },
    { path: "admin/licensekeys/view/:uuid", component: LicenseKeyViewComponent, canActivate: [AdminGuard] },

    { path: "admin/supportrequests", component: SupportRequestListComponent, canActivate: [AdminGuard] },
    { path: "admin/supportrequests/new", component: SupportRequestEditComponent, canActivate: [AdminGuard] },
    { path: "admin/supportrequests/view/:uuid", component: SupportRequestViewComponent, canActivate: [AdminGuard] },

    { path: "admin/orders", component: OrderListComponent, canActivate: [AdminGuard] },
    { path: "admin/orders/view/:uuid", component: OrderViewComponent, canActivate: [AdminGuard] },

    { path: "admin/mailtemplates", component: MailTemplateListComponent, canActivate: [AdminGuard] },
    { path: "admin/mailtemplates/edit/:uuid", component: MailTemplateEditComponent, canActivate: [AdminGuard] },

    { path: "admin/products", component: ProductListComponent, canActivate: [AdminGuard] },
    { path: "admin/products/new", component: ProductEditComponent, canActivate: [AdminGuard] },
    { path: "admin/products/edit/:uuid", component: ProductEditComponent, canActivate: [AdminGuard] },
    { path: "admin/products/edit/:productUuid/variants/new", component: ProductVariantEditComponent, canActivate: [AdminGuard] },
    { path: "admin/products/edit/:productUuid/variants/edit/:uuid", component: ProductVariantEditComponent, canActivate: [AdminGuard] },
    { path: "admin/products/edit/:productUuid/brokervariant/:brokerUuid/:variantUuid",
        component: BrokerProductVariantEditComponent, canActivate: [AdminGuard] },

    { path: "admin/systemsettings", component: SystemSettingListComponent, canActivate: [AdminGuard] },
    { path: "admin/systemsettings/edit/:uuid", component: SystemSettingEditComponent, canActivate: [AdminGuard] },

    { path: "admin/users", component: UserListComponent, canActivate: [AdminGuard] },
    { path: "admin/users/new", component: UserEditComponent, canActivate: [AdminGuard] },
    { path: "admin/users/edit/:uuid", component: UserEditComponent, canActivate: [AdminGuard] },

    { path: "admin/sendmail", component: SendMailComponent, canActivate: [AdminGuard] },
    { path: "admin/sendmail/:uuid", component: SendMailComponent, canActivate: [AdminGuard] },

    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
