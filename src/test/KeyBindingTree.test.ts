import { IKeybinding } from '../configuration';
import { expect } from 'chai';
import { KeybindingTree } from '../KeybindingTree';

suite("keybindingTree Tests", function () {
    test("empty keybindings", () => {
        const keybindingTree = new KeybindingTree([]);
        const options = keybindingTree.getTraverser().getAllowedKeys();
        expect(options.length).to.equal(0);
    });

    test("flat command tree", () => {
        const keybindings: IKeybinding[]
            = ["a", "b", "c", "d", "e", "f", "g", "h"].map((key) => {
                return {
                    keySequence: [key],
                    command: `${key}.command`,
                    label: `${key}.label`,
                    args: [`${key}.arg`]
                };
        });

        const keybindingTree = new KeybindingTree(keybindings);

        const traverser = keybindingTree.getTraverser();
        expect(traverser.isTerminal()).to.be.false;
        const options = traverser.getAllowedKeys();
        expect(options.length).to.equal(keybindings.length);

        options.forEach((option, index) => {
            expect(option.key).to.equal(keybindings[index].keySequence[0]);
            expect(option.keybinding).to.deep.equal(keybindings[index]);

            const traverser = keybindingTree.getTraverser();
            traverser.selectKey(option.key);

            expect(traverser.isTerminal()).to.be.true;
            expect(traverser.getTerminalKeybinding()).to.be.deep.equal(keybindings[index]);
        });
    });

    test("deep command tree", () => {
        const keybindings: IKeybinding[] = [{
                keySequence: ["a", "b", "c", "d", "e", "f", "g", "h"],
                command: "keyCommand",
                label: "keyLabel",
                args: ["keyArgs"]
            }];

        const keybindingTree = new KeybindingTree(keybindings);
        const traverser = keybindingTree.getTraverser();
        expect(traverser.isTerminal()).to.be.false;

        keybindings[0].keySequence.forEach((key, index) => {
            const options = traverser.getAllowedKeys();
            expect(options.length).to.equal(1);
            expect(options[0].key).to.equal(key);
            if (index < keybindings[0].keySequence.length - 1) {
                expect(options[0].keybinding).to.be.undefined;
            } else {
                expect(options[0].keybinding).to.deep.equal(keybindings[0]);
            }
            traverser.selectKey(key);
        });

        expect(traverser.getTerminalKeybinding()).to.equal(keybindings[0]);
        expect(traverser.isTerminal(), "should have reached the command").to.be.true;
    });
});