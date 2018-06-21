import { StatusBarKeybindingGuide } from "../KeybindingGuide";
import sinon = require("sinon");
import { StatusBarItem, StatusBarAlignment, ThemeColor } from "vscode";
import { expect } from "chai";
import { KeyOption } from "../KeybindingTreeTraverser";
import { noLabel } from "../strings";

class StatusBarItemStub implements StatusBarItem {
    alignment: StatusBarAlignment = 1;
    priority: number = 0;
    text: string = "";
    tooltip: string | undefined;
    color: string | ThemeColor | undefined;
    command: string | undefined;
    show(): void {
        throw new Error("Method not implemented.");
    }
    hide(): void {
        throw new Error("Method not implemented.");
    }
    dispose(): void {
        throw new Error("Method not implemented.");
    }
}

suite("StatusBarKeybindingGuide Tests", () => {
    test("doesn't show until told", () => {
        const stubs: sinon.SinonStubbedInstance<StatusBarItem>[] = [];

        const statusBarStubFactory = sinon.stub().callsFake(() => {
            const statusBarStub = sinon.createStubInstance(StatusBarItemStub)
            stubs.push(statusBarStub);
            return statusBarStub;
        });

        const keybindingGuide = new StatusBarKeybindingGuide(statusBarStubFactory);

        expect(statusBarStubFactory.called).to.be.false;
        keybindingGuide.show([{
            key: "a"
        }]);

        expect(statusBarStubFactory.called).to.be.true;
    });

    function makeCommand(key: string, text: string): string {
        return `[ ${key} ] - ${text}`;
    }

    function makeLabel(key: string, text: string): string {
        return `[ ${key} ] - (${text})`;
    }

    test("shows status bar items in order", () => {
        const stubs: sinon.SinonStubbedInstance<StatusBarItem>[] = [];
        const options: ReadonlyArray<KeyOption> = [
            {
                key: "a",
                keybinding: {
                    command: "aCommand",
                    keySequence: []
                }
            },
            {
                key: "b",
                keybinding: {
                    command: "bCommand",
                    keySequence: []
                }
            },
        ];

        const statusBarStubFactory = sinon.stub().callsFake(() => {
            const statusBarStub = sinon.createStubInstance(StatusBarItemStub)
            stubs.push(statusBarStub);
            return statusBarStub;
        });

        const keybindingGuide = new StatusBarKeybindingGuide(statusBarStubFactory);
        keybindingGuide.show(options);

        expect(stubs[0].show.calledOnce).to.be.true;
        expect(stubs[0].text).to.equal(makeCommand(options[0].key, options[0].keybinding!.command!));
        expect(stubs[1].show.calledOnce).to.be.true;
        expect(stubs[1].text).to.equal(makeCommand(options[1].key, options[1].keybinding!.command!));
    });

    test("clears on removeText", () => {
        const stubs: sinon.SinonStubbedInstance<StatusBarItem>[] = [];
        const options: ReadonlyArray<KeyOption> = [
            {
                key: "a",
                keybinding: {
                    command: "aCommand",
                    keySequence: []
                }
            },
            {
                key: "b",
                keybinding: {
                    command: "bCommand",
                    keySequence: []
                }
            },
        ];

        const statusBarStubFactory = sinon.stub().callsFake(() => {
            const statusBarStub = sinon.createStubInstance(StatusBarItemStub)
            stubs.push(statusBarStub);
            return statusBarStub;
        });

        const keybindingGuide = new StatusBarKeybindingGuide(statusBarStubFactory);
        keybindingGuide.show(options);
        keybindingGuide.hide();

        expect(stubs[0].dispose.called).to.be.true;
        expect(stubs[1].dispose.called).to.be.true;
    });

    test("disposes on dispose", () => {
        const stubs: sinon.SinonStubbedInstance<StatusBarItem>[] = [];
        const options: ReadonlyArray<KeyOption> = [
            {
                key: "a",
                keybinding: {
                    command: "aCommand",
                    keySequence: []
                }
            },
            {
                key: "b",
                keybinding: {
                    command: "bCommand",
                    keySequence: []
                }
            },
        ];

        const statusBarStubFactory = sinon.stub().callsFake(() => {
            const statusBarStub = sinon.createStubInstance(StatusBarItemStub)
            stubs.push(statusBarStub);
            return statusBarStub;
        });

        const keybindingGuide = new StatusBarKeybindingGuide(statusBarStubFactory);
        keybindingGuide.show(options);
        keybindingGuide.dispose();

        expect(stubs[0].dispose.called).to.be.true;
        expect(stubs[1].dispose.called).to.be.true;
    });

    test("handles new options", () => {
        const stubs: sinon.SinonStubbedInstance<StatusBarItem>[] = [];
        const options1: ReadonlyArray<KeyOption> = [
            {
                key: "a",
                keybinding: {
                    command: "aCommand",
                    keySequence: []
                }
            },
            {
                key: "b",
                keybinding: {
                    command: "bCommand",
                    keySequence: []
                }
            },
        ];

        const options2: ReadonlyArray<KeyOption> = [
            {
                key: "b",
                keybinding: {
                    command: "bCommand",
                    keySequence: []
                }
            },
            {
                key: "a",
                keybinding: {
                    command: "aCommand",
                    keySequence: []
                }
            },
        ];

        const statusBarStubFactory = sinon.stub().callsFake(() => {
            const statusBarStub = sinon.createStubInstance(StatusBarItemStub)
            stubs.push(statusBarStub);
            return statusBarStub;
        });

        const keybindingGuide = new StatusBarKeybindingGuide(statusBarStubFactory);
        keybindingGuide.show(options1);
        keybindingGuide.show(options2);

        expect(stubs[0].dispose.called).to.be.true;
        expect(stubs[1].dispose.called).to.be.true;

        expect(stubs[2].show.calledOnce).to.be.true;
        expect(stubs[2].text).to.equal(makeCommand(options2[0].key, options2[0].keybinding!.command!));
        expect(stubs[3].show.calledOnce).to.be.true;
        expect(stubs[3].text).to.equal(makeCommand(options2[1].key, options2[1].keybinding!.command!));
    });

    test("shows correct text", () => {
        const stubs: sinon.SinonStubbedInstance<StatusBarItem>[] = [];
        const commandWithLabel: KeyOption = {
            key: "a",
            keybinding: {
                command: "aCommand",
                label: "aLabel",
                keySequence: []
            }
        };
        const commandWithoutLabel: KeyOption = {
            key: "a",
            keybinding: {
                command: "aCommand",
                keySequence: []
            }
        };
        const labelWithoutCommand: KeyOption = {
            key: "b",
            keybinding: {
                label: "bLabel",
                keySequence: []
            }
        };
        const noCommandOrLabel: KeyOption = {
            key: "c",
            keybinding: {
                keySequence: []
            }
        };
        const noKeybinding: KeyOption = {
            key: "d"
        };

        const options: ReadonlyArray<KeyOption> = [
            commandWithLabel,
            commandWithoutLabel,
            labelWithoutCommand,
            noCommandOrLabel,
            noKeybinding,
        ];

        const statusBarStubFactory = sinon.stub().callsFake(() => {
            const statusBarStub = sinon.createStubInstance(StatusBarItemStub)
            stubs.push(statusBarStub);
            return statusBarStub;
        });

        const keybindingGuide = new StatusBarKeybindingGuide(statusBarStubFactory);
        keybindingGuide.show(options);

        expect(stubs[0].text).to.equal(makeCommand(commandWithLabel.key, commandWithLabel.keybinding!.label!));
        expect(stubs[1].text).to.equal(makeCommand(commandWithoutLabel.key, commandWithoutLabel.keybinding!.command!));
        expect(stubs[2].text).to.equal(makeLabel(labelWithoutCommand.key, labelWithoutCommand.keybinding!.label!));
        expect(stubs[3].text).to.equal(makeLabel(noCommandOrLabel.key, noLabel));
        expect(stubs[4].text).to.equal(makeLabel(noKeybinding.key, noLabel));
    });
});