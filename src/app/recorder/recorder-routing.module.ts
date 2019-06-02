import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { RecorderComponent } from "~/app/recorder/components/recorder.component";

const routes: Routes = [
    { path: "", component: RecorderComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class RecorderRoutingModule { }
