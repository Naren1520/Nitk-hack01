# 🚀 Campus Link - FINAL DEPLOYMENT COMMANDS

## Ready to Deploy? Run These Commands:

### Step 1: Verify Everything is Ready
```bash
# Install and verify
npm install
npm run verify
npm run build
```

### Step 2A: Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy Campus Link
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_OPENAI_API_KEY production

# Redeploy with environment variables
vercel --prod
```

### Step 2B: Deploy to Netlify (Alternative)
```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy Campus Link
netlify deploy --prod --dir=dist

# Set environment variables (via dashboard or CLI)
netlify env:set VITE_SUPABASE_URL "your-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key"
```

### Step 3: Configure Supabase Auth
After deployment, update your Supabase project:

1. Go to Supabase Dashboard → Authentication → Settings
2. Set **Site URL**: `https://your-deployed-domain.vercel.app`
3. Add **Redirect URLs**: `https://your-deployed-domain.vercel.app/**`

### Step 4: Create Admin User
```sql
-- Run in Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 🎉 Your Campus Link is Now LIVE!

### Test Your Deployment:
- Visit your deployed URL
- Test user registration
- Verify login/logout works
- Check all features are accessible

### Quick Start for Users:
1. Register with USN-based authentication
2. Complete profile setup
3. Explore all Campus Link features
4. Start using real-time collaboration tools

---

**🔗 Example URLs after deployment:**
- Vercel: `https://campus-link-xyz.vercel.app`
- Netlify: `https://campus-link-xyz.netlify.app`

**📞 Support:** Create issues on GitHub for any deployment questions