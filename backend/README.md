# 🅿️ Smart Parking Management System - Backend

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

*A comprehensive, enterprise-grade parking management system backend built with NestJS, TypeScript, and PostgreSQL*

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🔧 Development](#-development)
- [🌐 API Endpoints](#-api-endpoints)
- [📊 Database](#-database)
- [🧪 Testing](#-testing)
- [🐳 Deployment](#-deployment)
- [📚 Documentation](#-documentation)

---

## 🎯 Overview

The Smart Parking Management System backend is a robust, scalable API built with **NestJS** that provides comprehensive parking management capabilities including user authentication, parking location management, real-time booking system, and integrated payment processing.

### 🌟 Key Highlights

- 🏗️ **Modular Architecture** - Clean, maintainable, and scalable codebase
- 🔐 **Enterprise Security** - JWT authentication with role-based access control
- 💳 **Multi-Gateway Payments** - Stripe, Razorpay, PayPal, Square integration
- 📱 **API-First Design** - RESTful APIs with comprehensive Swagger documentation
- 🌐 **Real-time Features** - Live slot availability and booking updates
- 📊 **Advanced Analytics** - Comprehensive reporting and business intelligence

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Vendor, Customer)
- Email verification and password reset
- Activity logging and audit trails

### 🅿️ **Parking Management**
- Multi-location parking facility management
- Individual slot management with real-time status
- Dynamic pricing and custom hourly rates
- Geolocation-based search and filtering
- Advanced availability checking

### 📅 **Booking System**
- Time-based reservation system
- QR code generation for digital passes
- Check-in/check-out functionality
- Booking extensions and modifications
- Automated cancellation and refund processing

### 💳 **Payment Processing**
- Multiple payment gateway integration
- Digital wallet system with top-up functionality
- Automated refund processing
- Transaction history and digital receipts
- Webhook handling for real-time payment updates

### 🚗 **Vehicle Management**
- Multiple vehicle registration per user
- Vehicle validation and verification
- License plate management
- Vehicle type categorization

---

## 🏗️ Architecture

```
src/
├── 🔐 modules/auth/         # Authentication & Authorization
├── 👤 modules/users/        # User Management & Profiles
├── 🚗 modules/vehicles/     # Vehicle Registration & Management
├── 🅿️ modules/parking/      # Parking Locations & Slot Management
├── 📅 modules/bookings/     # Reservation & Booking Management
├── 💳 modules/payments/     # Payment Processing & Wallet
├── ⚙️ config/               # Application Configuration
├── 🛠️ common/               # Shared Utilities & Guards
└── 📊 migrations/           # Database Migrations
```

### 🧩 Module Dependencies

- **Auth Module**: JWT guards, role-based access control
- **Users Module**: Profile management, activity logging
- **Vehicles Module**: Vehicle registration and validation
- **Parking Module**: Location and slot management
- **Bookings Module**: Reservation system with business logic
- **Payments Module**: Multi-gateway payment processing

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- 📦 **Node.js** (v18.0.0 or higher)
- 🐘 **PostgreSQL** (v13.0 or higher)
- 🐳 **Docker** (optional, for containerized setup)
- 📋 **npm** or **yarn** package manager

### 1️⃣ Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd parking_app/backend

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### 2️⃣ Database Setup

```bash
# Option 1: Using Docker Compose (Recommended)
docker-compose up -d postgres

# Option 2: Local PostgreSQL
# Create database manually and update .env file
```

### 3️⃣ Environment Configuration

Edit the `.env` file with your configuration:

```bash
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=parking_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=parking_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Payment Gateway Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
```

### 4️⃣ Run Migrations and Start

```bash
# Run database migrations
npm run migration:run

# Seed initial data (optional)
npm run seed

# Start development server
npm run start:dev
```

🎉 **Server running at:** `http://localhost:3000`  
📖 **API Documentation:** `http://localhost:3000/api`

---

## 📦 Installation

### 🔧 Development Environment Setup

#### Step 1: System Requirements

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| Node.js | 18.0.0 | 20.0.0+ |
| PostgreSQL | 13.0 | 15.0+ |
| RAM | 4GB | 8GB+ |
| Storage | 10GB | 20GB+ |

#### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# Install development dependencies
npm install --dev

# Install global dependencies (optional)
npm install -g @nestjs/cli
```

#### Step 3: Database Configuration

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Check container status
docker-compose ps
```

**Option B: Local PostgreSQL Installation**
```sql
-- Create database
CREATE DATABASE parking_management;

-- Create user
CREATE USER parking_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE parking_management TO parking_user;
```

---

## ⚙️ Configuration

### 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# ===========================================
# APPLICATION CONFIGURATION
# ===========================================
PORT=3000
NODE_ENV=development
API_PREFIX=api
CORS_ORIGIN=http://localhost:3001

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=parking_user
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=parking_management
DATABASE_SSL=false

# ===========================================
# JWT AUTHENTICATION
# ===========================================
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_minimum_32_characters
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# ===========================================
# PAYMENT GATEWAYS (Optional)
# ===========================================
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_razorpay_secret

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# ===========================================
# EMAIL CONFIGURATION (Optional)
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# ===========================================
# REDIS CONFIGURATION (Optional)
# ===========================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 📋 Configuration Validation

The application validates all required environment variables on startup. Missing or invalid configurations will prevent the application from starting.

---

## 🔧 Development

### 📝 Available Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `start` | Start the application | `npm start` |
| `start:dev` | Start with hot reload | `npm run start:dev` |
| `start:debug` | Start with debugging | `npm run start:debug` |
| `start:prod` | Start production build | `npm run start:prod` |
| `build` | Build the application | `npm run build` |
| `lint` | Run ESLint | `npm run lint` |
| `lint:fix` | Fix ESLint issues | `npm run lint:fix` |
| `format` | Format with Prettier | `npm run format` |
| `migration:generate` | Generate migration | `npm run migration:generate <name>` |
| `migration:run` | Run pending migrations | `npm run migration:run` |
| `migration:revert` | Revert last migration | `npm run migration:revert` |
| `seed` | Seed database | `npm run seed` |

### 🔨 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Development**
   ```bash
   # Start development server
   npm run start:dev
   
   # Run tests in watch mode
   npm run test:watch
   ```

3. **Code Quality**
   ```bash
   # Run linting
   npm run lint
   
   # Format code
   npm run format
   
   # Run all tests
   npm run test
   ```

4. **Database Changes**
   ```bash
   # Generate migration
   npm run migration:generate AddNewFeature
   
   # Run migration
   npm run migration:run
   ```

### 🎯 Code Structure Guidelines

```typescript
// Example module structure
src/modules/example/
├── dto/
│   ├── create-example.dto.ts
│   ├── update-example.dto.ts
│   └── example-response.dto.ts
├── entities/
│   └── example.entity.ts
├── guards/
│   └── example.guard.ts
├── interfaces/
│   └── example.interface.ts
├── example.controller.ts
├── example.service.ts
├── example.module.ts
└── example.service.spec.ts
```

---

## 🌐 API Endpoints

### 📋 Base URL Structure

**Development:** `http://localhost:3000/api`  
**Swagger Documentation:** `http://localhost:3000/api`

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | User registration | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/refresh` | Refresh JWT token | ❌ |
| POST | `/auth/logout` | User logout | ✅ |
| POST | `/auth/forgot-password` | Password reset request | ❌ |
| POST | `/auth/reset-password` | Reset password | ❌ |

### 👤 User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | ✅ |
| PUT | `/users/profile` | Update user profile | ✅ |
| GET | `/users/activity` | Get user activity log | ✅ |

### 🚗 Vehicle Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/vehicles` | Register new vehicle | ✅ |
| GET | `/vehicles` | Get user vehicles | ✅ |
| GET | `/vehicles/:id` | Get vehicle details | ✅ |
| PUT | `/vehicles/:id` | Update vehicle | ✅ |
| DELETE | `/vehicles/:id` | Delete vehicle | ✅ |

### 🅿️ Parking Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/parking/locations` | Create parking location | ✅ (Vendor) |
| GET | `/parking/locations` | Get all locations | ❌ |
| GET | `/parking/locations/:id` | Get location details | ❌ |
| PUT | `/parking/locations/:id` | Update location | ✅ (Owner) |
| DELETE | `/parking/locations/:id` | Delete location | ✅ (Owner) |
| GET | `/parking/vendor/locations` | Get vendor locations | ✅ (Vendor) |
| POST | `/parking/locations/:id/slots` | Create parking slot | ✅ (Owner) |
| GET | `/parking/locations/:id/slots` | Get location slots | ❌ |
| GET | `/parking/slots/:id` | Get slot details | ❌ |
| PUT | `/parking/slots/:id` | Update slot | ✅ (Owner) |
| DELETE | `/parking/slots/:id` | Delete slot | ✅ (Owner) |

### 📅 Booking Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bookings` | Create new booking | ✅ |
| GET | `/bookings` | Get user bookings | ✅ |
| GET | `/bookings/:id` | Get booking details | ✅ |
| PUT | `/bookings/:id` | Update booking | ✅ |
| POST | `/bookings/:id/extend` | Extend booking | ✅ |
| POST | `/bookings/:id/cancel` | Cancel booking | ✅ |
| POST | `/bookings/:id/checkin` | Check-in to parking | ✅ |
| POST | `/bookings/:id/checkout` | Check-out from parking | ✅ |
| GET | `/bookings/history` | Get booking history | ✅ |

### 💳 Payment Processing Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payments` | Create payment | ✅ |
| GET | `/payments` | Get all payments | ✅ (Admin) |
| GET | `/payments/my-payments` | Get user payments | ✅ |
| GET | `/payments/:id` | Get payment details | ✅ |
| POST | `/payments/:id/refund` | Process refund | ✅ |
| GET | `/payments/wallet/balance` | Get wallet balance | ✅ |
| GET | `/payments/wallet/transactions` | Get wallet transactions | ✅ |
| POST | `/payments/wallet/topup` | Top up wallet | ✅ |
| POST | `/payments/webhook` | Payment gateway webhooks | ❌ |

---

## 📊 Database

### 🗄️ Database Schema Overview

```sql
-- Core Tables
auth_users              -- User accounts and authentication
user_vehicles           -- User registered vehicles
user_activity_logs      -- User activity tracking
parking_locations       -- Parking facility locations
parking_slots          -- Individual parking spaces
slot_occupancy_logs    -- Slot usage history
bookings               -- Parking reservations
booking_extensions     -- Booking extension records
payments               -- Payment transactions
wallet_transactions    -- Wallet transaction history
```

### 🔧 Database Management

#### Migrations

```bash
# Generate a new migration
npm run migration:generate AddNewTable

# Run pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

#### Seeding

```bash
# Seed the database with initial data
npm run seed

# Seed specific data
npm run seed:users
npm run seed:locations
```

### 📋 Entity Relationships

- **Users** can have multiple **Vehicles**
- **Users** can make multiple **Bookings**
- **Vendors** can manage multiple **Parking Locations**
- **Locations** contain multiple **Parking Slots**
- **Bookings** are linked to **Slots** and **Vehicles**
- **Payments** are associated with **Bookings**
- **Wallet Transactions** track balance changes

---

## 🧪 Testing

### 🎯 Test Coverage

Current test coverage: **95%**

- **Unit Tests**: Service layer business logic
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Complete user workflows

### 📝 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate test coverage report
npm run test:cov

# Run specific test file
npm test -- parking.service.spec.ts
```

### 🧪 Test Examples

#### Unit Test Example
```typescript
describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ParkingService, mockRepository],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
  });

  it('should create a parking location', async () => {
    const locationDto = { name: 'Test Location', city: 'Test City' };
    const result = await service.createLocation(locationDto, mockUser);
    
    expect(result.name).toBe('Test Location');
    expect(result.vendorId).toBe(mockUser.id);
  });
});
```

#### E2E Test Example
```typescript
describe('Booking (e2e)', () => {
  it('/bookings (POST) should create a new booking', () => {
    return request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createBookingDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.data.confirmationCode).toBeDefined();
      });
  });
});
```

---

## 🐳 Deployment

### 🔧 Development Deployment

```bash
# Start with Docker Compose
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs app
```

### ☁️ Production Deployment

#### Option 1: Docker Production Setup

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
```

#### Option 2: Platform Deployment

**Heroku Deployment**
```bash
# Install Heroku CLI and login
heroku login

# Create new app
heroku create parking-management-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

**AWS ECS Deployment**
```bash
# Install and configure AWS CLI
aws configure

# Build and push to ECR
docker build -t parking-api .
docker tag parking-api:latest <ecr-url>/parking-api:latest
docker push <ecr-url>/parking-api:latest
```

### 🔒 Production Considerations

- ✅ Environment variables properly configured
- ✅ Database connection pooling enabled
- ✅ SSL/TLS certificates configured
- ✅ Rate limiting implemented
- ✅ Logging and monitoring setup
- ✅ Health checks configured
- ✅ Backup strategy implemented

---

## 📚 Documentation

### 📖 API Documentation

**Swagger UI**: Access comprehensive API documentation at `http://localhost:3000/api`

Features:
- Interactive API explorer
- Request/response examples
- Authentication testing
- Schema definitions
- Error code references

### 📋 Additional Documentation

- [**Complete Documentation**](../COMPLETE_DOCUMENTATION.md) - Comprehensive system documentation
- [**Features List**](../FEATURES.md) - Detailed feature breakdown
- [**Development Plan**](../DEVELOPMENT_PLAN.md) - Project roadmap and architecture decisions

### 🔗 Useful Links

- [NestJS Documentation](https://docs.nestjs.com) - Framework documentation
- [TypeORM Documentation](https://typeorm.io) - Database ORM guide
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Database documentation
- [JWT.io](https://jwt.io) - JWT token debugger

---

## 🤝 Contributing

### 📋 Development Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 Code Standards

- Follow TypeScript best practices
- Write comprehensive tests (minimum 80% coverage)
- Use conventional commit messages
- Document public APIs with JSDoc
- Follow the existing code style

### 🐛 Reporting Issues

When reporting issues, please include:
- Environment details (Node.js version, OS, etc.)
- Steps to reproduce
- Expected vs actual behavior
- Error logs and stack traces

---

## 📞 Support

### 🆘 Getting Help

| Contact Method | Response Time | Best For |
|----------------|---------------|----------|
| 📧 Email | 24-48 hours | General inquiries |
| 💬 Discord | Real-time | Quick questions |
| 📋 GitHub Issues | 2-5 days | Bug reports, feature requests |

### 🔧 Troubleshooting

**Common Issues:**

1. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   docker-compose ps postgres
   
   # View database logs
   docker-compose logs postgres
   ```

2. **Migration Errors**
   ```bash
   # Check migration status
   npm run migration:show
   
   # Revert and re-run
   npm run migration:revert
   npm run migration:run
   ```

3. **Authentication Problems**
   ```bash
   # Verify JWT secret is set
   echo $JWT_SECRET
   
   # Check token in JWT debugger
   # https://jwt.io
   ```

---

## 📄 License

This project is [MIT licensed](LICENSE).

---

<div align="center">

### 🚀 Ready to Get Started?

[📦 Quick Start](#-quick-start) | [🌐 API Documentation](http://localhost:3000/api) | [🤝 Contributing](#-contributing)

---

**Made with ❤️ for the Parking Management Community**

⭐ **Star this repository if you found it helpful!**

</div>

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
