# Free Hosting + Git Guide — Fakhri Computers App

## 1. Initialize Git (version control)
git init
git add .
git commit -m "Initial commit"
git branch -M main

## 2. Create remote repo
Create a new empty repo on GitHub. Then:
git remote add origin https://github.com/YOUR_USERNAME/figma-make-app.git
git push -u origin main

## 3. Build for production
npm run build   # creates /dist

## 4. Deploy free
Option A — GitHub Pages: push /dist to `gh-pages` branch or use GitHub Actions.
Option B — Netlify/Vercel: connect repo; build command = `npm run build`; publish = `dist`.

## 5. Keep code clean
- Add .env files to .gitignore (already done)
- Never commit node_modules/ or dist/
