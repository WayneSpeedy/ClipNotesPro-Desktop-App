# ClipNotesPro Desktop App

This is a desktop wrapper for the ClipNotesPro web application, built with Electron.

## Development

### Prerequisites
- Node.js (v14 or later)
- npm (comes with Node.js)

### Installation
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm start
   ```

## Building for Production

### Windows
```bash
npm run dist
```

The installer will be created in the `dist` directory.

### Note
Make sure to add an icon file at `build/icon.png` (and other icon formats) for the final build.
