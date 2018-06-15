export class GlobalState {
    private static _isActive: boolean = false;

    public static get isActive(): boolean {
        return GlobalState._isActive;
    }

    public static set isActive(value: boolean) {
        console.log("setting isActive " + value);
        GlobalState._isActive = value;
    }
}