import { Component, OnInit } from "@angular/core";

class Recording {
    constructor(public name: string) { }
}

let recordingNames = ["Bom Diggy Diggy", "Coca Cola", "Dilbar", "Kya Batt Ay", "Viah", "Dil Luteya",
    "Affair", "Ku Ku", "Devil", "Bom Diggy Diggy", "Coca Cola", "Dilbar", "Kya Batt Ay", "Viah", "Dil Luteya",
    "Affair", "Ku Ku", "Devil", "Bom Diggy Diggy", "Coca Cola", "Dilbar", "Kya Batt Ay", "Viah", "Dil Luteya",
    "Affair", "Ku Ku", "Devil"];

// let recordings = [{
//     "title": "Bom Diggy Diggy",
//     "url": "https://jatt.download/music/data/Hindi_Movies/201802/Sonu_Ke_Titu_Ki_Sweety/128/Bom_Diggy_Diggy.mp3"
// },
// {
//     "title": "Coca Cola",
//     "url": "https://jatt.download/music/data/Hindi_Movies/201902/Luka_Chuppi/128/Coca_Cola.mp3"
// },
// {
//     "title": "Dilbar",
//     "url": "https://jatt.download/music/data/Hindi_Movies/201808/Satyameva_Jayate/128/Dilbar.mp3"
// },
// {
//     "title": "Kya Batt Ay",
//     "url": "https://cdn10.upload.solutions/507337cbad4d644b32c16a9b4362b5b5/xiqov/Kya Baat Ay-(Mr-Jatt.com).mp3"
// },
// {
//     "title": "Viah",
//     "url": "https://cdn10.upload.solutions/647f71bfd6c20eb51b20084f134727be/tbaov/Viah-(Mr-Jatt.com).mp3"
// },
// {
//     "title": "Dil Luteya",
//     "url": "https://cdn7.upload.solutions/afd29c2f81fb508bab015a68318bb654/xiuuv/Dil Luteya-(Mr-Jatt.com).mp3"
// },
// {
//     "title": "Affair",
//     "url": "https://cdn7.upload.solutions/edb1d4a06d73658bc09b31a6e962c446/vxhuv/Affair-(Mr-Jatt.com).mp3"
// },
// {
//     "title": "Ku Ku",
//     "url": "https://cdn5.upload.solutions/f6ed863a2cae87daeeb1a5a81efa5188/mqmnv/Ku Ku-(Mr-Jatt.com).mp3"
// },
// {
//     "title": "Devil",
//     "url": "https://cdn10.upload.solutions/5a9cb493a1df274a352a06d059ea6536/qxqov/Devil-(Mr-Jatt.com).mp3"
// }]

@Component({
    selector: "RecordingList",
    moduleId: module.id,
    templateUrl: "./recording-list.component.html",
    styleUrls: ['./recording-list.component.css'],
})

export class RecordingListComponent implements OnInit {

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    public recordings: Array<Recording>;

    constructor() {
        this.recordings = [];

        for (let i = 0; i < recordingNames.length; i++) {
            this.recordings.push(new Recording(recordingNames[i]));
        }
    }

    public onItemTap(args) {
        console.log("Item Tapped at cell index: " + args.index);
    }

}

