import 'package:flutter/material.dart';
import '../transaction.dart';

class MainList extends StatefulWidget {
  final List<Transaction> spendingData;
  const MainList(this.spendingData, {Key? key}) : super(key: key);

  @override
  _MainListState createState() => _MainListState();
}

class _MainListState extends State<MainList> {
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        itemCount: (widget.spendingData.length * 2).floor(),
        padding: const EdgeInsets.all(16.0),
        itemBuilder: (context, i) {
          if (i.isOdd) return const Divider();

          final idx = i ~/ 2;

          return ListTile(
            subtitle: Text('\$${widget.spendingData[idx].balance} left'),
            dense: true,
            title: Text(
                '${widget.spendingData[idx].amount} at ${widget.spendingData[idx].location}',
                style: const TextStyle(fontSize: 18.0)),
          );
        });
  }
}
