import { Component, OnInit, SystemJsNgModuleLoader } from "@angular/core";
import { TNSRecorder, TNSPlayer } from "nativescript-audio";
import { RouterExtensions } from "nativescript-angular/router"
import * as fs from "tns-core-modules/file-system";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as CryptoJS from 'crypto-js'
// import { fileToBase64 } from "file-base64-util";
// import * as base64 from "file-base64";
import { Buffer } from 'buffer'

@Component({
    selector: "Recorder",
    moduleId: module.id,
    templateUrl: "./recorder.component.html",
    styleUrls: ['./recorder.component.css'],
})

export class RecorderComponent {

    player: TNSPlayer;
    recorder: TNSRecorder;
    isRecording: boolean;
    recorderOptions;
    playerOptions;
    recordingFile;
    showPlay;
    showPause;
    showConfirm;
    audioFolder;
    base64;

    constructor(private routerExtensions: RouterExtensions, private http: HttpClient) {
        this.recorder = new TNSRecorder();
        this.player = new TNSPlayer();
        this.audioFolder = fs.knownFolders.currentApp().getFolder('audio')
        // this.addd = '/storage/emulated/0';

        this.recorderOptions = {
            filename: this.audioFolder.path + '/recording.mp3',
            infoCallback: function () {
                console.log('infoCallback');
            },
            errorCallback: function () {
                console.log('errorCallback');
                alert('Error recording.');
            }
        };
    }

    onStartTap() {
        if (TNSRecorder.CAN_RECORD) {
            this.recorder.start(this.recorderOptions).then((res) => {
                this.showPlay = false;
                this.showPause = false;
                this.showConfirm = false;
            }, (err) => {
                console.log('ERROR: ', err);
            });
        }
        else {
            alert('This device cannot record audio.');
        }
    }

    onStopTap() {
        this.recorder.stop();
        this.recordingFile = fs.File.fromPath(fs.path.join(fs.knownFolders.currentApp().getFolder('audio').path, 'recording.mp3'));
        console.log('File:', this.recordingFile.path);
        if (this.recordingFile.path != null) {
            this.showPlay = true;
            this.showPause = false;
            this.showConfirm = true;
        }
    }

    onConfirmTap() {
        this.saveDataAtServer();
    }

    onCancelTap() {
        this.showPlay = false;
        this.showPause = false;
        this.showConfirm = false;
    }

    private _trackComplete(args: any) {
        console.log('reference back to player:', args.player);

        // iOS only: flag indicating if completed successfully
        console.log('whether song play completed successfully:', args.flag);
        this.showPause = false;
        this.showPlay = true;
    }

    private _trackError(args: any) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);

        // Android only: extra detail on error
        console.log('extra info on the error:', args.extra);
    }

    onPlayPauseTap() {
        this.playerOptions = {
            audioFile: this.recordingFile.path,
            loop: false,
            autoplay: true,
            completeCallback: this._trackComplete.bind(this),
            errorCallback: this._trackError.bind(this)
        };
        this.player.playFromFile(this.playerOptions).then((res) => {
            this.player.getAudioTrackDuration().then((duration) => {
                // iOS: duration is in seconds
                // Android: duration is in milliseconds
                console.log(`song duration:`, duration);
            });
        })
        if (this.player.isAudioPlaying()) {
            this.player.pause();
            this.showPlay = true;
            this.showPause = false;
        }
        else {
            this.player.play();
            this.showPlay = false;
            this.showPause = true;
        }
    }

    getBase64(file: fs.File) {


        //encryption algo
        let data = file.readSync();
        var words = CryptoJS.enc.Utf8.parse(data);
        this.base64 = CryptoJS.enc.Base64.stringify(words);

        //decrytion algo
        // var words2 = CryptoJS.enc.Base64.parse(base64);
        // var textString = CryptoJS.enc.Utf8.stringify(words2);

        // var fl: fs.File = fs.File.fromPath('/storage/emulated/0/mg.mp3');
        // fl.writeSync(data);


    }

    saveDataAtServer() {

        this.getBase64(this.recordingFile)

        var headers = {
            "Content-Type": "application/json"
        };

        var body = {
            "userid": "sinan@karakurt.nl",
            "base": "data:audio/mp3;base64," + this.base64
        }

        console.log(body.base);

        this.http.post("http://suzie.kiws.nl/rest/api/v1/audio/submit", body, { headers: headers }).subscribe((response: any) => {
            alert("Recording is saved");
            this.showPlay = false;
            this.showPause = false;
            this.showConfirm = false;
        }, error => {
            console.log("error is", error);
        });
    }

    onListTap() {
        this.routerExtensions.navigate(["/detail"]);
    }
}