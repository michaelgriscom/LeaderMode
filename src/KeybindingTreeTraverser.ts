
import { IKeybinding } from "./Configuration";

export type KeyOption = { key: string, keybinding?: IKeybinding };

export interface IKeybindingTreeNode {
    readonly children: IKeybindingTreeNode[];
    readonly key: string;
    readonly keybinding?: IKeybinding; // can be undefined if the user creates a parent-less keybinding
}

export interface IKeybindingTreeTraverser {
    isTerminal(): boolean;
    getTerminalKeybinding(): IKeybinding;
    getAllowedKeys(): ReadonlyArray<KeyOption>;
    selectKey(key: string): void;
}

export class KeybindingTreeTraverser implements IKeybindingTreeTraverser {
    private _currentNode: IKeybindingTreeNode;
    public constructor(rootNode: IKeybindingTreeNode) {
        this._currentNode = rootNode;
    }

    public isTerminal(): boolean {
        return this._currentNode.keybinding !== undefined
            && this._currentNode.keybinding.command !== undefined;
    }

    public getTerminalKeybinding(): IKeybinding {
        if (!this.isTerminal()) {
            throw new Error("No command for given sequence.");
        }

        return this._currentNode.keybinding!;
    }

    public getAllowedKeys(): ReadonlyArray<KeyOption> {
        return this._currentNode.children;
    }

    public selectKey(key: string) {
        const newNode = this._currentNode.children.filter((node) => node.key === key);
        if (newNode.length === 0) {
            throw new Error("Invalid key");
        }

        this._currentNode = newNode[0];
    }
}