# LeaderMode

LeaderMode provides a mechanism for unifying VSCode keybindings into a single entry point, to allow for more mnemonic and discoverable shortcuts, without the additional learning curve of a full modal editing environment. The behavior, along with some keybindings, were inspired by [Spacemacs](http://spacemacs.org).

This project should be treated as a beta version, some keybindings and behaviors may change prior to the first major release.
It also contains some bindings (namely, for the [grid layout](https://code.visualstudio.com/updates/v1_24#_editor-grid-layout)) that are currently only available in the Insiders ring and act as no-ops on the public build.

![Usage Animation](./assets/usage_animation.gif)

## Features
LeaderMode allows for the use of a tree of keybindings instead of (or in addition to) normal shortcuts, such as `Ctrl+Shift+J`.
This allows for more mnemonic and semantic keybindings, for example `e-r` to create a new editor to the right, `e-l`
to create an editor to the left, etc. Upon pressing the leader key, a status bar entry is created at the bottom of the
VSCode window as an interactive cheat-sheet of the tree of keybindings.

## Extension Settings

### Commands
Customizable via keybindings.json:
* `leadermode.enter`: Enters leader mode. Default: `Alt+m`
* `leadermode.exit`: Exits leader mode. Default: `Escape`

### Configuration
Customizable via settings.json:
* `leadermode.keybindings`: An array of case-sensitive keybindings (or key sequence labels) of the form
```
{
    "keySequence": string[],
    "label": string, // optional. If not present, 'command' is used
    "command": string, // optional. If not present, entry is treated as just a label
    "args": string[] // optional. Arguments to provide to the command upon execution
}
```

## Known Issues and Limitations

* Due to a limitation that keypress messages are only forwarded if there's an active editor group,
currently leader mode is only activated if there's an active editor. One potential workaround
is to trigger the command `workbench.action.focusActiveEditorGroup` prior to invoking leader mode, however this can result in non-obvious behavior.
* Special characters (such as tab) are not currently supported as part of a key sequence
* If the key tree is too wide visually, it won't display
* LeaderMode should not be used in combination with Vim extensions, as both manipulate the `type` command

## Release Notes

### 0.1.1
Initial version

### 0.1.3
Additional keybindings and bugfixes