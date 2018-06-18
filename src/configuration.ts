import { workspace } from "vscode";

export interface IKeyBinding {
    keySequence: string[];
    command?: string;
    args?: any[];
    label?: string; // if not defined, command is used
}

export interface IConfiguration {
    keybindings: IKeyBinding[];
}

class ConfigurationKeys {
    static readonly sectionName: string = 'leadermode';
    static readonly leaderOption: string = 'leader';
    static readonly keybindingsOption: string = 'keybindings';
    static readonly keybindingPrefixLabels: string = 'keybindingPrefixLabels';
}

export function loadConfiguration(): IConfiguration {
    const WorkspaceConfiguration = workspace.getConfiguration("leadermode");
    const config: IConfiguration = {
        keybindings: WorkspaceConfiguration.get<IKeyBinding[]>(ConfigurationKeys.keybindingsOption) || [],
    };

    return config;
}