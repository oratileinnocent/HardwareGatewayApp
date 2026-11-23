import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

void main() {
  runApp(const HardwareGatewayApp());
}

// Modern Cyber-Slate Palette
const Color kBgColor = Color(0xFF090D16);
const Color kCardColor = Color(0xFF131A2B);
const Color kCardBorder = Color(0xFF1F2B45);
const Color kAccentColor = Color(0xFF00F2FE);
const Color kMintColor = Color(0xFF55D6BE);
const Color kMutedColor = Color(0xFF8F9EB8);
const Color kErrorColor = Color(0xFFFF5252);

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
    text: '192.168.18.183:8765',
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

  // Real PC Cursor visibility & auto-fade state
  Offset _cursorPos = const Offset(0.5, 0.5); // normalized [0.0 - 1.0]
  bool _cursorVisible = false;
  Timer? _cursorFadeTimer;
  bool _isClicking = false;
  Timer? _clickRippleTimer;

  // Multi-touch tracking for 2-finger scroll
  final Map<int, Offset> _pointerPositions = {};
  Offset? _lastTwoFingerCenter;
  double _scrollAccumulator = 0.0;

  // Fullscreen view toggle
  bool _isFullscreen = false;

  // Trackpad sensitivity (1.0 = calibrated 1:1 speed matching PC trackpad)
  double _mouseSensitivity = 1.0;

  @override
  void initState() {
    super.initState();
    // Auto-connect to screen server if possible
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _connectScreen();
    });
  }

  void _showCursorWithAutoFade() {
    _cursorFadeTimer?.cancel();
    if (!_cursorVisible) {
      setState(() => _cursorVisible = true);
    }
    _cursorFadeTimer = Timer(const Duration(milliseconds: 2500), () {
      if (mounted) {
        setState(() => _cursorVisible = false);
      }
    });
  }

  @override
  void dispose() {
    _cursorFadeTimer?.cancel();
    _clickRippleTimer?.cancel();
    _espSubscription?.cancel();
    _espChannel?.sink.close();
    _screenSubscription?.cancel();
    _screenChannel?.sink.close();
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

      setState(() {
        _espConnected = true;
      });
      _showMessage('Connected to ESP32 Gateway');
    } catch (_) {
      if (!mounted) return;
      setState(() => _espConnected = false);
      _showMessage('Cannot connect to ESP32. Connect to ESP32-Gateway Wi-Fi first.');
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

  // Send packet to ESP32
  void _sendEsp(Map<String, dynamic> data) {
    if (!_espConnected || _espChannel == null) return;
    try {
      _espChannel!.sink.add(jsonEncode(data));
    } catch (_) {
      if (mounted) setState(() => _espConnected = false);
    }
  }

  // ===========================================================================
  // PC SCREEN STREAMER CONNECTION
  // ===========================================================================
  Future<void> _connectScreen() async {
    if (_screenConnecting || _screenConnected) return;

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
      await channel.ready.timeout(const Duration(seconds: 8));

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
        },
        onDone: () {
          if (!mounted) return;
          setState(() {
            _screenConnected = false;
            _screenChannel = null;
            _screenFrame = null;
            _screenStatus = 'Disconnected';
          });
        },
      );

      setState(() {
        _screenStatus = 'Streaming...';
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _screenConnected = false;
        _screenChannel = null;
        _screenFrame = null;
        _screenStatus = 'Offline';
      });
    } finally {
      if (mounted) setState(() => _screenConnecting = false);
    }
  }

  Future<void> _disconnectScreen() async {
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
    setState(() => _isClicking = true);
    _clickRippleTimer?.cancel();
    _clickRippleTimer = Timer(const Duration(milliseconds: 180), () {
      if (mounted) setState(() => _isClicking = false);
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
    }

    // 2. Wireless Screen Streamer click
    if (_screenConnected && _screenChannel != null) {
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'pointer',
          'action': 'click',
          'x': _cursorPos.dx,
          'y': _cursorPos.dy,
        }));
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
    }

    // 2. Wireless Screen Streamer double click
    if (_screenConnected && _screenChannel != null) {
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'pointer',
          'action': 'click',
          'x': _cursorPos.dx,
          'y': _cursorPos.dy,
        }));
        _screenChannel!.sink.add(jsonEncode({
          'type': 'mouse_click',
          'button': 1,
          'state': 'double',
        }));
        Future.delayed(const Duration(milliseconds: 70), () {
          try {
            _screenChannel?.sink.add(jsonEncode({
              'type': 'pointer',
              'action': 'click',
              'x': _cursorPos.dx,
              'y': _cursorPos.dy,
            }));
          } catch (_) {}
        });
      } catch (_) {}
    }
  }

  void _rightClick() {
    _showCursorWithAutoFade();
    HapticFeedback.mediumImpact();
    setState(() => _isClicking = true);
    _clickRippleTimer?.cancel();
    _clickRippleTimer = Timer(const Duration(milliseconds: 250), () {
      if (mounted) setState(() => _isClicking = false);
    });

    // 1. ESP32 Hardware right click
    if (_espConnected) {
      _sendEsp({'t': 'b', 'btn': 2, 'state': 1});
      Future.delayed(const Duration(milliseconds: 50), () {
        _sendEsp({'t': 'b', 'btn': 2, 'state': 0});
      });
    }

    // 2. Wireless Screen Streamer right click
    if (_screenConnected && _screenChannel != null) {
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
    // If two fingers are active on touchpad, suppress cursor glide for 2-finger scroll
    if (_pointerPositions.length >= 2) return;

    _showCursorWithAutoFade();

    // 1. Calibrated 1:1 speed matching natural laptop trackpad
    final double sensitivityScale = 0.0013 * _mouseSensitivity;
    final newPos = Offset(
      (_cursorPos.dx + delta.dx * sensitivityScale).clamp(0.001, 0.999),
      (_cursorPos.dy + delta.dy * sensitivityScale).clamp(0.001, 0.999),
    );
    setState(() => _cursorPos = newPos);

    // 2. Hardware injection via ESP32 (if connected)
    if (_espConnected) {
      _sendEsp({
        't': 'm',
        'dx': (delta.dx * _mouseSensitivity).round(),
        'dy': (delta.dy * _mouseSensitivity).round(),
      });
    }

    // 3. Send single unified position event to wireless PC screen streamer
    if (_screenConnected && _screenChannel != null) {
      try {
        _screenChannel!.sink.add(jsonEncode({
          'type': 'pointer',
          'action': 'move',
          'x': newPos.dx,
          'y': newPos.dy,
        }));
      } catch (_) {}
    }
  }

  void _mouseButton(int button, bool pressed) {
    _showCursorWithAutoFade();
    if (pressed) {
      _triggerClickAnimation();
    }
    if (_espConnected) {
      _sendEsp({'t': 'b', 'btn': button, 'state': pressed ? 1 : 0});
    }
    if (_screenConnected && _screenChannel != null) {
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
      // Natural scrolling:
      // Dragging DOWN (deltaY > 0) -> scroll content DOWN (Windows dy = -1)
      // Dragging UP (deltaY < 0) -> scroll content UP (Windows dy = 1)
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
      _sendEsp({'t': 's', 'dy': amount});
    }
    if (_screenConnected && _screenChannel != null) {
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

  void _sendTextString(String text) {
    if (!_espConnected) {
      _showMessage('Connect to ESP32 Gateway to type on PC.');
      return;
    }
    for (final rune in text.runes) {
      if (rune >= 32 && rune <= 126) {
        _sendEsp({'t': 'k', 'key': String.fromCharCode(rune), 'mod': 0});
      }
    }
  }

  void _triggerMacro(String id) {
    if (_espConnected) {
      _sendEsp({'t': 'cmd', 'id': id});
      _showMessage('Triggered $id');
    } else {
      _showMessage('Connect to ESP32 Gateway to execute shortcuts.');
    }
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
  // MAIN BUILD - CLEAN 50/50 SPLIT MATCHING SKETCH
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
          color: isActive ? kMintColor.withOpacity(0.15) : Colors.white10,
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
          color: _screenConnected ? kAccentColor.withOpacity(0.5) : kCardBorder,
          width: 1.5,
        ),
        boxShadow: _screenConnected
            ? [
                BoxShadow(
                  color: kAccentColor.withOpacity(0.08),
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

                      // Maintain 16:9 aspect ratio standard for PC monitors
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
                              _showCursorWithAutoFade();
                              final normX = (details.localPosition.dx / renderW).clamp(0.001, 0.999);
                              final normY = (details.localPosition.dy / renderH).clamp(0.001, 0.999);
                              setState(() => _cursorPos = Offset(normX, normY));
                              _triggerClickAnimation();
                              _sendScreenPointer('click', details.localPosition, Size(renderW, renderH));
                            },
                            onPanStart: (details) {
                              _showCursorWithAutoFade();
                              final normX = (details.localPosition.dx / renderW).clamp(0.001, 0.999);
                              final normY = (details.localPosition.dy / renderH).clamp(0.001, 0.999);
                              setState(() => _cursorPos = Offset(normX, normY));
                              _sendScreenPointer('down', details.localPosition, Size(renderW, renderH));
                            },
                            onPanUpdate: (details) {
                              _showCursorWithAutoFade();
                              final normX = (details.localPosition.dx / renderW).clamp(0.001, 0.999);
                              final normY = (details.localPosition.dy / renderH).clamp(0.001, 0.999);
                              setState(() => _cursorPos = Offset(normX, normY));
                              _sendScreenPointer('move', details.localPosition, Size(renderW, renderH));
                            },
                            onPanEnd: (_) => _sendScreenPointer('up', Offset.zero, Size(renderW, renderH)),
                            child: Stack(
                              clipBehavior: Clip.none,
                              children: [
                                // PC Screen Frame
                                Positioned.fill(
                                  child: Image.memory(
                                    _screenFrame!,
                                    fit: BoxFit.fill,
                                    gaplessPlayback: true,
                                  ),
                                ),

                                // Real Windows PC Cursor Overlay with Smooth Inactivity Auto-Fade
                                Positioned(
                                  left: _cursorPos.dx * renderW,
                                  top: _cursorPos.dy * renderH,
                                  child: IgnorePointer(
                                    child: AnimatedOpacity(
                                      opacity: _cursorVisible ? 1.0 : 0.0,
                                      duration: const Duration(milliseconds: 220),
                                      curve: Curves.easeOut,
                                      child: _buildRealPcCursor(),
                                    ),
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
                    color: Colors.black.withOpacity(0.7),
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
          const SizedBox(height: 4),
          const Text(
            'Tap below to stream PC screen wirelessly',
            style: TextStyle(fontSize: 12, color: kMutedColor),
          ),
          const SizedBox(height: 16),
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
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // REAL PC WINDOWS CURSOR WIDGET & TACTILE FEEDBACK
  // ---------------------------------------------------------------------------
  Widget _buildRealPcCursor() {
    return CustomPaint(
      size: const Size(12, 19),
      painter: _RealWindowsCursorPainter(isClicking: _isClicking),
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
                        onPanStart: (_) => _showCursorWithAutoFade(),
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
                            label: const Text('Home Wi-Fi', style: TextStyle(fontSize: 11)),
                            onPressed: () {
                              setSheetState(() {
                                _screenAddressController.text = '192.168.18.183:8765';
                              });
                            },
                          ),
                          const SizedBox(width: 6),
                          ActionChip(
                            avatar: const Icon(Icons.school, size: 15),
                            label: const Text('Campus Wi-Fi', style: TextStyle(fontSize: 11)),
                            onPressed: () {
                              setSheetState(() {
                                _screenAddressController.text = '10.2.45.23:8765';
                              });
                            },
                          ),
                          const SizedBox(width: 6),
                          ActionChip(
                            avatar: const Icon(Icons.router, size: 15),
                            label: const Text('ESP32 AP', style: TextStyle(fontSize: 11)),
                            onPressed: () {
                              setSheetState(() {
                                _screenAddressController.text = '192.168.4.3:8765';
                              });
                            },
                          ),
                          const SizedBox(width: 6),
                          ActionChip(
                            avatar: const Icon(Icons.usb, size: 15),
                            label: const Text('USB Tether', style: TextStyle(fontSize: 11)),
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
    // Exact Windows default arrow geometry
    final Path path = Path();
    path.moveTo(0, 0);
    path.lineTo(0, 15.5);
    path.lineTo(3.6, 12.2);
    path.lineTo(6.4, 18.0);
    path.lineTo(8.6, 17.0);
    path.lineTo(5.8, 11.2);
    path.lineTo(10.5, 11.2);
    path.close();

    // 1. Soft Windows-style drop shadow behind the cursor
    final Path shadowPath = path.shift(const Offset(1.2, 1.4));
    final Paint shadowPaint = Paint()
      ..color = Colors.black.withValues(alpha: 0.35)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 1.5);
    canvas.drawPath(shadowPath, shadowPaint);

    // 2. Crisp, thin dark outline (#1E1E1E) for high contrast on light & dark screens
    final Paint borderPaint = Paint()
      ..color = const Color(0xFF1E1E1E)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.1
      ..strokeJoin = StrokeJoin.miter;
    canvas.drawPath(path, borderPaint);

    // 3. Crisp white body (#FFFFFF) with subtle click state
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
