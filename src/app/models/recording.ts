export class Recording {
    userid: string;
    baseUrl: String;

    constructor(obj?: any) {
        if (!obj) {
            return;

        }
        this.userid = obj.userid;
        this.baseUrl = obj.baseUrl;
    }
}