import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { RecorderComponent } from "./recorder/components/recorder.component";
import { RecordingListComponent } from "./recording-list/components/recording-list.component";
import { PlayerComponent } from "./player/components/player.component";

const routes: Routes = [
    { path: "", redirectTo: "/recorder", pathMatch: "full" },
    { path: "recordingList", component: RecordingListComponent },
    { path: "player", component: PlayerComponent },
    { path: "recorder", component: RecorderComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
