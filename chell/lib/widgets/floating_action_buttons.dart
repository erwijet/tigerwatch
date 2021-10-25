import 'package:flutter/material.dart';
import '../pages/login.dart';

@Deprecated("Deprecated, use HomePage.Drawer to edit login details")
class UpdateLoginDetailsFloatingActionButton extends StatelessWidget {
  const UpdateLoginDetailsFloatingActionButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
        child: const Icon(Icons.sync),
        onPressed: () =>
            Navigator.push(context, MaterialPageRoute(builder: (ctx) => const LoginPage())));
  }
}

class RefreshSpendingDataFloatingActionButton extends StatelessWidget {
  final Widget reloadableWidget;
  const RefreshSpendingDataFloatingActionButton(this.reloadableWidget, {Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton(
      child: const Icon(Icons.sync),
      onPressed: () => {},
    );
  }
}
