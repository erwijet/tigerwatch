import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'main_list.dart';
import '../transaction.dart';

class TransactionsListView extends StatefulWidget {
  final ValueListenable<List<Transaction>> transactionsListenable;
  final bool Function() getLoadingState;

  bool get isLoading {
    return getLoadingState();
  }

  const TransactionsListView(this.transactionsListenable, this.getLoadingState, {Key? key})
      : super(key: key);

  @override
  _TransactionsListViewState createState() => _TransactionsListViewState();
}

class _TransactionsListViewState extends State<TransactionsListView> {
  @override
  Widget build(BuildContext context) {
    if (widget.isLoading) {
      return const Center(child: CircularProgressIndicator());
    } else if (widget.transactionsListenable.value.isEmpty) {
      return const Center(child: Text('No records to display. Try refreshing?'));
    } else {
      return MainList(widget.transactionsListenable.value);
    }
  }
}
