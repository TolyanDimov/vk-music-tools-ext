![Preview](assets/preview.png)
# SmartScroll & VK Music

[English](README.md) · [Русский](README_RU.md) · [Deutsch](README_DE.md)

The extension combines SmartScroll and VK Music playlist tools.
Built from older [snippets](https://github.com/TolyanDimov/Snippets) that were used via F12 in [DevTools](https://developer.chrome.com/docs/devtools/console/javascript?hl=en).

## Features

- **SmartScroll:** auto scroll up/down, container selection, floating control panel, and a bottom-of-list reload nudge for VK lazy loading.
- **VK Music:** mass add/remove tracks in playlist edit mode, batch size selection (1–100), random track selection, delete loaded tracks and safe duplicates from your music.
- **VK Photo Albums:** select all photos with VK's native button for later moving them through the **More** menu.
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
2. The panel provides **Up**, **Down**, **Container**, **Stop**, **Close**.

### VK Music

1. Open VK Music and enter playlist edit mode.
2. **First scroll to the end** (you can use SmartScroll).
3. Click **Add** and enter the number of tracks. Leave the field empty to add all found tracks.
4. Enable **Random order** before starting to select tracks randomly.
5. Set **Per batch** to a value from 1 to 100. With random mode disabled, adding starts from the bottom of the available list.
6. Use **Remove** to uncheck tracks and **Stop** to cancel an operation.
7. Progress is shown in the floating panel status line.

### Moving photos between VK albums

1. Open the required VK album and enable photo selection mode.
2. Click **Select all photos** in the extension popup.
3. In VK, open **More** and choose moving the photos to another album.

The extension presses VK's native **Select all** button. Availability of moving photos depends on account permissions and the current VK interface.

### Export

1. Open a playlist or VK Music section.
2. **First scroll to the end** (you can use SmartScroll).
3. Click **Export to TXT** in the popup.

### Delete Music

1. Open a VK Music section with a track list.
2. **First scroll to the end** (you can use SmartScroll).
3. Click **Delete music** in the popup, choose the amount, and pass both detailed warnings.
4. Leave the amount empty to delete all found tracks.
5. Deletion progress is shown in the SmartScroll panel.

### Delete Duplicates

1. Open a VK Music section with a track list.
2. **First scroll to the end** (you can use SmartScroll).
3. Click **Delete duplicates** in the popup and pass both detailed warnings.
4. A safe duplicate is a track with the same title and duration.

## Notes

- Playlist add/remove buttons are available only in playlist edit mode.
- VK tools support both `vk.com` and `vk.ru`.
- Delete works with tracks loaded on the page and uses VK's native remove button in the current interface.
- Deletion requires two confirmations and cannot be automatically undone.
- If VK pauses lazy loading at the bottom, SmartScroll briefly moves up by several tracks and returns to the bottom.
- Do not close the tab while operations are running.
- Large playlists may cause the browser to slow down.

## Licenses

- Rubik font: `assets/fonts/OFL.txt`.

## Author

Anatoly Dimov — https://github.com/TolyanDimov


