# 🚀 Campus Link - Production Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Environment variables ready
- [ ] GitHub repository set up
- [ ] Domain name ready (optional)
- [ ] SSL certificate configured (automatic with Vercel/Netlify)

## 🔧 Quick Deploy Options

### Option 1: Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fcampus-link&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY&envDescription=Supabase%20configuration%20required&envLink=https%3A%2F%2Fsupabase.com%2Fdocs%2Fguides%2Fgetting-started&project-name=campus-link&repository-name=campus-link)

1. Click the deploy button above
2. Connect your GitHub account
3. Set environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
4. Deploy!

### Option 2: Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/campus-link)

1. Click the deploy button above
2. Connect your GitHub account
3. Set environment variables in Netlify dashboard
4. Deploy!

### Option 3: Manual Deployment

```bash
# Clone and setup
git clone https://github.com/your-username/campus-link.git
cd campus-link
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# Build and deploy
npm run build
# Upload dist/ folder to your hosting provider
```

## 🏗️ Supabase Backend Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project: "campus-link-production"
3. Wait for project initialization

### 2. Run Database Migrations

In Supabase SQL Editor, run these files in order:

```sql
-- 1. Run /supabase/migrations/001_initial_schema.sql
-- 2. Run /supabase/migrations/002_rls_policies.sql  
-- 3. Run /supabase/migrations/003_functions.sql
-- 4. Run /supabase/migrations/004_sample_data.sql
```

### 3. Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-id

# Deploy edge functions
supabase functions deploy server
```

### 4. Configure Storage Buckets

Create these storage buckets in Supabase Dashboard:
- `avatars` (public: false)
- `documents` (public: false) 
- `content-files` (public: false)
- `exam-files` (public: false)

### 5. Get API Credentials

From Supabase Dashboard → Settings → API:
- Project URL: `https://your-project-id.supabase.co`
- Anon key: `eyJ...` (public anon key)

## 🌐 Production Configuration

### Environment Variables

```bash
# Required
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional  
VITE_OPENAI_API_KEY=sk-your-openai-key
VITE_ANALYTICS_ID=your-analytics-id
```

### Custom Domain (Optional)

#### Vercel:
1. Domain settings → Add domain
2. Configure DNS records
3. SSL automatically handled

#### Netlify:
1. Domain settings → Add custom domain
2. Configure DNS records  
3. Enable HTTPS

## 🔐 Security Configuration

### Supabase Auth Settings

1. Go to Authentication → Settings
2. Set **Site URL**: `https://your-domain.com`
3. Add **Redirect URLs**: 
   - `https://your-domain.com/**`
   - `http://localhost:3000/**` (for development)

### Row Level Security (RLS)

Ensure RLS is enabled on all tables (handled by migrations):
- ✅ Users can only access their own data
- ✅ Admins have elevated permissions  
- ✅ Public data properly exposed

## 📊 Performance Optimizations

### Build Optimizations
- ✅ Code splitting enabled
- ✅ Asset optimization
- ✅ Compression enabled
- ✅ Source maps for debugging

### CDN & Caching
- ✅ Static assets cached (1 year)
- ✅ API responses cached appropriately
- ✅ Service worker for offline support

## 🧪 Testing Production

### Automated Tests
```bash
# Run before deployment
npm run test
npm run lint
npm run type-check
```

### Manual Testing Checklist
- [ ] App loads without errors
- [ ] User registration works
- [ ] Login/logout functions
- [ ] All major features accessible
- [ ] Mobile responsiveness
- [ ] Real-time features working
- [ ] File uploads functional
- [ ] Database operations working

## 📈 Analytics & Monitoring

### Error Tracking
Consider adding:
- Sentry for error monitoring
- LogRocket for session replay
- Google Analytics for usage

### Performance Monitoring
- Vercel Analytics (automatic)
- Core Web Vitals tracking
- Database performance monitoring

## 🚀 Post-Deployment

### 1. Create Admin User
```sql
-- In Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 2. Initial Content Setup
- Upload sample course materials
- Create department structure
- Set up user roles and permissions
- Configure notification settings

### 3. User Training
- Admin dashboard walkthrough
- Faculty onboarding guide  
- Student registration process
- Feature documentation

## 🆘 Troubleshooting

### Common Issues

**Build Fails:**
- Check Node.js version (18+)
- Clear node_modules and reinstall
- Check for TypeScript errors

**Supabase Connection:**
- Verify environment variables
- Check API key permissions
- Ensure RLS policies are correct

**Authentication Issues:**
- Verify redirect URLs
- Check Supabase auth settings
- Ensure email confirmation enabled

### Getting Help
- Check the [GitHub Issues](https://github.com/your-username/campus-link/issues)
- Review Supabase documentation
- Contact support team

## 🎉 Success!

Your Campus Link is now live in production! 

**Next Steps:**
1. Share access with your team
2. Import existing student/faculty data
3. Customize for your institution
4. Train users on the platform
5. Monitor usage and performance

---

**Live Demo:** [https://campus-link-demo.vercel.app](https://campus-link-demo.vercel.app)
**Documentation:** [Complete guides available in /docs](./docs/)
**Support:** [Open an issue on GitHub](https://github.com/your-username/campus-link/issues)