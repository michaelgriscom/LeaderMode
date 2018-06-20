import { IKeybinding } from '../configuration';
import { expect } from 'chai';
import { KeybindingTree } from '../KeybindingTree';

suite("keybindingTree Tests", function () {
    const letters: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

    test("empty keybindings", () => {
        const keybindingTree = new KeybindingTree([]);
        const options = keybindingTree.getTraverser().getAllowedKeys();
        expect(options.length).to.equal(0);
    });

    test("flat command tree", () => {
        const keybindings: IKeybinding[]
            = letters.map((key) => {
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

    test("honors casing", () => {
        const littleAKeybinding: IKeybinding = {
            keySequence: ["a"],
            label: "littleALabel",
            command: "littleACommand"
        };
        const bigAKeybinding: IKeybinding = {
            keySequence: ["A"],
            label: "bigALabel",
            command: "bigACommand"
        };
        const littleBKeybinding: IKeybinding = {
            keySequence: ["b"],
            label: "littleBLabel",
            command: "littleBCommand"
        };
        const bigBKeybinding: IKeybinding = {
            keySequence: ["B"],
            label: "bigBLabel",
            command: "bigBCommand"
        };

        const keybindings: IKeybinding[]
            = [
                littleBKeybinding,
                bigBKeybinding,
                bigAKeybinding,
                littleAKeybinding
            ];

        const keybindingTree = new KeybindingTree(keybindings);

        const rootOptions = keybindingTree.getTraverser().getAllowedKeys();
        expect(rootOptions[0].keybinding).to.deep.equal(littleAKeybinding);
        expect(rootOptions[0].key).to.equal("a");
        expect(rootOptions[1].keybinding).to.deep.equal(bigAKeybinding);
        expect(rootOptions[1].key).to.equal("A");
        expect(rootOptions[2].keybinding).to.deep.equal(littleBKeybinding);
        expect(rootOptions[2].key).to.equal("b");
        expect(rootOptions[3].keybinding).to.deep.equal(bigBKeybinding);
        expect(rootOptions[3].key).to.equal("B");
    });

    test("alphabetizes tree by key sequence", () => {
        const aKeybinding: IKeybinding = {
            keySequence: ["a"],
            label: "ooooo"
        };
        const aaKeybinding: IKeybinding = {
            keySequence: ["a", "a"],
            command: "yyyyy",
            label: "uuuuu"
        };
        const abKeybinding: IKeybinding = {
            keySequence: ["a", "b"],
            command: "yyyyy",
            label: "iiiiiiii"
        };
        const bKeybinding: IKeybinding = {
            keySequence: ["b"],
            label: "a"
        };
        const baKeybinding: IKeybinding = {
            keySequence: ["b", "a"],
            label: "eeee",
            command: "wwww"
        };
        const bbKeybinding: IKeybinding = {
            keySequence: ["b", "b"],
            label: "xxxx",
            command: "zzzz"
        };

        const keybindings: IKeybinding[]
            = [bKeybinding,
                abKeybinding,
                baKeybinding,
                aKeybinding,
                bbKeybinding,
                aaKeybinding];

        const keybindingTree = new KeybindingTree(keybindings);

        const rootOptions = keybindingTree.getTraverser().getAllowedKeys();
        expect(rootOptions[0].keybinding).to.deep.equal(aKeybinding);
        expect(rootOptions[0].key).to.equal("a");
        expect(rootOptions[1].keybinding).to.deep.equal(bKeybinding);
        expect(rootOptions[1].key).to.equal("b");

        const aTraverser = keybindingTree.getTraverser();
        aTraverser.selectKey("a");
        const aOptions = aTraverser.getAllowedKeys();
        expect(aOptions[0].keybinding).to.deep.equal(aaKeybinding);
        expect(aOptions[0].key).to.equal("a");
        expect(aOptions[1].keybinding).to.deep.equal(abKeybinding);
        expect(aOptions[1].key).to.equal("b");

        const bTraverser = keybindingTree.getTraverser();
        bTraverser.selectKey("b");
        const bOptions = bTraverser.getAllowedKeys();
        expect(bOptions[0].keybinding).to.deep.equal(baKeybinding);
        expect(bOptions[0].key).to.equal("a");
        expect(bOptions[1].keybinding).to.deep.equal(bbKeybinding);
        expect(bOptions[1].key).to.equal("b");
    });

    test("deep command tree", () => {
        const keybindings: IKeybinding[] = [{
            keySequence: letters,
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