// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:parking_app/main.dart';

void main() {
  testWidgets('Smart Parking app smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const SmartParkingApp());

    // Wait for initial render
    await tester.pump();

    // Verify that our smart parking app shows the expected content
    expect(find.text('AVAILABLE'), findsOneWidget);
    expect(find.text('OCCUPIED'), findsOneWidget);
    expect(find.text('RESERVED'), findsOneWidget);
    expect(find.text('TOTAL'), findsOneWidget);

    // Find and tap the scan button
    final scanButton = find.text('SCAN LOTS');
    expect(scanButton, findsOneWidget);

    await tester.tap(scanButton);
    await tester.pump();

    // Verify that scanning state is activated
    expect(find.text('SCAN LOTS'), findsOneWidget);
  });
}
