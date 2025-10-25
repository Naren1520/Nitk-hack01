# 🚀 Campus Link Deployment Guide

This guide provides step-by-step instructions for deploying Campus Link to production using GitHub and Vercel.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Git installed and configured
- ✅ GitHub account
- ✅ Vercel account
- ✅ Supabase project set up
- ✅ OpenAI API key (optional, for AI features)

## 🔧 Pre-Deployment Setup

### 1. Environment Variables Setup

Create a `.env.local` file with your credentials:

```bash
# Required - Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional - AI Features
VITE_OPENAI_API_KEY=sk-your-openai-api-key

# App Configuration
VITE_APP_NAME=Campus Link
VITE_APP_VERSION=1.0.0
```

### 2. Build Test

Test the production build locally:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to verify everything works correctly.

## 📂 GitHub Repository Setup

### Step 1: Create Repository

1. Go to [GitHub](https://github.com) and click "New repository"
2. Repository name: `campus-link`
3. Description: "Comprehensive college management system and campus hub"
4. Set to Public or Private (your choice)
5. Initialize with README: ❌ (we already have one)
6. Click "Create repository"

### Step 2: Push Your Code

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "🎉 Initial commit: Campus Link v1.0

✨ Features:
- Complete college management system
- Real-time collaboration and notifications
- AI-powered exam generation
- Smart campus tools and analytics
- Role-based access control
- Modern responsive design"

# Add remote origin (replace with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/campus-link.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Vercel Deployment

### Step 1: Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Find and import your `campus-link` repository

### Step 2: Configure Project

1. **Project Name**: `campus-link`
2. **Framework Preset**: Vite (should auto-detect)
3. **Root Directory**: `.` (default)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`

### Step 3: Environment Variables

In the Vercel dashboard, add these environment variables:

| Name | Value | Required |
|------|-------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ Yes |
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | ❌ Optional |
| `VITE_APP_NAME` | Campus Link | ❌ Optional |

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be available at `https://campus-link.vercel.app`

## 🎯 Post-Deployment Configuration

### 1. Custom Domain (Optional)

To use a custom domain:

1. In Vercel dashboard → Project Settings → Domains
2. Add your domain (e.g., `campuslink.yourschool.edu`)
3. Configure DNS records as shown:
   - Type: `CNAME`
   - Name: `@` or subdomain
   - Value: `cname.vercel-dns.com`

### 2. Supabase URL Configuration

Update your Supabase project settings:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to "Site URL": `https://campus-link.vercel.app`
3. Add to "Redirect URLs": `https://campus-link.vercel.app/**`

### 3. Security Headers (Recommended)

Add security headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to main branch:

```bash
# Make changes to your code
git add .
git commit -m "✨ Add new feature"
git push origin main
```

Your changes will be live in 2-3 minutes!

## 📊 Monitoring & Analytics

### 1. Vercel Analytics

Enable in Vercel dashboard:
- Go to Project → Analytics
- Enable "Web Analytics"
- View traffic, performance, and user insights

### 2. Performance Monitoring

Monitor your app's performance:
- **Core Web Vitals**: Automatically tracked by Vercel
- **Bundle Size**: Check in build logs
- **Error Tracking**: Use Vercel's error reporting

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails - TypeScript Errors**
   ```bash
   npm run build
   # Fix any TypeScript errors shown
   ```

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables
   - Check spelling and values

3. **Supabase Connection Issues**
   - Verify URL and keys are correct
   - Check Supabase project is active
   - Ensure URL configuration is set

4. **Images Not Loading**
   - Check image paths are correct
   - Ensure images are in `public/` folder
   - Verify Supabase storage permissions

### Getting Help:

- 📧 Vercel Support: [vercel.com/support](https://vercel.com/support)
- 📘 Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- 🐛 GitHub Issues: Create issue in your repository

## 🎉 Success!

Your Campus Link application is now live and accessible worldwide! 

**Next Steps:**
- Share the URL with your college community
- Set up user roles and permissions in Supabase
- Customize branding and content for your institution
- Monitor usage and gather feedback for improvements

---

**Deployment URL**: `https://campus-link.vercel.app`

**Admin Access**: Create admin user through Supabase auth dashboard

**Support**: Check GitHub repository for documentation and issues