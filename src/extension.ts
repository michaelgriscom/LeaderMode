'use strict';
import * as vscode from 'vscode';
import { loadConfiguration } from './Configuration';
import { KeybindingTree } from './KeybindingTree';
import { LeaderMode, ILeaderMode } from './LeaderMode';
import { enterLeaderModeCommand, exitLeaderModeCommand, ShowKeyGuide, extensionName } from './strings';
import { IKeybindingGuide, StatusBarKeybindingGuide, KeybindingGuideStub } from './KeybindingGuide';

function getLeaderMode(): ILeaderMode {
    const config = loadConfiguration();

    const keybindingTree = new KeybindingTree(config.keybindings);
    let keybindingGuide: IKeybindingGuide;
    if (config.showKeyGuide === ShowKeyGuide.Always) {
        keybindingGuide = new StatusBarKeybindingGuide();
    } else {
        // todo: consider firing an event instead of stubbing
        keybindingGuide = new KeybindingGuideStub();
    }

    return new LeaderMode(keybindingTree, keybindingGuide);
}

export async function activate(context: vscode.ExtensionContext) {
    let leaderMode: ILeaderMode = getLeaderMode();
    context.subscriptions.push(leaderMode);

    vscode.workspace.onDidChangeConfiguration((configChanged) => {
        if (!configChanged.affectsConfiguration(extensionName)) {
            return;
        }

        leaderMode.dispose();
        leaderMode = getLeaderMode();
        context.subscriptions.push(leaderMode);
    });

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