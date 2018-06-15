import { StatusBarItem, window, StatusBarAlignment } from "vscode";

export default class ShortcutHinter {
    private _statusBarItem: StatusBarItem;

    public constructor(statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)) {
        this._statusBarItem = statusBarItem;
    }

    public showText(text: string) {
        this._statusBarItem.show();
        this._statusBarItem.text = text;
    }

    public removeText() {
        this._statusBarItem.text = '';
        this._statusBarItem.hide();
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}