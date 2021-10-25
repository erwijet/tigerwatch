import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:localstore/localstore.dart';
import 'package:flutter/material.dart';
import 'helpers.dart';
import 'package:http/http.dart' as http;
import 'package:socket_io_client/socket_io_client.dart' as IO;

class _Dates {
  static String getToday() {
    return DateFormat('y-MM-d').format(DateTime.now());
  }

  static String getSixMonthsPrior() {
    final today = DateTime.now();
    return DateFormat('y-MM-d').format(DateTime(today.year, today.month - 6, today.day));
  }
}

class Transaction {
  final String date;
  final String location;
  final double amount;
  final double balance;

  Transaction(
      {required this.date, required this.location, required this.amount, required this.balance});

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
        date: json['Date'],
        location: json['Description'],
        amount: double.parse(json['Amount']),
        balance: double.parse(json['Balance']));
  }
}

class TransactionUtil {
  static Future<List<Transaction>> fetchTransactions(
      BuildContext ctx, Function(bool) setLoadingCB) async {
    setLoadingCB(true);

    final skey = await Helpers.fetchStoredSkey();
    final startDate = _Dates.getSixMonthsPrior();
    final endDate = _Dates.getToday();

    final res = await http.get(Uri.parse(
        'https://tigerspend.rit.edu/statementdetail.php?cid=105&skey=$skey&format=csv&startdate=$startDate&enddate=$endDate&acct=4'));

    if (res.headers['x-server']?.contains('shib') ?? false) {
      // token expired
      await _promptShib();
      return await fetchTransactions(ctx, setLoadingCB);
    }

    final csvData = res.body;

    return (jsonDecode(csvData) as List<dynamic>)
        .where((e) => e.length == 4)
        .map((e) => Transaction.fromJson(e))
        .toList();

    // final storage = FlutterSecureStorage();
    // final creds = await Localstore.instance.collection('tigerwatch').doc('creds').get();

    // final shibUser = creds.shibUser;
    // final shibPass = creds.shibPass;

    // http.request req = http.request("post", uri.parse("https://tigerspend-proxy.herokuapp.com"));
    // req.body = '{"shibuser":"$shibuser","shibpass":"$shibpass"}';
    // req.headers.addall({'content-type': 'application/json'});

    // final res = await req.send();

    // if (res.statusCode == 200) {
    //   final resStr = await res.stream.bytesToString();
    //   return (jsonDecode(resStr) as List<dynamic>)
    //       .where((e) => e.length == 4)
    //       .map((e) => Transaction.fromJson(e))
    //       .toList();
    // }
  }

  static Future<bool> _promptShib() async {
    bool done = false;
    return Future(() async {
      try {
        // Configure socket transports must be sepecified
        final socket = IO.io('http://tigerwatch-shib.herokuapp.com:80', <String, dynamic>{
          'transports': ['websocket'],
          'autoConnect': false,
        });

        // Connect to websocket
        socket.connect();

        // Handle socket events
        socket.on('connect', (_) => print('connect: ${socket.id}'));
        socket.on('message', (data) {
          print('Message: $data');
        });
        socket.on('disconnect', (_) => print('disconnect'));
        socket.on('fromServer', (_) => print(_));
      } catch (e) {
        print(e.toString());
        throw e;
      }
    }
  });
}
