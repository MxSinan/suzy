import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { RecordingListComponent } from "~/app/recording-list/components/recording-list.component";

const routes: Routes = [
    { path: "", component: RecordingListComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class RecordingListRoutingModule { }
