import { StatusBarAlignment, StatusBarItem, window } from "vscode";
import { KeyOption } from "./KeybindingTreeTraverser";
import { noLabel } from "./strings";

export interface IKeybindingGuide {
    show(options: ReadonlyArray<KeyOption>): void;
    hide(): void;
    dispose(): void;
}

export class KeybindingGuideStub implements IKeybindingGuide {
    public show(): void {
    }

    public hide(): void {
    }

    public dispose(): void {
    }
}

export class StatusBarKeybindingGuide implements IKeybindingGuide {
    private _statusBars: StatusBarItem[];
    private _statusBarItemFactory: () => StatusBarItem;

    public constructor(statusBarItemFactory: () => StatusBarItem
        = window.createStatusBarItem.bind(StatusBarAlignment.Left)) {
        this._statusBars = [];
        this._statusBarItemFactory = statusBarItemFactory;
    }

    private static getOption(keyOption: KeyOption) {
        const noDescriptionString: string = noLabel;

        let optionDescription: string = noDescriptionString;
        if (keyOption.keybinding) {
            optionDescription =
                keyOption.keybinding.label
                || keyOption.keybinding.command
                || noDescriptionString;
        } else {
            optionDescription = noDescriptionString;
        }

        const isCommand: boolean =
            keyOption.keybinding !== undefined
            && keyOption.keybinding.command !== undefined;

        if (isCommand) {
            return `[ ${keyOption.key} ] - ${optionDescription}`;
        } else {
            return `[ ${keyOption.key} ] - (${optionDescription})`;
        }
    }

    public show(options: ReadonlyArray<KeyOption>): void {
        this._statusBars.forEach((statusBar) => statusBar.dispose());
        this._statusBars = options.map((option) => {
            const statusBar = this._statusBarItemFactory();
            statusBar.text = StatusBarKeybindingGuide.getOption(option);
            statusBar.command = option.keybinding && option.keybinding.command;
            statusBar.show();
            return statusBar;
        });
    }

    public hide() {
        this.disposeStatusBars();
    }

    public dispose() {
        this.disposeStatusBars();
    }

    private disposeStatusBars() {
        this._statusBars.forEach((statusBar) => statusBar.dispose());
    }
}