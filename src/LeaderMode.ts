import * as vscode from 'vscode';
import { IKeybindingGuide, StatusBarKeybindingGuide } from './KeybindingGuide';
import { IKeybindingTree } from "./KeybindingTree";
import { isActiveSetting } from './strings';

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
    private _isActive: boolean;

    public constructor(keybindingTree: IKeybindingTree,
        keybindingGuide: IKeybindingGuide = new StatusBarKeybindingGuide()) {
        this._isActive = false;
        this._keybindingTree = keybindingTree;
        this._keybindingGuide = keybindingGuide;
        this._typeCommandDisposable = LeaderMode.emptyDisposable;
    }

    public async enable() {
        if (this.isActive()) {
            return;
        }

        await this.setIsActive(true);
        const traverser = this._keybindingTree.getTraverser();
        const options = traverser.getAllowedKeys();
        this._keybindingGuide.show(options);
        this._typeCommandDisposable = vscode.commands.registerCommand('type', async args => {
            try {
                traverser.selectKey(args.text);
            } catch {
                await this.disable();
                return;
            }

            if (traverser.isTerminal()) {
                const binding = traverser.getTerminalKeybinding();
                await vscode.commands.executeCommand(
                    binding.command!,
                    binding.args || []);
                await this.disable();
                return;
            }

            const options = traverser.getAllowedKeys();
            this._keybindingGuide.show(options);
        });
    }

    public async disable() {
        if (!this.isActive()) {
            return;
        }

        await this.setIsActive(false);
        this._typeCommandDisposable.dispose();
        this._typeCommandDisposable = LeaderMode.emptyDisposable;
        this._keybindingGuide.hide();
    }

    public dispose() {
        this._keybindingGuide.dispose();
        this._typeCommandDisposable.dispose();
    }

    private async setIsActive(isActive: boolean) {
        this._isActive = isActive;
        await vscode.commands.executeCommand('setContext', isActiveSetting, isActive);
    }

    private isActive(): boolean {
        return this._isActive;
    }
}