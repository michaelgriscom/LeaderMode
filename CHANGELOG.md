# Changelog

## 0.1.1
- Initial release

## 0.1.3
- Additional keybindings
- Various bugfixes
- Added assets

## 0.1.4
- Updated readme and documentation

## 0.1.5
- Added `showKeyGuide` setting
- Added `isActive` context
- Fixed keybinding issue
- Fixed status bar item display issue

## Unreleased
- Each element of `args` is now passed to the command as a separate argument (e.g. `editor.action.insertSnippet` now works)
- Leader mode is exited before the bound command runs, so commands that type text reach the editor
- Documented how to use a printable key (such as `-`) as the leader key
