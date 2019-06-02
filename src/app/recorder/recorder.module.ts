import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { RecorderRoutingModule } from "./recorder-routing.module";
import { RecorderComponent } from "./components/recorder.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        RecorderRoutingModule
    ],
    declarations: [
        RecorderComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RecorderModule { }
