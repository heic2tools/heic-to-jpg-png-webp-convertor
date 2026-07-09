# heic2.tools

**Free, browser-based HEIC/HEIF to JPG, PNG, or WebP converter.**
No uploads. No sign-up. No watermark. Your photos never leave your device.

🔗 Live tool: **[heic2.tools](https://heic2.tools)**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![No Backend](https://img.shields.io/badge/backend-none-brightgreen.svg)

---

## Why this exists

iPhones save photos in HEIC format by default. It's more storage-efficient than JPG, but poorly
supported outside the Apple ecosystem — plenty of websites, older apps, and non-Apple devices
can't open it.

Most "free" HEIC converters solve this by uploading your photo to a server, converting it there,
and sending it back. That means your personal photos pass through infrastructure you don't
control.

**heic2.tools does the conversion entirely client-side**, in the browser, using JavaScript. Files
never leave your device.

## Features

- 🖼️ Convert HEIC/HEIF → JPG, PNG, or WebP
- 📦 Batch conversion (up to 20 files at once)
- 🔒 100% client-side — no server upload, ever
- ⚡ No sign-up, no account, no watermark
- 🗂️ Download individually or as a `.zip`
- ♿ Keyboard-accessible drop zone

## How it works

Conversion is handled by [`heic2any`](https://github.com/alexcorvi/heic2any), a client-side
JavaScript library that decodes HEIC/HEIF image data and re-encodes it to a standard format
using the Canvas API — all inside the browser's memory. Batch downloads are zipped locally with
[`JSZip`](https://github.com/Stuk/jszip).

There is no backend. No API calls. No database. The entire app is static HTML/CSS/JS.

## Tech stack

| Layer | Choice |
|---|---|
| Markup / styling | Plain HTML5 + CSS (no framework) |
| Conversion | [heic2any](https://github.com/alexcorvi/heic2any) |
| Zipping | [JSZip](https://github.com/Stuk/jszip) |
| Hosting | Static (works on any static host / CDN) |

## Running locally

This is a static site — no build step, no dependencies to install.

```bash
git clone https://github.com/heic2tools/heic2-tools.git
cd heic2-tools
# open index.html directly, or serve it:
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```
.
├── index.html      # Markup + structure
├── style.css       # Styling (design tokens as CSS custom properties)
├── script.js       # Drag-and-drop, conversion logic, zip download
└── README.md
```

## Browser support

Works in any modern browser with support for the Canvas API and `File`/`Blob` APIs — the latest
versions of Chrome, Firefox, Safari, and Edge.

## Limitations

- Very large batches are limited by the user's own device performance, since there's no server
  doing the heavy lifting.
- HEIC decoding relies on the `heic2any` library's browser-side decoder; support may vary
  slightly across browsers for uncommon HEIC variants.

## Contributing

Issues and pull requests are welcome. If you're proposing a larger change, please open an issue
first to discuss what you'd like to change.

## License

[MIT](LICENSE) — free to use, modify, and distribute.
