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
import { BrokerListComponent } from "./component/broker-list.component";
import { UserService } from "./service/user.service";
import { BrokerService } from "./service/broker.service";
import { BrokerEditComponent } from "./component/broker-edit.component";
import { CustomerListComponent } from "./component/customer-list.component";
import { CustomerEditComponent } from "./component/customer-edit.component";
import { ProductEditComponent } from "./component/product-edit.component";
import { ProductListComponent } from "./component/product-list.component";
import { ProductVariantEditComponent } from "./component/product-variant-edit.component";
import { MailTemplateListComponent } from "./component/mail-template-list.component";
import { MailTemplateEditComponent } from "./component/mail-template-edit.component";
import { ResetPasswordComponent } from "./component/reset-password.component";

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
        CustomerEditComponent,
        CustomerListComponent,
        HomeComponent,
        LoginComponent,
        MailTemplateEditComponent,
        MailTemplateListComponent,
        ProductListComponent,
        ProductEditComponent,
        ProductVariantEditComponent,
        NavComponent,
        ResetPasswordComponent
    ],
    providers: [
        AuthService,
        HttpService,
        SessionService,
        UserService,
        BrokerService,
        AuthGuard,
        GuestGuard,
        AdminGuard
    ],
    bootstrap: [
        AppComponent,
        NavComponent
    ]
})
export class AppModule {}
