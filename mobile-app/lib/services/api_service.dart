import 'dart:io';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/parking_models.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  late Dio _dio;
  String? _authToken;

  // Replace with your actual API base URL
  static const String _baseUrl = 'https://your-parking-api.com/api/v1';

  // For demo purposes, we'll use mock data
  static const bool _useMockData = true;

  void initialize() {
    _dio = Dio();
    _dio.options.baseUrl = _baseUrl;
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);

    // Add interceptors
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_authToken != null) {
            options.headers['Authorization'] = 'Bearer $_authToken';
          }
          options.headers['Content-Type'] = 'application/json';
          handler.next(options);
        },
        onError: (error, handler) {
          _handleDioError(error);
          handler.next(error);
        },
      ),
    );
  }

  void _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        throw Exception(
          'Connection timeout. Please check your internet connection.',
        );
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        if (statusCode == 401) {
          _clearAuthToken();
          throw Exception('Unauthorized. Please login again.');
        } else if (statusCode == 403) {
          throw Exception('Access forbidden.');
        } else if (statusCode == 404) {
          throw Exception('Resource not found.');
        } else if (statusCode == 500) {
          throw Exception('Internal server error. Please try again later.');
        }
        break;
      case DioExceptionType.cancel:
        throw Exception('Request cancelled.');
      case DioExceptionType.unknown:
        if (error.error is SocketException) {
          throw Exception('No internet connection.');
        }
        break;
      default:
        throw Exception('Something went wrong. Please try again.');
    }
  }

  Future<void> _saveAuthToken(String token) async {
    _authToken = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<void> _clearAuthToken() async {
    _authToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  // Authentication APIs
  Future<ApiResponse<User>> login(String email, String password) async {
    try {
      if (_useMockData) {
        // Mock login for demo
        await Future.delayed(const Duration(seconds: 2));
        if (email.isNotEmpty && password.length >= 6) {
          final mockUser = User(
            id: 'user123',
            email: email,
            name: 'John Doe',
            phoneNumber: '+1234567890',
            vehicleNumbers: ['ABC-123', 'XYZ-789'],
            walletBalance: 250.75,
            createdAt: DateTime.now().subtract(const Duration(days: 30)),
          );
          await _saveAuthToken(
            'mock_token_${DateTime.now().millisecondsSinceEpoch}',
          );
          return ApiResponse.success(mockUser, message: 'Login successful');
        } else {
          return ApiResponse.error('Invalid credentials');
        }
      }

      final response = await _dio.post(
        '/auth/login',
        data: {'email': email, 'password': password},
      );

      final user = User.fromJson(response.data['user']);
      await _saveAuthToken(response.data['token']);

      return ApiResponse.success(user, message: 'Login successful');
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  Future<ApiResponse<User>> register(
    String email,
    String password,
    String name,
    String phoneNumber,
  ) async {
    try {
      if (_useMockData) {
        // Mock registration for demo
        await Future.delayed(const Duration(seconds: 2));
        final mockUser = User(
          id: 'user${DateTime.now().millisecondsSinceEpoch}',
          email: email,
          name: name,
          phoneNumber: phoneNumber,
          vehicleNumbers: [],
          walletBalance: 50.0,
          createdAt: DateTime.now(),
        );
        await _saveAuthToken(
          'mock_token_${DateTime.now().millisecondsSinceEpoch}',
        );
        return ApiResponse.success(
          mockUser,
          message: 'Registration successful',
        );
      }

      final response = await _dio.post(
        '/auth/register',
        data: {
          'email': email,
          'password': password,
          'name': name,
          'phoneNumber': phoneNumber,
        },
      );

      final user = User.fromJson(response.data['user']);
      await _saveAuthToken(response.data['token']);

      return ApiResponse.success(user, message: 'Registration successful');
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  Future<void> logout() async {
    try {
      if (!_useMockData) {
        await _dio.post('/auth/logout');
      }
      await _clearAuthToken();
    } catch (e) {
      // Even if logout fails on server, clear local token
      await _clearAuthToken();
    }
  }

  // Parking APIs
  Future<ApiResponse<List<ParkingZone>>> getParkingZones() async {
    try {
      if (_useMockData) {
        await Future.delayed(const Duration(seconds: 1));
        return ApiResponse.success(_getMockParkingZones());
      }

      final response = await _dio.get('/parking/zones');
      final zones =
          (response.data['zones'] as List)
              .map((zone) => ParkingZone.fromJson(zone))
              .toList();

      return ApiResponse.success(zones);
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  Future<ApiResponse<List<ParkingLot>>> getParkingLots({
    double? latitude,
    double? longitude,
    double? radius,
  }) async {
    try {
      if (_useMockData) {
        await Future.delayed(const Duration(seconds: 1));
        return ApiResponse.success(_getMockParkingLots());
      }

      final response = await _dio.get(
        '/parking/lots',
        queryParameters: {
          if (latitude != null) 'lat': latitude,
          if (longitude != null) 'lng': longitude,
          if (radius != null) 'radius': radius,
        },
      );

      final lots =
          (response.data['lots'] as List)
              .map((lot) => ParkingLot.fromJson(lot))
              .toList();

      return ApiResponse.success(lots);
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  Future<ApiResponse<ParkingLot>> getParkingLotDetails(String lotId) async {
    try {
      if (_useMockData) {
        await Future.delayed(const Duration(seconds: 1));
        final lots = _getMockParkingLots();
        final lot = lots.firstWhere(
          (l) => l.id == lotId,
          orElse: () => lots.first,
        );
        return ApiResponse.success(lot);
      }

      final response = await _dio.get('/parking/lots/$lotId');
      final lot = ParkingLot.fromJson(response.data['lot']);

      return ApiResponse.success(lot);
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  Future<ApiResponse<ParkingReservation>> createReservation({
    required String parkingLotId,
    required DateTime startTime,
    required DateTime endTime,
    required String vehicleNumber,
  }) async {
    try {
      if (_useMockData) {
        await Future.delayed(const Duration(seconds: 2));
        final reservation = ParkingReservation(
          id: 'res_${DateTime.now().millisecondsSinceEpoch}',
          userId: 'user123',
          parkingLotId: parkingLotId,
          spotNumber: 'A${DateTime.now().millisecond % 99 + 1}',
          startTime: startTime,
          endTime: endTime,
          totalCost: endTime.difference(startTime).inHours * 5.0,
          status: 'active',
          createdAt: DateTime.now(),
        );
        return ApiResponse.success(
          reservation,
          message: 'Reservation created successfully',
        );
      }

      final response = await _dio.post(
        '/parking/reservations',
        data: {
          'parkingLotId': parkingLotId,
          'startTime': startTime.toIso8601String(),
          'endTime': endTime.toIso8601String(),
          'vehicleNumber': vehicleNumber,
        },
      );

      final reservation = ParkingReservation.fromJson(
        response.data['reservation'],
      );
      return ApiResponse.success(
        reservation,
        message: 'Reservation created successfully',
      );
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  Future<ApiResponse<List<ParkingReservation>>> getUserReservations() async {
    try {
      if (_useMockData) {
        await Future.delayed(const Duration(seconds: 1));
        return ApiResponse.success(_getMockReservations());
      }

      final response = await _dio.get('/parking/reservations');
      final reservations =
          (response.data['reservations'] as List)
              .map((res) => ParkingReservation.fromJson(res))
              .toList();

      return ApiResponse.success(reservations);
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  Future<ApiResponse<void>> cancelReservation(String reservationId) async {
    try {
      if (_useMockData) {
        await Future.delayed(const Duration(seconds: 1));
        return ApiResponse.success(
          null,
          message: 'Reservation cancelled successfully',
        );
      }

      await _dio.delete('/parking/reservations/$reservationId');
      return ApiResponse.success(
        null,
        message: 'Reservation cancelled successfully',
      );
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  // Mock data for demo purposes
  List<ParkingZone> _getMockParkingZones() {
    return [
      ParkingZone(
        id: 'zone_a',
        name: 'ZONE A',
        parkingLots: _getMockParkingLots().take(2).toList(),
        averageOccupancy: 85.0,
        zoneType: 'commercial',
      ),
      ParkingZone(
        id: 'zone_b',
        name: 'ZONE B',
        parkingLots: _getMockParkingLots().skip(2).take(2).toList(),
        averageOccupancy: 42.0,
        zoneType: 'residential',
      ),
      ParkingZone(
        id: 'zone_c',
        name: 'ZONE C',
        parkingLots: _getMockParkingLots().skip(4).take(2).toList(),
        averageOccupancy: 67.0,
        zoneType: 'mixed',
      ),
    ];
  }

  List<ParkingLot> _getMockParkingLots() {
    final now = DateTime.now();
    return [
      ParkingLot(
        id: 'lot_1',
        name: 'Central Plaza Parking',
        address: '123 Main St, Downtown',
        latitude: 37.7749,
        longitude: -122.4194,
        totalSpots: 100,
        availableSpots: 15,
        occupiedSpots: 75,
        reservedSpots: 10,
        hourlyRate: 8.50,
        amenities: ['EV Charging', 'Security', 'Covered'],
        status: 'active',
        lastUpdated: now.subtract(const Duration(minutes: 2)),
      ),
      ParkingLot(
        id: 'lot_2',
        name: 'Tech District Hub',
        address: '456 Tech Ave, Silicon Valley',
        latitude: 37.7849,
        longitude: -122.4094,
        totalSpots: 150,
        availableSpots: 45,
        occupiedSpots: 90,
        reservedSpots: 15,
        hourlyRate: 12.00,
        amenities: ['EV Charging', '24/7 Access', 'Valet'],
        status: 'active',
        lastUpdated: now.subtract(const Duration(minutes: 1)),
      ),
      ParkingLot(
        id: 'lot_3',
        name: 'Shopping Center Garage',
        address: '789 Commerce Blvd, Mall District',
        latitude: 37.7649,
        longitude: -122.4294,
        totalSpots: 200,
        availableSpots: 78,
        occupiedSpots: 110,
        reservedSpots: 12,
        hourlyRate: 6.00,
        amenities: ['Shopping Access', 'Elevator', 'Security'],
        status: 'active',
        lastUpdated: now.subtract(const Duration(minutes: 3)),
      ),
      ParkingLot(
        id: 'lot_4',
        name: 'Airport Terminal Parking',
        address: '321 Airport Way, Terminal 1',
        latitude: 37.7549,
        longitude: -122.4394,
        totalSpots: 300,
        availableSpots: 120,
        occupiedSpots: 165,
        reservedSpots: 15,
        hourlyRate: 15.00,
        amenities: ['Shuttle Service', 'Long-term', 'Security'],
        status: 'active',
        lastUpdated: now.subtract(const Duration(minutes: 1)),
      ),
    ];
  }

  List<ParkingReservation> _getMockReservations() {
    final now = DateTime.now();
    return [
      ParkingReservation(
        id: 'res_1',
        userId: 'user123',
        parkingLotId: 'lot_1',
        spotNumber: 'A23',
        startTime: now.add(const Duration(hours: 1)),
        endTime: now.add(const Duration(hours: 4)),
        totalCost: 25.50,
        status: 'active',
        createdAt: now.subtract(const Duration(hours: 2)),
      ),
      ParkingReservation(
        id: 'res_2',
        userId: 'user123',
        parkingLotId: 'lot_2',
        spotNumber: 'B15',
        startTime: now.subtract(const Duration(days: 1)),
        endTime: now.subtract(const Duration(days: 1, hours: -3)),
        totalCost: 36.00,
        status: 'completed',
        createdAt: now.subtract(const Duration(days: 2)),
      ),
    ];
  }
}
