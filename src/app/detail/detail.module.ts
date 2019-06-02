import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { DetailRoutingModule } from "~/app/detail/detail-routing.module";
import { DetailComponent } from "./components/detail.component";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        DetailRoutingModule
    ],
    declarations: [
        DetailComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class DetailModule { }
