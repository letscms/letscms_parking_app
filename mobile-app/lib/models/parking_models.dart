class ParkingLot {
  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final int totalSpots;
  final int availableSpots;
  final int occupiedSpots;
  final int reservedSpots;
  final double hourlyRate;
  final List<String> amenities;
  final String status; // 'active', 'maintenance', 'closed'
  final DateTime lastUpdated;

  ParkingLot({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.totalSpots,
    required this.availableSpots,
    required this.occupiedSpots,
    required this.reservedSpots,
    required this.hourlyRate,
    required this.amenities,
    required this.status,
    required this.lastUpdated,
  });

  factory ParkingLot.fromJson(Map<String, dynamic> json) {
    return ParkingLot(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      latitude: json['latitude']?.toDouble() ?? 0.0,
      longitude: json['longitude']?.toDouble() ?? 0.0,
      totalSpots: json['totalSpots'] ?? 0,
      availableSpots: json['availableSpots'] ?? 0,
      occupiedSpots: json['occupiedSpots'] ?? 0,
      reservedSpots: json['reservedSpots'] ?? 0,
      hourlyRate: json['hourlyRate']?.toDouble() ?? 0.0,
      amenities: List<String>.from(json['amenities'] ?? []),
      status: json['status'] ?? 'unknown',
      lastUpdated:
          DateTime.tryParse(json['lastUpdated'] ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'totalSpots': totalSpots,
      'availableSpots': availableSpots,
      'occupiedSpots': occupiedSpots,
      'reservedSpots': reservedSpots,
      'hourlyRate': hourlyRate,
      'amenities': amenities,
      'status': status,
      'lastUpdated': lastUpdated.toIso8601String(),
    };
  }

  double get occupancyRate =>
      totalSpots > 0 ? (occupiedSpots / totalSpots) * 100 : 0;
  bool get isNearFull => occupancyRate > 85;
  bool get isAvailable => status == 'active' && availableSpots > 0;
}

class ParkingZone {
  final String id;
  final String name;
  final List<ParkingLot> parkingLots;
  final double averageOccupancy;
  final String zoneType; // 'commercial', 'residential', 'mixed'

  ParkingZone({
    required this.id,
    required this.name,
    required this.parkingLots,
    required this.averageOccupancy,
    required this.zoneType,
  });

  factory ParkingZone.fromJson(Map<String, dynamic> json) {
    return ParkingZone(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      parkingLots:
          (json['parkingLots'] as List?)
              ?.map((lot) => ParkingLot.fromJson(lot))
              .toList() ??
          [],
      averageOccupancy: json['averageOccupancy']?.toDouble() ?? 0.0,
      zoneType: json['zoneType'] ?? 'mixed',
    );
  }

  int get totalSpots => parkingLots.fold(0, (sum, lot) => sum + lot.totalSpots);
  int get totalAvailable =>
      parkingLots.fold(0, (sum, lot) => sum + lot.availableSpots);
  int get totalOccupied =>
      parkingLots.fold(0, (sum, lot) => sum + lot.occupiedSpots);
  int get totalReserved =>
      parkingLots.fold(0, (sum, lot) => sum + lot.reservedSpots);
}

class ParkingReservation {
  final String id;
  final String userId;
  final String parkingLotId;
  final String spotNumber;
  final DateTime startTime;
  final DateTime endTime;
  final double totalCost;
  final String status; // 'active', 'completed', 'cancelled'
  final DateTime createdAt;

  ParkingReservation({
    required this.id,
    required this.userId,
    required this.parkingLotId,
    required this.spotNumber,
    required this.startTime,
    required this.endTime,
    required this.totalCost,
    required this.status,
    required this.createdAt,
  });

  factory ParkingReservation.fromJson(Map<String, dynamic> json) {
    return ParkingReservation(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      parkingLotId: json['parkingLotId'] ?? '',
      spotNumber: json['spotNumber'] ?? '',
      startTime: DateTime.tryParse(json['startTime'] ?? '') ?? DateTime.now(),
      endTime: DateTime.tryParse(json['endTime'] ?? '') ?? DateTime.now(),
      totalCost: json['totalCost']?.toDouble() ?? 0.0,
      status: json['status'] ?? 'unknown',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'parkingLotId': parkingLotId,
      'spotNumber': spotNumber,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime.toIso8601String(),
      'totalCost': totalCost,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  Duration get duration => endTime.difference(startTime);
  bool get isActive => status == 'active' && DateTime.now().isBefore(endTime);
}

class User {
  final String id;
  final String email;
  final String name;
  final String phoneNumber;
  final String? profileImageUrl;
  final List<String> vehicleNumbers;
  final double walletBalance;
  final DateTime createdAt;

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.phoneNumber,
    this.profileImageUrl,
    required this.vehicleNumbers,
    required this.walletBalance,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      profileImageUrl: json['profileImageUrl'],
      vehicleNumbers: List<String>.from(json['vehicleNumbers'] ?? []),
      walletBalance: json['walletBalance']?.toDouble() ?? 0.0,
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'phoneNumber': phoneNumber,
      'profileImageUrl': profileImageUrl,
      'vehicleNumbers': vehicleNumbers,
      'walletBalance': walletBalance,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;
  final String? error;
  final int? statusCode;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    this.error,
    this.statusCode,
  });

  factory ApiResponse.success(T data, {String message = 'Success'}) {
    return ApiResponse(
      success: true,
      message: message,
      data: data,
      statusCode: 200,
    );
  }

  factory ApiResponse.error(String error, {int? statusCode}) {
    return ApiResponse(
      success: false,
      message: 'Error',
      error: error,
      statusCode: statusCode,
    );
  }
}
