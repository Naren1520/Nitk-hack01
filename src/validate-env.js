#!/usr/bin/env node

/**
 * Campus Link - Environment Validation Script
 * Validates that all required environment variables are set correctly
 */

const fs = require('fs');
const https = require('https');

console.log('🔍 Campus Link - Environment Validation');
console.log('=======================================\n');

// Load environment variables from .env.local
const loadEnvFile = (filename) => {
  if (!fs.existsSync(filename)) {
    return {};
  }
  
  const content = fs.readFileSync(filename, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  });
  
  return env;
};

// Validation checks
const validations = [
  {
    name: 'Environment Files',
    check: () => {
      const files = ['.env.example', '.env.local'];
      const missing = files.filter(f => !fs.existsSync(f));
      return {
        passed: missing.length === 0,
        message: missing.length > 0 ? `Missing files: ${missing.join(', ')}` : 'All environment files present'
      };
    }
  },
  {
    name: 'Supabase URL Format',
    check: () => {
      const env = loadEnvFile('.env.local');
      const url = env.VITE_SUPABASE_URL;
      
      if (!url) {
        return { passed: false, message: 'VITE_SUPABASE_URL not set' };
      }
      
      if (!url.includes('supabase.co')) {
        return { passed: false, message: 'Invalid Supabase URL format' };
      }
      
      return { passed: true, message: 'Supabase URL format is valid' };
    }
  },
  {
    name: 'Supabase Anon Key Format',
    check: () => {
      const env = loadEnvFile('.env.local');
      const key = env.VITE_SUPABASE_ANON_KEY;
      
      if (!key) {
        return { passed: false, message: 'VITE_SUPABASE_ANON_KEY not set' };
      }
      
      if (!key.startsWith('eyJ')) {
        return { passed: false, message: 'Invalid Supabase anon key format (should start with eyJ)' };
      }
      
      return { passed: true, message: 'Supabase anon key format is valid' };
    }
  },
  {
    name: 'OpenAI API Key Format',
    check: () => {
      const env = loadEnvFile('.env.local');
      const key = env.VITE_OPENAI_API_KEY;
      
      if (!key) {
        return { passed: false, message: 'VITE_OPENAI_API_KEY not set (optional but recommended)' };
      }
      
      if (!key.startsWith('sk-')) {
        return { passed: false, message: 'Invalid OpenAI API key format (should start with sk-)' };
      }
      
      return { passed: true, message: 'OpenAI API key format is valid' };
    }
  },
  {
    name: 'Required Dependencies',
    check: () => {
      if (!fs.existsSync('package.json')) {
        return { passed: false, message: 'package.json not found' };
      }
      
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const required = ['react', '@supabase/supabase-js', 'lucide-react'];
      const missing = required.filter(dep => !pkg.dependencies[dep]);
      
      return {
        passed: missing.length === 0,
        message: missing.length > 0 ? `Missing dependencies: ${missing.join(', ')}` : 'All required dependencies present'
      };
    }
  },
  {
    name: 'Build Configuration',
    check: () => {
      const files = ['vite.config.ts', 'tailwind.config.js', 'tsconfig.json'];
      const missing = files.filter(f => !fs.existsSync(f));
      
      return {
        passed: missing.length === 0,
        message: missing.length > 0 ? `Missing config files: ${missing.join(', ')}` : 'All build configuration files present'
      };
    }
  }
];

// Run validations
let allPassed = true;
let warningCount = 0;

validations.forEach((validation, index) => {
  const result = validation.check();
  const status = result.passed ? '✅' : '❌';
  
  console.log(`${index + 1}. ${status} ${validation.name}`);
  console.log(`   ${result.message}`);
  
  if (!result.passed) {
    if (result.message.includes('optional')) {
      warningCount++;
    } else {
      allPassed = false;
    }
  }
  
  console.log('');
});

// Test Supabase connection
const testSupabaseConnection = () => {
  const env = loadEnvFile('.env.local');
  const url = env.VITE_SUPABASE_URL;
  
  if (!url) {
    console.log('❌ Cannot test Supabase connection - URL not set\n');
    return;
  }
  
  console.log('🔗 Testing Supabase Connection...');
  
  const testUrl = `${url}/rest/v1/`;
  const request = https.get(testUrl, (res) => {
    if (res.statusCode === 200 || res.statusCode === 401) {
      console.log('✅ Supabase connection successful');
    } else {
      console.log(`❌ Supabase connection failed with status: ${res.statusCode}`);
    }
    console.log('');
    showFinalResults();
  });
  
  request.on('error', (err) => {
    console.log(`❌ Supabase connection failed: ${err.message}`);
    console.log('');
    showFinalResults();
  });
  
  request.setTimeout(5000, () => {
    console.log('⚠️  Supabase connection timeout (network issue or invalid URL)');
    console.log('');
    showFinalResults();
  });
};

// Show final results
const showFinalResults = () => {
  console.log('='.repeat(50));
  
  if (allPassed && warningCount === 0) {
    console.log('🎉 All validations passed! Your environment is ready.');
    console.log('\n📋 Next steps:');
    console.log('1. npm run dev - Start development server');
    console.log('2. npm run build - Test production build');
    console.log('3. Deploy to Vercel/Netlify with your environment variables');
    
  } else if (allPassed && warningCount > 0) {
    console.log(`⚠️  Basic setup complete with ${warningCount} warnings.`);
    console.log('\n📋 Recommended actions:');
    console.log('1. Set VITE_OPENAI_API_KEY for AI features');
    console.log('2. npm run dev - Start development server');
    console.log('3. Test all features work as expected');
    
  } else {
    console.log('❌ Some validations failed. Please fix the issues above.');
    console.log('\n🔧 Common fixes:');
    console.log('1. Copy .env.example to .env.local');
    console.log('2. Set your Supabase credentials in .env.local');
    console.log('3. Run npm install to install dependencies');
    console.log('4. Run this script again: node validate-env.js');
  }
  
  console.log('\n📚 For detailed setup instructions, see:');
  console.log('   - ENVIRONMENT_SETUP_GUIDE.md');
  console.log('   - README.md');
  console.log('\n🆘 Need help? Check the GitHub repository issues section.');
};

// Start validation
if (allPassed) {
  testSupabaseConnection();
} else {
  showFinalResults();
}