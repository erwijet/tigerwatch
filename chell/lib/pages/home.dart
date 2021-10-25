import 'package:flutter/material.dart';
import '../widgets/transactions_list_view.dart';
import '../transaction.dart';
import '../helpers.dart';

class HomePage extends StatefulWidget {
  final transactionHistoryValueNotifier = ValueNotifier<List<Transaction>>([]);
  bool isLoading = false;

  HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  void setLoading(bool v) {
    setState(() {
      widget.isLoading = v;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Dining Dollar History"),
        ),
        body: ValueListenableBuilder<List<Transaction>>(
            valueListenable: widget.transactionHistoryValueNotifier,
            builder: (ctx, value, child) => TransactionsListView(
                widget.transactionHistoryValueNotifier, () => widget.isLoading)),
        drawer: Drawer(
            child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
                margin: EdgeInsets.zero,
                padding: EdgeInsets.zero,
                decoration: BoxDecoration(
                    color: Helpers.tigerOrange,
                    image: DecorationImage(
                        fit: BoxFit.scaleDown,
                        image: AssetImage('images/tigerwatch_drawer_header.png'))),
                child: Text("")),
            ListTile(
              title: const Text('Logout'),
              onTap: () async {
                await Helpers.setStoredSkey('');
                Helpers.showMessage('Logout', 'You have been logged out', context);
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: const Text('About'),
              onTap: () {
                Navigator.pop(context);
              },
            )
          ],
        )),
        floatingActionButton: FloatingActionButton(
            child: const Icon(Icons.sync),
            onPressed: () async {
              widget.transactionHistoryValueNotifier.value = []; // trigger spinner to start
              widget.transactionHistoryValueNotifier.value =
                  await TransactionUtil.fetchTransactions(context, setLoading);
            }));
  }
}
