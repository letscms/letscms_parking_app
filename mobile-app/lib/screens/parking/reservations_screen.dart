import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:glassmorphism/glassmorphism.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:provider/provider.dart';
import '../../providers/parking_provider.dart';
import '../../models/parking_models.dart';

class ReservationsScreen extends StatefulWidget {
  const ReservationsScreen({super.key});

  @override
  State<ReservationsScreen> createState() => _ReservationsScreenState();
}

class _ReservationsScreenState extends State<ReservationsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ParkingProvider>().loadUserReservations();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isDesktop = size.width > 768;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'MY RESERVATIONS',
          style: GoogleFonts.orbitron(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF00F5FF),
            letterSpacing: 2,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF00F5FF)),
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF00F5FF),
          unselectedLabelColor: Colors.white70,
          indicatorColor: const Color(0xFF00F5FF),
          labelStyle: GoogleFonts.orbitron(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
          ),
          tabs: const [
            Tab(text: 'ACTIVE'),
            Tab(text: 'COMPLETED'),
            Tab(text: 'CANCELLED'),
          ],
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topRight,
            radius: 1.5,
            colors: [Color(0xFF1A1A2E), Color(0xFF16213E), Color(0xFF0F0F23)],
          ),
        ),
        child: Consumer<ParkingProvider>(
          builder: (context, parkingProvider, child) {
            return TabBarView(
              controller: _tabController,
              children: [
                _buildReservationsList(
                  parkingProvider.activeReservations,
                  'active',
                  isDesktop,
                  parkingProvider.isLoading,
                ),
                _buildReservationsList(
                  parkingProvider.userReservations
                      .where((r) => r.status == 'completed')
                      .toList(),
                  'completed',
                  isDesktop,
                  parkingProvider.isLoading,
                ),
                _buildReservationsList(
                  parkingProvider.userReservations
                      .where((r) => r.status == 'cancelled')
                      .toList(),
                  'cancelled',
                  isDesktop,
                  parkingProvider.isLoading,
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildReservationsList(
    List<ParkingReservation> reservations,
    String status,
    bool isDesktop,
    bool isLoading,
  ) {
    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(color: Color(0xFF00F5FF)),
      );
    }

    if (reservations.isEmpty) {
      return _buildEmptyState(status);
    }

    return AnimationLimiter(
      child: ListView.builder(
        padding: EdgeInsets.all(isDesktop ? 24 : 16),
        itemCount: reservations.length,
        itemBuilder: (context, index) {
          final reservation = reservations[index];
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              verticalOffset: 50.0,
              child: FadeInAnimation(
                child: _buildReservationCard(reservation, status, isDesktop),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState(String status) {
    String message;
    IconData icon;

    switch (status) {
      case 'active':
        message = 'No active reservations';
        icon = Icons.schedule;
        break;
      case 'completed':
        message = 'No completed reservations';
        icon = Icons.check_circle_outline;
        break;
      case 'cancelled':
        message = 'No cancelled reservations';
        icon = Icons.cancel_outlined;
        break;
      default:
        message = 'No reservations found';
        icon = Icons.local_parking_outlined;
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: Colors.white.withOpacity(0.3)),
          const SizedBox(height: 16),
          Text(
            message,
            style: GoogleFonts.orbitron(fontSize: 18, color: Colors.white70),
          ),
          const SizedBox(height: 8),
          Text(
            'Start by making a new reservation',
            style: GoogleFonts.orbitron(
              fontSize: 14,
              color: Colors.white.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReservationCard(
    ParkingReservation reservation,
    String status,
    bool isDesktop,
  ) {
    Color statusColor;
    IconData statusIcon;

    switch (status) {
      case 'active':
        statusColor = Colors.green;
        statusIcon = Icons.schedule;
        break;
      case 'completed':
        statusColor = Colors.blue;
        statusIcon = Icons.check_circle;
        break;
      case 'cancelled':
        statusColor = Colors.red;
        statusIcon = Icons.cancel;
        break;
      default:
        statusColor = Colors.grey;
        statusIcon = Icons.help;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: GlassmorphicContainer(
        width: double.infinity,
        height: isDesktop ? 200 : 180,
        borderRadius: 20,
        blur: 10,
        alignment: Alignment.center,
        border: 2,
        linearGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [statusColor.withOpacity(0.1), statusColor.withOpacity(0.05)],
        ),
        borderGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [statusColor.withOpacity(0.5), statusColor.withOpacity(0.2)],
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Reservation #${reservation.id.substring(0, 8)}',
                          style: GoogleFonts.orbitron(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF00F5FF),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Spot: ${reservation.spotNumber}',
                          style: GoogleFonts.orbitron(
                            fontSize: 12,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: statusColor.withOpacity(0.2),
                      border: Border.all(color: statusColor, width: 1),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(statusIcon, size: 12, color: statusColor),
                        const SizedBox(width: 4),
                        Text(
                          status.toUpperCase(),
                          style: GoogleFonts.orbitron(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: statusColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Time Info
              Row(
                children: [
                  Expanded(
                    child: _buildTimeInfo(
                      'START',
                      reservation.startTime,
                      Icons.login,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildTimeInfo(
                      'END',
                      reservation.endTime,
                      Icons.logout,
                    ),
                  ),
                ],
              ),

              const Spacer(),

              // Cost and Actions
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Total Cost',
                        style: GoogleFonts.orbitron(
                          fontSize: 10,
                          color: Colors.white70,
                        ),
                      ),
                      Text(
                        '\$${reservation.totalCost.toStringAsFixed(2)}',
                        style: GoogleFonts.orbitron(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF00F5FF),
                        ),
                      ),
                    ],
                  ),
                  if (status == 'active')
                    Row(
                      children: [
                        IconButton(
                          onPressed: () {
                            // TODO: Extend reservation
                          },
                          icon: const Icon(
                            Icons.schedule,
                            color: Color(0xFF00F5FF),
                            size: 20,
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            _cancelReservation(reservation.id);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 8,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            'CANCEL',
                            style: GoogleFonts.orbitron(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTimeInfo(String label, DateTime time, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: Colors.white.withOpacity(0.05),
        border: Border.all(color: Colors.white.withOpacity(0.1), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 12, color: Colors.white70),
              const SizedBox(width: 4),
              Text(
                label,
                style: GoogleFonts.orbitron(
                  fontSize: 10,
                  color: Colors.white70,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}',
            style: GoogleFonts.orbitron(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            '${time.day}/${time.month}/${time.year}',
            style: GoogleFonts.orbitron(fontSize: 10, color: Colors.white70),
          ),
        ],
      ),
    );
  }

  void _cancelReservation(String reservationId) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            backgroundColor: const Color(0xFF1A1A2E),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            title: Text(
              'Cancel Reservation',
              style: GoogleFonts.orbitron(
                color: const Color(0xFF00F5FF),
                fontWeight: FontWeight.bold,
              ),
            ),
            content: Text(
              'Are you sure you want to cancel this reservation? This action cannot be undone.',
              style: GoogleFonts.orbitron(color: Colors.white70, fontSize: 14),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: Text(
                  'KEEP',
                  style: GoogleFonts.orbitron(
                    color: Colors.white70,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  context.read<ParkingProvider>().cancelReservation(
                    reservationId,
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                ),
                child: Text(
                  'CANCEL',
                  style: GoogleFonts.orbitron(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
    );
  }
}
