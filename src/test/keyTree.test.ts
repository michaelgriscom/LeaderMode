import { KeyTree } from '../keyTree';
import { IKeyBinding } from '../configuration';
import { expect } from 'chai';

suite("KeyTree Tests", function () {
    test("empty keybindings", () => {
        const keyTree = new KeyTree([]);
        const options = keyTree.getTraverser().getCurrentOptions();
        expect(options.length).to.equal(0);
    });

    test("flat command tree", () => {
        const keybindings: IKeyBinding[]
            = ["a", "b", "c", "d", "e", "f", "g", "h"].map((key) => {
                return {
                    keySequence: [key],
                    command: `${key}.command`,
                    label: `${key}.label`,
                    args: [`${key}.arg`]
                };
        });

        const keyTree = new KeyTree(keybindings);

        const traverser = keyTree.getTraverser();
        expect(traverser.isTerminal()).to.be.false;
        const options = traverser.getCurrentOptions();
        expect(options.length).to.equal(keybindings.length);

        options.forEach((option, index) => {
            expect(option.key).to.equal(keybindings[index].keySequence[0]);
            expect(option.keybinding).to.deep.equal(keybindings[index]);

            const traverser = keyTree.getTraverser();
            traverser.chooseOption(option.key);

            expect(traverser.isTerminal()).to.be.true;
            expect(traverser.getTerminalBinding()).to.be.deep.equal(keybindings[index]);
        });
    });

    test("deep command tree", () => {
        const keybindings: IKeyBinding[] = [{
                keySequence: ["a", "b", "c", "d", "e", "f", "g", "h"],
                command: "keyCommand",
                label: "keyLabel",
                args: ["keyArgs"]
            }];

        const keyTree = new KeyTree(keybindings);
        const traverser = keyTree.getTraverser();
        expect(traverser.isTerminal()).to.be.false;

        keybindings[0].keySequence.forEach((key, index) => {
            const options = traverser.getCurrentOptions();
            expect(options.length).to.equal(1);
            expect(options[0].key).to.equal(key);
            if (index < keybindings[0].keySequence.length - 1) {
                expect(options[0].keybinding).to.be.undefined;
            } else {
                expect(options[0].keybinding).to.deep.equal(keybindings[0]);
            }
            traverser.chooseOption(key);
        });

        expect(traverser.getTerminalBinding()).to.equal(keybindings[0]);
        expect(traverser.isTerminal(), "should have reached the command").to.be.true;
    });
});