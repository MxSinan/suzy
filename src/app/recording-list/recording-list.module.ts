import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { RecordingListRoutingModule } from "./recording-list-routing.module";
import { RecordingListComponent } from "./components/recording-list.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        RecordingListRoutingModule
    ],
    declarations: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RecordingListModule { }
