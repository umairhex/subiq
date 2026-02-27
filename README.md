# Subiq

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![AI Analytics](https://img.shields.io/badge/AI-OpenRouter-orange.svg)](https://openrouter.ai/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)

An intelligent subscription management mobile application built with Expo and React Native, designed to help users track, optimize, and manage their subscription services with AI-powered recommendations.

## ✨ Key Features

### 📊 Subscription Management
- **Centralized Dashboard**: Single overview of all subscription services
- **Automated Reminders**: Renewal notifications and payment alerts
- **Cost Analysis**: Monthly and yearly expense projections with trend visualization
- **Status Tracking**: Active, trial, cancelled, and paused subscription states

### 🤖 AI-Powered Insights
- **Smart Recommendations**: AI-generated suggestions for subscription optimization
- **Usage Pattern Analysis**: Recognition of subscription utilization patterns
- **Cost Optimization**: Intelligent recommendations for service alternatives
- **Value Assessment**: Cost-benefit analysis of subscription services

### 📦 Asset Management
- **Asset Inventory**: Tracking of subscription-tied physical and digital assets
- **Value Tracking**: Purchase price and current market value monitoring
- **Maintenance Records**: Service history and warranty information tracking
- **Depreciation Analysis**: Asset value assessment over time

### 💰 Financial Analytics
- **Expense Summaries**: Monthly spending breakdowns and category analysis
- **Spending Trends**: Historical data visualization and forecasting
- **Payment Method Tracking**: Associated payment methods and billing cycles
- **Budget Optimization**: AI-driven suggestions for cost reduction

## 🛠️ Technology Stack

### Frontend Framework
- **Expo SDK 54** / **React Native 0.81**
- **TypeScript** with strict type checking
- **Expo Router** for seamless navigation

### AI & Backend
- **OpenRouter AI SDK** for recommendation engine and analytics
- **Supabase** (PostgreSQL) with Row Level Security
- **Supabase Auth** for secure user authentication
- **Real-time Updates** for live data synchronization

### State Management & UI
- **React Query** for server state management and caching
- **Custom Component Library** with consistent design system
- **AsyncStorage** for offline data persistence

### Development Tools
- **ESLint & Prettier** for code quality and consistency
- **pnpm** for efficient dependency management
- **Expo Application Services (EAS)** for builds and deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Expo CLI
- Supabase account for backend services

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/umairrx/subiq.git
   cd subiq
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file with your API credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   EXPO_PUBLIC_OPENROUTER_API_KEY=your-openrouter-key
   ```

4. **Database Setup**:
   - Create a new Supabase project at [database.new](https://database.new)
   - Run the SQL migrations to set up the database schema
   - Enable Row Level Security policies for data protection

5. **Start the development server**:
   ```bash
   pnpm start
   ```

## 📂 Project Structure

```
subiq/
├── app/                    # Main application screens and routing
├── assets/                 # Static assets (images, fonts, etc.)
├── audits/                 # Audit and compliance documentation
├── components/            # Reusable UI components
├── constants/             # Application constants and configuration
├── database/              # Database schema and migrations
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and services
├── providers/             # React context providers
├── stores/                # Global state management
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions and helpers
```

## 🔑 Authentication & Security

### Supabase Setup
1. Create a Supabase project at [database.new](https://database.new)
2. Configure authentication providers (Email/Password)
3. Set up Row Level Security policies for data protection
4. Configure real-time subscriptions for live updates

### AI Integration
- **OpenRouter API**: Used for AI-powered recommendations and analytics
- **Secure Key Management**: Encrypted storage of API credentials
- **Rate Limiting**: Built-in request throttling and error handling

## 🚀 Deployment

### Development Builds
```bash
# Create development builds
eas build --platform ios --profile development
eas build --platform android --profile development
```

### Production Builds
```bash
# Build for app store distribution
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to app stores
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

### Over-the-Air Updates
```bash
# Publish updates without app store review
eas update --branch production
```

## 📊 Data Architecture

### User Onboarding Flow
1. User registration and profile creation via Supabase Auth
2. Initial subscription data entry and categorization
3. AI model training on user spending patterns and preferences
4. Personalized dashboard setup with initial recommendations

### Subscription Management Flow
1. User adds subscription with detailed information (cost, billing cycle, category)
2. Data validation and storage in Supabase with RLS policies
3. Background analysis for usage patterns and cost optimization
4. AI-generated recommendations based on comprehensive data analysis

### Recommendation Engine Flow
1. Aggregation of user subscription and asset data
2. AI model analysis of spending patterns and utilization metrics
3. Generation of cost-benefit optimization suggestions
4. Presentation of actionable recommendations with detailed insights

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Integration
EXPO_PUBLIC_OPENROUTER_API_KEY=your-openrouter-key

# Optional: Analytics and Monitoring
EXPO_PUBLIC_ANALYTICS_KEY=your-analytics-key
```

### Build Profiles
The project includes multiple EAS build profiles:
- `development`: For testing and development
- `preview`: For beta testing and staging
- `production`: For app store releases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and part of a personal development portfolio.

## 📞 Contact

**Umair Khan**
- **LinkedIn**: [linkedin.com/in/m-umair-k](https://www.linkedin.com/in/m-umair-k)
- **Portfolio**: [umairrx.dev](https://umairrx.dev)
- **GitHub**: [github.com/umairrx](https://github.com/umairrx)

---

*Built with ❤️ to empower financial intelligence through AI*
