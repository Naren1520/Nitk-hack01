# Campus Link - Netlify Security Headers Configuration

# Security headers for all routes
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://oydklzlkgllkebepljtq.supabase.co wss://oydklzlkgllkebepljtq.supabase.co https://api.openai.com; frame-src 'self' https://oydklzlkgllkebepljtq.supabase.co;

# Cache static assets aggressively
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

*.jpeg
  Cache-Control: public, max-age=31536000, immutable

*.webp
  Cache-Control: public, max-age=31536000, immutable

*.ico
  Cache-Control: public, max-age=31536000, immutable

*.woff
  Cache-Control: public, max-age=31536000, immutable

*.woff2
  Cache-Control: public, max-age=31536000, immutable

# Service worker should not be cached
/sw.js
  Cache-Control: public, max-age=0, must-revalidate

# API routes should not be cached
/api/*
  Cache-Control: no-cache, no-store, must-revalidate
  
# HTML files should be validated frequently
*.html
  Cache-Control: public, max-age=3600, must-revalidate

# Manifest and other PWA files
/manifest.json
  Cache-Control: public, max-age=86400

# Sitemap
/sitemap.xml
  Cache-Control: public, max-age=86400

# Robots.txt
/robots.txt
  Cache-Control: public, max-age=86400