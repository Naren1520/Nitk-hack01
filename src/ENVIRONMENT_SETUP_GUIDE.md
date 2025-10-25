# 🔐 Campus Link - Environment Setup Guide

## Required Environment Variables

### 🚀 Quick Setup Steps

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your credentials:**
   ```bash
   # Use your preferred editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Get your Supabase credentials:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project or select existing
   - Go to Settings → API
   - Copy your Project URL and anon key

4. **Get OpenAI API key (optional):**
   - Go to [platform.openai.com](https://platform.openai.com/api-keys)
   - Create new API key
   - Copy the key (starts with `sk-`)

## 🏗️ Environment Variables Breakdown

### Required Variables (Core Functionality)

```env
# Supabase - Required for authentication, database, storage
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Optional Variables (Enhanced Features)

```env
# AI Features - For exam generation, study assistant
VITE_OPENAI_API_KEY=sk-your-openai-key

# Deployment - Set automatically by platforms
VITE_APP_URL=https://your-domain.vercel.app
VITE_ENVIRONMENT=production

# Feature Toggles
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# Customization
VITE_COLLEGE_NAME="Your College Name"
VITE_COLLEGE_CODE="YCN"
VITE_SUPPORT_EMAIL=support@yourcollege.edu
```

## 🌍 Environment-Specific Setup

### Local Development (`.env.local`)

```env
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key
VITE_OPENAI_API_KEY=sk-your-dev-openai-key
VITE_APP_URL=http://localhost:5173
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
```

### Production (Set in deployment platform)

```env
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
VITE_OPENAI_API_KEY=sk-your-prod-openai-key
VITE_APP_URL=https://your-domain.vercel.app
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
```

## 🔧 Platform-Specific Instructions

### Vercel Deployment

1. **Via Dashboard:**
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add each variable with Production/Preview/Development scope

2. **Via CLI:**
   ```bash
   vercel env add VITE_SUPABASE_URL production
   vercel env add VITE_SUPABASE_ANON_KEY production
   vercel env add VITE_OPENAI_API_KEY production
   ```

### Netlify Deployment

1. **Via Dashboard:**
   - Go to Site settings → Environment variables
   - Add each variable

2. **Via CLI:**
   ```bash
   netlify env:set VITE_SUPABASE_URL "your-url"
   netlify env:set VITE_SUPABASE_ANON_KEY "your-key"
   netlify env:set VITE_OPENAI_API_KEY "your-key"
   ```

## 🛡️ Security Best Practices

### ✅ Do's

- **Use separate Supabase projects** for development and production
- **Rotate API keys regularly** (monthly recommended)
- **Limit API key permissions** to only what's needed
- **Use environment-specific keys** (dev keys for development)
- **Never commit `.env.local`** to version control

### ❌ Don'ts

- **Never expose keys in client-side code** (all VITE_ vars are public)
- **Never commit real API keys** to GitHub
- **Don't use production keys** in development
- **Avoid hardcoding sensitive data** in components

## 🧪 Testing Your Setup

### 1. Test Environment Loading

```bash
# Start development server
npm run dev

# Check console for any missing variable warnings
# Check Network tab for successful Supabase connections
```

### 2. Test Core Features

- ✅ User registration/login works
- ✅ Data loads from Supabase
- ✅ File uploads work (if using storage)
- ✅ AI features respond (if OpenAI key set)

### 3. Test Deployment

```bash
# Build locally to check for issues
npm run build

# Preview production build
npm run preview
```

## 🆘 Troubleshooting

### Common Issues

**"Invalid API key" error:**
- Check key format (should start with correct prefix)
- Verify key is active in provider dashboard
- Ensure no extra spaces/characters

**"Network request failed":**
- Check Supabase URL format
- Verify project is active
- Check CORS settings in Supabase

**Features not working:**
- Check feature flags are set to `true`
- Verify all required environment variables are set
- Check browser console for specific errors

### Debug Commands

```bash
# Check environment variables are loaded
npm run dev
# Open browser console and check for warnings

# Test Supabase connection
# Go to Network tab and look for supabase.co requests

# Verify build with environment variables
npm run build
npm run preview
```

## 📞 Support

If you encounter issues:

1. **Check the GitHub Issues** for similar problems
2. **Verify all environment variables** are correctly set
3. **Test with minimal configuration** (only required variables)
4. **Check provider status pages** (Supabase, OpenAI)
5. **Create an issue** with error messages and configuration (without sensitive data)

---

**⚠️ Security Reminder**: Never share your actual API keys. The examples above use placeholder values.