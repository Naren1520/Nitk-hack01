#!/bin/bash

# Campus Link - Prepare for GitHub Deployment
echo "🚀 Preparing Campus Link for GitHub deployment..."

# Remove incorrectly placed TSX files from _headers
echo "🧹 Cleaning up file structure..."
find public/_headers -name "*.tsx" -type f -delete 2>/dev/null || true

# Ensure _headers is a file, not a directory
if [ -d "public/_headers" ]; then
    mv "public/_headers" "public/_headers_backup"
    echo "# Security Headers for Netlify
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
  Cache-Control: public, max-age=0, must-revalidate" > "public/_headers"
fi

# Check if Node.js dependencies are installed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project to verify everything works
echo "🏗️ Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Make scripts executable
chmod +x deploy.sh 2>/dev/null || true
chmod +x terminal-commands.sh 2>/dev/null || true

echo "✅ Campus Link is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Run: git init (if not already done)"
echo "2. Run: git remote add origin https://github.com/Naren1520/campuslinkss1.git"
echo "3. Run: git add ."
echo "4. Run: git commit -m \"🚀 Campus Link v1.0 - Production Ready\""
echo "5. Run: git push -u origin main"
echo ""
echo "🎉 After pushing, deploy to Vercel or Netlify!"