import 'package:flutter/material.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const LoginBox();
  }
}

class LoginBox extends StatefulWidget {
  const LoginBox({Key? key}) : super(key: key);

  @override
  _LoginBoxState createState() => _LoginBoxState();
}

class _LoginBoxState extends State<LoginBox> {
  final ritIdTextController = TextEditingController();
  final passwordTextController = TextEditingController();

  @override
  void dispose() {
    ritIdTextController.dispose();
    passwordTextController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Update Login')),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  Material(
                      child: TextField(
                    controller: ritIdTextController,
                    decoration:
                        const InputDecoration(border: OutlineInputBorder(), labelText: 'RIT ID'),
                  )),
                  const SizedBox(height: 16.0),
                  Material(
                      child: TextField(
                    obscureText: true,
                    controller: passwordTextController,
                    decoration:
                        const InputDecoration(border: OutlineInputBorder(), labelText: 'Password'),
                  )),
                  const SizedBox(height: 16.0),
                  SizedBox(
                      width: double.infinity, // match parent
                      child: ElevatedButton(
                        onPressed: () async {
                          final shibUser = ritIdTextController.text;
                          final shibPass = passwordTextController.text;
                          // Localstore.instance
                          //     .collection('tigerwatch')
                          //     .doc('creds')
                          //     .set({'shibUser': shibUser, 'shibPass': shibPass});
                          Navigator.pop(context);
                        },
                        child: const Text("Update"),
                      ))
                ])));
  }
}
