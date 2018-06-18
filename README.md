# LeaderMode

LeaderMode provides a mechanism for unifying VSCode keybindings into a single entry point, to allow for more mnemonic and discoverable shortcuts. The behavior, along with some keybindings, were inspired by the [Spacemacs](http://spacemacs.org) distribution.

## Features

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

- Due to a limitation that keypress messages are only forwarded if there's an active editor group,
currently leader mode will only activate if there's an active editor. One potential workaround
is to trigger the command `workbench.action.focusActiveEditorGroup` prior to invoking leader mode, however this can result in non-obvious behavior.
- LeaderMode should not be used in combination with Vim extensions, as both manipulate the `type` command

## Release Notes

### 0.1.0
