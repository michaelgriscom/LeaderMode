import * as assert from 'assert';
import { LeaderMode } from "../leaderMode";
import * as sinon from 'sinon';
import { ShortcutHinter } from "../ShortcutHinter";
import * as vscode from 'vscode';
import { KeyTree } from '../keyTree';
import { TreeTraverser } from '../treeTraverser';

suite("LeaderMode Tests", function () {
    const typeCommand = "type";

    test("Handles enable/disable shortcut hints", () => {
        var keyTree = sinon.createStubInstance(KeyTree);
        var treeTraverser = sinon.createStubInstance(TreeTraverser);
        keyTree.getTraverser.returns(treeTraverser);

        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);
        const leaderMode = new LeaderMode(keyTree, shortcutHinter);

        vscode.commands.executeCommand(typeCommand, "a");

        assert.ok(shortcutHinter.showOptions.notCalled, "no options should be displayed until mode is enabled");
        leaderMode.enable();
        assert.ok(shortcutHinter.showOptions.calledOnce, "when mode is enabled, options should be displayed");
        leaderMode.enable();
        assert.ok(shortcutHinter.showOptions.calledOnce, "enabling when already enabled should not have an effect");
        leaderMode.disable();
        assert.ok(shortcutHinter.removeText.calledOnce, "mode should clean up the shortcutHinter");

        leaderMode.dispose();
    });

    test("Registers and deregisters type event", () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);
        var keyTree = sinon.createStubInstance(KeyTree);
        var treeTraverser = sinon.createStubInstance(TreeTraverser);
        keyTree.getTraverser.returns(treeTraverser);
        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);
        const leaderMode = new LeaderMode(keyTree, shortcutHinter);

        assert.ok(registerStub.notCalled, "command should not be registered until mode is enabled");
        leaderMode.enable();
        assert.ok(registerStub.calledOnce, "registration should be called when mode is enabled");
        leaderMode.disable();
        assert.ok(disposableStub.dispose.calledOnce, "command should be disposed when mode is disabled");

        (vscode.commands.registerCommand as any).restore();

        leaderMode.dispose();
    });

    test("Cleans up resources", () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);

        var keyTree = sinon.createStubInstance(KeyTree);
        var treeTraverser = sinon.createStubInstance(TreeTraverser);
        keyTree.getTraverser.returns(treeTraverser);
        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);
        const leaderMode = new LeaderMode(keyTree, shortcutHinter);

        leaderMode.enable();
        leaderMode.disable();
        assert.ok(shortcutHinter.dispose.notCalled, "shortcut hinter should not be disposed until mode is disposed");
        leaderMode.dispose();
        assert.ok(shortcutHinter.dispose.calledOnce, "hinter should be cleaned up");
        assert.ok(disposableStub.dispose.calledOnce, "command should be cleaned up");

        (vscode.commands.registerCommand as any).restore();
    });

    test("sends key to traverser", () => {
        var keyTree = sinon.createStubInstance(KeyTree);
        var treeTraverser = sinon.createStubInstance(TreeTraverser);
        keyTree.getTraverser.returns(treeTraverser);
        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);
        const leaderMode = new LeaderMode(keyTree, shortcutHinter);
        treeTraverser.isTerminal.returns(false);

        leaderMode.enable();

        const typeArgs = ["a", "b", "c", "d", "e"];
        typeArgs.forEach((typeArg, index) => {
            vscode.commands.executeCommand(typeCommand, { text: typeArg });
            assert(treeTraverser.chooseOption.getCall(index).args[0] === typeArg);
        });

        leaderMode.dispose();
    });

    test("shows correct options", () => {
        var keyTree = sinon.createStubInstance(KeyTree);
        var treeTraverser = sinon.createStubInstance(TreeTraverser);
        keyTree.getTraverser.returns(treeTraverser);
        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);
        const leaderMode = new LeaderMode(keyTree, shortcutHinter);
        treeTraverser.isTerminal.returns(false);

        const firstOptions = "options";
        treeTraverser.getCurrentOptions.returns(firstOptions);
        leaderMode.enable();

        assert(shortcutHinter.showOptions.calledWith(firstOptions));

        const secondOptions = "secondOptions";
        treeTraverser.getCurrentOptions.returns(secondOptions);
        vscode.commands.executeCommand(typeCommand, { text: "a" });

        assert(shortcutHinter.showOptions.calledWith(secondOptions));
        leaderMode.dispose();
    });

    test.only("handles error", () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);

        var keyTree = sinon.createStubInstance(KeyTree);
        var treeTraverser = sinon.createStubInstance(TreeTraverser);
        keyTree.getTraverser.returns(treeTraverser);
        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);
        const leaderMode = new LeaderMode(keyTree, shortcutHinter);
        treeTraverser.isTerminal.returns(false);

        treeTraverser.chooseOption.throws("mock error");
        leaderMode.enable();
        registerStub.getCall(0).args[1]({ text: "a" });

        assert.ok(disposableStub.dispose.calledOnce, "command should be disposed when an invalid character is entered");

        (vscode.commands.registerCommand as any).restore();
        leaderMode.dispose();
    });
});