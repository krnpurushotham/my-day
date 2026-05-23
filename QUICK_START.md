# Quick Start Guide

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Deploy to GitHub Pages

### Option A: Quick Deploy (Recommended)

1. **Create GitHub repo**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Phase 1"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/my-day.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Select "GitHub Actions" as source
   - Done! Your app will build and deploy automatically

3. **Access your app**
   - URL: `https://YOUR_USERNAME.github.io/my-day/`

### Option B: Manual Deploy

```bash
npm run build
# Upload the 'dist' folder to your hosting
```

## Build & Test

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Testing Checklist

- [ ] Add an event with name, emoji, and time
- [ ] See event appear in the activities list
- [ ] Edit an event (change name/emoji/time)
- [ ] Delete an event
- [ ] Refresh page — events still there? ✅ (localStorage working)
- [ ] Try different theme colors in Settings
- [ ] Check on mobile device (responsive?)

## Troubleshooting

### "Cannot find module" errors
```bash
npm install
npm run dev
```

### Build fails
Check that all files exist in `src/components/` and `src/hooks/`

### Events not saving
- Check browser's localStorage is enabled
- Check browser console (F12) for errors
- Try clearing browser cache

### GitHub Pages URL wrong
Edit `vite.config.js` — change `base: '/my-day/'` to match your repo name.

---

Ready to add animations? Just let me know and we'll move to Phase 2! 🚀
