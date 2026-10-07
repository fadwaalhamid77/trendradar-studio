# TrendRadar Studio macOS Desktop App - Build Instructions

## Prerequisites

- Node.js 16+ (https://nodejs.org/)
- macOS 10.13 or later
- Xcode Command Line Tools (run: `xcode-select --install`)

## Installation & Setup

### Step 1: Clone or Download the Repository

```bash
git clone https://github.com/fadwaalhamid77/trendradar-studio.git
cd trendradar-studio
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Gemini API key:

```
GOOGLE_API_KEY=your_actual_google_api_key_here
```

[Get your free API key here](https://aistudio.google.com/apikey)

## Running in Development Mode

```bash
npm run dev
```

This will:
1. Start the Next.js dev server on http://localhost:3000
2. Launch the Electron app window automatically
3. You can edit files and the app will hot-reload

## Building the macOS App

### Create a Distributable DMG File

```bash
npm run build:mac
```

This will:
1. Build the Next.js static export
2. Package it into a native macOS app
3. Create a `.dmg` installer file in `dist/` folder

The DMG file can be:
- Shared with others
- Double-clicked to mount
- Drag the app to Applications folder
- Run as a native macOS application

### Output Files

After building, you'll find:
- `dist/TrendRadar Studio.dmg` - Installer file
- `dist/TrendRadar Studio-1.0.0.dmg` - Same as above with version
- `dist/TrendRadar Studio.zip` - Standalone zip archive

## Distributing Your App

1. Build with: `npm run build:mac`
2. Find the `.dmg` file in the `dist/` folder
3. Share the DMG file with others
4. Users can double-click to install and run

## Troubleshooting

### Port 3000 already in use

If you get an error about port 3000 being busy:

```bash
# Find the process
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Gemini API errors

- Verify your API key is correct in `.env.local`
- Check that you have API quota remaining
- The app will use a fallback response if the API fails

### App won't start

```bash
# Clean and reinstall
rm -rf node_modules
npm install
npm run dev
```

## Notes

- The app requires internet connection for:
  - Fetching news feeds (RSS)
  - AI analysis (Gemini API)
- The app is fully functional offline for viewing previously cached content
- Your API key is stored locally in `.env.local` and never transmitted

## Support

For issues:
1. Check GitHub Issues
2. Verify Node.js version: `node --version`
3. Verify npm version: `npm --version`
4. Try a clean install: `rm -rf node_modules && npm install`
