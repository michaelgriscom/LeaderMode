import { workspace } from "vscode";
import { extensionName, keybindingsSetting, ShowKeyGuide, showKeyGuideSetting } from "./strings";

export interface IKeybinding {
    keySequence: string[];
    command?: string;
    args?: any[];
    label?: string; // if not defined, command is used
}

export interface IConfiguration {
    keybindings: IKeybinding[];
    showKeyGuide: ShowKeyGuide;
}

export function loadConfiguration(): IConfiguration {
    const WorkspaceConfiguration = workspace.getConfiguration(extensionName);
    const config: IConfiguration = {
        keybindings: WorkspaceConfiguration.get<IKeybinding[]>(keybindingsSetting) || [],
        showKeyGuide: WorkspaceConfiguration.get<ShowKeyGuide>(showKeyGuideSetting) || ShowKeyGuide.Always,
    };

    return config;
}