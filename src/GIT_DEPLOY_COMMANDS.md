# 🚀 Git Deployment Commands for Campus Link

## Push to GitHub Repository

### Step 1: Initialize and Connect to Repository

```bash
# Navigate to your project directory
cd campus-link

# Initialize Git (if not already done)
git init

# Add the remote repository
git remote add origin https://github.com/Naren1520/campuslinkss1.git

# Verify remote is set correctly
git remote -v
```

### Step 2: Prepare Files for Commit

```bash
# Remove incorrectly placed files
rm -rf public/_headers/Code-component-*.tsx

# Add all files to staging
git add .

# Check what will be committed
git status
```

### Step 3: Commit and Push

```bash
# Create initial commit
git commit -m "🚀 Initial commit: Campus Link v1.0 - Complete College Management System

✨ Features included:
- USN-based authentication system
- Real-time collaboration and notifications
- AI-powered exam generation
- Smart campus tools and analytics
- Emergency safety system with 3-second hold
- Role-based content management
- Complete mobile responsiveness
- Supabase backend integration
- Production-ready deployment configs

🎓 Ready for immediate deployment to Vercel/Netlify!"

# Push to GitHub
git push -u origin main
```

### Alternative: If repository already exists

```bash
# If the repository has existing content, force push (be careful!)
git push -f origin main

# Or create a new branch for your version
git checkout -b campus-link-v1
git push -u origin campus-link-v1
```

## Quick Deploy Commands After Push

### Option A: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npx vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_OPENAI_API_KEY production
```

### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

## Environment Variables Needed

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=sk-your-openai-key
```

## Post-Deploy Checklist

- [ ] Update Supabase auth URLs with deployed domain
- [ ] Test user registration and login
- [ ] Verify all features work in production
- [ ] Create first admin user
- [ ] Share live URL with stakeholders

## 🎉 Success!

Your Campus Link will be live at:
- **GitHub**: https://github.com/Naren1520/campuslinkss1
- **Live Demo**: https://your-domain.vercel.app (after deployment)