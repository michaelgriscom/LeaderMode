import { IKeyTree } from "./keyTree";
import { createShortcutHinter, IShortcutHinter } from "./ShortcutHinter";
import * as vscode from 'vscode';

export interface ILeaderMode {
    enable(): void;
    disable(): void;
    dispose(): void;
}

export class LeaderMode implements ILeaderMode {
    private _keyTree: IKeyTree;
    private _typeCommandDisposable: vscode.Disposable;
    private _shortcutHinter: IShortcutHinter;
    private static readonly emptyDisposable = vscode.Disposable.from({ dispose: () => {}});

    public constructor(keyTree: IKeyTree, shortcutHinter: IShortcutHinter = createShortcutHinter()) {
        this._keyTree = keyTree;
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

        const traverser = this._keyTree.getTraverser();
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
                const binding = traverser.getTerminalBinding();
                vscode.commands.executeCommand(
                    binding.command!,
                    binding.args || []);
                this.disable();
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