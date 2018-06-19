import { StatusBarAlignment, StatusBarItem, window } from "vscode";
import { KeyOption } from "./KeybindingTreeTraverser";

export interface IKeybindingGuide {
    showOptions(options: ReadonlyArray<KeyOption>): void;
    removeText(): void;
    dispose(): void;
}

export class StatusBarKeybindingGuide implements IKeybindingGuide {
    private _statusBarItem: StatusBarItem;

    public constructor(statusBarItem: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left)) {
        this._statusBarItem = statusBarItem;
    }

    private static getOption(keyOption: KeyOption) {
        const noDescriptionString: string = "[No Description]";

        let optionDescription: string = noDescriptionString;
        if (keyOption.keybinding) {
            optionDescription =
                keyOption.keybinding.label
                || keyOption.keybinding.command
                || noDescriptionString;
        } else {
            optionDescription = noDescriptionString;
        }

        return `[${keyOption.key}]: ${optionDescription}`;
    }

    public showOptions(options: ReadonlyArray<KeyOption>): void {
        const text = options.map(StatusBarKeybindingGuide.getOption).join(" ");
        this._statusBarItem.show();
        this._statusBarItem.text = text;
    }

    public removeText() {
        this._statusBarItem.text = '';
        this._statusBarItem.hide();
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}