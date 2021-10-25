import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:localstore/localstore.dart';
import 'package:intl/date_symbol_data_local.dart';

typedef AsyncVoidFunction = Future<void> Function();

String formatDate(DateTime date) => DateFormat('yyyy-MM-dd').format(date);

Future<String> fetchCSV(AsyncVoidFunction onInvalidSKey) async {
  final store = Localstore.instance;
  final skey = (await store.collection('tigerwatch').doc('skey').get()) ?? {}['skey'];

  final today = DateTime.now();
  final sixMonthsAgo = DateTime(today.year, today.month - 6, today.day);

  if (skey == null || skey == '') {
    await onInvalidSKey();
    return await fetchCSV(onInvalidSKey);
  }

  final req = http.Request(
      "get",
      Uri.parse(
          "https://tigerspend.rit.edu/statementdetail.php?cid=105&skey=$skey&format=csv&startdate=$sixMonthsAgo&enddate=$today&acct=4"));

  final res = await req.send();

  if (res.statusCode == 200) {
    return await res.stream.bytesToString();
  } else {
    print(res);
  }

  return '';
  // http.Request req = http.Request(
  //     "post",
  //     Uri.parse(
  //         "https://tigerspend.rit.edu/statementdetail.php?cid=105&skey=$skey&format=csv&startdate=2021-04-01&enddate=2021-10-30&acct=4"));
  // req.headers.addAll({'content-type': 'application/json'});

  // final res = await req.send();

  // if (res.statusCode == 200) {
  //   final resStr = await res.stream.bytesToString();
  //   return (jsonDecode(resStr) as List<dynamic>)
  //       .where((e) => e.length == 4)
  //       .map((e) => Transaction.fromJson(e))
  //       .toList();
  // }
}
