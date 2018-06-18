# LeaderMode

LeaderMode provides a mechanism for unifying VSCode keybindings into a single entry point, to allow for more mnemonic and discoverable shortcuts. The behavior, along with some keybindings, were inspired by the [Spacemacs](http://spacemacs.org) distribution.

## Extension Settings

Commands (can be customized through keybindings.json):
* `leadermode.enter`: Enters leader mode. Default: `F14`
* `leadermode.exit`: Exits leader mode. Default: `Escape`

Configuration (can be customized through settings.json):
* `leadermode.keybindings`: An array of keybindings (or key sequence labels).

## Known Issues

- Due to a limitation that keypress messages are only forwarded if there's an active editor group,
currently leader mode will only activate if there's an active editor. One potential workaround
is to trigger the command `workbench.action.focusActiveEditorGroup` prior to invoking leader mode, however this can result in non-obvious behavior.
- LeaderMode should not be used in combination with Vim extensions, as both manipulate the `type` command

## Release Notes

### 0.1.1
Initial version