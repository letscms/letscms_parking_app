import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:glassmorphism/glassmorphism.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:math' as math;
import '../../providers/parking_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late AnimationController _pulseController;

  bool isScanning = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat();

    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);

    // Load initial data
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ParkingProvider>().loadUserData();
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _scanParkingLots() async {
    setState(() {
      isScanning = true;
    });

    // Use the provider's scanning simulation
    final parkingProvider = context.read<ParkingProvider>();
    await parkingProvider.simulateParkingLotScan();

    if (mounted) {
      setState(() {
        isScanning = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ParkingProvider>(
      builder: (context, parkingProvider, child) {
        final size = MediaQuery.of(context).size;
        final isDesktop = size.width > 768;

        return Scaffold(
          body: Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.topRight,
                radius: 1.5,
                colors: [
                  Color(0xFF1A1A2E),
                  Color(0xFF16213E),
                  Color(0xFF0F0F23),
                ],
              ),
            ),
            child: CustomScrollView(
              slivers: [
                // Futuristic App Bar
                SliverAppBar(
                  expandedHeight: isDesktop ? 120 : 100,
                  floating: false,
                  pinned: true,
                  backgroundColor: Colors.transparent,
                  actions: [
                    IconButton(
                      onPressed: () {
                        context.read<ParkingProvider>().logout();
                      },
                      icon: const Icon(Icons.logout, color: Color(0xFF00F5FF)),
                      tooltip: 'Logout',
                    ),
                  ],
                  flexibleSpace: FlexibleSpaceBar(
                    title: AnimatedTextKit(
                      animatedTexts: [
                        TyperAnimatedText(
                          'SMART PARKING',
                          textStyle: GoogleFonts.orbitron(
                            fontSize: isDesktop ? 24 : 18,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF00F5FF),
                          ),
                          speed: const Duration(milliseconds: 100),
                        ),
                      ],
                      isRepeatingAnimation: false,
                    ),
                    centerTitle: true,
                    background: Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color(0xFF00F5FF),
                            Color(0xFF0066FF),
                            Color(0xFF000033),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                // Main Content
                SliverPadding(
                  padding: EdgeInsets.all(isDesktop ? 24 : 16),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      // Status Cards
                      AnimationLimiter(
                        child:
                            isDesktop
                                ? Row(
                                  children: _getStatusCardsList(
                                    parkingProvider,
                                  ),
                                )
                                : Column(
                                  children: _getStatusCardsList(
                                    parkingProvider,
                                  ),
                                ),
                      ),

                      SizedBox(height: isDesktop ? 32 : 24),

                      // Real-time Chart
                      _buildRealtimeChart(context, isDesktop, parkingProvider),

                      SizedBox(height: isDesktop ? 32 : 24),

                      // Control Panel
                      _buildControlPanel(context, isDesktop),

                      SizedBox(height: isDesktop ? 32 : 24),

                      // Parking Zones
                      _buildParkingZones(context, isDesktop),
                    ]),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  List<Widget> _getStatusCardsList(ParkingProvider parkingProvider) {
    return [
      _buildStatusCard(
        'AVAILABLE',
        parkingProvider.totalAvailableSpots,
        Colors.green,
        0,
      ),
      _buildStatusCard(
        'OCCUPIED',
        parkingProvider.totalOccupiedSpots,
        Colors.red,
        1,
      ),
      _buildStatusCard(
        'RESERVED',
        parkingProvider.totalReservedSpots,
        Colors.orange,
        2,
      ),
      _buildStatusCard(
        'TOTAL',
        parkingProvider.totalParkingSpots,
        const Color(0xFF00F5FF),
        3,
      ),
    ];
  }

  Widget _buildStatusCard(String title, int value, Color color, int index) {
    return AnimationConfiguration.staggeredList(
      position: index,
      duration: const Duration(milliseconds: 375),
      child: SlideAnimation(
        verticalOffset: 50.0,
        child: FadeInAnimation(
          child: Container(
            margin: const EdgeInsets.only(bottom: 16),
            child: GlassmorphicContainer(
              width: double.infinity,
              height: 120,
              borderRadius: 20,
              blur: 10,
              alignment: Alignment.center,
              border: 2,
              linearGradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [color.withOpacity(0.1), color.withOpacity(0.05)],
              ),
              borderGradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [color.withOpacity(0.5), color.withOpacity(0.2)],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.orbitron(
                      fontSize: 12,
                      fontWeight: FontWeight.w300,
                      color: Colors.white70,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: 1.0 + (_pulseController.value * 0.1),
                        child: Text(
                          value.toString(),
                          style: GoogleFonts.orbitron(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: color,
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRealtimeChart(
    BuildContext context,
    bool isDesktop,
    ParkingProvider parkingProvider,
  ) {
    return GlassmorphicContainer(
      width: double.infinity,
      height: isDesktop ? 300 : 250,
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
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'REAL-TIME OCCUPANCY',
              style: GoogleFonts.orbitron(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF00F5FF),
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: PieChart(
                PieChartData(
                  sectionsSpace: 2,
                  centerSpaceRadius: 40,
                  sections: [
                    PieChartSectionData(
                      color: Colors.green,
                      value: parkingProvider.totalAvailableSpots.toDouble(),
                      title:
                          '${(parkingProvider.totalAvailableSpots / parkingProvider.totalParkingSpots * 100).round()}%',
                      radius: 60,
                      titleStyle: GoogleFonts.orbitron(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    PieChartSectionData(
                      color: Colors.red,
                      value: parkingProvider.totalOccupiedSpots.toDouble(),
                      title:
                          '${(parkingProvider.totalOccupiedSpots / parkingProvider.totalParkingSpots * 100).round()}%',
                      radius: 60,
                      titleStyle: GoogleFonts.orbitron(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    PieChartSectionData(
                      color: Colors.orange,
                      value: parkingProvider.totalReservedSpots.toDouble(),
                      title:
                          '${(parkingProvider.totalReservedSpots / parkingProvider.totalParkingSpots * 100).round()}%',
                      radius: 60,
                      titleStyle: GoogleFonts.orbitron(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlPanel(BuildContext context, bool isDesktop) {
    return GlassmorphicContainer(
      width: double.infinity,
      height: isDesktop ? 200 : 180,
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
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'CONTROL PANEL',
              style: GoogleFonts.orbitron(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF00F5FF),
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: Row(
                children: [
                  Expanded(
                    child: _buildControlButton(
                      'SCAN LOTS',
                      Icons.radar,
                      _scanParkingLots,
                      isScanning,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildControlButton(
                      'OPTIMIZE',
                      Icons.auto_awesome,
                      () {},
                      false,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildControlButton(
                      'ANALYTICS',
                      Icons.analytics,
                      () {},
                      false,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlButton(
    String title,
    IconData icon,
    VoidCallback onTap,
    bool isActive,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors:
                isActive
                    ? [
                      const Color(0xFF00F5FF).withOpacity(0.3),
                      const Color(0xFF0066FF).withOpacity(0.1),
                    ]
                    : [
                      Colors.white.withOpacity(0.1),
                      Colors.white.withOpacity(0.05),
                    ],
          ),
          border: Border.all(
            color: isActive ? const Color(0xFF00F5FF) : Colors.white24,
            width: 1,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isActive && isScanning)
              AnimatedBuilder(
                animation: _animationController,
                builder: (context, child) {
                  return Transform.rotate(
                    angle: _animationController.value * 2 * math.pi,
                    child: Icon(icon, color: const Color(0xFF00F5FF), size: 32),
                  );
                },
              )
            else
              Icon(
                icon,
                color: isActive ? const Color(0xFF00F5FF) : Colors.white70,
                size: 32,
              ),
            const SizedBox(height: 8),
            Text(
              title,
              style: GoogleFonts.orbitron(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: isActive ? const Color(0xFF00F5FF) : Colors.white70,
                letterSpacing: 1,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildParkingZones(BuildContext context, bool isDesktop) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'PARKING ZONES',
          style: GoogleFonts.orbitron(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF00F5FF),
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: isDesktop ? 4 : 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.2,
          ),
          itemCount: 8,
          itemBuilder: (context, index) {
            final zones = [
              'ZONE A',
              'ZONE B',
              'ZONE C',
              'ZONE D',
              'ZONE E',
              'ZONE F',
              'ZONE G',
              'ZONE H',
            ];
            final occupancy = [85, 42, 91, 23, 67, 78, 34, 56];
            final isNearFull = occupancy[index] > 80;

            return GlassmorphicContainer(
              width: double.infinity,
              height: double.infinity,
              borderRadius: 16,
              blur: 10,
              alignment: Alignment.center,
              border: 2,
              linearGradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  (isNearFull ? Colors.red : Colors.green).withOpacity(0.1),
                  (isNearFull ? Colors.red : Colors.green).withOpacity(0.05),
                ],
              ),
              borderGradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  (isNearFull ? Colors.red : Colors.green).withOpacity(0.5),
                  (isNearFull ? Colors.red : Colors.green).withOpacity(0.2),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    zones[index],
                    style: GoogleFonts.orbitron(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${occupancy[index]}%',
                    style: GoogleFonts.orbitron(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: isNearFull ? Colors.red : Colors.green,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'OCCUPIED',
                    style: GoogleFonts.orbitron(
                      fontSize: 8,
                      fontWeight: FontWeight.w300,
                      color: Colors.white70,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
