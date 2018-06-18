import { IKeybinding } from "./configuration";
import { IKeybindingTreeTraverser, KeybindingTreeTraverser, IKeybindingTreeNode } from "./keybindingTreeTraverser";

export interface IKeybindingTree {
    getTraverser(): IKeybindingTreeTraverser;
}

export class KeybindingTree implements IKeybindingTree {
    private _rootNode: IKeybindingTreeNode;

    public getTraverser(): IKeybindingTreeTraverser {
        return new KeybindingTreeTraverser(this._rootNode);
    }

    public constructor(
        keybindings: IKeybinding[]) {
        this._rootNode = KeybindingTree.buildTree(keybindings);
    }

    private static createRoot(): IKeybindingTreeNode {
        return {
            children: [],
            key: ""
        };
    }

    private static buildTree(keybindings: IKeybinding[]): IKeybindingTreeNode {
        const root = KeybindingTree.createRoot();
        if (!keybindings) {
            return root;
        }

        keybindings.forEach((keybinding) => {
            KeybindingTree.addKeyBinding(keybinding, root);
        });

        return root;
    }

    private static addKeyBinding(keybinding: IKeybinding, rootNode: IKeybindingTreeNode) {
        let currentNode: IKeybindingTreeNode = rootNode;
        keybinding.keySequence.forEach((key, index) => {
            const matchingNodes = currentNode.children.filter((node) => node.key === key);

            // full key sequence read, create leaf node
            if (index === keybinding.keySequence.length - 1) {
                // a command cannot be at or above any other key binding
                if (matchingNodes.length > 0 && keybinding.command) {
                    throw new Error(`Conflicting key sequence at: ${keybinding.keySequence}`);
                }

                const leafNode: IKeybindingTreeNode = {
                    children: [],
                    keybinding,
                    key
                };

                currentNode.children.push(leafNode);
            } else if (matchingNodes.length > 0) { // found an existing keybinding, follow subtree
                const matchingNode = matchingNodes[0];
                // a command cannot be at or above any other key binding
                if (matchingNode.keybinding && matchingNode.keybinding.command) {
                    throw new Error(`Conflicting key sequence at: ${keybinding.keySequence} and ${matchingNode.keybinding}`);
                }

                currentNode = matchingNode;
            } else { // no existing keybinding, create new subtree
                const newNode: IKeybindingTreeNode = {
                    children: [],
                    key
                };
                currentNode.children.push(newNode);
                currentNode = newNode;
            }
        });
    }
}
