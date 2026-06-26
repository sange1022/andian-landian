# 暗淡蓝点

暗淡蓝点 is a tiny desktop pomodoro timer for Windows and macOS.

## Behavior

- Floating always-on-top black circle.
- Only `25` and `45` minute modes.
- Left click starts or pauses the timer.
- Right click opens the native menu.
- The circle starts faint and becomes darker as the timer approaches zero.
- When time is up, the circle grows repeatedly.
- Click the finished circle three times to dismiss it.

## Development

```bash
npm install
npm test
npm start
```

If Electron download is slow in China, install with:

```bash
ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install
```

## Build Installers

```bash
npm run make:icon
npm run dist:win
npm run dist:mac
```

The installers are written to `dist/`.
