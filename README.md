# LeaderMode

LeaderMode provides a mechanism for unifying VSCode keybindings into a single entry point, to allow for more mnemonic and discoverable shortcuts. The behavior, along with some keybindings, were inspired by the [Spacemacs](http://spacemacs.org) distribution.

## Extension Settings

Commands (can be customized through keybindings.json):
* `leadermode.enter`: Enters leader mode. Default: `Alt+m`
* `leadermode.exit`: Exits leader mode. Default: `Escape`

Configuration (can be customized through settings.json):
* `leadermode.keybindings`: An array of case-sensitive keybindings (or key sequence labels) of the form
```
{
    "keySequence": string[],
    "label": string, // optional. If not present, 'command' is used
    "command": string, // optional. If not present, entry is treated as just a label
    "args": string[] // optional. Arguments to provide to the command upon execution
}
```

## Known Issues

- Due to a limitation that keypress messages are only forwarded if there's an active editor group,
currently leader mode is only activated if there's an active editor. One potential workaround
is to trigger the command `workbench.action.focusActiveEditorGroup` prior to invoking leader mode, however this can result in non-obvious behavior.
- LeaderMode should not be used in combination with Vim extensions, as both manipulate the `type` command

## Release Notes

### 0.1.1
Initial version