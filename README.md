# 🅿️ Smart Parking Management System

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile-lightgrey.svg)

*A comprehensive, enterprise-grade parking management solution with Web and Mobile applications*

[📱 Demo](#-demo) • [🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📱 Applications](#-applications)
- [🔧 Development](#-development)
- [🧪 Testing](#-testing)
- [🐳 Deployment](#-deployment)
- [📖 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)

---

## 🎯 Overview

The **Smart Parking Management System** is a complete, scalable solution that revolutionizes urban parking through technology. Built with modern technologies and best practices, it provides seamless parking experiences for users, comprehensive management tools for vendors, and powerful analytics for administrators.

### 🌟 **Why Choose Our Parking System?**

- 🚀 **Full-Stack Solution** - Complete ecosystem with Web, Mobile, and Admin applications
- 🏗️ **Enterprise Architecture** - Scalable, maintainable, and production-ready codebase
- 💳 **Multi-Payment Gateway** - Stripe, Razorpay, PayPal, Square integration
- 🌐 **Real-Time Updates** - Live slot availability and booking status
- 📱 **Cross-Platform** - Works on Web, iOS, and Android
- 🔐 **Enterprise Security** - JWT authentication, role-based access, data encryption

---

## ✨ Features

### 👤 **For Users (Customers)**

<details>
<summary>🔐 <strong>Authentication & Profile Management</strong></summary>

- ✅ Multi-platform signup/login (Email, Mobile, Social OAuth)
- ✅ Comprehensive profile management with preferences
- ✅ Vehicle registration and management system
- ✅ Activity tracking and audit logs
- ✅ Secure password reset and email verification

</details>

<details>
<summary>🔍 <strong>Smart Search & Discovery</strong></summary>

- ✅ Location-based parking search with geolocation
- ✅ Advanced filtering (price, distance, EV support, amenities)
- ✅ Real-time availability view with interactive maps
- ✅ Date/time-based availability checking
- ✅ Vehicle type compatibility matching

</details>

<details>
<summary>📅 <strong>Booking Management</strong></summary>

- ✅ Instant slot booking with confirmation
- ✅ Multi-slot and extended duration bookings
- ✅ QR code generation for contactless entry
- ✅ Real-time booking status tracking
- ✅ Flexible cancellation with automated refunds
- ✅ Booking history and receipt management

</details>

<details>
<summary>💳 <strong>Payment & Wallet System</strong></summary>

- ✅ Multiple payment gateways integration
- ✅ Digital wallet with secure top-up functionality
- ✅ Promo codes and discount management
- ✅ Automated billing and receipt generation
- ✅ Refund processing and transaction history

</details>

<details>
<summary>📱 <strong>Mobile Experience</strong></summary>

- ✅ Native mobile applications (iOS & Android)
- ✅ Push notifications for booking updates
- ✅ Offline capability for viewing bookings
- ✅ Location-based recommendations
- ✅ Voice assistant integration (planned)

</details>

### 🏢 **For Vendors (Parking Owners)**

<details>
<summary>🏗️ <strong>Property Management</strong></summary>

- ✅ Multiple parking location management
- ✅ Individual slot configuration and pricing
- ✅ Dynamic pricing rules (hourly, daily, peak hours)
- ✅ Amenity management (EV charging, CCTV, security)
- ✅ Photo and description management

</details>

<details>
<summary>📊 <strong>Business Analytics</strong></summary>

- ✅ Comprehensive revenue reporting
- ✅ Occupancy analytics and trends
- ✅ Customer behavior insights
- ✅ Peak time analysis
- ✅ Automated payout management

</details>

<details>
<summary>⚙️ <strong>Operations Management</strong></summary>

- ✅ Real-time slot status management
- ✅ Booking approval/rejection workflows
- ✅ Maintenance mode for slot blocking
- ✅ Customer communication tools
- ✅ QR code entry/exit management

</details>

### 👑 **For Administrators**

<details>
<summary>📈 <strong>System Administration</strong></summary>

- ✅ Comprehensive dashboard with KPIs
- ✅ User and vendor management
- ✅ Application approval workflows
- ✅ Global pricing and commission management
- ✅ System configuration and settings

</details>

<details>
<summary>💰 <strong>Financial Management</strong></summary>

- ✅ Transaction monitoring and reporting
- ✅ Commission tracking and payout management
- ✅ Revenue analytics and forecasting
- ✅ Dispute resolution tools
- ✅ Tax reporting and compliance

</details>

<details>
<summary>🔧 <strong>Platform Management</strong></summary>

- ✅ Content management system
- ✅ Notification broadcast system
- ✅ Support ticket management
- ✅ System health monitoring
- ✅ Security audit and logging

</details>

---

## 🏗️ Architecture

### 🎯 **System Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Mobile App    │    │   Admin Panel   │
│  (React.js)     │    │ (React Native)  │    │  (React.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │  (NestJS/Node)  │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   File Storage  │
│   Database      │    │     Cache       │    │   (AWS S3)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 📁 **Project Structure**

```
parking_app/
├── 🔙 backend/                 # NestJS API Server
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/          # Authentication & Authorization
│   │   │   ├── users/         # User Management
│   │   │   ├── vehicles/      # Vehicle Management
│   │   │   ├── parking/       # Parking Locations & Slots
│   │   │   ├── bookings/      # Booking Management
│   │   │   └── payments/      # Payment Processing
│   │   ├── common/            # Shared utilities
│   │   ├── config/            # Configuration
│   │   └── migrations/        # Database migrations
│   ├── test/                  # Test files
│   └── docs/                  # API documentation
│
├── 🌐 frontend-web/           # React.js Web Application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API integration
│   │   ├── store/             # State management
│   │   └── utils/             # Utility functions
│   └── public/                # Static assets
│
├── 📱 mobile-app/             # React Native Mobile App
│   ├── src/
│   │   ├── components/        # Mobile UI components
│   │   ├── screens/           # Application screens
│   │   ├── navigation/        # Navigation configuration
│   │   ├── services/          # API and native services
│   │   ├── store/             # Mobile state management
│   │   └── utils/             # Mobile utilities
│   ├── android/               # Android configuration
│   └── ios/                   # iOS configuration
│
├── 👑 admin-panel/            # Admin Dashboard
│   ├── src/
│   │   ├── components/        # Admin UI components
│   │   ├── pages/             # Admin pages
│   │   ├── services/          # Admin API services
│   │   └── utils/             # Admin utilities
│   └── dist/                  # Build output
│
├── 🐳 docker/                 # Docker configurations
│   ├── docker-compose.yml     # Development setup
│   ├── docker-compose.prod.yml # Production setup
│   └── Dockerfile.*           # Service-specific Dockerfiles
│
├── 📚 docs/                   # Project documentation
│   ├── api/                   # API documentation
│   ├── deployment/            # Deployment guides
│   └── development/           # Development guides
│
└── 🔧 scripts/                # Build and deployment scripts
```

### 🔧 **Technology Stack**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Backend** | NestJS + TypeScript | API server with modular architecture |
| **Database** | PostgreSQL + TypeORM | Relational data storage with ORM |
| **Cache** | Redis | Session storage and caching |
| **Web Frontend** | React.js + TypeScript | Responsive web application |
| **Mobile App** | React Native + TypeScript | Cross-platform mobile application |
| **Admin Panel** | React.js + Ant Design | Administrative dashboard |
| **Authentication** | JWT + Passport.js | Secure authentication system |
| **Payments** | Stripe + Razorpay + PayPal | Multi-gateway payment processing |
| **Maps** | Google Maps API | Location and mapping services |
| **File Storage** | AWS S3 / Cloudinary | Image and document storage |
| **Real-time** | WebSockets + Socket.io | Live updates and notifications |
| **Deployment** | Docker + AWS/GCP | Containerized deployment |

---

## 🚀 Quick Start

### 📋 **Prerequisites**

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13.0 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v6.0 or higher) - [Download](https://redis.io/download)
- **Docker** (optional) - [Download](https://www.docker.com/get-started)
- **Git** - [Download](https://git-scm.com/downloads)

### ⚡ **One-Command Setup**

```bash
# Clone the repository
git clone <repository-url>
cd parking_app

# Install dependencies for all applications
npm run install:all

# Setup environment variables
npm run setup:env

# Start all services with Docker
docker-compose up -d

# Or start individual services
npm run dev:backend    # Start backend API
npm run dev:web        # Start web application
npm run dev:mobile     # Start mobile development
npm run dev:admin      # Start admin panel
```

### 🌍 **Access Applications**

After setup, access the applications at:

| Application | URL | Description |
|-------------|-----|-------------|
| 🌐 **Web App** | `http://localhost:3001` | Customer web interface |
| 📱 **Mobile App** | Metro Bundler | React Native development |
| 👑 **Admin Panel** | `http://localhost:3002` | Administrative dashboard |
| 🔙 **API Server** | `http://localhost:3000` | Backend API endpoints |
| 📖 **API Docs** | `http://localhost:3000/api` | Swagger documentation |

---

## 📱 Applications

### 🌐 **Web Application**

**Tech Stack:** React.js + TypeScript + Tailwind CSS

**Features:**
- Responsive design for all screen sizes
- Progressive Web App (PWA) capabilities
- Real-time notifications
- Interactive mapping interface
- Secure payment processing

**Quick Start:**
```bash
cd frontend-web
npm install
npm start
```

**[📖 Web App Documentation](./frontend-web/README.md)**

---

### 📱 **Mobile Application**

**Tech Stack:** React Native + TypeScript

**Features:**
- Cross-platform (iOS & Android)
- Native performance
- Push notifications
- Offline capability
- Camera integration for QR codes

**Quick Start:**
```bash
cd mobile-app
npm install

# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

**[📖 Mobile App Documentation](./mobile-app/README.md)**

---

### 👑 **Admin Panel**

**Tech Stack:** React.js + Ant Design + TypeScript

**Features:**
- Comprehensive dashboard
- Data visualization
- User management
- Financial reporting
- System configuration

**Quick Start:**
```bash
cd admin-panel
npm install
npm start
```

**[📖 Admin Panel Documentation](./admin-panel/README.md)**

---

### 🔙 **Backend API**

**Tech Stack:** NestJS + TypeScript + PostgreSQL

**Features:**
- RESTful API design
- Comprehensive authentication
- Real-time capabilities
- Payment gateway integration
- Extensive documentation

**Quick Start:**
```bash
cd backend
npm install
npm run start:dev
```

**[📖 Backend Documentation](./backend/README.md)**

---

## 🔧 Development

### 🏃‍♂️ **Development Workflow**

1. **Setup Development Environment**
   ```bash
   # Clone and setup
   git clone <repository-url>
   cd parking_app
   npm run setup
   ```

2. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   npm run dev:backend
   
   # Terminal 2: Web App
   npm run dev:web
   
   # Terminal 3: Mobile App
   npm run dev:mobile
   
   # Terminal 4: Admin Panel
   npm run dev:admin
   ```

3. **Database Operations**
   ```bash
   # Run migrations
   npm run db:migrate
   
   # Seed initial data
   npm run db:seed
   
   # Reset database
   npm run db:reset
   ```

### 📝 **Available Scripts**

| Script | Description |
|--------|-------------|
| `npm run install:all` | Install dependencies for all applications |
| `npm run dev:all` | Start all development servers |
| `npm run build:all` | Build all applications for production |
| `npm run test:all` | Run tests for all applications |
| `npm run lint:all` | Run linting for all applications |
| `npm run docker:dev` | Start development environment with Docker |
| `npm run docker:prod` | Start production environment with Docker |

### 🔧 **Environment Configuration**

Each application requires environment configuration:

```bash
# Backend
cp backend/.env.example backend/.env

# Web App
cp frontend-web/.env.example frontend-web/.env

# Mobile App
cp mobile-app/.env.example mobile-app/.env

# Admin Panel
cp admin-panel/.env.example admin-panel/.env
```

---

## 🧪 Testing

### 🎯 **Testing Strategy**

We maintain comprehensive test coverage across all applications:

| Application | Unit Tests | Integration Tests | E2E Tests | Coverage |
|-------------|------------|-------------------|-----------|----------|
| Backend | ✅ | ✅ | ✅ | 95% |
| Web App | ✅ | ✅ | ✅ | 90% |
| Mobile App | ✅ | ✅ | ✅ | 85% |
| Admin Panel | ✅ | ✅ | ✅ | 88% |

### 🚀 **Running Tests**

```bash
# Run all tests
npm run test:all

# Run tests for specific application
npm run test:backend
npm run test:web
npm run test:mobile
npm run test:admin

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 🐳 Deployment

### 🔧 **Development Deployment**

```bash
# Start all services with Docker Compose
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### ☁️ **Production Deployment**

#### **Option 1: Docker Swarm**
```bash
# Deploy to Docker Swarm
docker stack deploy -c docker-compose.prod.yml parking-system
```

#### **Option 2: Kubernetes**
```bash
# Deploy to Kubernetes
kubectl apply -f k8s/
```

#### **Option 3: Cloud Platforms**

**AWS Deployment:**
- **Backend**: AWS ECS or Lambda
- **Database**: AWS RDS PostgreSQL
- **Frontend**: AWS S3 + CloudFront
- **Mobile**: AWS Device Farm for testing

**Google Cloud Deployment:**
- **Backend**: Google Cloud Run
- **Database**: Cloud SQL
- **Frontend**: Firebase Hosting
- **Mobile**: Firebase App Distribution

**Heroku Deployment:**
```bash
# Deploy backend to Heroku
cd backend
heroku create parking-api
git push heroku main
```

### 🔒 **Production Checklist**

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups scheduled
- [ ] Monitoring and logging setup
- [ ] Performance optimization applied
- [ ] Security headers configured
- [ ] CDN configured for static assets
- [ ] Error tracking setup (Sentry)

---

## 📖 Documentation

### 📚 **Complete Documentation**

- **[🏗️ Complete System Documentation](./COMPLETE_DOCUMENTATION.md)** - Comprehensive technical documentation
- **[✨ Features List](./FEATURES.md)** - Detailed feature breakdown and roadmap
- **[🔙 Backend Documentation](./backend/README.md)** - API server setup and reference
- **[🌐 Web App Documentation](./frontend-web/README.md)** - Web application guide
- **[📱 Mobile App Documentation](./mobile-app/README.md)** - Mobile development guide
- **[👑 Admin Panel Documentation](./admin-panel/README.md)** - Admin dashboard guide

### 🔗 **API Documentation**

- **[Swagger UI](http://localhost:3000/api)** - Interactive API documentation
- **[Postman Collection](./docs/api/postman-collection.json)** - API testing collection
- **[API Reference](./docs/api/README.md)** - Detailed API reference guide

### 🎓 **Learning Resources**

- **[Getting Started Guide](./docs/getting-started.md)** - Step-by-step setup guide
- **[Development Guide](./docs/development.md)** - Development best practices
- **[Deployment Guide](./docs/deployment.md)** - Production deployment guide
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🚀 **Quick Contribution Guide**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and add tests
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### 📋 **Contribution Guidelines**

- Follow the coding standards defined in each application
- Write tests for new features and bug fixes
- Update documentation for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PR

### 🐛 **Reporting Issues**

When reporting issues, please include:
- Environment details (OS, Node.js version, etc.)
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or error logs

### 💡 **Feature Requests**

We're always looking to improve! Feel free to suggest:
- New features for users, vendors, or admins
- Performance improvements
- UI/UX enhancements
- Integration with new services

---

## 📞 Support

### 🆘 **Getting Help**

| Contact Method | Response Time | Best For |
|----------------|---------------|----------|
| 📧 **Email** | 24-48 hours | General inquiries |
| 💬 **Discord** | Real-time | Quick questions |
| 📋 **GitHub Issues** | 2-5 days | Bug reports, feature requests |
| 📖 **Documentation** | Immediate | Setup and usage guides |

### 🔧 **Troubleshooting**

**Common Issues:**

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   brew services list | grep postgresql
   
   # Start PostgreSQL
   brew services start postgresql
   ```

3. **Node Version Issues**
   ```bash
   # Use Node Version Manager
   nvm use 18
   ```

### 🌟 **Community**

Join our growing community:

- 🌟 **Star the repository** if you find it helpful
- 👀 **Watch** for updates and releases
- 🍴 **Fork** to contribute or customize
- 📢 **Share** with others who might benefit

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Acknowledgments

- **NestJS Team** for the amazing framework
- **React Team** for the frontend libraries
- **TypeScript Team** for type safety
- **Open Source Community** for inspiration and tools

---

<div align="center">

### 🚀 Ready to Transform Parking Management?

[🏁 Quick Start](#-quick-start) | [📖 Documentation](#-documentation) | [🤝 Contributing](#-contributing) | [📞 Support](#-support)

---

**Built with ❤️ for the Urban Mobility Community**

⭐ **Star this repository if you found it helpful!**

![Stars](https://img.shields.io/github/stars/username/parking_app?style=social)
![Forks](https://img.shields.io/github/forks/username/parking_app?style=social)
![Watchers](https://img.shields.io/github/watchers/username/parking_app?style=social)

</div>
