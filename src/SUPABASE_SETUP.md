# 🗄️ Supabase Setup Guide for Campus Link

This guide will help you set up Supabase backend for the Campus Link application with complete database schema, authentication, and real-time features.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `campus-link`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for project initialization (2-3 minutes)

### 2. Get Project Credentials

From your Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (`https://your-project-id.supabase.co`)
   - **Anon Public Key** (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configure Environment Variables

Create `.env.local` file in your project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_OPENAI_API_KEY=sk-your-openai-key-here  # Optional
```

## 🏗️ Database Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to **Database** → **SQL Editor**
2. Run each migration file in order:
   - Copy content from `/supabase/migrations/001_initial_schema.sql`
   - Paste and click "Run"
   - Repeat for files `002_rls_policies.sql`, `003_functions.sql`, `004_sample_data.sql`

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

## 🔐 Authentication Setup

### 1. Configure Auth Settings

Go to **Authentication** → **Settings**:

**Site URL**: `http://localhost:3000` (development)
**Additional redirect URLs**:
- `https://your-domain.vercel.app` (production)
- `http://localhost:3000/**` (development)

**Email Templates** (optional):
- Customize welcome email
- Customize password reset email

### 2. Enable Auth Providers

In **Authentication** → **Providers**:
- ✅ Email (enabled by default)
- Optional: Google, GitHub, etc.

### 3. Configure Email Settings

In **Authentication** → **Settings** → **SMTP Settings**:
- Configure your email provider
- Or use Supabase built-in email service

## 📦 Storage Setup

### 1. Create Storage Buckets

Go to **Storage** and create these buckets:

| Bucket Name | Public | Purpose |
|-------------|---------|---------|
| `avatars` | ✅ Yes | User profile pictures |
| `documents` | ❌ No | Course documents, private files |
| `content-files` | ✅ Yes | Public content attachments |
| `exam-files` | ❌ No | Exam-related files |

### 2. Configure Storage Policies

For each bucket, set up RLS policies:

**Avatars Bucket**:
```sql
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to avatars
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

**Documents Bucket**:
```sql
-- Only faculty/admin can upload documents
CREATE POLICY "Faculty can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
);

-- Users can read documents they have access to
CREATE POLICY "Users can read accessible documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');
```

## 🔔 Real-time Setup

Real-time is enabled by default. Configure channels in your app:

```typescript
// Example: Listen to notifications
const channel = supabase
  .channel('notifications')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'notifications' },
    (payload) => {
      console.log('New notification:', payload);
    }
  )
  .subscribe();
```

## 🛡️ Security Configuration

### 1. Row Level Security (RLS)

All tables have RLS enabled with appropriate policies. Key policies:

- **Profiles**: Users can view all profiles, update their own
- **Notifications**: Users see only their notifications
- **Documents**: Role-based access (faculty can create, students can view published)
- **Exams**: Faculty can create/manage, students can take scheduled exams

### 2. API Rate Limiting

In **Settings** → **API**:
- Set appropriate rate limits for your usage
- Monitor API usage in dashboard

### 3. Database Optimization

**Indexes are created for**:
- User lookups
- Notification queries
- Document searches
- Exam filtering
- Analytics queries

## 📊 Sample Data

The setup includes sample data for testing:

- **Admin User**: `admin@campuslink.edu`
- **Faculty User**: `dr.smith@campuslink.edu`  
- **Student Users**: `jane.doe@student.campuslink.edu`, `mike.wilson@student.campuslink.edu`
- Sample courses, exams, documents, and events

## 🔧 Advanced Configuration

### 1. Database Functions

Custom functions are available:
- `get_user_dashboard_stats(user_id)` - Get user dashboard statistics
- `create_notification(...)` - Create notifications
- `broadcast_notification(...)` - Send notifications to multiple users

### 2. Triggers

Automatic triggers for:
- New user profile creation
- Updated timestamps
- Notification cleanup

### 3. Extensions

Enabled extensions:
- `uuid-ossp` - UUID generation
- `pgcrypto` - Cryptographic functions

## 🚀 Production Deployment

### 1. Environment Variables

For production deployment, set these in Vercel:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_OPENAI_API_KEY=sk-your-production-openai-key
```

### 2. Domain Configuration

Update Supabase auth settings with production URLs:
- Site URL: `https://campus-link.vercel.app`
- Redirect URLs: `https://campus-link.vercel.app/**`

### 3. Security Checklist

- ✅ RLS policies tested and working
- ✅ Storage policies configured
- ✅ API keys secured
- ✅ Rate limiting configured
- ✅ CORS settings updated
- ✅ SSL certificates valid

## 🔍 Monitoring & Maintenance

### 1. Database Health

Monitor in Supabase dashboard:
- **Database** → **Reports** - Query performance
- **Settings** → **Usage** - Resource usage
- **Logs** - Error logs and debugging

### 2. Scheduled Maintenance

The `cleanup_expired_data()` function removes:
- Expired notifications
- Old analytics data (6+ months)

Set up a cron job or Edge Function to run this weekly.

### 3. Backups

Supabase automatically backs up your database:
- Point-in-time recovery available
- Manual backups can be created
- Download backups from dashboard

## 🆘 Troubleshooting

### Common Issues:

1. **Connection Errors**
   - Check environment variables
   - Verify project URL and keys
   - Ensure network connectivity

2. **Authentication Issues**
   - Check redirect URLs
   - Verify email settings
   - Test with different browsers

3. **Permission Errors**
   - Review RLS policies
   - Check user roles in profiles table
   - Verify policy syntax

4. **Performance Issues**
   - Check query performance in reports
   - Review index usage
   - Monitor resource usage

### Getting Help:

- 📧 Supabase Support: [supabase.com/support](https://supabase.com/support)
- 📘 Documentation: [supabase.com/docs](https://supabase.com/docs)
- 💬 Discord: [discord.supabase.com](https://discord.supabase.com)
- 🐛 GitHub Issues: Create issue in your repository

## ✅ Setup Verification

Test your setup:

1. **Authentication**: Try signing up a new user
2. **Database**: Create a test notification
3. **Storage**: Upload a test file
4. **Real-time**: Test live notifications
5. **Permissions**: Verify role-based access

## 🎉 You're Ready!

Your Supabase backend is now fully configured for Campus Link! 

**Next Steps**:
- Deploy your application to production
- Set up monitoring and analytics
- Customize for your institution's needs
- Train users on the new system

---

**Campus Link + Supabase** = Powerful, scalable college management system! 🚀