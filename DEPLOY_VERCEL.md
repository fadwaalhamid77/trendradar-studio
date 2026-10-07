# Deploy TrendRadar Studio to Vercel (Simple Steps)

## What You Need
- GitHub account (you already have this)
- Vercel account (free)
- Gemini API key (free from Google)

## Step-by-Step Guide

### Step 1: Get Your Gemini API Key

1. Go to: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key (it looks like: `AIzaSy...`)
4. Keep it safe — you'll need it in a few minutes

### Step 2: Sign Up for Vercel (if you don't have an account)

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Sign in with your GitHub account
5. Click "Authorize"

### Step 3: Deploy the Project

1. After signing in to Vercel, click "Add New Project"
2. You'll see a list of your GitHub repositories
3. Find and click: `trendradar-studio`
4. Click "Import"
5. A new page will open with settings

### Step 4: Add Your API Key

1. Look for the section called "Environment Variables"
2. Click "Add"
3. Fill in:
   - **Name:** `GOOGLE_API_KEY`
   - **Value:** Paste your Gemini API key (from Step 1)
4. Click "Add"
5. Make sure it says "✓ Added"

### Step 5: Deploy

1. Click the big blue button that says "Deploy"
2. Wait 2-3 minutes while Vercel builds your app
3. You'll see a checkmark ✓ when it's done
4. Click "Visit" to open your live app!

### Step 6: Share Your Link

1. Your app is now live at a URL like:
   - `https://trendradar-studio.vercel.app`
2. You can:
   - Bookmark it
   - Share the link with others
   - Use it on any device (Mac, Windows, iPhone, Android)

---

## That's It! 🎉

Your app is now live on the internet. Just click the link and use it.

### Using Your App

1. Click the link from Vercel
2. Select a news category from the top menu
3. Click on any story
4. Click "توليد التحقيق الاستقصائي" (Generate Investigation)
5. Wait for the AI analysis
6. Read the report, verification, timeline, and video script

### Add Custom Topics

1. Click "+ خبر يدوي" (Add Manual News)
2. Type your topic
3. Click "Add"
4. Analyze it

---

## Troubleshooting

### "API Key Error"
- Make sure you copied your API key correctly
- Go to Vercel → Project Settings → Environment Variables
- Check that GOOGLE_API_KEY has your actual key
- Redeploy the project

### "News Not Loading"
- This is a temporary RSS feed issue
- Try using "Add Manual News" instead
- Or refresh the page

### "Deploy Failed"
- Go back to Vercel
- Click "Redeploy"
- If it still fails, check the build logs

---

## Important Notes

✅ Your API key is safe — it only runs on Vercel's servers
✅ The app works on any device with internet
✅ You can access it from anywhere
✅ It's free to use (Vercel offers free tier)
✅ If you want to make changes, push them to GitHub and Vercel auto-deploys

---

## Next Steps After Deployment

Once your site is live:
- Share the link with colleagues
- Customize the app by editing files in GitHub
- Add more features (login, database, saved investigations, etc.)
- Monitor usage in Vercel dashboard

Enjoy your TrendRadar Studio! 🚀
