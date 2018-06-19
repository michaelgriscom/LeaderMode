import * as vscode from 'vscode';
import { IKeybindingGuide, StatusBarKeybindingGuide } from './KeybindingGuide';
import { IKeybindingTree } from "./KeybindingTree";

export interface ILeaderMode {
    enable(): void;
    disable(): void;
    dispose(): void;
}

export class LeaderMode implements ILeaderMode {
    private static readonly emptyDisposable = vscode.Disposable.from({ dispose: () => { } });
    private _keybindingTree: IKeybindingTree;
    private _typeCommandDisposable: vscode.Disposable;
    private _keybindingGuide: IKeybindingGuide;

    public constructor(keybindingTree: IKeybindingTree,
        keybindingGuide: IKeybindingGuide = new StatusBarKeybindingGuide()) {
        this._keybindingTree = keybindingTree;
        this._keybindingGuide = keybindingGuide;
        this._typeCommandDisposable = LeaderMode.emptyDisposable;
    }
    public enable() {
        if (this.isEnabled()) {
            return;
        }

        const traverser = this._keybindingTree.getTraverser();
        const options = traverser.getAllowedKeys();
        this._keybindingGuide.showOptions(options);
        this._typeCommandDisposable = vscode.commands.registerCommand('type', async args => {
            try {
                traverser.selectKey(args.text);
            } catch {
                this.disable();
                return;
            }

            if (traverser.isTerminal()) {
                const binding = traverser.getTerminalKeybinding();
                await vscode.commands.executeCommand(
                    binding.command!,
                    binding.args || []);
                this.disable();
                return;
            }

            const options = traverser.getAllowedKeys();
            this._keybindingGuide.showOptions(options);
        });
    }

    public disable() {
        if (!this.isEnabled) {
            return;
        }

        this._typeCommandDisposable.dispose();
        this._typeCommandDisposable = LeaderMode.emptyDisposable;
        this._keybindingGuide.removeText();
    }

    public dispose() {
        this._keybindingGuide.dispose();
        this._typeCommandDisposable.dispose();
    }

    private isEnabled(): boolean {
        return this._typeCommandDisposable !== LeaderMode.emptyDisposable;
    }
}