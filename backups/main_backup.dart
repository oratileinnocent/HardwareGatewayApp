import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

void main() {
  runApp(const HardwareGatewayApp());
}

const Color bg = Color(0xFF0B1020);
const Color panel = Color(0xFF151D30);
const Color accent = Color(0xFF55D6BE);
const Color muted = Color(0xFF9AA8C2);

class HardwareGatewayApp extends StatelessWidget {
  const HardwareGatewayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Hardware Gateway',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: bg,
        colorScheme: ColorScheme.fromSeed(
          seedColor: accent,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      home: const GatewayHome(),
    );
  }
}

class GatewayHome extends StatefulWidget {
  const GatewayHome({super.key});

  @override
  State<GatewayHome> createState() => _GatewayHomeState();
}

class _GatewayHomeState extends State<GatewayHome> {
  // ESP32 gateway connection.
  final TextEditingController _addressController = TextEditingController(
    text: '192.168.4.1',
  );

  final TextEditingController _keyboardController = TextEditingController();

  WebSocketChannel? _channel;
  StreamSubscription? _subscription;

  bool _connected = false;
  bool _connecting = false;
  String _status = 'Not connected';

  // Windows PC screen connection.
  static const String _screenServerAddress = '192.168.4.3';

  WebSocketChannel? _screenChannel;
  StreamSubscription? _screenSubscription;

  Uint8List? _screenFrame;
  bool _screenConnecting = false;
  String _screenStatus = 'Screen not connected';

  // Connect to the ESP32 HID WebSocket.
  Future<void> _connect() async {
    if (_connecting || _connected) return;

    final address = _addressController.text.trim();

    if (address.isEmpty) {
      _showMessage('Enter the ESP32 IP address.');
      return;
    }

    setState(() {
      _connecting = true;
      _status = 'Connecting...';
    });

    WebSocketChannel? candidate;

    try {
      final channel = WebSocketChannel.connect(Uri.parse('ws://$address/ws'));

      candidate = channel;

      await channel.ready.timeout(const Duration(seconds: 10));

      if (!mounted) {
        await channel.sink.close();
        return;
      }

      _channel = channel;

      _subscription = channel.stream.listen(
        (message) {
          // ESP32 status messages can be handled here later.
        },
        onError: (Object error) {
          if (!mounted) return;

          setState(() {
            _connected = false;
            _status = 'Connection error';
          });
        },
        onDone: () {
          if (!mounted) return;

          setState(() {
            _connected = false;
            _status = 'Disconnected';
          });
        },
      );

      setState(() {
        _connected = true;
        _status = 'Gateway connected';
      });
    } catch (error) {
      await candidate?.sink.close();

      if (!mounted) return;

      setState(() {
        _connected = false;
        _status = 'Connection failed';
      });

      _showMessage('Could not connect. Check ESP32 Wi-Fi and IP address.');
    } finally {
      if (mounted) {
        setState(() => _connecting = false);
      }
    }
  }

  Future<void> _disconnect() async {
    final subscription = _subscription;
    final channel = _channel;

    _subscription = null;
    _channel = null;

    await subscription?.cancel();
    await channel?.sink.close();

    if (!mounted) return;

    setState(() {
      _connected = false;
      _status = 'Disconnected';
    });
  }

  // Send commands to the ESP32.
  void _send(Map<String, dynamic> data) {
    if (!_connected || _channel == null) return;

    try {
      _channel!.sink.add(jsonEncode(data));
    } catch (error) {
      if (!mounted) return;

      setState(() {
        _connected = false;
        _status = 'Connection error';
      });
    }
  }

  void _moveMouse(Offset delta) {
    if (!_connected) return;

    _send({
      't': 'm',
      'dx': (delta.dx * 2).round(),
      'dy': (delta.dy * 2).round(),
    });
  }

  void _mouseButton(int button, bool pressed) {
    _send({'t': 'b', 'btn': button, 'state': pressed ? 1 : 0});
  }

  void _scroll(int amount) {
    _send({'t': 'w', 'w': amount});
  }

  void _sendText() {
    if (!_connected) {
      _showMessage('Connect to the gateway first.');
      return;
    }

    final text = _keyboardController.text;

    for (final rune in text.runes) {
      if (rune >= 32 && rune <= 126) {
        _send({'t': 'k', 'key': String.fromCharCode(rune), 'mod': 0});
      }
    }

    _keyboardController.clear();
  }

  void _macro(String id) {
    _send({'t': 'cmd', 'id': id});
  }

  // Connect independently to the Windows screen server.
  Future<void> _connectScreen() async {
    if (_screenConnecting || _screenChannel != null) return;

    setState(() {
      _screenConnecting = true;
      _screenStatus = 'Connecting to PC screen...';
    });

    WebSocketChannel? candidate;

    try {
      final channel = WebSocketChannel.connect(
        Uri.parse('ws://$_screenServerAddress:8765'),
      );

      candidate = channel;

      await channel.ready.timeout(const Duration(seconds: 10));

      if (!mounted) {
        await channel.sink.close();
        return;
      }

      _screenChannel = channel;

      _screenSubscription = channel.stream.listen(
        (message) {
          if (message is List<int> && mounted) {
            setState(() {
              _screenFrame = Uint8List.fromList(message);
              _screenStatus = 'Live screen connected';
            });
          }
        },
        onError: (Object error) {
          if (!mounted) return;

          setState(() {
            _screenStatus = 'Screen connection error';
            _screenChannel = null;
            _screenFrame = null;
          });

          _showMessage('Screen stream error. Check the Python server.');
        },
        onDone: () {
          if (!mounted) return;

          setState(() {
            _screenStatus = 'Screen disconnected';
            _screenChannel = null;
            _screenFrame = null;
          });
        },
      );

      setState(() {
        _screenStatus = 'Connected; waiting for first frame...';
      });
    } catch (error) {
      await candidate?.sink.close();

      if (!mounted) return;

      setState(() {
        _screenChannel = null;
        _screenFrame = null;
        _screenStatus = 'Could not connect to PC';
      });

      _showMessage(
        'Cannot connect to PC screen. '
        'Check the PC IP and screen_server.py.',
      );
    } finally {
      if (mounted) {
        setState(() => _screenConnecting = false);
      }
    }
  }

  Future<void> _disconnectScreen() async {
    final subscription = _screenSubscription;
    final channel = _screenChannel;

    _screenSubscription = null;
    _screenChannel = null;

    await subscription?.cancel();
    await channel?.sink.close();

    if (!mounted) return;

    setState(() {
      _screenFrame = null;
      _screenStatus = 'Screen not connected';
    });
  }

  void _showMessage(String message) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), behavior: SnackBarBehavior.floating),
    );
  }

  @override
  void dispose() {
    _subscription?.cancel();
    _channel?.sink.close();

    _screenSubscription?.cancel();
    _screenChannel?.sink.close();

    _addressController.dispose();
    _keyboardController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: bg,
        title: const Row(
          children: [
            Icon(Icons.memory, color: accent, size: 30),
            SizedBox(width: 10),
            Text(
              'Hardware Gateway',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _connectionCard(),
            const SizedBox(height: 22),

            _sectionTitle('REMOTE TOUCHPAD', Icons.touch_app),
            const SizedBox(height: 10),
            _touchpad(),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _mouseButtonWidget('Left click', Icons.ads_click, 1),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _mouseButtonWidget('Right click', Icons.mouse, 2),
                ),
              ],
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: _actionButton(
                    'Scroll up',
                    Icons.keyboard_arrow_up,
                    () => _scroll(-3),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _actionButton(
                    'Scroll down',
                    Icons.keyboard_arrow_down,
                    () => _scroll(3),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            _sectionTitle('KEYBOARD', Icons.keyboard_alt_outlined),
            const SizedBox(height: 10),
            _keyboardCard(),
            const SizedBox(height: 24),

            _sectionTitle('SHORTCUTS', Icons.bolt),
            const SizedBox(height: 10),
            _shortcutsCard(),
            const SizedBox(height: 24),

            _sectionTitle('PC SCREEN', Icons.desktop_windows),
            const SizedBox(height: 10),
            _screenPlaceholder(),
            const SizedBox(height: 20),

            const Center(
              child: Text(
                'PJD301B • ESP32-S3 N8R2',
                style: TextStyle(color: muted, fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _connectionCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: panel,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _connected ? accent : Colors.white12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                _connected ? Icons.wifi : Icons.wifi_off,
                color: _connected ? accent : muted,
                size: 28,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'ESP32-S3 Gateway',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _status,
                      style: TextStyle(
                        color: _connected ? accent : muted,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _connected ? accent : Colors.orangeAccent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          TextField(
            controller: _addressController,
            enabled: !_connected && !_connecting,
            keyboardType: TextInputType.url,
            decoration: const InputDecoration(
              labelText: 'Gateway IP address',
              prefixIcon: Icon(Icons.router),
              border: OutlineInputBorder(),
              isDense: true,
            ),
          ),
          const SizedBox(height: 12),

          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _connecting
                  ? null
                  : (_connected ? _disconnect : _connect),
              icon: Icon(_connected ? Icons.link_off : Icons.link),
              label: Text(
                _connecting
                    ? 'Connecting...'
                    : (_connected ? 'Disconnect' : 'Connect to gateway'),
              ),
              style: FilledButton.styleFrom(
                backgroundColor: accent,
                foregroundColor: bg,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
          const SizedBox(height: 8),

          const Text(
            'Connect your phone to the ESP32-Gateway Wi-Fi first.',
            style: TextStyle(color: muted, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: accent, size: 21),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 13,
            letterSpacing: 1.2,
            fontWeight: FontWeight.bold,
            color: muted,
          ),
        ),
      ],
    );
  }

  Widget _touchpad() {
    return Container(
      height: 210,
      decoration: BoxDecoration(
        color: panel,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white12),
      ),
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onPanUpdate: (details) => _moveMouse(details.delta),
        child: const Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.touch_app, color: accent, size: 42),
              SizedBox(height: 10),
              Text(
                'Touch and drag to move the cursor',
                style: TextStyle(color: muted),
              ),
              SizedBox(height: 5),
              Text(
                'Use the buttons below to click',
                style: TextStyle(color: muted, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _mouseButtonWidget(String label, IconData icon, int button) {
    return GestureDetector(
      onTapDown: (_) => _mouseButton(button, true),
      onTapUp: (_) => _mouseButton(button, false),
      onTapCancel: () => _mouseButton(button, false),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 17),
        decoration: BoxDecoration(
          color: panel,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white12),
        ),
        child: Column(
          children: [
            Icon(icon, color: accent),
            const SizedBox(height: 6),
            Text(label),
          ],
        ),
      ),
    );
  }

  Widget _actionButton(String label, IconData icon, VoidCallback action) {
    return OutlinedButton.icon(
      onPressed: _connected ? action : null,
      icon: Icon(icon),
      label: Text(label),
      style: OutlinedButton.styleFrom(
        foregroundColor: accent,
        padding: const EdgeInsets.symmetric(vertical: 13),
      ),
    );
  }

  Widget _keyboardCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: panel,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          TextField(
            controller: _keyboardController,
            enabled: _connected,
            onSubmitted: (_) => _sendText(),
            decoration: const InputDecoration(
              hintText: 'Type text to send to the PC',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.edit),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _connected ? _sendText : null,
              icon: const Icon(Icons.send),
              label: const Text('Send text'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _shortcutsCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: panel,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          _shortcutRow('Switch windows', Icons.flip, 'ALT_TAB'),
          const Divider(color: Colors.white12),
          _shortcutRow('Copy', Icons.copy, 'CTRL_C'),
          const Divider(color: Colors.white12),
          _shortcutRow('Paste', Icons.content_paste, 'CTRL_V'),
          const Divider(color: Colors.white12),
          _shortcutRow('Windows key', Icons.window, 'WIN_L'),
        ],
      ),
    );
  }

  Widget _shortcutRow(String label, IconData icon, String command) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: accent),
      title: Text(label),
      trailing: const Icon(Icons.arrow_forward_ios, size: 15, color: muted),
      onTap: _connected
          ? () => _macro(command)
          : () => _showMessage('Connect to the gateway first.'),
    );
  }

  Widget _screenPlaceholder() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white12),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          Container(
            color: panel,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                const Icon(Icons.desktop_windows, color: accent),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    _screenStatus,
                    style: const TextStyle(fontSize: 12),
                  ),
                ),
                Icon(
                  _screenFrame != null ? Icons.circle : Icons.circle_outlined,
                  color: _screenFrame != null ? accent : muted,
                  size: 12,
                ),
              ],
            ),
          ),
          AspectRatio(
            aspectRatio: 16 / 9,
            child: _screenFrame != null
                ? Image.memory(
                    _screenFrame!,
                    fit: BoxFit.contain,
                    gaplessPlayback: true,
                    errorBuilder: (context, error, stackTrace) {
                      return const Center(
                        child: Text(
                          'Could not display screen frame',
                          style: TextStyle(color: muted),
                        ),
                      );
                    },
                  )
                : const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.desktop_access_disabled,
                          size: 42,
                          color: muted,
                        ),
                        SizedBox(height: 10),
                        Text(
                          'PC screen preview',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 6),
                        Text(
                          'Connect to start viewing',
                          style: TextStyle(color: muted, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: _screenConnecting
                    ? null
                    : (_screenChannel != null
                          ? _disconnectScreen
                          : _connectScreen),
                icon: Icon(
                  _screenConnecting
                      ? Icons.hourglass_top
                      : (_screenChannel != null
                            ? Icons.stop_circle_outlined
                            : Icons.play_circle_outline),
                ),
                label: Text(
                  _screenConnecting
                      ? 'Connecting...'
                      : (_screenChannel != null
                            ? 'Stop screen sharing'
                            : 'Connect to PC screen'),
                ),
                style: FilledButton.styleFrom(
                  backgroundColor: accent,
                  foregroundColor: bg,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
