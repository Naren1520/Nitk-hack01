#!/bin/bash

# Campus Link - Terminal Commands for Deployment
# Run these commands in order for quick deployment

echo "🚀 Campus Link Deployment Commands"
echo "================================="

echo "1. Install dependencies and build"
npm install
npm run build

echo "2. Test the build locally (optional)"
echo "npm run preview"

echo "3A. Deploy to Vercel (Option 1)"
echo "npm install -g vercel"
echo "vercel login"
echo "vercel"

echo "3B. Deploy to Netlify (Option 2)" 
echo "npm install -g netlify-cli"
echo "netlify login"
echo "netlify deploy --prod --dir=dist"

echo "4. Set environment variables after deployment"
echo "Don't forget to add your Supabase credentials!"

echo "🎉 Your Campus Link will be live once deployed!"