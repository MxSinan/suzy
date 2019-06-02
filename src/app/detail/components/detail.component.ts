import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { Observable, EventData } from "tns-core-modules/data/observable/observable";
import { Page, isAndroid } from "tns-core-modules/ui/page/page";
import * as application from "tns-core-modules/application";

@Component({
    selector: "Detail",
    moduleId: module.id,
    templateUrl: "./detail.component.html",
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

    songs = [{
        "title": "Recording 1",
        "url": "https://jatt.download/music/data/Hindi_Movies/201802/Sonu_Ke_Titu_Ki_Sweety/128/Bom_Diggy_Diggy.mp3"
    },
    {
        "title": "Recording 2",
        "url": "https://jatt.download/music/data/Hindi_Movies/201902/Luka_Chuppi/128/Coca_Cola.mp3"
    },
    {
        "title": "Recording 3",
        "url": "https://jatt.download/music/data/Hindi_Movies/201808/Satyameva_Jayate/128/Dilbar.mp3"
    },
    {
        "title": "Recording 4",
        "url": "https://cdn10.upload.solutions/507337cbad4d644b32c16a9b4362b5b5/xiqov/Kya Baat Ay-(Mr-Jatt.com).mp3"
    },
    {
        "title": "Recording 5",
        "url": "https://cdn10.upload.solutions/647f71bfd6c20eb51b20084f134727be/tbaov/Viah-(Mr-Jatt.com).mp3"
    },
    {
        "title": "Recording 6",
        "url": "https://cdn7.upload.solutions/afd29c2f81fb508bab015a68318bb654/xiuuv/Dil Luteya-(Mr-Jatt.com).mp3"
    },
    {
        "title": "Recording 7",
        "url": "https://cdn7.upload.solutions/edb1d4a06d73658bc09b31a6e962c446/vxhuv/Affair-(Mr-Jatt.com).mp3"
    },
    {
        "title": "Recording 8",
        "url": "https://cdn5.upload.solutions/f6ed863a2cae87daeeb1a5a81efa5188/mqmnv/Ku Ku-(Mr-Jatt.com).mp3"
    },
    {
        "title": "Recording 9",
        "url": "https://cdn10.upload.solutions/5a9cb493a1df274a352a06d059ea6536/qxqov/Devil-(Mr-Jatt.com).mp3"
    }]

    listBackground: string;

    commentsExist: boolean = false;
    comments = new ObservableArray();
    constructor(private activatedRoute: ActivatedRoute, private router: Router, private routerExtensions: RouterExtensions, private http: HttpClient) {

        this.listBackground = "Unselected";

    }

    public onSongTap(args) {

        this.listBackground = "Selected"

        let navigationExtras: NavigationExtras = {
            queryParams: {
                // "id": this.songId,
                // "name": this.songName,
                // "thumbnail": this.songThumbnail,
                "song": JSON.stringify(this.songs[args.index])
                // "isFavourite": this.songIsFavourite
            },
        };
        console.log("SOSOSOS", this.songs[args.index])
        this.router.navigate(["/player"], navigationExtras)
    }

    ngOnInit(): void {
        if (isAndroid) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
                args.cancel = true;
                // this.routerExtensions.back();
            });
        }
    }

    pageLoaded(args: EventData) {
        console.log("Page Loaded called")
    }


    pageUnloaded() {
    }

    ngOnDestroy(): void {
        if (isAndroid) {
            application.off(application.AndroidApplication.activityBackPressedEvent, (result) => {
                console.log("Removed")
            });

        }
    }
}