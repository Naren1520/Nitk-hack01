#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Campus Link Deployment Verification');
console.log('=====================================\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Run npm init to create package.json'
  },
  {
    name: 'App.tsx exists',
    check: () => fs.existsSync('App.tsx'),
    fix: 'Ensure main App.tsx file is present'
  },
  {
    name: 'Vite config exists',
    check: () => fs.existsSync('vite.config.ts'),
    fix: 'Create vite.config.ts file'
  },
  {
    name: 'Tailwind config exists',
    check: () => fs.existsSync('tailwind.config.js'),
    fix: 'Create tailwind.config.js file'
  },
  {
    name: 'Environment example exists',
    check: () => fs.existsSync('.env.example'),
    fix: 'Create .env.example with required variables'
  },
  {
    name: 'Supabase setup script exists',
    check: () => fs.existsSync('scripts/setup-supabase.sql'),
    fix: 'Ensure Supabase migration files are present'
  },
  {
    name: 'Deployment configs exist',
    check: () => fs.existsSync('vercel.json') && fs.existsSync('netlify.toml'),
    fix: 'Create deployment configuration files'
  },
  {
    name: 'Node modules installed',
    check: () => fs.existsSync('node_modules'),
    fix: 'Run: npm install'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  
  console.log(`${index + 1}. ${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   Fix: ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(40));

if (allPassed) {
  console.log('🎉 All checks passed! Ready for deployment.');
  console.log('\nNext steps:');
  console.log('1. Run: npm run build');
  console.log('2. Choose deployment option:');
  console.log('   - Vercel: npx vercel');
  console.log('   - Netlify: npx netlify deploy --prod --dir=dist');
  console.log('3. Set environment variables in your deployment dashboard');
  console.log('4. Update Supabase auth URLs with your deployed domain');
} else {
  console.log('❌ Some checks failed. Please fix the issues above before deploying.');
}

console.log('\n📚 For detailed instructions, see DEPLOY_NOW.md');