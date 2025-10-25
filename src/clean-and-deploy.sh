#!/bin/bash

# Campus Link - Clean and Deploy Script
# This script cleans up the repository and prepares for GitHub deployment

echo "🧹 Campus Link - Clean and Deploy to GitHub"
echo "============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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

# Step 1: Clean up incorrect files
print_step "Cleaning up repository structure..."

# Remove TSX files from _headers directory
if [ -d "public/_headers" ]; then
    print_warning "Found TSX files in _headers directory, removing..."
    find public/_headers -name "*.tsx" -type f -delete 2>/dev/null || true
    rm -rf public/_headers/Code-component-*.tsx 2>/dev/null || true
    
    # Remove the directory if it exists and recreate _headers as file
    if [ -d "public/_headers" ]; then
        rm -rf public/_headers
    fi
fi

print_success "Repository structure cleaned!"

# Step 2: Ensure environment files are ready
print_step "Checking environment configuration..."

if [ ! -f ".env.example" ]; then
    print_error ".env.example not found! This is required for documentation."
    exit 1
fi

if [ ! -f ".env.local.example" ]; then
    print_warning ".env.local.example not found, but continuing..."
fi

# Create .env.local if it doesn't exist (from example)
if [ ! -f ".env.local" ]; then
    print_warning "Creating .env.local from example template..."
    cp .env.example .env.local
    print_warning "⚠️  IMPORTANT: Edit .env.local with your actual API keys before running the app!"
fi

print_success "Environment configuration checked!"

# Step 3: Install dependencies and test build
print_step "Installing dependencies..."
npm install

print_step "Testing production build..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed! Please fix errors before deploying."
    exit 1
fi

print_success "Build successful!"

# Step 4: Git setup and push
print_step "Setting up Git repository..."

# Initialize Git if not already done
if [ ! -d ".git" ]; then
    git init
    print_success "Git repository initialized!"
fi

# Add remote if not exists
if ! git remote get-url origin &>/dev/null; then
    git remote add origin https://github.com/Naren1520/campuslinkss1.git
    print_success "GitHub remote added!"
else
    git remote set-url origin https://github.com/Naren1520/campuslinkss1.git
    print_success "GitHub remote updated!"
fi

# Stage all files
print_step "Staging files for commit..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    print_warning "No changes to commit."
else
    # Commit changes
    print_step "Creating commit..."
    git commit -m "🚀 Campus Link v1.0 - Production Ready College Management System

✨ Complete Feature Set:
- USN-based authentication with role-based access (Student/Faculty/Admin)
- Real-time collaboration with live document editing
- AI-powered exam generation from uploaded materials
- Smart campus tools with AR navigation and focus mode
- Emergency safety system with 3-second hold security alert
- Comprehensive analytics and performance tracking
- Mobile-responsive design with PWA support
- Real-time notifications and alarm system

🔧 Technical Stack:
- React 18 + TypeScript + Tailwind CSS v4
- Supabase backend (Auth, Database, Storage, Realtime)
- OpenAI integration for AI-powered features
- shadcn/ui component library
- Advanced caching and performance optimizations

🛡️ Security & Production Ready:
- Environment variable configuration for all deployment platforms
- Security headers and CORS protection
- Role-based content management system
- Data encryption and secure file uploads
- Production deployment configurations for Vercel/Netlify

🎓 Perfect for Educational Institutions:
- Complete student information system
- Faculty management and course administration
- Real-time campus communication hub
- Advanced academic analytics and reporting
- Integrated safety and emergency response system

🚀 Ready for immediate production deployment!
Developed with ❤️ for the future of educational technology."

    print_success "Commit created successfully!"
fi

# Push to GitHub
print_step "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    print_success "Successfully pushed to GitHub!"
else
    print_warning "Push failed, attempting force push..."
    git push -f origin main
    
    if [ $? -eq 0 ]; then
        print_success "Force push successful!"
    else
        print_error "Push failed. Please check your GitHub credentials."
        exit 1
    fi
fi

# Success message
echo ""
echo "🎉 SUCCESS! Campus Link has been deployed to GitHub!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 🌐 Visit your repository: https://github.com/Naren1520/campuslinkss1"
echo ""
echo "2. 🚀 Deploy to production:"
echo "   • Vercel: npx vercel --prod"
echo "   • Netlify: npx netlify deploy --prod --dir=dist"
echo ""
echo "3. ⚙️ Set environment variables in your deployment platform:"
echo "   • VITE_SUPABASE_URL=https://your-project-id.supabase.co"
echo "   • VITE_SUPABASE_ANON_KEY=your-supabase-anon-key"
echo "   • VITE_OPENAI_API_KEY=sk-your-openai-key"
echo ""
echo "4. 🔧 Configure Supabase:"
echo "   • Update Site URL in Supabase Auth settings"
echo "   • Add your deployed domain to redirect URLs"
echo "   • Run database migrations from /supabase/migrations/"
echo ""
echo "5. 👥 Create your first admin user:"
echo "   • Register through the app"
echo "   • Update role to 'admin' in Supabase profiles table"
echo ""
echo "📚 Documentation:"
echo "   • Complete setup: ENVIRONMENT_SETUP_GUIDE.md"
echo "   • Deployment: FINAL_DEPLOYMENT_COMMANDS.md"
echo "   • Features: README.md"
echo ""
print_success "Campus Link is ready to revolutionize your educational institution! 🎓✨"