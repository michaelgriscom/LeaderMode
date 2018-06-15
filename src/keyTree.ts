import { IKeyBinding, IKeyBindingPrefixLabel } from "./configuration";

interface IKeyNode extends IKeyBinding {
    children: IKeyNode[];
}

export class KeyTree {
    private rootNode: IKeyNode;

    public constructor(
        keyBindings: IKeyBinding[],
        keyBindingPrefixLabels: IKeyBindingPrefixLabel[]) {
        this.rootNode = {
            children: [],
            keySequence: [],
            label: "root"
        };
    }

    public getChildren(keyBinding?: IKeyBinding): IKeyBinding[] {
        if (!keyBinding) {
            return this.rootNode.children;
        }


    }
}