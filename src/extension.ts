'use strict';
import * as vscode from 'vscode';
import { loadConfiguration } from './Configuration';
import { KeybindingTree } from './KeybindingTree';
import { LeaderMode } from './LeaderMode';

export function activate(context: vscode.ExtensionContext) {
    const config = loadConfiguration();
    const keybindingTree = new KeybindingTree(config.keybindings);
    const leaderMode = new LeaderMode(keybindingTree);
    context.subscriptions.push(leaderMode);

    registerCommand(context, 'leadermode.enter', async args => {
        leaderMode.enable();
    });

    registerCommand(context, 'leadermode.exit', async args => {
        leaderMode.disable();
    });
}

function registerCommand(
    context: vscode.ExtensionContext,
    command: string,
    callback: (...args: any[]) => any
) {
    const disposable = vscode.commands.registerCommand(command, async args => {
        callback(args);
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {
}