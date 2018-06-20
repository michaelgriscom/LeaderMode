'use strict';
import * as vscode from 'vscode';
import { loadConfiguration } from './Configuration';
import { KeybindingTree } from './KeybindingTree';
import { LeaderMode } from './LeaderMode';
import { enterLeaderModeCommand, exitLeaderModeCommand } from './strings';

export async function activate(context: vscode.ExtensionContext) {
    const config = loadConfiguration();
    const keybindingTree = new KeybindingTree(config.keybindings);
    const leaderMode = new LeaderMode(keybindingTree);
    context.subscriptions.push(leaderMode);

    registerCommand(context, enterLeaderModeCommand, async () => {
        await leaderMode.enable();
    });

    registerCommand(context, exitLeaderModeCommand, async () => {
        await leaderMode.disable();
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