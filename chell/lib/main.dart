import 'package:flutter/material.dart';
import 'helpers.dart';

import 'pages/home.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const TigerSpendApp());
}

class TigerSpendApp extends StatelessWidget {
  const TigerSpendApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        theme: ThemeData(primarySwatch: const MaterialColor(0xFFF76902, Helpers.color)),
        title: 'TigerWatch',
        home: HomePage());
  }
}
