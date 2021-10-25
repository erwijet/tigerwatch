import 'package:flutter/material.dart';

class SimpleTile extends StatelessWidget {
  final String contents;

  const SimpleTile(this.contents, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(contents);
  }
}
