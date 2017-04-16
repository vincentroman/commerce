import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule }    from "@angular/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./component/app.component";
import { LoginComponent } from "./component/login.component";
import { NavComponent } from "./component/nav.component";

import { AuthService } from "./service/auth.service";
import { HttpService } from "./service/http.service";
import { SessionService } from "./service/session.service";

import { routing } from "./app.routing";

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
        LoginComponent,
        NavComponent
    ],
    providers: [
        AuthService,
        HttpService,
        SessionService
    ],
    bootstrap: [
        AppComponent,
        NavComponent
    ]
})
export class AppModule {}
