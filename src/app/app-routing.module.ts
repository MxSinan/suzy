import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { RecorderComponent } from "./recorder/components/recorder.component";
import { RecordingListComponent } from "./recording-list/components/recording-list.component";
import { PlayerComponent } from "./player/components/player.component";

const routes: Routes = [
    { path: "player", component: PlayerComponent },
    { path: "recorder", component: RecorderComponent },
    { path: "", redirectTo: "/recorder", pathMatch: "full" },
    { path: "recordingList", component: RecordingListComponent },
    { path: "detail", loadChildren: "~/app/detail/detail.module#DetailModule" },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
