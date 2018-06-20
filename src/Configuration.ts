import { workspace } from "vscode";
import { extensionName, keybindingsSetting } from "./strings";

export interface IKeybinding {
    keySequence: string[];
    command?: string;
    args?: any[];
    label?: string; // if not defined, command is used
}

export interface IConfiguration {
    keybindings: IKeybinding[];
}

export function loadConfiguration(): IConfiguration {
    const WorkspaceConfiguration = workspace.getConfiguration(extensionName);
    const config: IConfiguration = {
        keybindings: WorkspaceConfiguration.get<IKeybinding[]>(keybindingsSetting) || [],
    };

    return config;
}