import { KeyTree } from "./keyTree";
import { TreeTraverser } from "./treeTraverser";
import ShortcutHinter from "./ShortcutHinter";
import { IConfiguration } from "./configuration";
import * as vscode from 'vscode';

export class LeaderMode {
    private _keyTree: KeyTree;
    private _typeCommandDisposable: vscode.Disposable;
    private _shortcutHinter: ShortcutHinter;

    public constructor(config: IConfiguration) {
        this._keyTree = new KeyTree(config.keyBindings);
        this._shortcutHinter = new ShortcutHinter();
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

            if(traverser.isTerminal()) {
                const command = traverser.getCommand();
                vscode.executeCommand(command);
                GlobalState.isActive = false;
                return;
            }

            const options = traverser.getCurrentOptions();
            shortcutHinter.showOptions(options);
        });


        this._exitCommandDisposable = vscode.commands.registerCommand('extension.holyExit', async args => {
            shortcutHinter.removeText();
            console.log("holy mode exited");
            this.disable();
        });
    }

    private disable() {
        this.onDispose();
    }

    onDispose() {
        this._typeCommandDisposable.dispose();
        this._exitCommandDisposable.dispose();
        this._shortcutHinter.dispose();
    }
}