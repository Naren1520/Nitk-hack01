# 🎓 Campus Link - Comprehensive College Management System

> Revolutionary college hub connecting academics, campus life, and services in one seamless platform.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNaren1520%2Fcampuslinkss1&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY&envDescription=Supabase%20configuration%20required)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Naren1520/campuslinkss1)

## ✨ Features

### 🔐 Authentication & Security
- **USN-based Authentication**: Secure login using University Student Number
- **Role-based Access Control**: Separate interfaces for students, faculty, and administrators
- **Emergency Safety System**: 3-second hold emergency button for campus security

### 📚 Academic Management
- **Examination Portal**: Complete exam management with results tracking
- **AI-Powered Exam Generation**: Automatically generate questions from uploaded materials
- **Course Registration**: Streamlined course selection and enrollment
- **Progress Tracking**: Real-time academic performance monitoring
- **Previous Year Papers**: Access to historical exam questions

### 🧠 Smart Campus Tools
- **AI Study Assistant**: Intelligent tutoring and study recommendations
- **AR Campus Navigation**: Augmented reality campus wayfinding
- **Smart Scheduling**: Automated timetable optimization
- **Focus Mode**: Distraction-free study environment

### 💬 Communication Hub
- **Real-time Notifications**: Instant updates on important announcements
- **Document Collaboration**: Live collaborative editing with version control
- **Peer Help Network**: Student-to-student assistance platform
- **Faculty Communication**: Direct messaging with professors

### 🛡️ Safety & Services
- **Emergency Alert System**: Campus-wide safety notifications
- **Wi-Fi Management**: Seamless network access control
- **Digital Services**: Online service requests and approvals
- **Lost & Found**: Community-driven item recovery system

### 🏆 Community & Recognition
- **Achievement Gallery**: Showcase student accomplishments
- **Community Forums**: Discussion spaces for various topics
- **Event Management**: Campus event planning and participation
- **Recognition Programs**: Awards and achievement tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/Naren1520/campuslinkss1.git
cd campuslinkss1

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Configure your environment variables
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_OPENAI_API_KEY=sk-your-openai-key
```

## 📦 Deployment

### Option 1: Vercel (Recommended)

1. **One-Click Deploy**: Use the Vercel button above
2. **Manual Deploy**:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Option 2: Netlify

1. **One-Click Deploy**: Use the Netlify button above
2. **Manual Deploy**:
   ```bash
   npm run build
   npx netlify deploy --prod --dir=dist
   ```

### Option 3: Self-Hosted

```bash
# Build for production
npm run build

# Serve the dist folder with your preferred web server
```

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Run the migration files in order:
   - `/supabase/migrations/001_initial_schema.sql`
   - `/supabase/migrations/002_rls_policies.sql`
   - `/supabase/migrations/003_functions.sql`
   - `/supabase/migrations/004_sample_data.sql`

3. Create storage buckets:
   - `avatars` (private)
   - `documents` (private)
   - `content-files` (private)
   - `exam-files` (private)

4. Deploy edge functions:
   ```bash
   supabase functions deploy server
   ```

## 👥 User Roles

### Students
- Access academic records and course materials
- Participate in collaborative features
- Use smart campus tools
- Submit service requests

### Faculty
- Manage course content and exams
- Grade assignments and track progress
- Communicate with students
- Upload educational materials

### Administrators
- System-wide configuration and monitoring
- User management and role assignment
- Content moderation and approval
- Analytics and reporting

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **UI Components**: shadcn/ui, Radix UI
- **Real-time**: Supabase Realtime
- **AI Integration**: OpenAI API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel, Netlify

## 📱 Mobile Support

Campus Link is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Touch-optimized interface with adaptive layouts
- **Mobile**: Native app-like experience with gesture support
- **PWA**: Install as a Progressive Web App

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run deploy       # Run deployment script
```

### Project Structure

```
├── components/          # React components
├── lib/                # Utilities and services
├── supabase/           # Database migrations and functions
├── styles/             # Global CSS and Tailwind config
├── public/             # Static assets
└── scripts/            # Build and deployment scripts
```

## 📊 Analytics & Monitoring

- **Performance Monitoring**: Built-in analytics dashboard
- **Real-time Metrics**: User activity and system health
- **Error Tracking**: Comprehensive error logging
- **Usage Analytics**: Feature adoption and user engagement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Complete guides in `/docs`
- **Issues**: [GitHub Issues](https://github.com/Naren1520/campuslinkss1/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Naren1520/campuslinkss1/discussions)

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced AI tutoring features
- [ ] Video conferencing integration
- [ ] Blockchain-based certificates
- [ ] IoT campus integration
- [ ] Machine learning analytics

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for integrated college management solutions
- Special thanks to the open-source community

---

**🔗 Live Demo**: [Campus Link Demo](https://campus-link-demo.vercel.app)

**📧 Contact**: [Your Contact Information]

Made with ❤️ for educational institutions worldwide.