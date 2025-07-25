import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:glassmorphism/glassmorphism.dart';

class FuturisticButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final Color? color;
  final Color? textColor;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double? height;

  const FuturisticButton({
    super.key,
    required this.text,
    this.onPressed,
    this.color,
    this.textColor,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height,
  });

  @override
  State<FuturisticButton> createState() => _FuturisticButtonState();
}

class _FuturisticButtonState extends State<FuturisticButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.color ?? const Color(0xFF00F5FF);
    final textColor = widget.textColor ?? Colors.black;

    return GestureDetector(
      onTapDown: (_) => _animationController.forward(),
      onTapUp: (_) => _animationController.reverse(),
      onTapCancel: () => _animationController.reverse(),
      onTap: widget.isLoading ? null : widget.onPressed,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              width: widget.width,
              height: widget.height ?? 50,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [color, color.withOpacity(0.8)],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.3),
                    blurRadius: 8,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Center(
                child:
                    widget.isLoading
                        ? SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: textColor,
                            strokeWidth: 2,
                          ),
                        )
                        : Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (widget.icon != null) ...[
                              Icon(widget.icon, color: textColor, size: 18),
                              const SizedBox(width: 8),
                            ],
                            Text(
                              widget.text,
                              style: GoogleFonts.orbitron(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                                letterSpacing: 1,
                              ),
                            ),
                          ],
                        ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class GlassCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? borderColor;
  final double borderRadius;

  const GlassCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderColor,
    this.borderRadius = 20,
  });

  @override
  Widget build(BuildContext context) {
    final color = borderColor ?? const Color(0xFF00F5FF);

    return Container(
      width: width,
      height: height,
      margin: margin,
      child: GlassmorphicContainer(
        width: width ?? double.infinity,
        height: height ?? double.infinity,
        borderRadius: borderRadius,
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
        child: Padding(
          padding: padding ?? const EdgeInsets.all(20),
          child: child,
        ),
      ),
    );
  }
}

class FuturisticTextField extends StatefulWidget {
  final TextEditingController controller;
  final String label;
  final String? hint;
  final IconData? icon;
  final bool isPassword;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;
  final VoidCallback? onTap;
  final bool readOnly;

  const FuturisticTextField({
    super.key,
    required this.controller,
    required this.label,
    this.hint,
    this.icon,
    this.isPassword = false,
    this.validator,
    this.keyboardType,
    this.onTap,
    this.readOnly = false,
  });

  @override
  State<FuturisticTextField> createState() => _FuturisticTextFieldState();
}

class _FuturisticTextFieldState extends State<FuturisticTextField> {
  bool _isPasswordVisible = false;
  bool _isFocused = false;

  @override
  Widget build(BuildContext context) {
    return Focus(
      onFocusChange: (hasFocus) {
        setState(() {
          _isFocused = hasFocus;
        });
      },
      child: TextFormField(
        controller: widget.controller,
        obscureText: widget.isPassword && !_isPasswordVisible,
        validator: widget.validator,
        keyboardType: widget.keyboardType,
        onTap: widget.onTap,
        readOnly: widget.readOnly,
        style: GoogleFonts.orbitron(color: Colors.white, fontSize: 14),
        decoration: InputDecoration(
          labelText: widget.label,
          hintText: widget.hint,
          labelStyle: GoogleFonts.orbitron(
            color: _isFocused ? const Color(0xFF00F5FF) : Colors.white70,
            fontSize: 12,
            letterSpacing: 1,
          ),
          hintStyle: GoogleFonts.orbitron(
            color: Colors.white.withOpacity(0.5),
            fontSize: 12,
          ),
          prefixIcon:
              widget.icon != null
                  ? Icon(
                    widget.icon,
                    color:
                        _isFocused ? const Color(0xFF00F5FF) : Colors.white70,
                  )
                  : null,
          suffixIcon:
              widget.isPassword
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
      ),
    );
  }
}

class StatusChip extends StatelessWidget {
  final String label;
  final Color color;
  final IconData? icon;
  final bool isActive;

  const StatusChip({
    super.key,
    required this.label,
    required this.color,
    this.icon,
    this.isActive = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: color.withOpacity(isActive ? 0.3 : 0.1),
        border: Border.all(
          color: color.withOpacity(isActive ? 1.0 : 0.5),
          width: isActive ? 2 : 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: color),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: GoogleFonts.orbitron(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: color,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}

class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;
  final String? message;

  const LoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
    this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Container(
            color: Colors.black.withOpacity(0.7),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(color: Color(0xFF00F5FF)),
                  if (message != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      message!,
                      style: GoogleFonts.orbitron(
                        color: Colors.white,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class EmptyStateWidget extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String? actionText;
  final VoidCallback? onAction;

  const EmptyStateWidget({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    this.actionText,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: Colors.white.withOpacity(0.3)),
          const SizedBox(height: 16),
          Text(
            title,
            style: GoogleFonts.orbitron(
              fontSize: 18,
              color: Colors.white70,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: GoogleFonts.orbitron(
              fontSize: 14,
              color: Colors.white.withOpacity(0.5),
            ),
            textAlign: TextAlign.center,
          ),
          if (actionText != null && onAction != null) ...[
            const SizedBox(height: 24),
            FuturisticButton(
              text: actionText!,
              onPressed: onAction,
              icon: Icons.add,
            ),
          ],
        ],
      ),
    );
  }
}
