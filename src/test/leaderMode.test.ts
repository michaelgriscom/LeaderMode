import { LeaderMode } from "../leaderMode";
import * as sinon from 'sinon';
import { ShortcutHinter } from "../ShortcutHinter";
import * as vscode from 'vscode';
import { KeyTree } from '../keyTree';
import { TreeTraverser } from '../treeTraverser';
import { expect } from "chai";

suite("LeaderMode Tests", function () {
    const typeCommand = "type";

    test("Handles enable/disable shortcut hints", () => {
        var keyTree = sinon.createStubInstance(KeyTree);
        var treeTraverser = sinon.createStubInstance(TreeTraverser);
        keyTree.getTraverser.returns(treeTraverser);

        var shortcutHinter = sinon.createStubInstance(ShortcutHinter);
        const leaderMode = new LeaderMode(keyTree, shortcutHinter);

        vscode.commands.executeCommand(typeCommand, "a");

        expect(shortcutHinter.showOptions.notCalled).to.be.true;
        leaderMode.enable();
        expect(shortcutHinter.showOptions.calledOnce).to.be.true;
        leaderMode.enable();
        expect(shortcutHinter.showOptions.calledOnce).to.be.true;
        leaderMode.disable();
        expect(shortcutHinter.removeText.calledOnce).to.be.true;
        expect(shortcutHinter.dispose.notCalled).to.be.true;

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

        expect(registerStub.notCalled).to.be.true;
        leaderMode.enable();
        expect(registerStub.calledOnce).to.be.true;
        leaderMode.disable();
        expect(disposableStub.dispose.calledOnce).to.be.true;

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
        expect(shortcutHinter.dispose.notCalled).to.be.true;
        leaderMode.dispose();
        expect(shortcutHinter.dispose.calledOnce).to.be.true;
        expect(disposableStub.dispose.calledOnce).to.be.true;

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
            expect(treeTraverser.chooseOption.getCall(index).args[0]).to.equal(typeArg);
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

        expect(shortcutHinter.showOptions.getCall(0).args[0]).to.equal(firstOptions);

        const secondOptions = "secondOptions";
        treeTraverser.getCurrentOptions.returns(secondOptions);
        vscode.commands.executeCommand(typeCommand, { text: "a" });

        expect(shortcutHinter.showOptions.getCall(1).args[0]).to.equal(secondOptions);
        expect(shortcutHinter.showOptions.calledTwice).to.be.true;
        leaderMode.dispose();
    });

    test("handles error", () => {
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

        expect(disposableStub.dispose.calledOnce).to.be.true;

        (vscode.commands.registerCommand as any).restore();
        leaderMode.dispose();
    });
});