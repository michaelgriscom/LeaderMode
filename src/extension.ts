'use strict';
import * as vscode from 'vscode';
import { loadConfiguration } from './Configuration';
import { LeaderMode } from './LeaderMode';
import { KeybindingTree } from './KeybindingTree';

export function activate(context: vscode.ExtensionContext) {
    const config = loadConfiguration();
    const keybindingTree = new KeybindingTree(config.keybindings);
    const leaderMode = new LeaderMode(keybindingTree);
    context.subscriptions.push(leaderMode);

    registerCommand(context, 'extension.enterLeaderMode', async args => {
        leaderMode.enable();
    });

    registerCommand(context, 'extension.exitLeaderMode', async args => {
        leaderMode.disable();
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