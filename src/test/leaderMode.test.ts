import * as assert from 'assert';
import { LeaderMode } from "../leaderMode";
import * as sinon from 'sinon';
import { ShortcutHinter } from "../ShortcutHinter";
import { IConfiguration } from '../configuration';
import * as vscode from 'vscode';

suite("LeaderMode Tests", function () {
    const typeCommand = "type";

    test("Handles enable/disable shortcut hints", () => {
        var config: IConfiguration = {
            keyBindings: []
        };
        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);

        const leaderMode = new LeaderMode(config, shortcutHinter);

        vscode.commands.executeCommand(typeCommand, "a");

        assert.ok(shortcutHinter.showOptions.notCalled, "no options should be displayed until mode is enabled");
        leaderMode.enable();
        assert.ok(shortcutHinter.showOptions.calledOnce, "when mode is enabled, options should be displayed");
        leaderMode.enable();
        assert.ok(shortcutHinter.showOptions.calledOnce, "enabling when already enabled should not have an effect");
        leaderMode.disable();
        assert.ok(shortcutHinter.removeText.calledOnce, "mode should clean up the shortcutHinter");
    });

    test("Registers and deregisters type event", () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);
        var config: IConfiguration = {
            keyBindings: []
        };
        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);

        const leaderMode = new LeaderMode(config, shortcutHinter);
        assert.ok(registerStub.notCalled, "command should not be registered until mode is enabled");
        leaderMode.enable();
        assert.ok(registerStub.calledOnce, "registration should be called when mode is enabled");
        leaderMode.disable();
        assert.ok(disposableStub.dispose.calledOnce, "command should be disposed when mode is disabled");

        (vscode.commands.registerCommand as any).restore();
    });

    test("Cleans up resources", () => {
        var config: IConfiguration = {
            keyBindings: []
        };
        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);

        const leaderMode = new LeaderMode(config, shortcutHinter);
        leaderMode.enable();
        leaderMode.disable();
        assert.ok(shortcutHinter.dispose.notCalled, "shortcut hinter should not be disposed until mode is disposed");
        leaderMode.dispose();
        assert.ok(shortcutHinter.dispose.calledOnce, "hinter should be cleaned up");
        assert.ok(disposableStub.dispose.calledOnce, "command should be cleaned up");

        (vscode.commands.registerCommand as any).restore();
    });
});