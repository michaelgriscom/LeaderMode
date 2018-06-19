import { LeaderMode } from "../leaderMode";
import * as sinon from 'sinon';
import { StatusBarKeybindingGuide } from "../KeybindingGuide";
import * as vscode from 'vscode';
import { expect } from "chai";
import { KeybindingTree } from "../KeybindingTree";
import { KeybindingTreeTraverser } from "../KeybindingTreeTraverser";
import { IKeybinding } from "../Configuration";

suite("LeaderMode Tests", function () {
    const typeCommand = "type";

    test("Handles enable/disable shortcut hints", async () => {
        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);

        var keybindingGuide = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, keybindingGuide);

        await vscode.commands.executeCommand(typeCommand, "a");

        expect(keybindingGuide.showOptions.notCalled).to.be.true;
        leaderMode.enable();
        expect(keybindingGuide.showOptions.calledOnce).to.be.true;
        leaderMode.enable();
        expect(keybindingGuide.showOptions.calledOnce).to.be.true;
        leaderMode.disable();
        expect(keybindingGuide.removeText.calledOnce).to.be.true;
        expect(keybindingGuide.dispose.notCalled).to.be.true;

        leaderMode.dispose();
    });

    test("Registers and deregisters type event", () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);
        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var keybindingGuide = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, keybindingGuide);

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
        var keybindingGuide = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, keybindingGuide);

        leaderMode.enable();
        leaderMode.disable();
        expect(keybindingGuide.dispose.notCalled).to.be.true;
        leaderMode.dispose();
        expect(keybindingGuide.dispose.calledOnce).to.be.true;
        expect(disposableStub.dispose.calledOnce).to.be.true;

        (vscode.commands.registerCommand as any).restore();
    });

    test("sends key to traverser", async () => {
        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var keybindingGuide = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, keybindingGuide);
        traverser.isTerminal.returns(false);

        leaderMode.enable();

        const typeArgs = ["a", "b", "c", "d", "e"];
        typeArgs.forEach(async (typeArg, index) => {
            await vscode.commands.executeCommand(typeCommand, { text: typeArg });
            expect(traverser.selectKey.getCall(index).args[0]).to.equal(typeArg);
        });

        leaderMode.dispose();
    });

    test("shows correct options", async () => {
        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var keybindingGuide = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, keybindingGuide);
        traverser.isTerminal.returns(false);

        const firstOptions = "options";
        traverser.getAllowedKeys.returns(firstOptions);
        leaderMode.enable();

        expect(keybindingGuide.showOptions.getCall(0).args[0]).to.equal(firstOptions);

        const secondOptions = "secondOptions";
        traverser.getAllowedKeys.returns(secondOptions);
        await vscode.commands.executeCommand(typeCommand, { text: "a" });

        expect(keybindingGuide.showOptions.getCall(1).args[0]).to.equal(secondOptions);
        expect(keybindingGuide.showOptions.calledTwice).to.be.true;
        leaderMode.dispose();
    });

    test("handles error", async () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);

        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var keybindingGuide = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, keybindingGuide);
        traverser.isTerminal.returns(false);

        traverser.selectKey.throws("mock error");
        leaderMode.enable();
        await registerStub.getCall(0).args[1]({ text: "a" });

        expect(disposableStub.dispose.calledOnce).to.be.true;

        (vscode.commands.registerCommand as any).restore();
        leaderMode.dispose();
    });

    test("invokes terminal command with args", async () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);

        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var keybindingGuide = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, keybindingGuide);
        traverser.isTerminal.returns(true);

        const keybinding: IKeybinding = {
            command: "foo",
            keySequence: ["a"],
            args: [{
                arg1: "val1",
                arg2: "val2"
            }, {
                arg3: "val3"
            }]
        };

        traverser.getTerminalKeybinding.returns(keybinding);

        leaderMode.enable();
        const executeStub = sinon.stub(vscode.commands, "executeCommand");

        // simulates a key press
        await registerStub.getCall(0).args[1]({ text: "a" });

        expect(executeStub.calledOnce).to.be.true;
        expect(executeStub.getCall(0).args[0]).to.equal(keybinding.command);
        expect(executeStub.getCall(0).args[1]).to.deep.equal(keybinding.args);
        expect(disposableStub.dispose.calledOnce).to.be.true;

        leaderMode.dispose();
        (vscode.commands.registerCommand as any).restore();
        (vscode.commands.executeCommand as any).restore();
    });

    test("invokes terminal command without args", async () => {
        const registerStub = sinon.stub(vscode.commands, "registerCommand");
        var disposableStub = sinon.createStubInstance(vscode.Disposable);
        registerStub.returns(disposableStub);

        var keybindingTree = sinon.createStubInstance(KeybindingTree);
        var traverser = sinon.createStubInstance(KeybindingTreeTraverser);
        keybindingTree.getTraverser.returns(traverser);
        var keybindingGuide = sinon.createStubInstance(StatusBarKeybindingGuide);
        const leaderMode = new LeaderMode(keybindingTree, keybindingGuide);
        traverser.isTerminal.returns(true);

        const keybinding: IKeybinding = {
            command: "foo",
            keySequence: ["a"]
        };

        traverser.getTerminalKeybinding.returns(keybinding);

        leaderMode.enable();
        const executeStub = sinon.stub(vscode.commands, "executeCommand");

        // simulates a key press
        await registerStub.getCall(0).args[1]({ text: "a" });

        expect(executeStub.calledOnce).to.be.true;
        expect(executeStub.getCall(0).args[0]).to.equal(keybinding.command);
        expect(executeStub.getCall(0).args[1]).to.be.empty;
        expect(disposableStub.dispose.calledOnce).to.be.true;

        leaderMode.dispose();
        (vscode.commands.registerCommand as any).restore();
        (vscode.commands.executeCommand as any).restore();
    });
});