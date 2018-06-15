import { WorkspaceConfiguration, Uri, window, workspace } from "vscode";

export interface IKeyBinding {
    keySequence: string[];
    command?: string;
    args?: any[];
    label?: string; // if not defined, command is used
}

// export interface IKeyBindingPrefixLabel {
//     keySequence: string[];
//     label: string;
// }

export interface IConfiguration {
    leader: string;
    keyBindings: IKeyBinding[];
    // keyBindingPrefixLabels: IKeyBindingPrefixLabel[];
}

class ConfigurationKeys {
    static readonly sectionName: string = 'holymode';
    static readonly leaderOption: string = 'leader';
    static readonly keyBindingsOption: string = 'keyBindings';
    static readonly keyBindingPrefixLabels: string = 'keyBindingPrefixLabels';
}

function getWorkspaceConfiguration(sectionName: string): WorkspaceConfiguration {
    let resource: Uri | undefined = undefined;
    let activeTextEditor = window.activeTextEditor;
    if (activeTextEditor) {
        resource = activeTextEditor.document.uri;
    }

    return workspace.getConfiguration(sectionName, resource);
}

export function loadConfiguration(): IConfiguration {
    const WorkspaceConfiguration = getWorkspaceConfiguration(ConfigurationKeys.sectionName);
    const config: IConfiguration = {
        leader: WorkspaceConfiguration.get<string>(ConfigurationKeys.leaderOption) || '',
        keyBindings: WorkspaceConfiguration.get<IKeyBinding[]>(ConfigurationKeys.leaderOption) || [],
        // keyBindingPrefixLabels: WorkspaceConfiguration.get<IKeyBindingPrefixLabel[]>(ConfigurationKeys.leaderOption) || []
    };

    return config;
}