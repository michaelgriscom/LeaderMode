import { IKeyBinding } from "./configuration";

export interface IKeyNode {
    readonly children: IKeyNode[];
    readonly key: string;
    readonly keyBinding?: IKeyBinding;
}

export class KeyTree {
    private rootNode: IKeyNode;

    public constructor(
        keyBindings: IKeyBinding[]) {
        this.rootNode = KeyTree.buildTree(keyBindings);
    }

    private static createRoot(): IKeyNode {
        return {
            children: [],
            key: ""
        };
    }

    private static addKeyBinding(keyBinding: IKeyBinding, rootNode: IKeyNode) {
        let currentNode: IKeyNode = rootNode;
        keyBinding.keySequence.forEach((key, index) => {
            const matchingNodes = currentNode.children.filter((node) => node.key === key);

            // full key sequence read, create leaf node
            if (index === keyBinding.keySequence.length - 1) {
                // a command cannot be at or above any other key binding
                if (matchingNodes.length > 0 && keyBinding.command) {
                    throw new Error(`Conflicting key sequence at: ${keyBinding.keySequence}`);
                }

                const leafNode: IKeyNode = {
                    children: [],
                    keyBinding,
                    key
                };

                currentNode.children.push(leafNode);
            } else if (matchingNodes.length > 0) { // follow subtree
                const matchingNode = matchingNodes[0];
                // a command cannot be at or above any other key binding
                if (matchingNode.keyBinding && matchingNode.keyBinding.command) {
                    throw new Error(`Conflicting key sequence at: ${keyBinding.keySequence} and ${matchingNode.keyBinding}`);
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

    private static buildTree(keyBindings: IKeyBinding[]): IKeyNode {
        const root = KeyTree.createRoot();
        if (!keyBindings) {
            return root;
        }

        keyBindings.forEach((keyBinding) => {
            KeyTree.addKeyBinding(keyBinding, root);
        });

        return root;
    }

    public getRoot(): IKeyNode {
        return this.rootNode;
    }
}