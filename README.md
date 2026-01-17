# SmartScroll & VK Music

[English](README.md) · [Русский](README_RU.md) · [Deutsch](README_DE.md)

The extension combines SmartScroll and VK Music playlist tools.
Built from older [snippets](https://github.com/TolyanDimov/Snippets) that were used via F12 in [DevTools](https://developer.chrome.com/docs/devtools/console/javascript?hl=en).

## Features

- **SmartScroll:** auto scroll up/down, container selection, floating control panel.
- **VK Music:** mass add/remove tracks in playlist edit mode.
- **Export:** save track list to TXT (`Artist - Title`).

## Localization support

The extension supports three languages: Russian, English, and German.

## Installation (developer mode)

1. Open `chrome://extensions/` in the address bar.
2. Enable Developer mode.
3. Click **Load unpacked** and select the `vk-music-tools-ext` folder.

## How to use

### SmartScroll

1. Click **Open panel** in the popup.
2. The panel provides **Up**, **Down**, **Pick** (container), **Stop**, **Close**.

### VK Music

1. Open VK Music and enter playlist edit mode.
2. **First scroll to the end** (you can use SmartScroll).
3. Use the floating panel: **Add** tracks, **Remove** tracks, **Stop** (cancel all operations).
4. Progress is shown in the floating panel status line.

### Export

1. Open a playlist or VK Music section.
2. **First scroll to the end** (you can use SmartScroll).
3. Click **Export to TXT** in the popup.

## Notes

- VK buttons are available only in playlist edit mode.
- Do not close the tab while operations are running.
- Large playlists may cause the browser to slow down.

## Licenses

- Rubik font: `assets/fonts/OFL.txt`.

## Author

Anatoly Dimov — https://github.com/TolyanDimov
