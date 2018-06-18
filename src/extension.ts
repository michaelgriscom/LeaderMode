'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { loadConfiguration } from './configuration';
import { LeaderMode } from './leaderMode';
import { KeybindingTree } from './keybindingTree';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const config = loadConfiguration();
    const keybindingTree = new KeybindingTree(config.keybindings);
    const leadermode = new LeaderMode(keybindingTree);
    context.subscriptions.push(leadermode);

    registerCommand(context, 'extension.enterLeaderMode', async args => {
        leadermode.enable();
    });

    registerCommand(context, 'extension.exitLeaderMode', async args => {
        leadermode.disable();
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

export function deactivate() {
}