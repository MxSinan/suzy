import * as appSettings from "tns-core-modules/application-settings";

export class Values {

    public static X_ROLE_KEY: string = "x_role_key";
    public static SELECTED_OPTION: string = "selected_option";
    public static isNotNewUser: string="is_not_new_user"
    public static FACEBOOK_ACCESS_TOKEN="facebook_access_token"

    public static writeString(key: string, value: string): void {
        appSettings.setString(key, value);
    }

    public static readString(key: string, defaultValue: string): string {
        return appSettings.getString(key, defaultValue);
    }

    public static writeNumber(key: string, value: number): void {
        appSettings.setNumber(key, value);
    }

    public static readNumber(key: string, defaultValue: number): number {
        return appSettings.getNumber(key, defaultValue);
    }

    public static writeBoolean(key: string, value: boolean): void {
        appSettings.setBoolean(key, value);
    }

    public static readBoolean(key: string, defaultValue: boolean): boolean {
        return appSettings.getBoolean(key, defaultValue);
    }

    public static doesExist(key: string): boolean {
        return appSettings.hasKey(key);
    }

    public static remove(key: string) {
        appSettings.remove(key);
    }

}