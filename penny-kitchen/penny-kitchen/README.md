# Penny Kitchen

A cookbook website that shows the real cost of every meal. Recipes are plain
text files — no database, no admin login needed.

## Running it on your own computer (optional, to preview before deploying)

```
npm install
npm run dev
```

Then open http://localhost:3000

## Adding a new recipe

1. Go to `content/recipes/`
2. Copy `_template.md`, rename it (e.g. `tomato-pasta.md` — lowercase, dashes, no spaces)
3. Fill in the title, image path, servings, and ingredient list with prices
4. Write the instructions below the `---` line using Markdown
5. Add your photo to `public/images/`
6. Save, commit, and push to GitHub

Vercel rebuilds the site automatically within about 30 seconds of a push —
no other steps needed. The total price banner and per-serving cost are
calculated automatically from the ingredient prices you enter.

## Renaming the site

Edit `lib/config.js` — change `name` and `tagline`, nothing else needs to change.

## Deploying on Vercel (one-time setup)

1. Create a free account at github.com if you don't have one
2. Create a new repository and push this project to it:
   ```
   git init
   git add .
   git commit -m "Initial cookbook site"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
3. Create a free account at vercel.com and sign in with GitHub
4. Click "New Project," select this repository, and click "Deploy"
5. Vercel gives you a live URL like `penny-kitchen.vercel.app` within a minute

## Adding your own domain

In your Vercel project, go to Settings → Domains, add your domain, and follow
the DNS instructions Vercel shows you (usually one CNAME or A record added at
wherever you bought the domain).

## Editing recipes without a computer

You can also add or edit recipe files directly on GitHub.com:
open the file, click the pencil (edit) icon, make your changes, and click
"Commit changes." Vercel will redeploy automatically.
