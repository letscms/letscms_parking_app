import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:glassmorphism/glassmorphism.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:provider/provider.dart';
import 'dart:math' as math;
import '../../providers/parking_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with TickerProviderStateMixin {
  late AnimationController _backgroundController;
  late AnimationController _formController;
  late AnimationController _scanController;

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  bool _isLoading = false;
  bool _isPasswordVisible = false;
  bool _isScanning = false;

  @override
  void initState() {
    super.initState();
    _backgroundController = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    )..repeat();

    _formController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _scanController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _formController.forward();
  }

  @override
  void dispose() {
    _backgroundController.dispose();
    _formController.dispose();
    _scanController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      final parkingProvider = context.read<ParkingProvider>();
      final success = await parkingProvider.login(
        _emailController.text.trim(),
        _passwordController.text,
      );

      if (mounted) {
        setState(() {
          _isLoading = false;
        });

        if (!success && parkingProvider.error != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(parkingProvider.error!),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  void _biometricScan() async {
    setState(() {
      _isScanning = true;
    });

    _scanController.repeat();

    // Simulate biometric scan and auto-login
    await Future.delayed(const Duration(seconds: 3));

    if (mounted) {
      setState(() {
        _isScanning = false;
      });
      _scanController.stop();

      // Auto-login with demo credentials for biometric
      final parkingProvider = context.read<ParkingProvider>();
      await parkingProvider.login('demo@parking.com', 'password123');
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isDesktop = size.width > 768;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topLeft,
            radius: 2.0,
            colors: [
              const Color(0xFF1A1A2E),
              const Color(0xFF16213E),
              const Color(0xFF0F0F23),
              Colors.black,
            ],
          ),
        ),
        child: Stack(
          children: [
            // Animated Background
            _buildAnimatedBackground(),

            // Main Content
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(isDesktop ? 32 : 24),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      maxWidth: isDesktop ? 400 : double.infinity,
                    ),
                    child: AnimationLimiter(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: AnimationConfiguration.toStaggeredList(
                          duration: const Duration(milliseconds: 375),
                          childAnimationBuilder:
                              (widget) => SlideAnimation(
                                verticalOffset: 50.0,
                                child: FadeInAnimation(child: widget),
                              ),
                          children: [
                            _buildHeader(),
                            const SizedBox(height: 40),
                            _buildLoginForm(),
                            const SizedBox(height: 30),
                            _buildBiometricLogin(),
                            const SizedBox(height: 40),
                            _buildFooter(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAnimatedBackground() {
    return AnimatedBuilder(
      animation: _backgroundController,
      builder: (context, child) {
        return CustomPaint(
          painter: CircuitBoardPainter(_backgroundController.value),
          child: Container(),
        );
      },
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [const Color(0xFF00F5FF), const Color(0xFF0066FF)],
            ),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF00F5FF).withOpacity(0.3),
                blurRadius: 20,
                spreadRadius: 5,
              ),
            ],
          ),
          child: const Icon(Icons.local_parking, size: 50, color: Colors.white),
        ),
        const SizedBox(height: 24),
        AnimatedTextKit(
          animatedTexts: [
            TyperAnimatedText(
              'SMART PARKING',
              textStyle: GoogleFonts.orbitron(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF00F5FF),
                letterSpacing: 2,
              ),
              speed: const Duration(milliseconds: 100),
            ),
          ],
          isRepeatingAnimation: false,
        ),
        const SizedBox(height: 8),
        Text(
          'FUTURE CITY ACCESS',
          style: GoogleFonts.orbitron(
            fontSize: 14,
            fontWeight: FontWeight.w300,
            color: Colors.white70,
            letterSpacing: 3,
          ),
        ),
      ],
    );
  }

  Widget _buildLoginForm() {
    return GlassmorphicContainer(
      width: double.infinity,
      height: 350,
      borderRadius: 20,
      blur: 15,
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
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'SECURE LOGIN',
                style: GoogleFonts.orbitron(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF00F5FF),
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 24),
              _buildTextField(
                controller: _emailController,
                label: 'EMAIL',
                icon: Icons.email_outlined,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Email is required';
                  }
                  if (!value.contains('@')) {
                    return 'Enter a valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              _buildTextField(
                controller: _passwordController,
                label: 'PASSWORD',
                icon: Icons.lock_outline,
                isPassword: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Password is required';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 30),
              _buildLoginButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool isPassword = false,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: isPassword && !_isPasswordVisible,
      validator: validator,
      style: GoogleFonts.orbitron(color: Colors.white, fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.orbitron(
          color: Colors.white70,
          fontSize: 12,
          letterSpacing: 1,
        ),
        prefixIcon: Icon(icon, color: const Color(0xFF00F5FF)),
        suffixIcon:
            isPassword
                ? IconButton(
                  icon: Icon(
                    _isPasswordVisible
                        ? Icons.visibility_off
                        : Icons.visibility,
                    color: Colors.white70,
                  ),
                  onPressed: () {
                    setState(() {
                      _isPasswordVisible = !_isPasswordVisible;
                    });
                  },
                )
                : null,
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: const Color(0xFF00F5FF).withOpacity(0.3),
            width: 1,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF00F5FF), width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.red, width: 2),
        ),
        filled: true,
        fillColor: Colors.white.withOpacity(0.05),
      ),
    );
  }

  Widget _buildLoginButton() {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _login,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF00F5FF),
          foregroundColor: Colors.black,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 8,
        ),
        child:
            _isLoading
                ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    color: Colors.black,
                    strokeWidth: 2,
                  ),
                )
                : Text(
                  'ACCESS GRANTED',
                  style: GoogleFonts.orbitron(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 2,
                  ),
                ),
      ),
    );
  }

  Widget _buildBiometricLogin() {
    return Column(
      children: [
        Text(
          'OR',
          style: GoogleFonts.orbitron(
            fontSize: 12,
            fontWeight: FontWeight.w300,
            color: Colors.white70,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 20),
        GestureDetector(
          onTap: _isScanning ? null : _biometricScan,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors:
                    _isScanning
                        ? [const Color(0xFF00F5FF), const Color(0xFF0066FF)]
                        : [
                          const Color(0xFF00F5FF).withOpacity(0.2),
                          const Color(0xFF0066FF).withOpacity(0.1),
                        ],
              ),
              border: Border.all(
                color: const Color(0xFF00F5FF).withOpacity(0.5),
                width: 2,
              ),
              boxShadow:
                  _isScanning
                      ? [
                        BoxShadow(
                          color: const Color(0xFF00F5FF).withOpacity(0.5),
                          blurRadius: 20,
                          spreadRadius: 5,
                        ),
                      ]
                      : [],
            ),
            child:
                _isScanning
                    ? AnimatedBuilder(
                      animation: _scanController,
                      builder: (context, child) {
                        return Transform.rotate(
                          angle: _scanController.value * 2 * math.pi,
                          child: const Icon(
                            Icons.fingerprint,
                            size: 40,
                            color: Colors.white,
                          ),
                        );
                      },
                    )
                    : const Icon(
                      Icons.fingerprint,
                      size: 40,
                      color: Color(0xFF00F5FF),
                    ),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          _isScanning ? 'SCANNING...' : 'BIOMETRIC ACCESS',
          style: GoogleFonts.orbitron(
            fontSize: 10,
            fontWeight: FontWeight.w500,
            color: _isScanning ? const Color(0xFF00F5FF) : Colors.white70,
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }

  Widget _buildFooter() {
    return Column(
      children: [
        Text(
          'Secure • Encrypted • Future-Ready',
          style: GoogleFonts.orbitron(
            fontSize: 10,
            fontWeight: FontWeight.w300,
            color: Colors.white.withOpacity(0.4),
            letterSpacing: 1,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Smart Parking System v2.0',
          style: GoogleFonts.orbitron(
            fontSize: 8,
            fontWeight: FontWeight.w300,
            color: Colors.white.withOpacity(0.3),
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }
}

class CircuitBoardPainter extends CustomPainter {
  final double animationValue;

  CircuitBoardPainter(this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    final paint =
        Paint()
          ..color = const Color(0xFF00F5FF).withOpacity(0.1)
          ..strokeWidth = 1
          ..style = PaintingStyle.stroke;

    final glowPaint =
        Paint()
          ..color = const Color(0xFF00F5FF).withOpacity(0.3)
          ..strokeWidth = 3
          ..style = PaintingStyle.stroke
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 2);

    // Draw circuit lines
    for (int i = 0; i < 20; i++) {
      final startX = (size.width / 20) * i;
      final startY = size.height * (0.2 + (animationValue + i * 0.1) % 1 * 0.6);

      final path = Path();
      path.moveTo(startX, startY);
      path.lineTo(startX + 50, startY);
      path.lineTo(startX + 50, startY + 30);
      path.lineTo(startX + 100, startY + 30);

      canvas.drawPath(path, paint);

      // Add glow effect
      if ((animationValue * 10 + i) % 3 < 1) {
        canvas.drawPath(path, glowPaint);
      }
    }

    // Draw nodes
    for (int i = 0; i < 10; i++) {
      final x = (size.width / 10) * i;
      final y = size.height * (0.3 + (animationValue + i * 0.2) % 1 * 0.4);

      canvas.drawCircle(
        Offset(x, y),
        3,
        Paint()
          ..color = const Color(0xFF00F5FF).withOpacity(0.5)
          ..style = PaintingStyle.fill,
      );
    }
  }

  @override
  bool shouldRepaint(CircuitBoardPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
