'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GlobalState } from './globalState';
import ShortcutHinter from './ShortcutHinter';
import { loadConfiguration } from './configuration';
import { ShortcutFinder } from './ShortcutFinder';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const shortcutHinter = new ShortcutHinter();
    context.subscriptions.push(shortcutHinter);

    const config = loadConfiguration();
    const shortcutFinder = new ShortcutFinder(config.keyBindings, config.keyBindingPrefixLabels);

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "holymode" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    registerCommand(context, 'extension.holyEnter', async args => {
        // The code you place here will be executed every time your command is executed
        GlobalState.isActive = true;
        // Display a message box to the user
        console.log('holy mode entered');
    });

    registerCommand(context, 'extension.holyExit', async args => {
        if (GlobalState.isActive) {
            GlobalState.isActive = false;
            shortcutHinter.removeText();
            console.log("holy mode exited");
        } else {
            // await vscode.commands.executeCommand('default:escape');
        }
    });


    // todo: unregister when deactivated
    registerCommand(context, 'type', async args => {
        if (GlobalState.isActive) {
            shortcutHinter.showText(args.text);
        } else {
            await vscode.commands.executeCommand('default:type', args);
        }
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