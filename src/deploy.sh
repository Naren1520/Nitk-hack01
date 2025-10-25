#!/bin/bash

# Campus Link Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Campus Link Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git and try again."
        exit 1
    fi
    
    print_success "All dependencies are installed!"
}

# Check Node.js version
check_node_version() {
    print_status "Checking Node.js version..."
    
    NODE_VERSION=$(node -v | cut -c 2-)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)
    
    if [ $MAJOR_VERSION -lt 18 ]; then
        print_error "Node.js version $NODE_VERSION is not supported. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    print_success "Node.js version $NODE_VERSION is supported!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully!"
}

# Build the application
build_application() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully!"
}

# Test the build
test_build() {
    print_status "Testing build..."
    
    if [ ! -d "dist" ]; then
        print_error "Build directory not found. Build may have failed."
        exit 1
    fi
    
    if [ ! -f "dist/index.html" ]; then
        print_error "index.html not found in build directory."
        exit 1
    fi
    
    print_success "Build test passed!"
}

# Check environment variables
check_environment() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local file not found. Make sure to configure environment variables in Vercel."
    else
        print_success "Environment configuration file found!"
    fi
}

# Git operations
setup_git() {
    print_status "Setting up Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        print_success "Git repository initialized!"
    else
        print_success "Git repository already exists!"
    fi
    
    # Check if remote exists
    if ! git remote get-url origin &> /dev/null; then
        print_warning "Git remote 'origin' not set. You'll need to add it manually:"
        echo "git remote add origin https://github.com/YOUR_USERNAME/campus-link.git"
    else
        print_success "Git remote is configured!"
    fi
}

# Commit and push changes
git_deploy() {
    read -p "Do you want to commit and push changes to GitHub? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Committing changes..."
        
        git add .
        git commit -m "🚀 Deploy: Campus Link v1.0 - Production Ready

✨ Features deployed:
- Complete college management system
- Real-time collaboration and notifications  
- AI-powered exam generation
- Smart campus tools and analytics
- Role-based access control
- Supabase backend integration
- Production optimizations

🔧 Technical improvements:
- Performance optimizations
- Security enhancements
- Mobile responsiveness
- Cross-browser compatibility
- SEO optimization

Ready for production use! 🎓"
        
        print_status "Pushing to GitHub..."
        git push origin main
        
        print_success "Code pushed to GitHub successfully!"
    else
        print_warning "Skipped Git operations. Remember to push your changes manually."
    fi
}

# Vercel deployment instructions
vercel_instructions() {
    print_status "Vercel Deployment Instructions:"
    echo
    echo "1. Go to https://vercel.com and sign in with GitHub"
    echo "2. Click 'New Project' and import your campus-link repository"
    echo "3. Configure these environment variables:"
    echo "   - VITE_SUPABASE_URL=https://your-project-id.supabase.co"
    echo "   - VITE_SUPABASE_ANON_KEY=your-supabase-anon-key"
    echo "   - VITE_OPENAI_API_KEY=sk-your-openai-key (optional)"
    echo "4. Click 'Deploy' and wait for completion"
    echo "5. Your app will be live at https://campus-link-xxx.vercel.app"
    echo
    print_success "Follow these steps to complete your deployment!"
}

# Supabase setup instructions
supabase_instructions() {
    print_status "Supabase Setup Instructions:"
    echo
    echo "1. Go to https://supabase.com and create a new project"
    echo "2. Name: 'campus-link-production'"
    echo "3. Go to SQL Editor and run the migration files in order:"
    echo "   - /supabase/migrations/001_initial_schema.sql"
    echo "   - /supabase/migrations/002_rls_policies.sql"
    echo "   - /supabase/migrations/003_functions.sql"
    echo "   - /supabase/migrations/004_sample_data.sql"
    echo "4. Create storage buckets: avatars, documents, content-files, exam-files"
    echo "5. Get your project URL and anon key from Settings → API"
    echo
    print_success "Complete Supabase setup before deploying to Vercel!"
}

# Main deployment process
main() {
    echo
    print_status "Starting Campus Link deployment process..."
    echo
    
    # Run all checks and operations
    check_dependencies
    check_node_version
    check_environment
    install_dependencies
    build_application
    test_build
    setup_git
    
    echo
    print_success "✅ Pre-deployment checks completed successfully!"
    echo
    
    # Show setup instructions
    supabase_instructions
    echo
    vercel_instructions
    echo
    
    # Git operations
    git_deploy
    
    echo
    print_success "🎉 Campus Link is ready for deployment!"
    echo
    print_status "Next steps:"
    echo "1. Complete Supabase setup (see instructions above)"
    echo "2. Deploy to Vercel (see instructions above)"
    echo "3. Update Supabase auth URLs with your Vercel URL"
    echo "4. Test your live application"
    echo "5. Create admin users and populate content"
    echo
    print_success "Happy deploying! 🚀"
}

# Run the main function
main "$@"