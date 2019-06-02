import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { TNSPlayer } from 'nativescript-audio';
import { screen, isAndroid } from "tns-core-modules/platform";
import { Label } from "tns-core-modules/ui/label/label";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient } from "@angular/common/http";
import { Page, EventData, Observable } from "tns-core-modules/ui/page/page";
import { ImageSource, fromResource, fromBase64 } from "tns-core-modules/image-source/image-source";
import * as application from "tns-core-modules/application";
import { knownFolders, File } from "tns-core-modules/file-system/file-system";

@Component({
    selector: "Player",
    moduleId: module.id,
    templateUrl: "./player.component.html",
    styleUrls: ['./player.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('stack') stackRef: ElementRef;
    @ViewChild('button') buttonRef: ElementRef;
    @ViewChild('labelRem') labelRemRef: ElementRef;
    @ViewChild('labelPas') labelPasRef: ElementRef;
    @ViewChild('barIndicator') progressIndicatorRef: ElementRef;



    userId: string;
    id: number;
    filePath: string;
    playerClass: string;

    page: Page


    progress = 0;
    tnsPlayer: TNSPlayer;
    animationSet: Animation;
    duration: number;
    current: number;
    currentSec: number;
    currentMin: number;
    currentHour: number;

    remainingSec: number;
    remainingMin: number;
    remainingHour: number;

    viewModel;

    count = 0;

    player: TNSPlayer;
    _checkInterval;
    progressProperty = new Observable();

    isPlaying = false;
    isBusy = true;
    buttonStyle: string;
    buttonStylePlay = 'buttonPlay';
    buttonStylePause = 'buttonPause';

    passedTime: string;
    remainingTime: string;

    labelRem;
    labelPas;
    progressIndicator;

    song;
    songName
    songId
    songThumbnail
    songUrl
    songIsFavourite;

    thumbnail;
    screenHeight = screen.mainScreen.heightDIPs;
    screenWidth = screen.mainScreen.widthDIPs;

    screenRatio = this.screenHeight / this.screenWidth;

    discHeight = 80 / this.screenRatio;

    discHeightStr = this.discHeight + "%"


    disc = 80 / this.screenRatio + '%';
    isRendering: boolean;
    renderViewTimeout;
    constructor(private activatedRoute: ActivatedRoute, private routerExtensions: RouterExtensions, private http: HttpClient, ) {
        this.player = new TNSPlayer();
        this.passedTime = "00"
        this.remainingTime = "00"
        this.isRendering = false;

        this.id = 0;
        this.userId = "user3@user3.nl"

        this.activatedRoute.queryParams.subscribe(params => {
            this.id = JSON.parse(params["Number"]);
            this.userId = JSON.parse(params["userid"]);
        })
        this.userId = "user3@user3.nl"
        this.filePath = knownFolders.currentApp().getFile('recording.mp3').path;
        this.playerClass = "button"

        this.getSongFromServer();
    }

    onBackButtonPress() {
        this.routerExtensions.back();
    }

    random() {
        return Math.floor(Math.random() * 2)
    }

    pageLoaded(args: EventData) {
        this.page = args.object as Page;
    }

    getThumbnailSrc(data: string) {
        if (data != null && data != undefined) {
            let base64Data = data.split(',');
            if (base64Data.length == 2) {
                if (base64Data[1] != null && base64Data[1] != undefined) {
                    const imageSrc = fromBase64(base64Data[1]);
                    return imageSrc;
                }
                else {
                    const imgFromResources: ImageSource = <ImageSource>fromResource("img_video_default");
                    return imgFromResources;
                }
            } else {
                const imgFromResources: ImageSource = <ImageSource>fromResource("img_video_default");
                return imgFromResources;
            }

        }
        else {
            const imgFromResources: ImageSource = <ImageSource>fromResource("img_video_default");
            return imgFromResources;
        }
    }

    ngOnInit() {
        var that = this;
        if (isAndroid) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
                args.cancel = true;
            });
        }

    }

    ngAfterViewInit(): void {
        var labelPas = this.labelPasRef.nativeElement as Label;
        var labelRem = this.labelRemRef.nativeElement as Label;
        let that = this;
        that.current = 0;
    }


    async initPlayer() {
        var that = this;

        const playerOptions = {
            audioFile: this.filePath,
            loop: false,
            autoplay: true,
        };

        await this.player
            .playFromFile(playerOptions)
            .then((res) => {
                console.log("EEEEEEE", res);
            }).then(() => {
                that.isRendering = true;
            })
            .catch((err) => {
                console.log("something went wrong...", err);
            });
    }

    async  getSongFromServer() {

        console.log("US:", this.userId)
        console.log("id:", this.id)

        await this.http.get(`http://suzie.kiws.nl/rest/api/v1/audio/recording?userid=${this.userId}&id=${this.id}`).subscribe((res) => {
            console.log("Res:", res)

            this.initPlayer();
            this.isPlaying = true;
        }, error => {
            console.log("Error:", error);
        })
    }

    playPause() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.playerClass = "buttonPause"
        } else {
            this.isPlaying = false;
            this.playerClass = "button"
        }
    }


    ngOnDestroy() {
        if (isAndroid) {
            application.off(application.AndroidApplication.activityBackPressedEvent, (result) => {
                console.log("Removed")
            });
        }

        clearInterval(this._checkInterval);
        clearTimeout(this.renderViewTimeout);
    }

}
