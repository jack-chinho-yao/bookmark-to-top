# Bookmark To Top

A Chrome / Brave extension that automatically moves each newly added bookmark to
the top of its folder. If it detects a burst of additions (i.e. a bookmark
import), it skips them so the imported order isn't shuffled.

## How it works

- Listens to `chrome.bookmarks.onCreated`.
- Uses a debounce to collect bookmarks created within a time window:
  - `WINDOW_MS` (in `background.js`): the window — bookmarks are processed only
    after additions stop for this long.
  - `THRESHOLD`: if more than this many are created within the window, it's
    treated as an import and the whole batch is skipped.
- Normal case (count within threshold): each bookmark is `move`d to `index: 0`.

To tune the behavior, edit `WINDOW_MS` and `THRESHOLD` at the top of
`background.js`.

## Local testing (Brave / Chrome)

1. Go to `brave://extensions` (or `chrome://extensions` on Chrome).
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select this project folder.
4. After editing the code, click the reload icon on the extension card to apply
   changes.

## Packaging for the store

Build a clean zip (only the necessary files, excluding `.DS_Store`):

```bash
rm -f bookmark-to-top.zip && zip -r bookmark-to-top.zip manifest.json background.js icons -x "*.DS_Store"
```

Command breakdown:
- `rm -f bookmark-to-top.zip`: delete the old zip first (`-f` ignores a missing
  file) so contents aren't appended to a stale archive.
- `&&`: only continue if the previous step succeeded.
- `zip -r ... manifest.json background.js icons`: zip these three items; `-r`
  recurses into `icons/` to include its files.
- `-x "*.DS_Store"`: exclude the macOS hidden files. The `*` is a wildcard
  matching any path at any depth, so a single rule excludes `.DS_Store` in every
  folder (root, `icons/`, and any future subfolders) — no need to list each one.

Upload the resulting `bookmark-to-top.zip` to the
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
via **Add new item**. Brave users can install it straight from the Chrome Web
Store — no separate listing needed.

> Registering a developer account costs a one-time $5 USD fee. Publishing has
> nothing to do with git; the store only needs the zip.

## File structure

```
manifest.json   Extension config (name, permissions, icons, service worker)
background.js   Core logic (move newly created bookmarks to the top)
icons/          16 / 48 / 128 icons
```