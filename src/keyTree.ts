import { IKeyBinding } from "./configuration";

export interface IKeyNode {
    readonly children: IKeyNode[];
    readonly key: string;
    readonly keyBinding: IKeyBinding;
}

export class KeyTree {
    private rootNode: IKeyNode;

    public constructor(
        keyBindings: IKeyBinding[]) {
        this.rootNode = {
            children: [],
            keyBinding: {
                keySequence: [],
                label: "root"
            },
            key: ""
        };
    }

    public getRoot(keyBinding?: IKeyBinding): IKeyNode {
        return this.rootNode;
    }
}