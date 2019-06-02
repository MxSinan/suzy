import { Component, OnInit, SystemJsNgModuleLoader } from "@angular/core";
import { TNSRecorder, TNSPlayer } from "nativescript-audio";
import { RouterExtensions } from "nativescript-angular/router"
import * as fs from "tns-core-modules/file-system";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as CryptoJS from 'crypto-js'
import { Buffer } from 'buffer'
import * as btoa from 'btoa'
import * as atob from 'atob'

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
        this.getBase64(this.recordingFile)
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

        console.log('whether song play completed successfully:', args.flag);
        this.showPause = false;
        this.showPlay = true;
    }

    private _trackError(args: any) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);

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

    getEncodedBase64String(buffer) {

        var bytes = new Uint8Array(buffer);
        var len = buffer.length;
        var binary = "";
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    getDecordedData(buffer) {

        var binary = atob(buffer);
        var buffer2 = new ArrayBuffer(binary.length);
        console.log("NUM", buffer2.byteLength)
        var arr = new Array(buffer2.byteLength)
        var bytes = new Uint8Array(buffer2);
        for (var i = 0; i < buffer2.byteLength; i++) {
            bytes[i] = binary.charCodeAt(i) & 0xFF;
            arr[i] = binary.charCodeAt(i) & 0xFF;
        }
        return arr;
    }

    getBase64(file: fs.File) {

        let data = file.readSync();
        var data2 = this.getEncodedBase64String(data);
        this.base64 = data2;
        var bin = this.getDecordedData(data2)
        console.log("vin:", bin)

        var fl = fs.File.fromPath('/storage/emulated/0/mymy.mp3');
        fl.writeSync(bin, (error => {
            console.log("ERER:", error)
        }))

    }

    saveDataAtServer() {

        this.getBase64(this.recordingFile)

        var headers = {
            "Content-Type": "application/json"
        };

        var body = {
            "userid": "user3@user3.nl",
            "base": "data:audio/mp3;base64," + this.base64
        }

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
        this.routerExtensions.navigate(["/recordingList"]);
    }
}