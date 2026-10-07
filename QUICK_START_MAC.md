# TrendRadar Studio - Quick Start for Mac Users

## For End Users (Using Pre-Built App)

### Download & Install

1. Download `TrendRadar Studio.dmg` from the releases
2. Double-click the DMG file
3. Drag "TrendRadar Studio" to the Applications folder
4. Open Applications folder and double-click TrendRadar Studio
5. If prompted, click "Open" to confirm running from unknown developer

### Using the App

1. **First Time Setup**
   - Click the gear icon in the top right
   - Paste your Gemini API key (get free key: https://aistudio.google.com/apikey)
   - Click "Save Key"

2. **How to Use**
   - Select a news category from the top menu
   - Click on any story in the left panel
   - Click "توليد التحقيق الاستقصائي" (Generate Investigation)
   - Wait for AI analysis
   - View results in tabs: Report, Verification, Timeline, Video Script

3. **Add Custom Topics**
   - Click "+ خبر يدوي" button
   - Type your topic and context
   - Click "Add" and then analyze

---

## For Developers (Building from Source)

### Prerequisites

- macOS 10.13+
- Node.js 16+: https://nodejs.org/
- Xcode Command Line Tools: `xcode-select --install`

### Build Steps

```bash
# 1. Clone repository
git clone https://github.com/fadwaalhamid77/trendradar-studio.git
cd trendradar-studio

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local and add your Gemini API key
# Open .env.local in your editor and replace:
# GOOGLE_API_KEY=your_actual_key_here

# 5. Run in development mode
npm run dev

# OR build a distributable DMG
npm run build:mac
```

### After Building

The `.dmg` file will be in the `dist/` folder. You can:
- Share it with others
- Install it locally by double-clicking
- Distribute on your website

---

## System Requirements

- **macOS**: 10.13 or later (Intel or Apple Silicon)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: ~500MB
- **Internet**: Required for news feeds and AI analysis

## Keyboard Shortcuts

- **⌘+Q**: Quit app
- **⌘+,**: Open preferences
- **⌘+R**: Reload
- **⌘+Shift+R**: Force reload
- **Alt+⌘+I**: Open Developer Tools

## Getting API Key

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste into app settings
5. Click Save

## Troubleshooting

**"App can't be opened because Apple cannot check it for malicious software"**
- Right-click app → Open → Click Open
- Or: System Preferences → Security & Privacy → Open Anyway

**"No news loading"**
- Check internet connection
- Try refreshing category
- RSS feeds may be temporarily unavailable

**"AI analysis not working"**
- Verify API key in settings
- Check you have API quota remaining
- App has built-in fallback responses

---

## Features

✅ Real-time news aggregation from 5 categories
✅ AI-powered investigative analysis
✅ Timeline generation
✅ Documentary video script creation
✅ Custom topic analysis
✅ Dark-theme optimized UI
✅ RTL Arabic language support
✅ Offline fallback responses
✅ One-click app experience

---

## Next Steps

- Star the repo on GitHub
- Report bugs or request features via Issues
- Fork and customize for your newsroom
