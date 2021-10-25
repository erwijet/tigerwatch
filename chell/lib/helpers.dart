import 'package:flutter/material.dart';
import 'package:localstore/localstore.dart';
import 'pages/login.dart';

class Helpers {
  static Future<String?> fetchStoredSkey() async {
    final store = Localstore.instance;
    final doc = await store.collection('tigerwatch').doc('skey').get();
    final String? skey = doc?['skey'] as String?;

    return skey;
  }

  static Future<void> setStoredSkey(String skey) async {
    final store = Localstore.instance;
    await store.collection('tigerwatch').doc('skey').set({skey: skey});
  }

  static void showMessage(String title, String msg, BuildContext ctx) {
    showDialog<String>(
        context: ctx,
        builder: (BuildContext ctx) => AlertDialog(
                title: const Text('Unable to Find Data'),
                content: Text(msg),
                actions: <Widget>[
                  TextButton(
                      onPressed: () => Navigator.pop(ctx, 'Dismiss'), child: const Text('Dismiss')),
                ]));
  }

  static const tigerOrange = Color.fromARGB(255, 247, 105, 2);
  static const Map<int, Color> color = {
    50: tigerOrange,
    100: tigerOrange,
    200: tigerOrange,
    300: tigerOrange,
    400: tigerOrange,
    500: tigerOrange,
    600: tigerOrange,
    700: tigerOrange,
    800: tigerOrange,
    900: tigerOrange,
  };
}
