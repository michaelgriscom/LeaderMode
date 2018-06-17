import { StatusBarItem, window, StatusBarAlignment } from "vscode";
import { IKeyBinding } from "./configuration";

type KeyOption = { key: string, keyBinding?: IKeyBinding };

export interface IShortcutHinter {
    showOptions(options: ReadonlyArray<KeyOption>): void;
    removeText(): void;
    dispose(): void;
}

export function createShortcutHinter() {
    const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
    return new ShortcutHinter(statusBarItem);
}

export class ShortcutHinter implements IShortcutHinter {
    showOptions(options: ReadonlyArray<KeyOption>): void {
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

    public constructor(statusBarItem: StatusBarItem) {
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