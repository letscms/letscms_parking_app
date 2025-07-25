import 'package:flutter/material.dart';
import '../models/parking_models.dart';
import '../services/api_service.dart';

class ParkingProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  // State variables
  List<ParkingZone> _parkingZones = [];
  List<ParkingLot> _parkingLots = [];
  List<ParkingReservation> _userReservations = [];
  User? _currentUser;

  bool _isLoading = false;
  String? _error;

  // Getters
  List<ParkingZone> get parkingZones => _parkingZones;
  List<ParkingLot> get parkingLots => _parkingLots;
  List<ParkingReservation> get userReservations => _userReservations;
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _currentUser != null;

  // Computed properties
  int get totalParkingSpots =>
      _parkingLots.fold(0, (sum, lot) => sum + lot.totalSpots);
  int get totalAvailableSpots =>
      _parkingLots.fold(0, (sum, lot) => sum + lot.availableSpots);
  int get totalOccupiedSpots =>
      _parkingLots.fold(0, (sum, lot) => sum + lot.occupiedSpots);
  int get totalReservedSpots =>
      _parkingLots.fold(0, (sum, lot) => sum + lot.reservedSpots);

  double get averageOccupancyRate {
    if (_parkingLots.isEmpty) return 0.0;
    final totalOccupancy = _parkingLots.fold(
      0.0,
      (sum, lot) => sum + lot.occupancyRate,
    );
    return totalOccupancy / _parkingLots.length;
  }

  List<ParkingReservation> get activeReservations =>
      _userReservations.where((res) => res.isActive).toList();

  // Authentication methods
  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.login(email, password);
      if (response.success && response.data != null) {
        _currentUser = response.data;
        await loadUserData();
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? 'Login failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  Future<bool> register(
    String email,
    String password,
    String name,
    String phoneNumber,
  ) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.register(
        email,
        password,
        name,
        phoneNumber,
      );
      if (response.success && response.data != null) {
        _currentUser = response.data;
        await loadUserData();
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? 'Registration failed');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _apiService.logout();
    } finally {
      _currentUser = null;
      _parkingZones = [];
      _parkingLots = [];
      _userReservations = [];
      _clearError();
      notifyListeners();
    }
  }

  // Data loading methods
  Future<void> loadUserData() async {
    await Future.wait([
      loadParkingZones(),
      loadParkingLots(),
      loadUserReservations(),
    ]);
  }

  Future<void> loadParkingZones() async {
    try {
      final response = await _apiService.getParkingZones();
      if (response.success && response.data != null) {
        _parkingZones = response.data!;
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load parking zones');
      }
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<void> loadParkingLots({
    double? latitude,
    double? longitude,
    double? radius,
  }) async {
    try {
      final response = await _apiService.getParkingLots(
        latitude: latitude,
        longitude: longitude,
        radius: radius,
      );
      if (response.success && response.data != null) {
        _parkingLots = response.data!;
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load parking lots');
      }
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<void> loadUserReservations() async {
    if (!isLoggedIn) return;

    try {
      final response = await _apiService.getUserReservations();
      if (response.success && response.data != null) {
        _userReservations = response.data!;
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load reservations');
      }
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<ParkingLot?> getParkingLotDetails(String lotId) async {
    try {
      final response = await _apiService.getParkingLotDetails(lotId);
      if (response.success && response.data != null) {
        return response.data;
      } else {
        _setError(response.error ?? 'Failed to load parking lot details');
        return null;
      }
    } catch (e) {
      _setError(e.toString());
      return null;
    }
  }

  // Reservation methods
  Future<bool> createReservation({
    required String parkingLotId,
    required DateTime startTime,
    required DateTime endTime,
    required String vehicleNumber,
  }) async {
    if (!isLoggedIn) {
      _setError('Please login to make a reservation');
      return false;
    }

    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.createReservation(
        parkingLotId: parkingLotId,
        startTime: startTime,
        endTime: endTime,
        vehicleNumber: vehicleNumber,
      );

      if (response.success && response.data != null) {
        _userReservations.add(response.data!);
        // Update the parking lot availability
        await loadParkingLots();
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? 'Failed to create reservation');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  Future<bool> cancelReservation(String reservationId) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await _apiService.cancelReservation(reservationId);
      if (response.success) {
        _userReservations.removeWhere((res) => res.id == reservationId);
        // Update the parking lot availability
        await loadParkingLots();
        _setLoading(false);
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? 'Failed to cancel reservation');
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError(e.toString());
      _setLoading(false);
      return false;
    }
  }

  // Real-time updates simulation
  Future<void> refreshParkingData() async {
    _setLoading(true);
    await Future.wait([loadParkingLots(), loadParkingZones()]);
    _setLoading(false);
  }

  // Utility methods for scanning simulation
  Future<void> simulateParkingLotScan() async {
    _setLoading(true);

    // Simulate scanning delay
    await Future.delayed(const Duration(seconds: 3));

    // Update parking lots with new random data
    for (var lot in _parkingLots) {
      final random = DateTime.now().millisecondsSinceEpoch % 100;
      final newOccupied = 30 + (random % 70);
      final newReserved = 5 + (random % 20);
      final newAvailable = lot.totalSpots - newOccupied - newReserved;

      if (newAvailable >= 0) {
        _parkingLots[_parkingLots.indexOf(lot)] = ParkingLot(
          id: lot.id,
          name: lot.name,
          address: lot.address,
          latitude: lot.latitude,
          longitude: lot.longitude,
          totalSpots: lot.totalSpots,
          availableSpots: newAvailable,
          occupiedSpots: newOccupied,
          reservedSpots: newReserved,
          hourlyRate: lot.hourlyRate,
          amenities: lot.amenities,
          status: lot.status,
          lastUpdated: DateTime.now(),
        );
      }
    }

    _setLoading(false);
    notifyListeners();
  }

  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  // Search and filter methods
  List<ParkingLot> searchParkingLots(String query) {
    if (query.isEmpty) return _parkingLots;

    return _parkingLots
        .where(
          (lot) =>
              lot.name.toLowerCase().contains(query.toLowerCase()) ||
              lot.address.toLowerCase().contains(query.toLowerCase()),
        )
        .toList();
  }

  List<ParkingLot> getAvailableParkingLots() {
    return _parkingLots.where((lot) => lot.isAvailable).toList();
  }

  List<ParkingLot> getNearFullParkingLots() {
    return _parkingLots.where((lot) => lot.isNearFull).toList();
  }

  ParkingLot? findParkingLotById(String id) {
    try {
      return _parkingLots.firstWhere((lot) => lot.id == id);
    } catch (e) {
      return null;
    }
  }
}
