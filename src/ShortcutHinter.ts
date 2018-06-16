import { StatusBarItem, window, StatusBarAlignment } from "vscode";
import { IKeyBinding } from "./configuration";

export default class ShortcutHinter {
    showOptions(options: ReadonlyArray<{key: string, keyBinding: IKeyBinding}>): any {
        const text = options.map((option) => `[${option.key}]: ${option.keyBinding.label}`).join(" ");
        this._statusBarItem.show();
        this._statusBarItem.text = text;
    }

    private _statusBarItem: StatusBarItem;

    public constructor(statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)) {
        this._statusBarItem = statusBarItem;
    }

    public removeText() {
        this._statusBarItem.text = '';
        this._statusBarItem.hide();
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}