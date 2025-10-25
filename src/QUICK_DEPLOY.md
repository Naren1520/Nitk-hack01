# ⚡ Quick Deploy Guide - Campus Link

Get Campus Link running in production in under 30 minutes!

## 🚀 Quick Start (3 Steps)

### Step 1: Supabase Backend (10 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com) → New Project
   - Name: `campus-link-production`
   - Wait for setup (2-3 minutes)

2. **Setup Database**
   - Go to **SQL Editor** in dashboard
   - Copy entire content from `/scripts/setup-supabase.sql`
   - Paste and click **Run** (this sets up everything!)

3. **Get Credentials**
   - Go to **Settings** → **API**
   - Copy **Project URL** and **Anon Key**

### Step 2: GitHub Repository (5 minutes)

```bash
# Create repository on GitHub, then:
git init
git add .
git commit -m "🚀 Deploy Campus Link"
git remote add origin https://github.com/YOUR_USERNAME/campus-link.git
git push -u origin main
```

### Step 3: Vercel Deployment (10 minutes)

1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) → New Project
   - Import your GitHub repository
   - Add environment variables:
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     VITE_OPENAI_API_KEY=sk-your-openai-key (optional)
     ```
   - Click **Deploy**

2. **Update Supabase Auth**
   - Copy your Vercel URL (e.g., `https://campus-link-xxx.vercel.app`)
   - In Supabase: **Authentication** → **Settings**
   - Set **Site URL** to your Vercel URL
   - Add to **Redirect URLs**: `https://campus-link-xxx.vercel.app/**`

## ✅ Verification

Test your deployment:
- ✅ App loads at your Vercel URL
- ✅ User registration works
- ✅ Login/logout functions
- ✅ Dashboard displays properly

## 🎉 You're Live!

Your Campus Link is now running in production!

**Default Admin**: Update any user to admin role:
```sql
-- In Supabase SQL Editor:
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Next Steps**:
- Create admin and faculty accounts
- Upload course materials
- Customize for your institution
- Train users on the new system

---

**Need help?** Check the complete guide in `COMPLETE_DEPLOYMENT_GUIDE.md`