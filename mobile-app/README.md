# 📱 Smart Parking - Flutter Mobile Application

<div align="center">

[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)](https://dart.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

*Cross-platform mobile application for Smart Parking Management System*

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [📦 Dependencies](#-dependencies)
- [🔧 Development](#-development)
- [📱 Build & Deploy](#-build--deploy)
- [🧪 Testing](#-testing)
- [📚 Documentation](#-documentation)

---

## 🎯 Overview

The Smart Parking Flutter mobile application provides a seamless, cross-platform experience for users to find, book, and manage parking spaces. Built with Flutter, it offers native performance on both iOS and Android platforms with a single codebase.

### 🌟 Why Flutter?

- **🚀 Single Codebase** - Write once, run on iOS and Android
- **⚡ Native Performance** - Compiled to native ARM code
- **🎨 Beautiful UI** - Material Design and Cupertino widgets
- **🔥 Hot Reload** - Instant development feedback
- **📱 Platform Integration** - Access to native device features
- **🌐 Web Support** - Additional web deployment capability

---

## ✨ Features

### 👤 **User Experience**

<details>
<summary>🔐 <strong>Authentication & Security</strong></summary>

- ✅ **Multi-Platform Login** - Email, phone, social OAuth
- ✅ **Biometric Authentication** - Fingerprint/Face ID support
- ✅ **Secure Storage** - Encrypted local data storage
- ✅ **Auto-Login** - Remember user sessions securely
- ✅ **Two-Factor Authentication** - Enhanced security options

</details>

<details>
<summary>🔍 <strong>Smart Search & Discovery</strong></summary>

- ✅ **Location-Based Search** - GPS-powered nearby parking
- ✅ **Interactive Maps** - Google Maps with custom markers
- ✅ **Advanced Filters** - Price, distance, amenities, ratings
- ✅ **Real-Time Availability** - Live slot status updates
- ✅ **Favorite Locations** - Save frequently used parking spots
- ✅ **Route Navigation** - Integrated turn-by-turn directions

</details>

<details>
<summary>📅 <strong>Booking Management</strong></summary>

- ✅ **Quick Booking** - One-tap slot reservation
- ✅ **QR Code Generation** - Digital parking passes
- ✅ **Calendar Integration** - Sync with device calendar
- ✅ **Booking Modifications** - Extend or cancel reservations
- ✅ **Check-In/Check-Out** - QR code scanning functionality
- ✅ **Booking History** - Complete transaction records

</details>

<details>
<summary>💳 <strong>Payment & Wallet</strong></summary>

- ✅ **Multiple Payment Methods** - Cards, UPI, wallets, net banking
- ✅ **Digital Wallet** - In-app balance management
- ✅ **Automatic Payments** - Seamless transaction processing
- ✅ **Payment History** - Detailed transaction records
- ✅ **Refund Management** - Automated refund processing
- ✅ **Promotional Codes** - Discount and offer system

</details>

<details>
<summary>📱 <strong>Mobile-Specific Features</strong></summary>

- ✅ **Push Notifications** - Real-time booking updates
- ✅ **Offline Mode** - Limited functionality without internet
- ✅ **Background Location** - Track parking location
- ✅ **Camera Integration** - QR code scanning and photo capture
- ✅ **Voice Commands** - Voice-activated booking (future)
- ✅ **Gesture Navigation** - Intuitive mobile interactions

</details>

---

## 🏗️ Architecture

### 📱 **App Architecture**

```
lib/
├── 🚀 main.dart                    # App entry point
├── 🔧 app/                         # App configuration
│   ├── app.dart                    # Main app widget
│   ├── routes.dart                 # Navigation routes
│   └── theme/                      # App theming
├── 🎯 core/                        # Core functionality
│   ├── constants/                  # App constants
│   ├── errors/                     # Error handling
│   ├── network/                    # API client
│   ├── storage/                    # Local storage
│   └── utils/                      # Utility functions
├── 🧩 features/                    # Feature modules
│   ├── auth/                       # Authentication
│   ├── booking/                    # Booking management
│   ├── parking/                    # Parking locations
│   ├── payment/                    # Payment processing
│   ├── profile/                    # User profile
│   └── vehicle/                    # Vehicle management
├── 🎨 shared/                      # Shared components
│   ├── widgets/                    # Reusable widgets
│   ├── models/                     # Data models
│   └── services/                   # Shared services
└── 🔥 firebase_options.dart        # Firebase configuration
```

### 🔄 **State Management Pattern**

```dart
// BLoC Pattern Implementation
abstract class ParkingEvent {}
abstract class ParkingState {}

class ParkingBloc extends Bloc<ParkingEvent, ParkingState> {
  final ParkingRepository repository;
  
  ParkingBloc({required this.repository}) : super(ParkingInitial()) {
    on<LoadParkingLocations>(_onLoadParkingLocations);
    on<BookParkingSlot>(_onBookParkingSlot);
  }
  
  Future<void> _onLoadParkingLocations(
    LoadParkingLocations event,
    Emitter<ParkingState> emit,
  ) async {
    emit(ParkingLoading());
    try {
      final locations = await repository.getParkingLocations();
      emit(ParkingLoaded(locations));
    } catch (e) {
      emit(ParkingError(e.toString()));
    }
  }
}
```

### 🏗️ **Feature Structure**

Each feature follows a clean architecture pattern:

```
feature_name/
├── 📊 data/
│   ├── datasources/               # API and local data sources
│   ├── models/                    # Data transfer objects
│   └── repositories/              # Repository implementations
├── 🏛️ domain/
│   ├── entities/                  # Business entities
│   ├── repositories/              # Repository interfaces
│   └── usecases/                  # Business logic
└── 📱 presentation/
    ├── bloc/                      # State management
    ├── pages/                     # Screen widgets
    └── widgets/                   # Feature-specific widgets
```

---

## 🚀 Quick Start

### 📋 **Prerequisites**

- **Flutter SDK** (3.16.0 or higher) - [Install Flutter](https://flutter.dev/docs/get-started/install)
- **Dart SDK** (3.2.0 or higher) - Included with Flutter
- **Android Studio** - For Android development
- **Xcode** - For iOS development (macOS only)
- **Git** - Version control

### ⚡ **Setup Instructions**

#### 1. Install Flutter
```bash
# macOS using Homebrew
brew install --cask flutter

# Verify installation
flutter doctor
```

#### 2. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd parking_app/mobile-app

# Install dependencies
flutter pub get

# Generate code (if needed)
flutter packages pub run build_runner build
```

#### 3. Firebase Configuration
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Configure Firebase for Flutter
flutterfire configure
```

#### 4. Environment Setup
```bash
# Copy environment configuration
cp .env.example .env

# Update with your API endpoints and keys
```

#### 5. Run the Application
```bash
# List available devices
flutter devices

# Run on iOS simulator
flutter run -d ios

# Run on Android emulator
flutter run -d android

# Run in debug mode with hot reload
flutter run --debug
```

---

## 📦 Dependencies

### 🔧 **Core Dependencies**

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5
  
  # Network & API
  dio: ^5.3.2
  retrofit: ^4.0.3
  json_annotation: ^4.8.1
  
  # Local Storage
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  shared_preferences: ^2.2.2
  
  # Firebase Services
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  firebase_messaging: ^14.7.10
  cloud_firestore: ^4.13.6
  
  # UI & Widgets
  flutter_svg: ^2.0.9
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  lottie: ^2.7.0
  
  # Maps & Location
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0
  geocoding: ^2.1.1
  
  # Payments
  razorpay_flutter: ^1.3.6
  stripe_payment: ^1.1.4
  upi_india: ^3.4.0
  
  # Device Features
  camera: ^0.10.5+5
  qr_code_scanner: ^1.0.1
  local_auth: ^2.1.7
  device_info_plus: ^9.1.1
  package_info_plus: ^4.2.0
  
  # Utilities
  intl: ^0.18.1
  url_launcher: ^6.2.1
  share_plus: ^7.2.1
  permission_handler: ^11.1.0
```

### 🛠️ **Development Dependencies**

```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  
  # Code Generation
  build_runner: ^2.4.7
  retrofit_generator: ^8.0.4
  json_serializable: ^6.7.1
  hive_generator: ^2.0.1
  
  # Testing
  mockito: ^5.4.2
  bloc_test: ^9.1.5
  integration_test:
    sdk: flutter
  
  # Code Quality
  flutter_lints: ^3.0.1
  very_good_analysis: ^5.1.0
  
  # Assets
  flutter_launcher_icons: ^0.13.1
  flutter_native_splash: ^2.3.6
```

---

## 🔧 Development

### 🏃‍♂️ **Development Workflow**

#### 1. Start Development
```bash
# Hot reload development
flutter run --debug

# With flavor (if configured)
flutter run --debug --flavor development

# Profile mode for performance testing
flutter run --profile
```

#### 2. Code Generation
```bash
# Generate code for models, repositories, etc.
flutter packages pub run build_runner build

# Watch for changes and auto-generate
flutter packages pub run build_runner watch

# Clean and regenerate
flutter packages pub run build_runner build --delete-conflicting-outputs
```

#### 3. Asset Management
```bash
# Generate app icons
flutter pub run flutter_launcher_icons:main

# Generate splash screens
flutter pub run flutter_native_splash:create
```

### 📝 **Development Scripts**

Create a `Makefile` for common tasks:

```makefile
# Development commands
.PHONY: get clean build test

get:
	flutter pub get

clean:
	flutter clean
	flutter pub get

build-runner:
	flutter packages pub run build_runner build --delete-conflicting-outputs

watch:
	flutter packages pub run build_runner watch

test:
	flutter test

integration-test:
	flutter test integration_test/

analyze:
	flutter analyze

format:
	dart format .

run-ios:
	flutter run -d ios

run-android:
	flutter run -d android

build-apk:
	flutter build apk --release

build-ios:
	flutter build ios --release

build-web:
	flutter build web
```

### 🎨 **UI Development Guidelines**

#### Material Design Implementation
```dart
// Custom theme configuration
class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF2196F3),
        brightness: Brightness.light,
      ),
      appBarTheme: const AppBarTheme(
        elevation: 0,
        centerTitle: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }
  
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF2196F3),
        brightness: Brightness.dark,
      ),
    );
  }
}
```

#### Responsive Design
```dart
// Responsive breakpoints
class ScreenBreakpoints {
  static const double mobile = 480;
  static const double tablet = 768;
  static const double desktop = 1024;
}

// Responsive widget builder
class ResponsiveBuilder extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;
  
  const ResponsiveBuilder({
    Key? key,
    required this.mobile,
    this.tablet,
    this.desktop,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= ScreenBreakpoints.desktop) {
          return desktop ?? tablet ?? mobile;
        } else if (constraints.maxWidth >= ScreenBreakpoints.tablet) {
          return tablet ?? mobile;
        } else {
          return mobile;
        }
      },
    );
  }
}
```

---

## 📱 Build & Deploy

### 🔨 **Build Commands**

#### Android Build
```bash
# Debug APK
flutter build apk --debug

# Release APK
flutter build apk --release

# App Bundle for Play Store
flutter build appbundle --release

# With flavor
flutter build apk --release --flavor production
```

#### iOS Build
```bash
# Debug build
flutter build ios --debug

# Release build
flutter build ios --release

# Archive for App Store
flutter build ipa --release
```

### 🚀 **Deployment Configuration**

#### Android Deployment
1. **Configure Signing**
   ```bash
   # Generate keystore
   keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```

2. **Update android/key.properties**
   ```properties
   storePassword=your_store_password
   keyPassword=your_key_password
   keyAlias=upload
   storeFile=../upload-keystore.jks
   ```

3. **Build signed APK**
   ```bash
   flutter build apk --release
   flutter build appbundle --release
   ```

#### iOS Deployment
1. **Configure certificates in Xcode**
2. **Update bundle identifier**
3. **Configure App Store Connect**
4. **Build and upload**
   ```bash
   flutter build ipa --release
   ```

### 📊 **CI/CD Pipeline**

#### GitHub Actions Example
```yaml
name: Flutter CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
      - run: flutter pub get
      - run: flutter test
      - run: flutter analyze

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v3
        with:
          name: android-apk
          path: build/app/outputs/flutter-apk/app-release.apk

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter build ios --release --no-codesign
```

---

## 🧪 Testing

### 🎯 **Testing Strategy**

#### Unit Tests
```dart
// Example unit test
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:parking_app/features/auth/domain/usecases/login_usecase.dart';

class MockAuthRepository extends Mock implements AuthRepository {}

void main() {
  late LoginUseCase useCase;
  late MockAuthRepository mockRepository;

  setUp(() {
    mockRepository = MockAuthRepository();
    useCase = LoginUseCase(mockRepository);
  });

  group('LoginUseCase', () {
    test('should return user when login is successful', () async {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      final user = User(id: '1', email: email);
      
      when(mockRepository.login(email, password))
          .thenAnswer((_) async => Right(user));

      // Act
      final result = await useCase(LoginParams(email: email, password: password));

      // Assert
      expect(result, Right(user));
      verify(mockRepository.login(email, password));
    });
  });
}
```

#### Widget Tests
```dart
// Example widget test
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:parking_app/shared/widgets/custom_button.dart';

void main() {
  testWidgets('CustomButton displays text correctly', (WidgetTester tester) async {
    // Arrange
    const buttonText = 'Test Button';
    bool pressed = false;

    // Act
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: CustomButton(
            text: buttonText,
            onPressed: () => pressed = true,
          ),
        ),
      ),
    );

    // Assert
    expect(find.text(buttonText), findsOneWidget);
    
    await tester.tap(find.byType(CustomButton));
    expect(pressed, true);
  });
}
```

#### Integration Tests
```dart
// Example integration test
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:parking_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Parking App Integration Tests', () {
    testWidgets('Complete booking flow', (WidgetTester tester) async {
      // Start app
      app.main();
      await tester.pumpAndSettle();

      // Login flow
      await tester.tap(find.byKey(const Key('login_button')));
      await tester.pumpAndSettle();
      
      await tester.enterText(find.byKey(const Key('email_field')), 'test@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      
      await tester.tap(find.byKey(const Key('submit_login')));
      await tester.pumpAndSettle();

      // Verify home screen
      expect(find.text('Available Parking'), findsOneWidget);
      
      // Select parking location
      await tester.tap(find.byKey(const Key('parking_location_0')));
      await tester.pumpAndSettle();
      
      // Book parking slot
      await tester.tap(find.byKey(const Key('book_slot_button')));
      await tester.pumpAndSettle();
      
      // Verify booking confirmation
      expect(find.text('Booking Confirmed'), findsOneWidget);
    });
  });
}
```

### 📊 **Test Coverage**

```bash
# Run tests with coverage
flutter test --coverage

# Generate HTML coverage report
genhtml coverage/lcov.info -o coverage/html

# Open coverage report
open coverage/html/index.html
```

**Target Coverage:**
- **Unit Tests**: 90%+ coverage
- **Widget Tests**: 80%+ coverage  
- **Integration Tests**: Key user journeys

---

## 📚 Documentation

### 📖 **Code Documentation**

#### Dart Documentation
```dart
/// A service for managing parking bookings.
/// 
/// This service handles the creation, modification, and cancellation
/// of parking bookings. It integrates with the backend API to ensure
/// real-time synchronization.
class BookingService {
  /// Creates a new parking booking.
  /// 
  /// Returns a [Future] that completes with the created [Booking]
  /// or throws a [BookingException] if the booking fails.
  /// 
  /// Example:
  /// ```dart
  /// final booking = await bookingService.createBooking(
  ///   slotId: 'slot_123',
  ///   startTime: DateTime.now(),
  ///   duration: Duration(hours: 2),
  /// );
  /// ```
  Future<Booking> createBooking({
    required String slotId,
    required DateTime startTime,
    required Duration duration,
  }) async {
    // Implementation
  }
}
```

### 🔧 **Configuration Files**

#### pubspec.yaml Structure
```yaml
name: parking_app
description: Smart Parking Management Mobile Application
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter
  # Add dependencies here

dev_dependencies:
  flutter_test:
    sdk: flutter
  # Add dev dependencies here

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/icons/
    - assets/animations/
  
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Regular.ttf
        - asset: assets/fonts/Inter-Bold.ttf
          weight: 700
```

### 🎯 **Development Best Practices**

1. **Code Organization**
   - Follow feature-based folder structure
   - Use barrel exports for clean imports
   - Separate concerns with clean architecture

2. **State Management**
   - Use BLoC pattern for complex state
   - Implement proper error handling
   - Use Equatable for value comparison

3. **Performance**
   - Implement lazy loading for lists
   - Use const constructors where possible
   - Optimize image loading with caching

4. **Testing**
   - Write tests for all business logic
   - Mock external dependencies
   - Test user interactions

5. **Security**
   - Validate all user inputs
   - Use secure storage for sensitive data
   - Implement proper authentication

---

<div align="center">

### 🚀 Ready to Build Amazing Mobile Experiences?

[🏁 Quick Start](#-quick-start) | [📦 Dependencies](#-dependencies) | [🧪 Testing](#-testing) | [📱 Deploy](#-build--deploy)

---

**Built with ❤️ using Flutter & Dart**

⭐ **Star this repository if you found it helpful!**

</div>
