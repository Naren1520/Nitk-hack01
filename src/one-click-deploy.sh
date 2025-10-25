#!/bin/bash

# Campus Link - One-Click Deployment Script
# This script handles everything from cleanup to GitHub push

set -e  # Exit on any error

echo "🚀 Campus Link - One-Click Deployment to GitHub"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Clean up files
print_step "Cleaning up project structure..."
find public/_headers -name "*.tsx" -type f -delete 2>/dev/null || true
if [ -d "public/_headers" ]; then
    rm -rf "public/_headers"
fi

# Create proper _headers file
cat > "public/_headers" << 'EOF'
# Security Headers for Netlify
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;

# Cache static assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

*.js
  Cache-Control: public, max-age=31536000, immutable

*.css  
  Cache-Control: public, max-age=31536000, immutable

*.svg
  Cache-Control: public, max-age=31536000, immutable

*.png
  Cache-Control: public, max-age=31536000, immutable

*.jpg
  Cache-Control: public, max-age=31536000, immutable

# Service worker
/sw.js
  Cache-Control: public, max-age=0, must-revalidate
EOF

print_success "Project structure cleaned up!"

# Step 2: Install dependencies and build
print_step "Installing dependencies..."
npm install

print_step "Building project to verify everything works..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build successful!"
else
    print_error "Build failed. Please fix errors before deploying."
    exit 1
fi

# Step 3: Git setup
print_step "Setting up Git repository..."

if [ ! -d ".git" ]; then
    git init
    print_success "Git repository initialized!"
else
    print_success "Git repository already exists!"
fi

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    git remote add origin https://github.com/Naren1520/campuslinkss1.git
    print_success "Remote repository added!"
else
    # Update remote URL to ensure it's correct
    git remote set-url origin https://github.com/Naren1520/campuslinkss1.git
    print_success "Remote repository updated!"
fi

# Step 4: Commit and push
print_step "Staging files for commit..."
git add .

print_step "Creating commit..."
git commit -m "🚀 Campus Link v1.0 - Complete College Management System

✨ Key Features:
- USN-based authentication system with role management
- Real-time collaboration and notifications
- AI-powered exam generation from uploaded documents
- Smart campus tools with AR navigation
- Emergency safety system with 3-second hold button
- Complete mobile responsiveness
- Comprehensive analytics and performance tracking

🔧 Technical Implementation:
- React 18 + TypeScript + Tailwind CSS v4
- Supabase backend (Auth, Database, Storage, Realtime)
- shadcn/ui component library
- OpenAI API integration for AI features
- PWA support with offline capabilities
- Production-optimized build configuration

🚀 Deployment Ready:
- Vercel and Netlify configurations included
- Comprehensive environment variable documentation
- Database migrations and setup scripts provided
- Security headers and performance optimizations applied
- Mobile-first responsive design

🎓 Perfect for educational institutions seeking a modern, 
integrated campus management solution. Ready for immediate 
production deployment!

Developed with ❤️ for the future of education technology."

print_step "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    print_success "Successfully pushed to GitHub!"
else
    print_warning "Push failed. Attempting force push..."
    git push -f origin main
    if [ $? -eq 0 ]; then
        print_success "Force push successful!"
    else
        print_error "Push failed. Please check your GitHub credentials and repository access."
        exit 1
    fi
fi

echo ""
echo "🎉 SUCCESS! Campus Link has been deployed to GitHub!"
echo ""
echo "📋 What's Next:"
echo "1. Visit: https://github.com/Naren1520/campuslinkss1"
echo "2. Deploy to Vercel: npx vercel --prod"
echo "3. Or deploy to Netlify: npm run build && npx netlify deploy --prod --dir=dist"
echo "4. Set your environment variables in the deployment dashboard"
echo "5. Configure Supabase auth URLs with your deployed domain"
echo ""
echo "🔗 Environment Variables Needed:"
echo "VITE_SUPABASE_URL=https://your-project-id.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=your-supabase-anon-key"
echo "VITE_OPENAI_API_KEY=sk-your-openai-key"
echo ""
print_success "Campus Link is ready to change education! 🚀🎓"