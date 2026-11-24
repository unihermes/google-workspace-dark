# Workspace Dark

A Firefox extension that puts Google Drive, Docs, Slides and Sheets in dark mode, while keeping **Docs pages** and **Slides canvases** white so documents and presentations still look the way they'll print or present.

| App    | Dark UI | Content                                        |
|--------|---------|------------------------------------------------|
| Drive  | ✓       | thumbnails and avatars keep their real colors  |
| Docs   | ✓       | pages stay white                               |
| Slides | ✓       | slides and filmstrip thumbnails stay white     |
| Sheets | ✓       | cell grid dark (optional), charts keep their real colors |

Everything can be toggled per app from the toolbar button.

## Install

### Temporary (for development)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…** and pick `manifest.json` in this folder.

Temporary add-ons are removed when Firefox restarts.

### Permanent

Firefox only installs signed extensions permanently. Either:

- **Sign it yourself (unlisted):** create an account on [addons.mozilla.org](https://addons.mozilla.org/developers/), then
  ```sh
  npx web-ext sign --channel=unlisted --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET
  ```
  and install the `.xpi` it produces from `web-ext-artifacts/`.
- **Firefox Developer Edition / Nightly:** set `xpinstall.signatures.required` to `false` in `about:config`, then `npx web-ext build` and install the `.zip`.

## How it works

`dark.css` inverts the whole page (with a 180° hue rotation so colors keep their hue), then inverts back the things that should keep their real colors: images, video, Docs pages, Slides canvases and Sheets charts. Because it relies on a few container selectors rather than restyling every part of Google's UI, it survives most of Google's updates.

If Google renames a container and, say, Docs pages turn dark, the selector to update is in the matching section of `dark.css`:

- Docs pages: `.kix-page-paginated`, `.kix-page`, `.kix-page-compact`
- Slides: `#workspace-container svg`, `.punch-filmstrip-thumbnail`, `.punch-viewer-container`
- Sheets: `#waffle-grid-container`, `.waffle-embedded-object-overlay`

Dark mode pauses while something is fullscreen (Slides **Present**, videos), since fullscreen content is drawn outside the page filter.

## Files

```
manifest.json     extension manifest (MV3)
content.js        detects the app and toggles classes on <html>
dark.css          the dark theme
popup/            toolbar popup with the toggles
icons/icon.svg
```
