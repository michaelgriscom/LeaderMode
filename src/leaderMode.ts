import { KeyTree } from "./keyTree";
import { TreeTraverser } from "./treeTraverser";
import { createShortcutHinter, IShortcutHinter } from "./ShortcutHinter";
import { IConfiguration } from "./configuration";
import * as vscode from 'vscode';

export interface ILeaderMode {
    enable(): void;
    disable(): void;
    dispose(): void;
}

export function createLeaderMode(config: IConfiguration) {
    const shortcutHinter = createShortcutHinter();
    return new LeaderMode(config, shortcutHinter);
}

export class LeaderMode implements ILeaderMode {
    private _keyTree: KeyTree;
    private _typeCommandDisposable: vscode.Disposable;
    private _shortcutHinter: IShortcutHinter;
    private static readonly emptyDisposable = vscode.Disposable.from({ dispose: () => {}});

    public constructor(config: IConfiguration, shortcutHinter: IShortcutHinter) {
        this._keyTree = new KeyTree(config.keyBindings);
        this._shortcutHinter = shortcutHinter;
        this._typeCommandDisposable = LeaderMode.emptyDisposable;
    }

    private isEnabled(): boolean {
        return this._typeCommandDisposable !== LeaderMode.emptyDisposable;
    }

    enable() {
        if (this.isEnabled()) {
            return;
        }

        const traverser = new TreeTraverser(this._keyTree);
        const options = traverser.getCurrentOptions();
        this._shortcutHinter.showOptions(options);

        this._typeCommandDisposable = vscode.commands.registerCommand('type', async args => {
            try {
                traverser.chooseOption(args.text);
            } catch {
                this.disable();
                this._shortcutHinter.removeText();
                return;
            }

            if (traverser.isTerminal()) {
                const command = traverser.getCommand();
                vscode.commands.executeCommand(command);
                return;
            }

            const options = traverser.getCurrentOptions();
            this._shortcutHinter.showOptions(options);
        });
    }

    disable() {
        if (!this.isEnabled) {
            return;
        }

        this._typeCommandDisposable.dispose();
        this._typeCommandDisposable = LeaderMode.emptyDisposable;
        this._shortcutHinter.removeText();
    }

    dispose() {
        this._shortcutHinter.dispose();
        this._typeCommandDisposable.dispose();
    }
}