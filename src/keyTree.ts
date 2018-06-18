import { IKeyBinding } from "./configuration";
import { ITreeTraverser, TreeTraverser } from "./treeTraverser";

export interface IKeyNode {
    readonly children: IKeyNode[];
    readonly key: string;
    readonly keybinding?: IKeyBinding;
}

export interface IKeyTree {
    getTraverser(): ITreeTraverser;
}

export class KeyTree implements IKeyTree {
    private _rootNode: IKeyNode;

    public getTraverser(): ITreeTraverser {
        return new TreeTraverser(this._rootNode);
    }

    public constructor(
        keybindings: IKeyBinding[]) {
        this._rootNode = KeyTree.buildTree(keybindings);
    }

    private static createRoot(): IKeyNode {
        return {
            children: [],
            key: ""
        };
    }

    private static addKeyBinding(keybinding: IKeyBinding, rootNode: IKeyNode) {
        let currentNode: IKeyNode = rootNode;
        keybinding.keySequence.forEach((key, index) => {
            const matchingNodes = currentNode.children.filter((node) => node.key === key);

            // full key sequence read, create leaf node
            if (index === keybinding.keySequence.length - 1) {
                // a command cannot be at or above any other key binding
                if (matchingNodes.length > 0 && keybinding.command) {
                    throw new Error(`Conflicting key sequence at: ${keybinding.keySequence}`);
                }

                const leafNode: IKeyNode = {
                    children: [],
                    keybinding,
                    key
                };

                currentNode.children.push(leafNode);
            } else if (matchingNodes.length > 0) { // follow subtree
                const matchingNode = matchingNodes[0];
                // a command cannot be at or above any other key binding
                if (matchingNode.keybinding && matchingNode.keybinding.command) {
                    throw new Error(`Conflicting key sequence at: ${keybinding.keySequence} and ${matchingNode.keybinding}`);
                }

                currentNode = matchingNode;
            } else { // create new subtree
                const newNode: IKeyNode = {
                    children: [],
                    key
                };
                currentNode.children.push(newNode);
                currentNode = newNode;
            }
        });
    }

    private static buildTree(keybindings: IKeyBinding[]): IKeyNode {
        const root = KeyTree.createRoot();
        if (!keybindings) {
            return root;
        }

        keybindings.forEach((keybinding) => {
            KeyTree.addKeyBinding(keybinding, root);
        });

        return root;
    }
}