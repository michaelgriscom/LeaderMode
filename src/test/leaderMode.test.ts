import { LeaderMode } from "../leaderMode";
import * as sinon from 'sinon';
import { StatusBarKeybindingGuide } from "../ShortcutHinter";
import * as vscode from 'vscode';
import { expect } from "chai";
import { KeybindingTree } from "../keybindingTree";
import { KeybindingTreeTraverser } from "../keybindingTreeTraverser";

suite("LeaderMode Tests", function () {
    const typeCommand = "type";

    test("Handles enable/disable shortcut hints", () => {
        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);

        var shortcutHinter = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, shortcutHinter);

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
        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var shortcutHinter = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, shortcutHinter);

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

        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var shortcutHinter = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, shortcutHinter);

        leaderMode.enable();
        leaderMode.disable();
        expect(shortcutHinter.dispose.notCalled).to.be.true;
        leaderMode.dispose();
        expect(shortcutHinter.dispose.calledOnce).to.be.true;
        expect(disposableStub.dispose.calledOnce).to.be.true;

        (vscode.commands.registerCommand as any).restore();
    });

    test("sends key to traverser", () => {
        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var shortcutHinter = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, shortcutHinter);
        traverser.isTerminal.returns(false);

        leaderMode.enable();

        const typeArgs = ["a", "b", "c", "d", "e"];
        typeArgs.forEach((typeArg, index) => {
            vscode.commands.executeCommand(typeCommand, { text: typeArg });
            expect(traverser.selectKey.getCall(index).args[0]).to.equal(typeArg);
        });

        leaderMode.dispose();
    });

    test("shows correct options", () => {
        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var shortcutHinter = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, shortcutHinter);
        traverser.isTerminal.returns(false);

        const firstOptions = "options";
        traverser.getAllowedKeys.returns(firstOptions);
        leaderMode.enable();

        expect(shortcutHinter.showOptions.getCall(0).args[0]).to.equal(firstOptions);

        const secondOptions = "secondOptions";
        traverser.getAllowedKeys.returns(secondOptions);
        vscode.commands.executeCommand(typeCommand, { text: "a" });

        expect(shortcutHinter.showOptions.getCall(1).args[0]).to.equal(secondOptions);
        expect(shortcutHinter.showOptions.calledTwice).to.be.true;
        leaderMode.dispose();
    });

    test("handles error", () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);

        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var shortcutHinter = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, shortcutHinter);
        traverser.isTerminal.returns(false);

        traverser.selectKey.throws("mock error");
        leaderMode.enable();
        registerStub.getCall(0).args[1]({ text: "a" });

        expect(disposableStub.dispose.calledOnce).to.be.true;

        (vscode.commands.registerCommand as any).restore();
        leaderMode.dispose();
    });

    test("invokes terminal command", () => {
        // todo: hit the isTerminal case
    });
});