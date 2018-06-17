import { StatusBarItem, window, StatusBarAlignment } from "vscode";
import { IKeyBinding } from "./configuration";

type KeyOption = { key: string, keyBinding?: IKeyBinding };

export default class ShortcutHinter {
    showOptions(options: ReadonlyArray<KeyOption>): any {
        const text = options.map(ShortcutHinter.getOption).join(" ");
        this._statusBarItem.show();
        this._statusBarItem.text = text;
    }

    private static getOption(keyOption: KeyOption) {
        const noDescriptionString: string = "[No Description]";

        let optionDescription: string = noDescriptionString;
        if (keyOption.keyBinding) {
            optionDescription=
                keyOption.keyBinding.label
                || keyOption.keyBinding.command
                || noDescriptionString;
        } else {
            optionDescription = noDescriptionString;
        }

        return `[${keyOption.key}]: ${optionDescription}`;
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