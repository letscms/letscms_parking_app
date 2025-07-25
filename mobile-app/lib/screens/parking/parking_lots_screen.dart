import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:glassmorphism/glassmorphism.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:provider/provider.dart';
import '../../providers/parking_provider.dart';
import '../../models/parking_models.dart';

class ParkingLotsScreen extends StatefulWidget {
  const ParkingLotsScreen({super.key});

  @override
  State<ParkingLotsScreen> createState() => _ParkingLotsScreenState();
}

class _ParkingLotsScreenState extends State<ParkingLotsScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ParkingProvider>().loadParkingLots();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isDesktop = size.width > 768;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'PARKING LOTS',
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
            return Column(
              children: [
                // Search Bar
                Padding(
                  padding: EdgeInsets.all(isDesktop ? 24 : 16),
                  child: _buildSearchBar(),
                ),

                // Parking Lots List
                Expanded(
                  child:
                      parkingProvider.isLoading
                          ? const Center(
                            child: CircularProgressIndicator(
                              color: Color(0xFF00F5FF),
                            ),
                          )
                          : parkingProvider.parkingLots.isEmpty
                          ? _buildEmptyState()
                          : _buildParkingLotsList(parkingProvider, isDesktop),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildSearchBar() {
    return GlassmorphicContainer(
      width: double.infinity,
      height: 60,
      borderRadius: 16,
      blur: 10,
      alignment: Alignment.center,
      border: 2,
      linearGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          const Color(0xFF00F5FF).withOpacity(0.1),
          const Color(0xFF0066FF).withOpacity(0.05),
        ],
      ),
      borderGradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          const Color(0xFF00F5FF).withOpacity(0.5),
          const Color(0xFF0066FF).withOpacity(0.2),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: TextField(
          controller: _searchController,
          style: GoogleFonts.orbitron(color: Colors.white),
          decoration: InputDecoration(
            hintText: 'Search parking lots...',
            hintStyle: GoogleFonts.orbitron(
              color: Colors.white70,
              fontSize: 14,
            ),
            prefixIcon: const Icon(Icons.search, color: Color(0xFF00F5FF)),
            border: InputBorder.none,
            suffixIcon: IconButton(
              icon: const Icon(Icons.filter_list, color: Color(0xFF00F5FF)),
              onPressed: () {
                // TODO: Implement filter functionality
              },
            ),
          ),
          onChanged: (value) {
            context.read<ParkingProvider>().searchParkingLots(value);
          },
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.local_parking_outlined,
            size: 80,
            color: Colors.white.withOpacity(0.3),
          ),
          const SizedBox(height: 16),
          Text(
            'No parking lots found',
            style: GoogleFonts.orbitron(fontSize: 18, color: Colors.white70),
          ),
          const SizedBox(height: 8),
          Text(
            'Try adjusting your search criteria',
            style: GoogleFonts.orbitron(
              fontSize: 14,
              color: Colors.white.withOpacity(0.5),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildParkingLotsList(ParkingProvider provider, bool isDesktop) {
    return AnimationLimiter(
      child: ListView.builder(
        padding: EdgeInsets.all(isDesktop ? 24 : 16),
        itemCount: provider.parkingLots.length,
        itemBuilder: (context, index) {
          final lot = provider.parkingLots[index];
          return AnimationConfiguration.staggeredList(
            position: index,
            duration: const Duration(milliseconds: 375),
            child: SlideAnimation(
              verticalOffset: 50.0,
              child: FadeInAnimation(
                child: _buildParkingLotCard(lot, isDesktop),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildParkingLotCard(ParkingLot lot, bool isDesktop) {
    final occupancyRate = (lot.occupiedSpots / lot.totalSpots * 100).round();
    final isNearFull = occupancyRate > 80;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: GlassmorphicContainer(
        width: double.infinity,
        height: isDesktop ? 180 : 160,
        borderRadius: 20,
        blur: 10,
        alignment: Alignment.center,
        border: 2,
        linearGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF00F5FF).withOpacity(0.1),
            const Color(0xFF0066FF).withOpacity(0.05),
          ],
        ),
        borderGradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF00F5FF).withOpacity(0.5),
            const Color(0xFF0066FF).withOpacity(0.2),
          ],
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
                          lot.name,
                          style: GoogleFonts.orbitron(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF00F5FF),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          lot.address,
                          style: GoogleFonts.orbitron(
                            fontSize: 12,
                            color: Colors.white70,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
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
                      color: (isNearFull ? Colors.red : Colors.green)
                          .withOpacity(0.2),
                      border: Border.all(
                        color: isNearFull ? Colors.red : Colors.green,
                        width: 1,
                      ),
                    ),
                    child: Text(
                      '$occupancyRate%',
                      style: GoogleFonts.orbitron(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isNearFull ? Colors.red : Colors.green,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Stats Row
              Row(
                children: [
                  _buildStatChip('Available', lot.availableSpots, Colors.green),
                  const SizedBox(width: 8),
                  _buildStatChip('Occupied', lot.occupiedSpots, Colors.red),
                  const SizedBox(width: 8),
                  _buildStatChip('Reserved', lot.reservedSpots, Colors.orange),
                ],
              ),

              const Spacer(),

              // Action Row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '\$${lot.hourlyRate}/hour',
                    style: GoogleFonts.orbitron(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF00F5FF),
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        onPressed: () {
                          // TODO: Navigate to lot details
                        },
                        icon: const Icon(
                          Icons.info_outline,
                          color: Color(0xFF00F5FF),
                          size: 20,
                        ),
                      ),
                      ElevatedButton(
                        onPressed:
                            lot.availableSpots > 0
                                ? () {
                                  // TODO: Navigate to booking
                                }
                                : null,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF00F5FF),
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Text(
                          'RESERVE',
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

  Widget _buildStatChip(String label, int value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: color.withOpacity(0.1),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(shape: BoxShape.circle, color: color),
          ),
          const SizedBox(width: 6),
          Text(
            '$value $label',
            style: GoogleFonts.orbitron(fontSize: 10, color: Colors.white70),
          ),
        ],
      ),
    );
  }
}
