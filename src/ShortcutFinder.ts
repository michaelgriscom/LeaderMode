import { IKeyBinding, IKeyBindingPrefixLabel } from "./configuration";

export interface IShortcutStep {
    key: string;
    stepName: string;
}

export interface IShortcut {
    keySequence: string;
    command: string;
}

export class ShortcutFinder {
    private _keySequence: string[];
    _keyBindings: IKeyBinding[];
    _keyBindingPrefixLabels: IKeyBindingPrefixLabel[];

    public constructor(
        keyBindings: IKeyBinding[],
        keyBindingPrefixLabels: IKeyBindingPrefixLabel[]) {
        this._keySequence = [];
        this._keyBindings = keyBindings;
        this._keyBindingPrefixLabels = keyBindingPrefixLabels;
    }

    public addKey(key: string) {
        this._keySequence.push(key);
    }

    public isTerminal(): boolean {
        return false;
    }

    public getShortcut(): string {
        if (!this.isTerminal) {
            throw new Error("Not at a terminal shortcut");
        }

        return '';
    }

    public getPossibilities(): IShortcutStep[] {
        return [];
    }
}