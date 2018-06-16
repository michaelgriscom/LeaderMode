'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GlobalState } from './globalState';
import ShortcutHinter from './ShortcutHinter';
import { loadConfiguration } from './configuration';
import { ShortcutFinder } from './ShortcutFinder';
import { KeyTree } from './keyTree';
import { TreeTraverser } from './treeTraverser';
import { LeaderMode } from './leaderMode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const shortcutHinter = new ShortcutHinter();
    context.subscriptions.push(shortcutHinter);

    const config = loadConfiguration();

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "holymode" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    registerCommand(context, 'extension.holyEnter', async args => {
        const leadermode = new LeaderMode(config);
    });


    registerCommand(context, 'compositionStart', async args => {
        console.log("compositionStart");
    });

    registerCommand(context, 'compositionEnd', async args => {
        console.log("compositionEnd");
    });
}

function registerCommand(
    context: vscode.ExtensionContext,
    command: string,
    callback: (...args: any[]) => any
) {
    let disposable = vscode.commands.registerCommand(command, async args => {
        callback(args);
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}