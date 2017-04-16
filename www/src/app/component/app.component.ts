import { Component } from "@angular/core";
import { Router, Event as RouterEvent, NavigationEnd } from "@angular/router";

@Component({
    selector: "div.main",
    template: `
        <router-outlet></router-outlet>
    `
})
export class AppComponent {
    constructor(private router: Router) {
        router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event);
        });
    }

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationEnd) {
            //$("#loading-layer").hide();
        }
    }
}
