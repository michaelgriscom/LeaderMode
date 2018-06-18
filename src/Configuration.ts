import { workspace } from "vscode";

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
    const WorkspaceConfiguration = workspace.getConfiguration("leadermode");
    const config: IConfiguration = {
        keybindings: WorkspaceConfiguration.get<IKeybinding[]>("keybindings") || [],
    };

    return config;
}