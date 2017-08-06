import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule }    from "@angular/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./component/app.component";
import { HomeComponent } from "./component/home.component";
import { LoginComponent } from "./component/login.component";
import { NavComponent } from "./component/nav.component";

import { AuthService } from "./service/auth.service";
import { HttpService } from "./service/http.service";
import { SessionService } from "./service/session.service";

import { routing } from "./app.routing";
import { AuthGuard } from "./guard/auth-guard.service";
import { GuestGuard } from "./guard/guest-guard.service";
import { AdminGuard } from "./guard/admin-guard.service";
import { BrokerListComponent } from "./component/admin/broker-list.component";
import { BrokerService } from "./service/broker.service";
import { BrokerEditComponent } from "./component/admin/broker-edit.component";
import { ProductEditComponent } from "./component/admin/product-edit.component";
import { ProductListComponent } from "./component/admin/product-list.component";
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
import { LicenseKeyMyGenerateComponent } from "./component/customer/license-key-generate.component";
import { LicenseKeyMyViewComponent } from "./component/customer/license-key-view.component";
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
import { PersonService } from "./service/person.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule,
        routing
    ],
    declarations: [
        AppComponent,
        BrokerEditComponent,
        BrokerListComponent,
        BrokerTestComponent,
        BrokerProductVariantEditComponent,
        ChangePasswordComponent,
        HomeComponent,
        LicenseKeyListComponent,
        LicenseKeyEditComponent,
        LicenseKeyViewComponent,
        LicenseKeyMyListComponent,
        LicenseKeyMyViewComponent,
        LicenseKeyMyGenerateComponent,
        LoginComponent,
        MailTemplateEditComponent,
        MailTemplateListComponent,
        OrderListComponent,
        OrderViewComponent,
        PurchaseComponent,
        ProductListComponent,
        ProductEditComponent,
        ProductVariantEditComponent,
        NavComponent,
        ResetPasswordComponent,
        SupportRequestListComponent,
        SupportRequestEditComponent,
        SupportRequestViewComponent,
        SystemSettingListComponent,
        SystemSettingEditComponent,
        TicketsMyListComponent,
        TicketsMyViewComponent,
        UserEditComponent,
        UserListComponent
    ],
    providers: [
        AuthService,
        HttpService,
        SessionService,
        PersonService,
        BrokerService,
        AuthGuard,
        GuestGuard,
        AdminGuard,
        CustomerGuard
    ],
    bootstrap: [
        AppComponent,
        NavComponent
    ]
})
export class AppModule {}
