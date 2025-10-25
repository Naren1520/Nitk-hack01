# 🚀 Campus Link - Deploy Now Guide

## ⚡ Quick Deploy Commands

### 1. Make Deploy Script Executable and Run

```bash
# Make the deploy script executable
chmod +x deploy.sh

# Run the automated deployment
./deploy.sh
```

### 2. One-Click Deploy Options

#### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Deploy with auto-configuration
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project's name? campus-link
# - In which directory is your code located? ./
# - Want to override the settings? Yes
# - Build Command: npm run build
# - Output Directory: dist
# - Development Command: npm run dev
```

#### Deploy to Netlify
```bash
# Install Netlify CLI if you haven't already
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist

# If first time, run:
netlify login
netlify init
netlify deploy --prod --dir=dist
```

### 3. Environment Variables Setup

#### For Vercel:
```bash
# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_OPENAI_API_KEY

# Redeploy with new environment variables
vercel --prod
```

#### For Netlify:
```bash
# Set environment variables via CLI
netlify env:set VITE_SUPABASE_URL "your-supabase-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-supabase-anon-key"  
netlify env:set VITE_OPENAI_API_KEY "your-openai-key"

# Or set via Netlify dashboard
```

## 🔗 Quick Links

### Deploy Buttons
- **Vercel**: [One-Click Deploy](https://vercel.com/new/clone?repository-url=https://github.com/your-username/campus-link)
- **Netlify**: [One-Click Deploy](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/campus-link)

### Required Environment Variables
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=sk-your-openai-key (optional)
```

## ✅ Pre-Flight Checklist

- [ ] Supabase project created and configured
- [ ] Database migrations run
- [ ] Environment variables ready
- [ ] GitHub repository pushed
- [ ] Build script tested locally (`npm run build`)

## 🎯 Post-Deployment

1. **Test Your Live App**: Visit your deployed URL
2. **Create Admin User**: Run SQL in Supabase to set admin role
3. **Configure Auth URLs**: Update Supabase auth settings with your domain
4. **Share with Team**: Send live URL to stakeholders

## 🆘 Quick Troubleshooting

**Build Fails?**
```bash
npm run build
# Check for errors and fix them
```

**Environment Variables Not Working?**
- Double-check variable names (must start with VITE_)
- Verify values in deployment dashboard
- Redeploy after adding variables

**Supabase Connection Issues?**
- Verify URL and key are correct
- Check Supabase project is active
- Ensure auth URLs are configured

## 🎉 Success!

Your Campus Link is now live! 🚀

**Next Steps:**
1. Set up monitoring and analytics
2. Create user accounts for testing
3. Import any existing data
4. Train your team on the new system