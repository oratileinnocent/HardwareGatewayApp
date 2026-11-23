import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const HardwareGatewayApp());
}

// Discovered Server Model
class DiscoveredServer {
  final String hostname;
  final String ip;
  final int port;
  final DateTime lastSeen;

  const DiscoveredServer({
    required this.hostname,
    required this.ip,
    required this.port,
    required this.lastSeen,
  });

  String get address => '$ip:$port';
}

// Modern Cyber-Slate Palette
const Color kBgColor = Color(0xFF090D16);
const Color kCardColor = Color(0xFF131A2B);
const Color kCardBorder = Color(0xFF1F2B45);
const Color kAccentColor = Color(0xFF00F2FE);
const Color kMintColor = Color(0xFF55D6BE);
const Color kMutedColor = Color(0xFF8F9EB8);
const Color kErrorColor = Color(0xFFFF5252);
const Color kWarningColor = Color(0xFFFFB300);

class HardwareGatewayApp extends StatelessWidget {
  const HardwareGatewayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Hardware Gateway',
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: kBgColor,
        colorScheme: const ColorScheme.dark(
          primary: kAccentColor,
          secondary: kMintColor,
          surface: kCardColor,
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
  // ESP32 Hardware Gateway Connection
  final TextEditingController _espAddressController = TextEditingController(
    text: '192.168.4.1',
  );
  WebSocketChannel? _espChannel;
  StreamSubscription? _espSubscription;
  bool _espConnected = false;
  bool _espConnecting = false;

  // PC Screen Streamer Connection
  final TextEditingController _screenAddressController = TextEditingController(
    text: '10.2.39.171:8765',
  );
  final TextEditingController _screenTokenController = TextEditingController(
    text: 'CHANGE_THIS_TOKEN_9f3d7c2a',
  );
  WebSocketChannel? _screenChannel;
  StreamSubscription? _screenSubscription;
  Uint8List? _screenFrame;
  bool _screenConnected = false;
  bool _screenConnecting = false;
  String _screenStatus = 'Screen offline';

  // UDP Auto-Discovery & Auto-Reconnect
  RawDatagramSocket? _udpSocket;
  Timer? _discoveryBroadcastTimer;
  DiscoveredServer? _discoveredServer;
  bool _isScanning = false;
  bool _autoReconnect = true;
  Timer? _reconnectTimer;

  // Real PC Cursor visibility & auto-fade state with zero-jank ValueNotifiers
  final ValueNotifier<Offset> _cursorPosNotifier = ValueNotifier<Offset>(const Offset(0.5, 0.5)); // normalized [0.0 - 1.0]
  final ValueNotifier<bool> _cursorVisibleNotifier = ValueNotifier<bool>(false);
  final ValueNotifier<bool> _isClickingNotifier = ValueNotifier<bool>(false);

  Offset get _cursorPos => _cursorPosNotifier.value;
  bool get _cursorVisible => _cursorVisibleNotifier.value;
  bool get _isClicking => _isClickingNotifier.value;

  Timer? _cursorFadeTimer;
  Timer? _clickRippleTimer;

  // Sub-pixel fractional accumulators: eliminates dead zones & preserves micro-movements
  double _accumulatedDx = 0.0;
  double _accumulatedDy = 0.0;

  // Multi-touch tracking for 2-finger scroll
  final Map<int, Offset> _pointerPositions = {};
  Offset? _lastTwoFingerCenter;
  double _scrollAccumulator = 0.0;

  // Fullscreen view toggle
  bool _isFullscreen = false;

  // Trackpad sensitivity (1.0 = calibrated high-responsiveness glide)
  double _mouseSensitivity = 1.0;

  @override
  void initState() {
    super.initState();
    _startUdpDiscovery();
    // Auto-connect to screen server on launch
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _connectScreen();
    });
  }

  void _showCursorWithAutoFade() {
    _cursorFadeTimer?.cancel();
    if (!_cursorVisibleNotifier.value) {
      _cursorVisibleNotifier.value = true;
    }
    _cursorFadeTimer = Timer(const Duration(milliseconds: 2500), () {
      if (mounted) {
        _cursorVisibleNotifier.value = false;
      }
    });
  }

  @override
  void dispose() {
    _discoveryBroadcastTimer?.cancel();
    _reconnectTimer?.cancel();
    _udpSocket?.close();
    _cursorFadeTimer?.cancel();
    _clickRippleTimer?.cancel();
    _espSubscription?.cancel();
    _espChannel?.sink.close();
    _screenSubscription?.cancel();
    _screenChannel?.sink.close();
    _cursorPosNotifier.dispose();
    _cursorVisibleNotifier.dispose();
    _isClickingNotifier.dispose();
    _espAddressController.dispose();
    _screenAddressController.dispose();
    _screenTokenController.dispose();
    super.dispose();
  }

  // ===========================================================================
  // ESP32 GATEWAY CONNECTION
  // ===========================================================================
  Future<void> _connectEsp() async {
    if (_espConnecting || _espConnected) return;

    final address = _espAddressController.text.trim();
    if (address.isEmpty) {
      _showMessage('Enter ESP32 Gateway IP address');
      return;
    }

    setState(() => _espConnecting = true);

    try {
      final channel = WebSocketChannel.connect(Uri.parse('ws://$address/ws'));
      await channel.ready.timeout(const Duration(seconds: 6));

      if (!mounted) {
        await channel.sink.close();
        return;
      }

      _espChannel = channel;
      _espSubscription = channel.stream.listen(
        (msg) {},
        onError: (_) {
          if (!mounted) return;
          setState(() {
            _espConnected = false;
            _espChannel = null;
          });
          _showMessage('ESP32 Gateway connection error');
        },
        onDone: () {
          if (!mounted) return;
          setState(() {
            _espConnected = false;
            _espChannel = null;
          });
        },
      );

      setState(() => _espConnected = true);
      _showMessage('Connected to ESP32 Gateway');
    } catch (_) {
      if (!mounted) return;
      setState(() => _espConnected = false);
      _showMessage('Cannot connect to ESP32. Check Wi-Fi connection.');
    } finally {
      if (mounted) setState(() => _espConnecting = false);
    }
  }

  Future<void> _disconnectEsp() async {
    final sub = _espSubscription;
    final ch = _espChannel;
    _espSubscription = null;
    _espChannel = null;
    await sub?.cancel();
    await ch?.sink.close();
    if (mounted) setState(() => _espConnected = false);
  }

  void _sendEsp(Map<String, dynamic> data) {
    if (!_espConnected || _espChannel == null) return;
    try {
      _espChannel!.sink.add(jsonEncode(data));
    } catch (_) {
      if (mounted) setState(() => _espConnected = false);
    }
  }

  // ===========================================================================
  // UDP AUTO-DISCOVERY SERVICE (AUTO-FINDS ANY PC ON ANY NETWORK)
  // ===========================================================================
  Future<void> _startUdpDiscovery() async {
    try {
      _udpSocket?.close();
      final socket = await RawDatagramSocket.bind(InternetAddress.anyIPv4, 0);
      socket.broadcastEnabled = true;
      _udpSocket = socket;

      socket.listen((RawSocketEvent event) {
        if (event == RawSocketEvent.read) {
          final datagram = socket.receive();
          if (datagram != null) {
            _handleDiscoveryDatagram(datagram);
          }
        }
      });

      // Send initial discovery requests
      _sendDiscoveryPing();

      // Periodic background scan every 3.5s while disconnected
      _discoveryBroadcastTimer?.cancel();
      _discoveryBroadcastTimer = Timer.periodic(const Duration(milliseconds: 3500), (_) {
        if (!_screenConnected) {
          _sendDiscoveryPing();
        }
      });
    } catch (_) {}
  }

  void _sendDiscoveryPing() {
    if (_udpSocket == null) return;
    try {
      final ping = utf8.encode(jsonEncode({'type': 'discover_request'}));
      // Broadcast on standard UDP port 8768
      _udpSocket!.send(ping, InternetAddress('255.255.255.255'), 8768);
      _udpSocket!.send(ping, InternetAddress('127.0.0.1'), 8768);
    } catch (_) {}
  }

  void _handleDiscoveryDatagram(Datagram datagram) {
    try {
      final text = utf8.decode(datagram.data, allowMalformed: true);
      final json = jsonDecode(text);
      if (json is Map && json['type'] == 'server_beacon') {
        final hostname = json['hostname']?.toString() ?? 'PC';
        final wsPort = (json['ws_port'] as num?)?.toInt() ?? 8765;
        final ips = (json['ips'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [];

        String chosenIp = datagram.address.address;
        if (chosenIp.startsWith('127.') && ips.isNotEmpty) {
          chosenIp = ips.first;
        }

        final server = DiscoveredServer(
          hostname: hostname,
          ip: chosenIp,
          port: wsPort,
          lastSeen: DateTime.now(),
        );

        final wasNull = _discoveredServer == null;
        if (mounted) {
          setState(() {
            _discoveredServer = server;
            _isScanning = false;
          });

          // If offline, adopt the discovered PC address and auto-connect!
          if (!_screenConnected && !_screenConnecting) {
            _screenAddressController.text = server.address;
            if (wasNull) {
              _showMessage('✨ Discovered $hostname ($chosenIp:$wsPort)! Connecting...');
              _connectScreen();
            }
          }
        }
      }
    } catch (_) {}
  }

  Future<void> _triggerScan() async {
    HapticFeedback.mediumImpact();
    setState(() => _isScanning = true);
    _sendDiscoveryPing();
    await Future.delayed(const Duration(milliseconds: 300));
    _sendDiscoveryPing();
    await Future.delayed(const Duration(milliseconds: 1400));
    if (mounted) {
      setState(() => _isScanning = false);
      if (_discoveredServer != null) {
        _showMessage('Found ${_discoveredServer!.hostname} (${_discoveredServer!.address})');
      } else {
        _showMessage('No PC screen server found. Make sure server is running.');
      }
    }
  }

  void _scheduleReconnect() {
    if (!_autoReconnect || !mounted) return;
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 2), () {
      if (mounted && !_screenConnected && !_screenConnecting) {
        _connectScreen();
      }
    });
  }

  // ===========================================================================
  // PC SCREEN STREAMER CONNECTION (EXACT WAY AS BEFORE)
  // ===========================================================================
  Future<void> _connectScreen() async {
    if (_screenConnecting || _screenConnected) return;

    _reconnectTimer?.cancel();
    final rawAddress = _screenAddressController.text.trim();
    if (rawAddress.isEmpty) return;

    setState(() {
      _screenConnecting = true;
      _screenStatus = 'Connecting...';
    });

    try {
      String urlString = rawAddress;
      if (!urlString.startsWith('ws://') && !urlString.startsWith('wss://')) {
        urlString = urlString.contains(':') ? 'ws://$urlString' : 'ws://$urlString:8765';
      }

      Uri parsedUri = Uri.parse(urlString);
      final token = _screenTokenController.text.trim();
      if (token.isNotEmpty) {
        final qp = Map<String, String>.from(parsedUri.queryParameters);
        qp['token'] = token;
        parsedUri = parsedUri.replace(queryParameters: qp);
      }

      final channel = WebSocketChannel.connect(parsedUri);
      await channel.ready.timeout(const Duration(seconds: 6));

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
              _screenConnected = true;
              _screenStatus = 'LIVE';
            });
          }
        },
        onError: (_) {
          if (!mounted) return;
          setState(() {
            _screenConnected = false;
            _screenChannel = null;
            _screenFrame = null;
            _screenStatus = 'Connection error';
          });
          _scheduleReconnect();
        },
        onDone: () {
          if (!mounted) return;
          setState(() {
            _screenConnected = false;
            _screenChannel = null;
            _screenFrame = null;
            _screenStatus = 'Disconnected';
          });
          _scheduleReconnect();
        },
      );

      setState(() {
        _screenStatus = 'Streaming...';
      });
      _showMessage('PC Screen connected wirelessly!');
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _screenConnected = false;
        _screenChannel = null;
        _screenFrame = null;
        _screenStatus = 'Offline';
      });
      _showMessage('Could not connect to PC screen. Verify IP & port.');
      _scheduleReconnect();
    } finally {
      if (mounted) setState(() => _screenConnecting = false);
    }
  }

  Future<void> _disconnectScreen() async {
    _reconnectTimer?.cancel();
    final sub = _screenSubscription;
    final ch = _screenChannel;
    _screenSubscription = null;
    _screenChannel = null;
    await sub?.cancel();
    await ch?.sink.close();
    if (mounted) {
      setState(() {
        _screenConnected = false;
        _screenFrame = null;
        _screenStatus = 'Offline';
      });
    }
  }

  // Dispatch Touch Pointer on Screen
  void _sendScreenPointer(String action, Offset localPos, Size size) {
    if (_screenChannel == null || size.width <= 0 || size.height <= 0) return;
    final normalizedX = (localPos.dx / size.width).clamp(0.0, 1.0);
    final normalizedY = (localPos.dy / size.height).clamp(0.0, 1.0);
    try {
      _screenChannel!.sink.add(jsonEncode({
        'type': 'pointer',
        'action': action,
        'x': normalizedX,
        'y': normalizedY,
      }));
    } catch (_) {}
  }

  // ===========================================================================
  // MOUSE & KEYBOARD INPUT DISPATCH
  // ===========================================================================
  void _triggerClickAnimation() {
    _showCursorWithAutoFade();
    HapticFeedback.lightImpact();
    _isClickingNotifier.value = true;
    _clickRippleTimer?.cancel();
    _clickRippleTimer = Timer(const Duration(milliseconds: 180), () {
      if (mounted) _isClickingNotifier.value = false;
    });
  }

  void _tapToClick() {
    _showCursorWithAutoFade();
    _triggerClickAnimation();

    // 1. ESP32 Hardware click
    if (_espConnected) {
      _sendEsp({'t': 'b', 'btn': 1, 'state': 1});
      Future.delayed(const Duration(milliseconds: 40), () {
        _sendEsp({'t': 'b', 'btn': 1, 'state': 0});
      });
    } else if (_screenConnected && _screenChannel != null) {
      // 2. Wireless Screen Streamer click at current PC cursor position
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'mouse_click',
          'button': 1,
          'state': 'click',
        }));
      } catch (_) {}
    }
  }

  void _doubleClick() {
    _showCursorWithAutoFade();
    _triggerClickAnimation();

    // 1. ESP32 Hardware double click
    if (_espConnected) {
      _sendEsp({'t': 'b', 'btn': 1, 'state': 1});
      Future.delayed(const Duration(milliseconds: 30), () {
        _sendEsp({'t': 'b', 'btn': 1, 'state': 0});
        Future.delayed(const Duration(milliseconds: 50), () {
          _sendEsp({'t': 'b', 'btn': 1, 'state': 1});
          Future.delayed(const Duration(milliseconds: 30), () {
            _sendEsp({'t': 'b', 'btn': 1, 'state': 0});
          });
        });
      });
    } else if (_screenConnected && _screenChannel != null) {
      // 2. Wireless Screen Streamer double click at current PC cursor position
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'mouse_click',
          'button': 1,
          'state': 'double',
        }));
      } catch (_) {}
    }
  }

  void _rightClick() {
    _showCursorWithAutoFade();
    HapticFeedback.mediumImpact();
    _isClickingNotifier.value = true;
    _clickRippleTimer?.cancel();
    _clickRippleTimer = Timer(const Duration(milliseconds: 250), () {
      if (mounted) _isClickingNotifier.value = false;
    });

    // 1. ESP32 Hardware right click
    if (_espConnected) {
      _sendEsp({'t': 'b', 'btn': 2, 'state': 1});
      Future.delayed(const Duration(milliseconds: 50), () {
        _sendEsp({'t': 'b', 'btn': 2, 'state': 0});
      });
    } else if (_screenConnected && _screenChannel != null) {
      // 2. Wireless Screen Streamer right click
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'mouse_click',
          'button': 2,
          'state': 'click',
        }));
      } catch (_) {}
    }
  }

  void _moveMouse(Offset delta) {
    if (_pointerPositions.length >= 2) return;
    _showCursorWithAutoFade();

    // High-precision sub-pixel delta accumulator for hardware mouse injection
    // Base 2.0 multiplier matches user's preferred high-speed glide
    final double speedFactor = 2.0 * _mouseSensitivity;
    _accumulatedDx += delta.dx * speedFactor;
    _accumulatedDy += delta.dy * speedFactor;

    final int sendDx = _accumulatedDx.truncate();
    final int sendDy = _accumulatedDy.truncate();

    if (sendDx != 0 || sendDy != 0) {
      _accumulatedDx -= sendDx;
      _accumulatedDy -= sendDy;

      // Primary: Real USB HID hardware mouse injection via ESP32-S3
      if (_espConnected) {
        _sendEsp({
          't': 'm',
          'dx': sendDx,
          'dy': sendDy,
        });
      } else if (_screenConnected && _screenChannel != null) {
        // Fallback: Relative mouse glide via PC screen streamer
        try {
          _screenChannel!.sink.add(jsonEncode({
            'type': 'mouse_move',
            'dx': sendDx,
            'dy': sendDy,
          }));
        } catch (_) {}
      }
    }
  }

  void _mouseButton(int button, bool pressed) {
    _showCursorWithAutoFade();
    if (pressed) {
      _triggerClickAnimation();
    }
    if (_espConnected) {
      _sendEsp({'t': 'b', 'btn': button, 'state': pressed ? 1 : 0});
    } else if (_screenConnected && _screenChannel != null) {
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'mouse_click',
          'button': button,
          'state': pressed ? 'down' : 'up',
        }));
      } catch (_) {}
    }
  }

  void _handleScrollDrag(double deltaY) {
    _showCursorWithAutoFade();
    _scrollAccumulator += deltaY;
    const double notchThreshold = 14.0;
    while (_scrollAccumulator.abs() >= notchThreshold) {
      final int direction = _scrollAccumulator > 0 ? -1 : 1;
      _mouseScroll(direction);
      HapticFeedback.selectionClick();
      if (_scrollAccumulator > 0) {
        _scrollAccumulator -= notchThreshold;
      } else {
        _scrollAccumulator += notchThreshold;
      }
    }
  }

  void _mouseScroll(int amount) {
    _showCursorWithAutoFade();
    if (_espConnected) {
      // Send both dy and w parameters to support all firmware variations
      _sendEsp({'t': 's', 'dy': amount, 'w': amount});
    } else if (_screenConnected && _screenChannel != null) {
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'mouse_scroll',
          'dy': amount,
        }));
        _screenChannel!.sink.add(jsonEncode({
          'type': 'pointer',
          'action': 'scroll',
          'dy': amount,
        }));
      } catch (_) {}
    }
  }

  // Pointer event handlers for two-finger gestures on touchpad
  void _onTrackpadPointerDown(PointerDownEvent event) {
    _showCursorWithAutoFade();
    _pointerPositions[event.pointer] = event.position;
    if (_pointerPositions.length == 2) {
      final pts = _pointerPositions.values.toList();
      _lastTwoFingerCenter = (pts[0] + pts[1]) / 2;
    }
  }

  void _onTrackpadPointerMove(PointerMoveEvent event) {
    _pointerPositions[event.pointer] = event.position;
    if (_pointerPositions.length == 2) {
      final pts = _pointerPositions.values.toList();
      final currentCenter = (pts[0] + pts[1]) / 2;
      if (_lastTwoFingerCenter != null) {
        final double dy = currentCenter.dy - _lastTwoFingerCenter!.dy;
        _handleScrollDrag(dy);
      }
      _lastTwoFingerCenter = currentCenter;
    }
  }

  void _onTrackpadPointerUp(PointerUpEvent event) {
    _pointerPositions.remove(event.pointer);
    if (_pointerPositions.length < 2) {
      _lastTwoFingerCenter = null;
      _scrollAccumulator = 0.0;
    }
  }

  void _onTrackpadPointerCancel(PointerCancelEvent event) {
    _pointerPositions.remove(event.pointer);
    _lastTwoFingerCenter = null;
    _scrollAccumulator = 0.0;
  }

  // ===========================================================================
  // UNIVERSAL KEYBOARD & SHORTCUTS (ESP32 + PC FALLBACK)
  // ===========================================================================
  void _sendTextString(String text) {
    if (text.isEmpty) return;

    // 1. ESP32 Hardware injection if active
    if (_espConnected) {
      for (final rune in text.runes) {
        if (rune >= 32 && rune <= 126) {
          _sendEsp({'t': 'k', 'key': String.fromCharCode(rune), 'mod': 0});
        }
      }
      _showMessage('Typed via ESP32');
      return;
    }

    // 2. Wireless PC Screen server direct typing fallback
    if (_screenConnected && _screenChannel != null) {
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'type_text',
          'text': text,
        }));
        _showMessage('Typed wirelessly to PC');
        return;
      } catch (_) {}
    }

    _showMessage('Connect to PC or ESP32 to type.');
  }

  void _triggerMacro(String id) {
    HapticFeedback.lightImpact();

    if (_espConnected) {
      _sendEsp({'t': 'cmd', 'id': id});
      _showMessage('Triggered $id');
      return;
    }

    if (_screenConnected && _screenChannel != null) {
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'macro',
          'id': id,
        }));
        _showMessage('Triggered $id wirelessly');
        return;
      } catch (_) {}
    }

    _showMessage('Connect to ESP32 or PC screen server.');
  }

  void _showMessage(String text) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(text),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  // ===========================================================================
  // MAIN BUILD - CLEAN 50/50 SPLIT MATCHING USER'S ORIGINAL DESIGN
  // ===========================================================================
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header Bar
            _buildTopAppBar(),

            // Top Half: PC SCREEN VIEW
            Expanded(
              flex: _isFullscreen ? 10 : 5,
              child: _buildPcScreenZone(),
            ),

            if (!_isFullscreen) ...[
              const SizedBox(height: 6),

              // Bottom Half: TOUCHPAD & CONTROLS
              Expanded(
                flex: 5,
                child: _buildTouchpadZone(),
              ),

              // Quick Action Bottom Dock
              _buildBottomDock(),
            ],
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // TOP APP BAR
  // ---------------------------------------------------------------------------
  Widget _buildTopAppBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: kBgColor,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: kAccentColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.memory, color: kAccentColor, size: 22),
          ),
          const SizedBox(width: 10),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Hardware Gateway',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
              Text(
                'ESP32-S3 • PJD301B',
                style: TextStyle(fontSize: 10, color: kMutedColor),
              ),
            ],
          ),
          const Spacer(),

          // ESP32 Connection Badge
          _buildPillBadge(
            label: _espConnected ? 'ESP32' : 'ESP32 Off',
            icon: Icons.wifi,
            isActive: _espConnected,
            onTap: _showSettingsSheet,
          ),
          const SizedBox(width: 8),

          // Settings Button
          IconButton(
            icon: const Icon(Icons.tune, color: kMutedColor, size: 22),
            onPressed: _showSettingsSheet,
            tooltip: 'Settings',
          ),
        ],
      ),
    );
  }

  Widget _buildPillBadge({
    required String label,
    required IconData icon,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: isActive ? kMintColor.withValues(alpha: 0.15) : Colors.white10,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive ? kMintColor : Colors.white24,
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 13,
              color: isActive ? kMintColor : kMutedColor,
            ),
            const SizedBox(width: 5),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: isActive ? kMintColor : kMutedColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // ZONE 1: PC SCREEN (TOP HALF)
  // ---------------------------------------------------------------------------
  Widget _buildPcScreenZone() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: _screenConnected ? kAccentColor.withValues(alpha: 0.5) : kCardBorder,
          width: 1.5,
        ),
        boxShadow: _screenConnected
            ? [
                BoxShadow(
                  color: kAccentColor.withValues(alpha: 0.08),
                  blurRadius: 16,
                  spreadRadius: 2,
                ),
              ]
            : [],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // Live Image / Standby
          Positioned.fill(
            child: _screenFrame != null
                ? LayoutBuilder(
                    builder: (context, constraints) {
                      final double maxW = constraints.maxWidth;
                      final double maxH = constraints.maxHeight;

                      const double targetAspect = 16.0 / 9.0;
                      double renderW = maxW;
                      double renderH = renderW / targetAspect;
                      if (renderH > maxH) {
                        renderH = maxH;
                        renderW = renderH * targetAspect;
                      }

                      return Center(
                        child: SizedBox(
                          width: renderW,
                          height: renderH,
                          child: GestureDetector(
                            behavior: HitTestBehavior.opaque,
                            onTapDown: (details) {
                              _triggerClickAnimation();
                              _sendScreenPointer('click', details.localPosition, Size(renderW, renderH));
                            },
                            onPanStart: (details) {
                              _sendScreenPointer('down', details.localPosition, Size(renderW, renderH));
                            },
                            onPanUpdate: (details) {
                              _sendScreenPointer('move', details.localPosition, Size(renderW, renderH));
                            },
                            onPanEnd: (_) => _sendScreenPointer('up', Offset.zero, Size(renderW, renderH)),
                            child: Stack(
                              clipBehavior: Clip.none,
                              children: [
                                // Authentic PC Screen Frame (displays the single live PC cursor directly from host)
                                Positioned.fill(
                                  child: Image.memory(
                                    _screenFrame!,
                                    fit: BoxFit.fill,
                                    gaplessPlayback: true,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  )
                : _buildScreenStandby(),
          ),

          // Header Overlay inside Screen
          Positioned(
            top: 10,
            left: 12,
            right: 12,
            child: Row(
              children: [
                // Live Status Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.7),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white24),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _screenConnected ? kMintColor : kErrorColor,
                          boxShadow: _screenConnected
                              ? [
                                  const BoxShadow(
                                    color: kMintColor,
                                    blurRadius: 6,
                                  ),
                                ]
                              : [],
                        ),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        _screenStatus,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: _screenConnected ? Colors.white : kMutedColor,
                        ),
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                // Fullscreen button
                IconButton(
                  icon: Icon(
                    _isFullscreen ? Icons.fullscreen_exit : Icons.fullscreen,
                    color: Colors.white70,
                    size: 22,
                  ),
                  onPressed: () {
                    setState(() => _isFullscreen = !_isFullscreen);
                  },
                ),

                // Power / Reconnect Button
                IconButton(
                  icon: Icon(
                    _screenConnected ? Icons.power_settings_new : Icons.refresh,
                    color: _screenConnected ? kErrorColor : kAccentColor,
                    size: 20,
                  ),
                  onPressed: _screenConnected ? _disconnectScreen : _connectScreen,
                  tooltip: _screenConnected ? 'Disconnect screen' : 'Connect screen',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScreenStandby() {
    return Center(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: kCardColor,
                  border: Border.all(color: kCardBorder),
                ),
                child: const Icon(
                  Icons.desktop_windows_outlined,
                  size: 40,
                  color: kAccentColor,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'PC Screen Offline',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Connect to PC screen server wirelessly:',
                style: TextStyle(fontSize: 11, color: kMutedColor),
              ),
              const SizedBox(height: 12),

              // Discovered PC Banner (When found via UDP auto-discovery)
              if (_discoveredServer != null) ...[
                Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: kMintColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: kMintColor.withValues(alpha: 0.5)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_outline, color: kMintColor, size: 20),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Discovered: ${_discoveredServer!.hostname}',
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              _discoveredServer!.address,
                              style: const TextStyle(fontSize: 11, color: kMintColor),
                            ),
                          ],
                        ),
                      ),
                      FilledButton(
                        onPressed: () {
                          _screenAddressController.text = _discoveredServer!.address;
                          _connectScreen();
                        },
                        style: FilledButton.styleFrom(
                          backgroundColor: kMintColor,
                          foregroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          visualDensity: VisualDensity.compact,
                        ),
                        child: const Text('Connect', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
              ],

              // Auto-Detect PC Radar Scan Button
              OutlinedButton.icon(
                onPressed: _isScanning ? null : _triggerScan,
                icon: _isScanning
                    ? const SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2, color: kAccentColor),
                      )
                    : const Icon(Icons.radar, size: 16, color: kAccentColor),
                label: Text(
                  _isScanning ? 'Searching Network for PC...' : 'Auto-Detect PC on Wi-Fi',
                  style: const TextStyle(fontSize: 12, color: kAccentColor),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: kAccentColor, width: 1.2),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
              ),
              const SizedBox(height: 10),

              // Visible IP Address Input Field
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFF0F1524),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: kCardBorder),
                ),
                child: TextField(
                  controller: _screenAddressController,
                  style: const TextStyle(fontSize: 13, color: Colors.white),
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    isDense: true,
                    prefixIcon: Icon(Icons.computer, size: 18, color: kAccentColor),
                    hintText: 'Enter PC IP:8765',
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // Quick Preset Chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (_discoveredServer != null) ...[
                      ActionChip(
                        visualDensity: VisualDensity.compact,
                        avatar: const Icon(Icons.stars, size: 13, color: kMintColor),
                        label: Text(_discoveredServer!.hostname, style: const TextStyle(fontSize: 10, color: kMintColor)),
                        onPressed: () {
                          setState(() {
                            _screenAddressController.text = _discoveredServer!.address;
                          });
                          _connectScreen();
                        },
                      ),
                      const SizedBox(width: 6),
                    ],
                    ActionChip(
                      visualDensity: VisualDensity.compact,
                      avatar: const Icon(Icons.wifi, size: 13, color: kAccentColor),
                      label: Text('Wi-Fi (${_screenAddressController.text})', style: const TextStyle(fontSize: 10)),
                      onPressed: () {
                        _connectScreen();
                      },
                    ),
                    const SizedBox(width: 6),
                    ActionChip(
                      visualDensity: VisualDensity.compact,
                      avatar: const Icon(Icons.router, size: 13, color: kMintColor),
                      label: const Text('ESP32 AP (192.168.4.3)', style: TextStyle(fontSize: 10)),
                      onPressed: () {
                        setState(() {
                          _screenAddressController.text = '192.168.4.3:8765';
                        });
                        _connectScreen();
                      },
                    ),
                    const SizedBox(width: 6),
                    ActionChip(
                      visualDensity: VisualDensity.compact,
                      avatar: const Icon(Icons.usb, size: 13, color: kMutedColor),
                      label: const Text('USB (127.0.0.1)', style: TextStyle(fontSize: 10)),
                      onPressed: () {
                        setState(() {
                          _screenAddressController.text = '127.0.0.1:8765';
                        });
                        _connectScreen();
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 14),
              FilledButton.icon(
                onPressed: _screenConnecting ? null : _connectScreen,
                icon: Icon(
                  _screenConnecting ? Icons.hourglass_top : Icons.play_arrow,
                  size: 18,
                ),
                label: Text(_screenConnecting ? 'Connecting...' : 'Connect Screen'),
                style: FilledButton.styleFrom(
                  backgroundColor: kAccentColor,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // REAL PC WINDOWS CURSOR WIDGET & TACTILE FEEDBACK
  // ---------------------------------------------------------------------------
  Widget _buildRealPcCursor() {
    return ValueListenableBuilder<bool>(
      valueListenable: _isClickingNotifier,
      builder: (context, clicking, _) {
        return CustomPaint(
          size: const Size(12, 19),
          painter: _RealWindowsCursorPainter(isClicking: clicking),
        );
      },
    );
  }

  // ---------------------------------------------------------------------------
  // ZONE 2: TOUCHPAD & CONTROLS (BOTTOM HALF)
  // ---------------------------------------------------------------------------
  Widget _buildTouchpadZone() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: kCardColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: kCardBorder, width: 1.5),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: Column(
          children: [
            // Top touch pad surface + vertical scroll strip
            Expanded(
              child: Row(
                children: [
                  // Main Trackpad surface with 1-finger glide and 2-finger scroll
                  Expanded(
                    child: Listener(
                      behavior: HitTestBehavior.opaque,
                      onPointerDown: _onTrackpadPointerDown,
                      onPointerMove: _onTrackpadPointerMove,
                      onPointerUp: _onTrackpadPointerUp,
                      onPointerCancel: _onTrackpadPointerCancel,
                      child: GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTap: _tapToClick,
                        onDoubleTap: _doubleClick,
                        onLongPress: _rightClick,
                        onPanStart: (_) {
                          _accumulatedDx = 0.0;
                          _accumulatedDy = 0.0;
                          _showCursorWithAutoFade();
                        },
                        onPanUpdate: (details) => _moveMouse(details.delta),
                        child: Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.touch_app,
                                color: kAccentColor.withValues(alpha: 0.5),
                                size: 36,
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Precision Touchpad',
                                style: TextStyle(
                                  color: kMutedColor,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 3),
                              const Text(
                                'Glide to move • Tap to select • 2-Finger scroll',
                                style: TextStyle(
                                  color: Colors.white54,
                                  fontSize: 11,
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                '2x Tap to open • Long press for Right Click',
                                style: TextStyle(
                                  color: Colors.white24,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Dedicated Precision Vertical Scroll Strip
                  Container(
                    width: 44,
                    decoration: const BoxDecoration(
                      border: Border(
                        left: BorderSide(color: kCardBorder, width: 1),
                      ),
                      color: Color(0xFF0F1524),
                    ),
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onVerticalDragDown: (_) {
                        _showCursorWithAutoFade();
                        _scrollAccumulator = 0.0;
                      },
                      onVerticalDragUpdate: (details) {
                        final delta = details.primaryDelta ?? 0;
                        if (delta != 0) {
                          _handleScrollDrag(delta);
                        }
                      },
                      onVerticalDragEnd: (_) => _scrollAccumulator = 0.0,
                      child: const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            Icon(Icons.keyboard_arrow_up, size: 18, color: kMutedColor),
                            RotatedBox(
                              quarterTurns: 1,
                              child: Text(
                                'SCROLL',
                                style: TextStyle(
                                  fontSize: 9,
                                  letterSpacing: 1.5,
                                  color: kMutedColor,
                                ),
                              ),
                            ),
                            Icon(Icons.keyboard_arrow_down, size: 18, color: kMutedColor),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Left / Right Click Buttons
            Container(
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: kCardBorder, width: 1)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _buildClickButton('Left Click', Icons.mouse, 1),
                  ),
                  Container(width: 1, height: 48, color: kCardBorder),
                  Expanded(
                    child: _buildClickButton('Right Click', Icons.ads_click, 2),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildClickButton(String label, IconData icon, int btnCode) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: (_) => _mouseButton(btnCode, true),
      onTapUp: (_) => _mouseButton(btnCode, false),
      onTapCancel: () => _mouseButton(btnCode, false),
      child: Container(
        height: 48,
        color: Colors.transparent,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 18, color: kAccentColor),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // BOTTOM ACTION DOCK
  // ---------------------------------------------------------------------------
  Widget _buildBottomDock() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _buildDockItem(
            icon: Icons.keyboard_alt_outlined,
            label: 'Keyboard',
            onTap: _showKeyboardSheet,
          ),
          _buildDockItem(
            icon: Icons.bolt,
            label: 'Shortcuts',
            onTap: _showShortcutsSheet,
          ),
          _buildDockItem(
            icon: _espConnected ? Icons.router : Icons.power_settings_new,
            label: _espConnected ? 'ESP32 Live' : 'Connect ESP',
            color: _espConnected ? kMintColor : kAccentColor,
            onTap: _espConnected ? _disconnectEsp : _connectEsp,
          ),
        ],
      ),
    );
  }

  Widget _buildDockItem({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    Color? color,
  }) {
    final c = color ?? kMutedColor;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18, color: c),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: c,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // MODALS & SHEETS (KEYBOARD, SHORTCUTS, SETTINGS)
  // ---------------------------------------------------------------------------
  void _showKeyboardSheet() {
    final textController = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: kCardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  const Icon(Icons.keyboard, color: kAccentColor),
                  const SizedBox(width: 10),
                  const Text(
                    'Direct Keyboard Input',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              TextField(
                controller: textController,
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: 'Type text to send to PC...',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.edit_note),
                ),
                onSubmitted: (val) {
                  _sendTextString(val);
                  Navigator.pop(ctx);
                },
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        _triggerMacro('ENTER');
                        Navigator.pop(ctx);
                      },
                      child: const Text('Enter'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        _triggerMacro('BACKSPACE');
                      },
                      child: const Text('Backspace'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: FilledButton(
                      onPressed: () {
                        _sendTextString(textController.text);
                        Navigator.pop(ctx);
                      },
                      style: FilledButton.styleFrom(backgroundColor: kAccentColor),
                      child: const Text('Send', style: TextStyle(color: Colors.black)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  void _showShortcutsSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: kCardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Row(
                children: [
                  Icon(Icons.bolt, color: kAccentColor),
                  SizedBox(width: 10),
                  Text(
                    'Quick PC Shortcuts',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _buildShortcutChip('Next Slide', 'NEXT_SLIDE', Icons.skip_next),
                  _buildShortcutChip('Prev Slide', 'PREV_SLIDE', Icons.skip_previous),
                  _buildShortcutChip('Start Slideshow', 'START_SLIDESHOW', Icons.play_arrow),
                  _buildShortcutChip('Switch Apps', 'ALT_TAB', Icons.flip),
                  _buildShortcutChip('Windows Key', 'WIN_L', Icons.window),
                  _buildShortcutChip('Task Manager', 'TASK_MGR', Icons.security),
                  _buildShortcutChip('Copy', 'CTRL_C', Icons.copy),
                  _buildShortcutChip('Paste', 'CTRL_V', Icons.content_paste),
                  _buildShortcutChip('Select All', 'CTRL_A', Icons.select_all),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  Widget _buildShortcutChip(String label, String macroId, IconData icon) {
    return ActionChip(
      avatar: Icon(icon, size: 16, color: kAccentColor),
      label: Text(label, style: const TextStyle(fontSize: 12)),
      backgroundColor: const Color(0xFF0F1524),
      side: const BorderSide(color: kCardBorder),
      onPressed: () {
        _triggerMacro(macroId);
        Navigator.pop(context);
      },
    );
  }

  void _showSettingsSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: kCardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.tune, color: kAccentColor),
                        SizedBox(width: 10),
                        Text(
                          'Connection & Gateway Settings',
                          style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),

                    // PC Screen Host:Port
                    const Text(
                      'PC SCREEN STREAMER ADDRESS',
                      style: TextStyle(
                        fontSize: 11,
                        letterSpacing: 1,
                        color: kMutedColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _screenAddressController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        isDense: true,
                        prefixIcon: Icon(Icons.computer),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Quick chips
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          ActionChip(
                            avatar: const Icon(Icons.wifi, size: 15),
                            label: const Text('Campus Wi-Fi (10.2.39.171)', style: TextStyle(fontSize: 11)),
                            onPressed: () {
                              setSheetState(() {
                                _screenAddressController.text = '10.2.39.171:8765';
                              });
                            },
                          ),
                          const SizedBox(width: 6),
                          ActionChip(
                            avatar: const Icon(Icons.router, size: 15),
                            label: const Text('ESP32 AP (192.168.4.3)', style: TextStyle(fontSize: 11)),
                            onPressed: () {
                              setSheetState(() {
                                _screenAddressController.text = '192.168.4.3:8765';
                              });
                            },
                          ),
                          const SizedBox(width: 6),
                          ActionChip(
                            avatar: const Icon(Icons.usb, size: 15),
                            label: const Text('USB Tether (127.0.0.1)', style: TextStyle(fontSize: 11)),
                            onPressed: () {
                              setSheetState(() {
                                _screenAddressController.text = '127.0.0.1:8765';
                              });
                            },
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 18),

                    // ESP32 Hardware IP
                    const Text(
                      'ESP32 HARDWARE GATEWAY IP',
                      style: TextStyle(
                        fontSize: 11,
                        letterSpacing: 1,
                        color: kMutedColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _espAddressController,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        isDense: true,
                        prefixIcon: Icon(Icons.router),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Auto-Reconnect Toggle
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text(
                        'Auto-Reconnect Screen',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      subtitle: const Text(
                        'Automatically reconnect if network briefly drops',
                        style: TextStyle(fontSize: 11, color: kMutedColor),
                      ),
                      value: _autoReconnect,
                      activeTrackColor: kAccentColor,
                      onChanged: (val) {
                        setSheetState(() => _autoReconnect = val);
                        setState(() => _autoReconnect = val);
                      },
                    ),

                    const SizedBox(height: 14),

                    // Mouse Sensitivity
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Trackpad Sensitivity',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text('${_mouseSensitivity.toStringAsFixed(1)}x'),
                      ],
                    ),
                    Slider(
                      value: _mouseSensitivity,
                      min: 0.4,
                      max: 2.5,
                      divisions: 21,
                      activeColor: kAccentColor,
                      onChanged: (val) {
                        setSheetState(() => _mouseSensitivity = val);
                        setState(() => _mouseSensitivity = val);
                      },
                    ),

                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        onPressed: () {
                          Navigator.pop(ctx);
                          _connectScreen();
                        },
                        style: FilledButton.styleFrom(
                          backgroundColor: kAccentColor,
                          foregroundColor: Colors.black,
                        ),
                        child: const Text('Save & Reconnect'),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}

// =============================================================================
// AUTHENTIC REAL WINDOWS AERO / 11 CURSOR PAINTER
// =============================================================================
class _RealWindowsCursorPainter extends CustomPainter {
  final bool isClicking;
  _RealWindowsCursorPainter({required this.isClicking});

  @override
  void paint(Canvas canvas, Size size) {
    final Path path = Path();
    path.moveTo(0, 0);
    path.lineTo(0, 15.5);
    path.lineTo(3.6, 12.2);
    path.lineTo(6.4, 18.0);
    path.lineTo(8.6, 17.0);
    path.lineTo(5.8, 11.2);
    path.lineTo(10.5, 11.2);
    path.close();

    final Path shadowPath = path.shift(const Offset(1.2, 1.4));
    final Paint shadowPaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.35)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 1.5);
    canvas.drawPath(shadowPath, shadowPaint);

    final Paint borderPaint = Paint()
      ..color = const Color(0xFF1E1E1E)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.1
      ..strokeJoin = StrokeJoin.miter;
    canvas.drawPath(path, borderPaint);

    final Paint fillPaint = Paint()
      ..color = isClicking ? const Color(0xFFE0F7FA) : Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawPath(path, fillPaint);
  }

  @override
  bool shouldRepaint(covariant _RealWindowsCursorPainter oldDelegate) {
    return oldDelegate.isClicking != isClicking;
  }
}
