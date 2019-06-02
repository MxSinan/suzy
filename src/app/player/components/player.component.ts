import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { TNSPlayer } from 'nativescript-audio';
import { screen, isAndroid } from "tns-core-modules/platform";
import { Label } from "tns-core-modules/ui/label/label";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ExtendedNavigationExtras } from "nativescript-angular/router/router-extensions";
import { Page, EventData, Observable } from "tns-core-modules/ui/page/page";
import { ImageSource, fromResource, fromBase64 } from "tns-core-modules/image-source/image-source";
import { RadialBarIndicator } from "nativescript-ui-gauge";
import * as application from "tns-core-modules/application";

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

    // songs = ["https://jatt.download/music/data/Hindi_Movies/201802/Sonu_Ke_Titu_Ki_Sweety/128/Bom_Diggy_Diggy.mp3", "https://jatt.download/music/data/Hindi_Movies/201902/Luka_Chuppi/128/Coca_Cola.mp3", "https://jatt.download/music/data/Hindi_Movies/201808/Satyameva_Jayate/128/Dilbar.mp3"]

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
    constructor(private activatedRoute: ActivatedRoute, private routerExtensions: RouterExtensions, private http: HttpClient,) {
        this.player = new TNSPlayer();
        this.passedTime = "00"
        this.remainingTime = "00"
        this.isRendering = false;

        this.activatedRoute.queryParams.subscribe(params => {
            // this.songName = params.name;
            // this.songId = params.id;
            this.song = JSON.parse(params["song"]);
            this.songName = this.song.title;
            console.log("SSSSSSSSSSSSSSSSSS", this.song)
            // this.songThumbnail = params.thumbnail;
            // this.songUrl = params.url;
            // this.songIsFavourite = params.isFavourite;

            // if (this.songName != null && this.songName != undefined && this.songName != "") {
            // }
            // if (this.songId != null && this.songId != undefined && this.songId != "") {
            //     this.getFileById();
            // }

            // if (this.songService.getPlayer().isAudioPlaying()) {
            //     var button = this.buttonRef.nativeElement as Button;
            //     button.backgroundImage = 'res://pause'
            // }
            // else {
            //     var button = this.buttonRef.nativeElement as Button;
            //     button.backgroundImage = 'res://play'
            // }

            // if (this.songThumbnail != null && this.songThumbnail != undefined) {
            //     if (<ImageSource>this.getThumbnailSrc(this.songThumbnail) != null && <ImageSource>this.getThumbnailSrc(this.songThumbnail) != undefined) {
            //         this.thumbnail = <ImageSource>this.getThumbnailSrc(this.songThumbnail);
            //     }
            //     else {
            //         this.thumbnail = <ImageSource>fromResource("img_video_default");
            //     }
            // }
            // else {
            //     this.thumbnail = <ImageSource>fromResource("img_video_default");
            // }
        })

        // this.userService.userChanges.subscribe(user => {
        //     if (user == null || user == undefined) {

        //         let extendedNavigationExtras: ExtendedNavigationExtras = {
        //             queryParams: {
        //                 "user": null
        //             },
        //         };
        //         this.routerExtensions.navigate(["/home"], extendedNavigationExtras)
        //     }
        // })

        // this.userService.playerButtonChanges.subscribe((state: boolean) => {
        //     if (state) {
        //         var button = this.buttonRef.nativeElement as Button;
        //         button.backgroundImage = 'res://pause'
        //     }
        //     else {
        //         var button = this.buttonRef.nativeElement as Button;
        //         button.backgroundImage = 'res://play'
        //     }
        // })

        const playerOptions = {
            audioFile: this.song.url,
            loop: false,
            autoplay: true,
        };
        var that = this;
        this.player
            .playFromUrl(playerOptions)
            .then((res) => {
                // that.isRendering = true;
                console.log("EEEEEEE", res);
                // that.songService.setPlayer(that.player);
                // GlobalNotificationBuilder.setSongService(this.songService)
                // var button = this.buttonRef.nativeElement as Button;
                // button.backgroundImage = 'res://pause'
            }).then(() => {
                that.isRendering = true;
                // console.log("Afterrtrtyryry")
            })
            .catch((err) => {
                console.log("something went wrong...", err);
            });
    }

    onBackButtonPress() {
        // this.songService.pause();
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


    getSeconds(duration: number) {
        return Math.floor((duration / 1000) % 60);
    }

    getMinutes(duration: number) {
        return Math.floor((duration / 1000) / 60);
    }

    getHours(duration: number) {
        return Math.floor((duration / 1000) / 3600);
    }

    durationConverter(duration: number) {
        let seconds: number;
        let minutes: number;
        let hours: number;
        let durationRaw: number
        durationRaw = duration / 1000;

        if (Math.floor(durationRaw / 60) > 0) {
            minutes = Math.floor(durationRaw / 60);
            seconds = durationRaw % 60;
            if (minutes / 60 > 0) {
                hours = Math.floor(minutes / 60);
                minutes = minutes % 60;
            }
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

    // getFileById() {
    //     let headers = new HttpHeaders({
    //         "Content-Type": "application/json",
    //         "x-tenant-code": "music",
    //         "x-role-key": Values.readString(Values.X_ROLE_KEY, "")
    //     });


    //     this.http.get("http://docs-api-dev.m-sas.com/api/files/" + this.songId, { headers: headers }).subscribe((res: any) => {

    //         if (res.isSuccess) {
    //             let result: any
    //             result = res.data
    //             this.songUrl = result.url;
    //         }
    //         else {
    //             // alert(res.error)
    //         }
    //     },
    //         error => {
    //             // alert(error)
    //         })
    // }


    ngAfterViewInit(): void {
        // var button = this.buttonRef.nativeElement as Button;
        var labelPas = this.labelPasRef.nativeElement as Label;
        var labelRem = this.labelRemRef.nativeElement as Label;
        // button.backgroundImage = 'res://play'
        let that = this;
        that.current = 0;


        // this.renderViewTimeout = setTimeout(() => {
        //     this.isRendering = true;
        // }, 1000)


        // setInterval(() => {
        //     let remaining: number = 0;
        //     // that.current = that.songService.getPlayer().currentTime
        //     let progress: number = 0;
        //     let progressIndicator = that.progressIndicatorRef.nativeElement as RadialBarIndicator;

        //     this.songService.getPlayer().getAudioTrackDuration().then((durationStr: string) => {
        //         let duration = parseInt(durationStr, 10)
        //         if (duration != NaN && duration != undefined && duration != 0) {
        //             that.duration = duration;
        //             if (that.current != NaN && that.current != undefined && that.current != 0) {
        //                 progress = (that.current / that.duration) * 100;
        //                 that.progress = progress;
        //                 progressIndicator.maximum = progress;
        //                 remaining = that.duration - that.current;

        //                 this.currentSec = this.getSeconds(that.current);
        //                 this.currentMin = this.getMinutes(that.current);
        //                 this.currentHour = this.getHours(that.current);

        //                 this.remainingSec = this.getSeconds(remaining)
        //                 this.remainingMin = this.getMinutes(remaining)
        //                 this.remainingHour = this.getHours(remaining)


        //                 var remSec;
        //                 var remMin;
        //                 var remHour;

        //                 var pasSec;
        //                 var pasMin;
        //                 var pasHour;

        //                 if (this.remainingSec < 10) {
        //                     remSec = "0" + this.remainingSec;
        //                 }
        //                 else {
        //                     remSec = this.remainingSec;
        //                 }

        //                 if (this.remainingMin < 10) {
        //                     remMin = "0" + this.remainingMin;
        //                 }
        //                 else {
        //                     remMin = this.remainingMin;
        //                 }

        //                 if (this.remainingHour < 10) {
        //                     remHour = "0" + this.remainingHour;
        //                 }
        //                 else {
        //                     remHour = this.remainingHour;
        //                 }
        //                 this.remainingTime = remHour + ":" + remMin + ":" + remSec + "";

        //                 if (this.currentSec < 10) {
        //                     pasSec = "0" + this.currentSec;
        //                 }
        //                 else {
        //                     pasSec = this.currentSec;
        //                 }

        //                 if (this.currentMin < 10) {
        //                     pasMin = "0" + this.currentMin;
        //                 }
        //                 else {
        //                     pasMin = this.currentMin;
        //                 }

        //                 if (this.currentHour < 10) {
        //                     pasHour = "0" + this.currentHour;
        //                 }
        //                 else {
        //                     pasHour = this.currentHour;
        //                 }

        //                 this.passedTime = pasHour + ":" + pasMin + ":" + pasSec + "";
        //                 labelPas.text = this.passedTime;
        //                 labelRem.text = this.remainingTime;
        //             }
        //             else {
        //                 progress = 0;
        //                 that.progress = progress;
        //                 progressIndicator.maximum = progress;
        //             }
        //         }
        //     })
        // }, 1000);

    }

    playPause() {
        // if (this.songService.getPlayer().isAudioPlaying()) {
        //     this.songService.playerState(false);
        //     this.songService.getPlayer().pause();
        //     var button = this.buttonRef.nativeElement as Button;
        //     button.backgroundImage = 'res://play'
        //     console.log("SER:", this.songService)

        // } else {
        //     this.songService.getPlayer().play();
        //     this.songService.playerState(true);
        //     var button = this.buttonRef.nativeElement as Button;
        //     button.backgroundImage = 'res://pause'
        //     console.log("SER:", this.songService)
        // }
    }

  
    ngOnDestroy() {
        if (isAndroid) {
            application.off(application.AndroidApplication.activityBackPressedEvent, (result) => {
                console.log("Removed")
            });

        }

        // this.songService.getPlayer().dispose()
        clearInterval(this._checkInterval);
        clearTimeout(this.renderViewTimeout);
    }

}
