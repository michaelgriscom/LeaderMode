import * as vscode from 'vscode';
import { IKeybindingTree } from "./KeybindingTree";
import { IKeybindingGuide, StatusBarKeybindingGuide } from './KeybindingGuide';

export interface ILeaderMode {
    enable(): void;
    disable(): void;
    dispose(): void;
}

export class LeaderMode implements ILeaderMode {
    private _keybindingTree: IKeybindingTree;
    private _typeCommandDisposable: vscode.Disposable;
    private _keybindingGuide: IKeybindingGuide;
    private static readonly emptyDisposable = vscode.Disposable.from({ dispose: () => {}});

    public constructor(keybindingTree: IKeybindingTree,
        keybindingGuide: IKeybindingGuide = new StatusBarKeybindingGuide()) {
        this._keybindingTree = keybindingTree;
        this._keybindingGuide = keybindingGuide;
        this._typeCommandDisposable = LeaderMode.emptyDisposable;
    }

    private isEnabled(): boolean {
        return this._typeCommandDisposable !== LeaderMode.emptyDisposable;
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
                this._keybindingGuide.removeText();
                return;
            }

            if (traverser.isTerminal()) {
                const binding = traverser.getTerminalKeybinding();
                vscode.commands.executeCommand(
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
}