import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";
import { ExtendedNavigationExtras } from "nativescript-angular/router/router-extensions";
import { NavigationExtras, Router } from "@angular/router";


@Component({
    selector: "RecordingList",
    moduleId: module.id,
    templateUrl: "./recording-list.component.html",
    styleUrls: ['./recording-list.component.css'],
})

export class RecordingListComponent implements OnInit {

    recordingList;
    userId: string;

    constructor(private http: HttpClient,  private router: Router) {

        this.recordingList = [];
        this.userId = "user3@user3.nl"
        this.getDataFromServer();
    }

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    public onItemTap(args) {

        // let extras: ExtendedNavigationExtras = {
        //     queryParams: {
        //         'userid': this.userId,
        //         'Number': this.recordingList[args.index]
        //     }
        // }


        let navigationExtras: NavigationExtras = {
            queryParams: {
                'userid': this.userId,
                'Number': this.recordingList[args.index].Number
            }
        };

        this.router.navigate(['/player'], navigationExtras)
    }

    public getDataFromServer() {
        this.http.get(`http://suzie.kiws.nl/rest/api/v1/audio/recordings?userid=${this.userId}&offset=0&limit=20`).subscribe((res: any) => {
            console.log("RES:::", res)
            this.recordingList = res.recordings;
        }, error => {
            console.log("ERR:::", error)
        })
    }

    pageUnloaded() {
        this.recordingList = [];
    }

}

