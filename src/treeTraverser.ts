import { IKeyNode, KeyTree } from "./keyTree";
import { IKeyBinding } from "./configuration";

export class TreeTraverser {
    private _currentNode: IKeyNode;

    public constructor(keyTree: KeyTree) {
        this._currentNode = keyTree.getRoot();
    }

    public isTerminal(): boolean {
        return this._currentNode.keyBinding !== undefined
            && this._currentNode.keyBinding.command !== undefined;
    }

    public getCommand(): string {
        if(!this.isTerminal()) {
            throw new Error("No command for given sequence.");
        }

        return this._currentNode.keyBinding!.command!;
    }

    public getCurrentOptions(): ReadonlyArray<{key: string, keyBinding?: IKeyBinding}> {
        return this._currentNode.children;
    }

    public chooseOption(key: string) {
        const newNode = this._currentNode.children.filter((node) => node.key === key);
        if(newNode.length === 0) {
            throw new Error("Invalid key");
        }

        this._currentNode = newNode[0];
    }
}