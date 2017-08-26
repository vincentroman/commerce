import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";
import "jquery";
import "bloodhound";
import "typeahead.js";

import { AppModule } from "./app.module";

if (location.hostname !== "localhost") {
    enableProdMode();
}
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);

window.setInterval(function() {
    let navHeight: number = $(".navbar-collapse").height();
    let mainHeight: number = $(".main").outerHeight();
    let windowInnerHeight: number = window.innerHeight;
    let targetHeight: number = Math.max(navHeight, mainHeight, windowInnerHeight);
    $(".navbar").height(targetHeight - 2);
}, 250);
