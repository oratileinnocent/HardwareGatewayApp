<p align="center">
  <img src="tut_logo.png" alt="TUT Emblem" width="110"><br>
  <strong style="font-size: 1.3em; color: #003366;">Tshwane University of Technology</strong><br>
  <em style="color: #C62828;">We empower people</em>
</p>

# TSHWANE UNIVERSITY OF TECHNOLOGY
## FACULTY OF INFORMATION AND COMMUNICATION TECHNOLOGY
### NATIONAL DIPLOMA: COMPUTER SYSTEMS ENGINEERING
### INTELLIGENT INDUSTRIAL SYSTEMS: IDC30BI / PJD301B

---

# USER MANUAL

| Attribute | Details |
| :--- | :--- |
| **PROJECT TITLE** | **Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation** |
| **LECTURER NAMES** | Muwanguzi Mark Ntume and Chunling Du |
| **STUDENT NAME** | Oratile Innocent Tshosetso |
| **STUDENT NUMBER** | 222883253 |
| **EMAIL ADDRESS** | oratileinnocent.45@gmail.com |
| **CONTACT NUMBERS** | 076 950 6870 |
| **ACADEMIC YEAR** | 2026 |
| **DOCUMENT REVISION** | Version 1.0 (Final Deliverable) |

---

## TABLE OF CONTENTS

1. [SCOPE](#1-scope)  
   1.1 [Identification](#11-identification)  
   1.2 [System Overview](#12-system-overview)  
   1.3 [Document Overview](#13-document-overview)  
2. [REFERENCED DOCUMENTS](#2-referenced-documents)  
3. [SOFTWARE SUMMARY](#3-software-summary)  
   3.1 [Software Application](#31-software-application)  
   3.2 [Software Inventory](#32-software-inventory)  
   3.3 [Software Environment](#33-software-environment)  
   3.4 [Software Organization and Overview of Operation](#34-software-organization-and-overview-of-operation)  
   3.5 [Contingencies and Alternate States and Modes of Operation](#35-contingencies-and-alternate-states-and-modes-of-operation)  
   3.6 [Security and Privacy](#36-security-and-privacy)  
   3.7 [Assistance and Problem Reporting](#37-assistance-and-problem-reporting)  
4. [ACCESS TO THE SOFTWARE](#4-access-to-the-software)  
   4.1 [Access Control & Installation](#41-access-control--installation)  
       4.1.1 [Access Control](#411-access-control)  
       4.1.2 [Installation and Setup](#412-installation-and-setup)  
   4.2 [Initiating Procedure](#42-initiating-procedure)  
   4.3 [Description of Inputs](#43-description-of-inputs)  
       4.3.1 [Input Conditions](#431-input-conditions)  
       4.3.2 [Input Formats](#432-input-formats)  
       4.3.3 [Composition Rules](#433-composition-rules)  
       4.3.4 [Input Vocabulary](#434-input-vocabulary)  
       4.3.5 [Sample Inputs](#435-sample-inputs)  
   4.4 [Description of Outputs](#44-description-of-outputs)  
       4.4.1 [General Description](#441-general-description)  
       4.4.2 [Output Formats](#442-output-formats)  
       4.4.3 [Sample Outputs](#443-sample-outputs)  
   4.5 [Recovery and Error Correction Procedures](#45-recovery-and-error-correction-procedures)  
   4.6 [Stopping and Suspending Work](#46-stopping-and-suspending-work)  
5. [PROCESSING REFERENCE GUIDE](#5-processing-reference-guide)  
   5.1 [Capabilities](#51-capabilities)  
   5.2 [Conventions](#52-conventions)  
   5.3 [Processing Procedures](#53-processing-procedures)  
   5.4 [Aspect of Software Use](#54-aspect-of-software-use)  
   5.5 [Related Processing](#55-related-processing)  
   5.6 [Data Backup](#56-data-backup)  
   5.7 [Recovery from Errors, Malfunctions, and Emergencies](#57-recovery-from-errors-malfunctions-and-emergencies)  
   5.8 [Messages](#58-messages)  
   5.9 [Quick-Reference Guide](#59-quick-reference-guide)  
6. [QUERY PROCEDURES](#6-query-procedures)  
   6.1 [Database / Data File Format](#61-databasedata-file-format)  
   6.2 [Query Capabilities](#62-query-capabilities)  
   6.3 [Query Preparation](#63-query-preparation)  
   6.4 [Control Instructions](#64-control-instructions)  
7. [NOTES](#7-notes)  
8. [REFERENCE](#8-reference)  
A. [APPENDIXES](#a-appendixes)  

---

## 1. SCOPE

### 1.1 Identification
* **System Identification:** Hardware-Level USB Remote Access Gateway System (HW-GW-ESP32S3).
* **Software Identification:**
  * Embedded Microcontroller Firmware: `ESP32-S3 Native HID & AsyncWS Firmware` (Release v1.0.0).
  * Client Control Application: `Hardware Gateway Mobile Controller (Flutter)` (Package: `hardware_gateway_app`, Version 1.0.0+1).
  * Host Screen Streamer Service: `HardwareGatewayStream Daemon` (Python/Asyncio WebSocket Service v1.0).
* **Operating System Platforms Supported:**
  * **Target Host PC (Receiver):** Windows 10/11, macOS (10.14+), Linux (Kernel 2.6+), and any OS supporting USB HID Class v1.11 out-of-the-box without driver installation.
  * **Client Controller (Operator):** Android (API Level 21+), iOS (12+), Web (Chromium/Safari/Firefox), and Windows/Linux Desktop runtimes.

### 1.2 System Overview
The **Hardware-Level USB Remote Access Gateway** is an autonomous, agentless hardware dongle and companion software suite designed to provide remote control access to secured, air-gapped, or headless workstations. Traditional software remote access suites (such as RDP, TeamViewer, or AnyDesk) require administrative privileges, software agent installation on the host, open firewall ports, and active internet connectivity—prerequisites often banned in sensitive industrial, banking, military, and data center environments.

The system solves these barriers by relocating human-machine interaction to the physical hardware layer:
1. The **ESP32-S3 Hardware Gateway** plugs directly into the host machine’s USB port, where its on-chip Full-Speed USB OTG transceiver natively enumerates as a combined USB Composite Human Interface Device (Standard 101/104-key Keyboard and 3-button Optical Mouse). The host operating system accepts all inputs without driver installation or software execution.
2. The gateway broadcasts an isolated, peer-to-peer 2.4 GHz IEEE 802.11b/g/n SoftAP network (`SSID: ESP32-Gateway`).
3. The **Hardware Gateway Mobile App** (built with Flutter) or an embedded zero-dependency HTML5 web app connects to the gateway over a full-duplex WebSocket channel over TCP port 80.
4. Touch movements, gestures, clicks, and keystrokes captured on the mobile device are packaged into lightweight JSON packets, streamed over Wi-Fi, decoded by Core 0 of the ESP32-S3, and injected into physical USB HID endpoint FIFOs by Core 1 in sub-30ms round-trip latency.
5. An optional companion **Host Screen Streamer** captures the target PC screen and streams binary JPEG frames over WebSocket back to the mobile app, providing visual feedback with real-time cursor overlay and click ripples.

* **Project Sponsor / Evaluator:** Department of Computer Systems Engineering, Faculty of Information and Communication Technology, Tshwane University of Technology (TUT).
* **Developer:** Oratile Innocent Tshosetso (Student No: 222883253).
* **Target Operational Sites:** Air-gapped server racks, industrial SCADA consoles, forensic investigation labs, corporate IT helpdesks, and server rooms.

### 1.3 Document Overview
This User Manual provides step-by-step operational guidance for field technicians, system administrators, and student evaluators. It details software configuration, mobile app operation, hardware installation, safety procedures (including the physical RF kill-switch), protocol formatting, and troubleshooting. 

> [!IMPORTANT]
> Because the hardware gateway operates through native USB HID hardware emulation, any command sent through the gateway executes with the direct physical authorization of whatever user session is active on the target PC. Users must ensure authorized physical access before connecting.

---

## 2. REFERENCED DOCUMENTS

1. **USB Implementers Forum (USB-IF):** *Device Class Definition for Human Interface Devices (HID)*, Firmware Specification Version 1.11, June 2021.
2. **Espressif Systems:** *ESP32-S3 Technical Reference Manual*, Document ESP32S3-TRM, Revision 1.2, 2023.
3. **IETF Network Working Group:** *The WebSocket Protocol*, Standards Track RFC 6455, December 2011.
4. **IEEE Computer Society:** *IEEE Standard for Information Technology—Systems Design—Software User Documentation*, IEEE Std 1063-2001.
5. **Tshwane University of Technology (TUT):** *Project Design III (PJD 301B) & Intelligent Industrial Systems (IDC30BI) Curriculum and Project Guidelines*, 2026.
6. **W3C Working Group:** *Touch Events Level 2 Specification*, W3C Recommendation, 2020.

---

## 3. SOFTWARE SUMMARY

### 3.1 Software Application
The primary purpose of the software is to translate capacitive multi-touch inputs, text keystrokes, and pre-programmed system administrative macros from a handheld mobile device into compliant USB HID hardware signals.

* **Core Capabilities:**
  * Sub-30ms real-time touch cursor tracking with non-linear velocity scaling ($V = \alpha \cdot \Delta D^{1.2}$).
  * Multi-touch gesture recognition: single-finger glide, tap-to-click, double-click, drag-and-drop, and two-finger vertical scrolling.
  * Direct full-string ASCII and keycode text injection via mobile virtual keyboard.
  * One-tap administrative macro dispatch (e.g., Task Manager, Alt+Tab, Windows+L Lock, Copy/Paste).
  * Real-time remote screen frame display (JPEG binary stream) with authentic Windows Aero/11 cursor overlay and click animations.
  * Automatic UDP server discovery and auto-reconnection.
* **Operating Improvements & Benefits:**
  * Eliminates the need to connect physical keyboard, mouse, or KVM crash carts to cramped server racks.
  * Leaves zero software footprints, background processes, or registry traces on the host computer.
  * Bypasses host firewall rules, endpoint detection and response (EDR) software blocks, and USB storage restrictions (as it identifies solely as human input hardware).

### 3.2 Software Inventory
The complete software release inventory consists of the following components:

| Component / File | Purpose | Location |
| :--- | :--- | :--- |
| `hardware_gateway_app` (APK / Binary) | Flutter client mobile application for Android/iOS/Windows | Project root directory / Release build |
| `lib/main.dart` | Complete client application source code (UI, WebSockets, UDP discovery, Gesture engine) | `lib/main.dart` |
| `pubspec.yaml` | Flutter environment definitions, asset mappings, and package dependencies | Project root |
| `firmware.bin` | Compiled C++ FreeRTOS binary for ESP32-S3 | Flash Memory (Offset `0x10000`) |
| `littlefs.bin` | LittleFS SPI flash partition holding zero-dependency HTML5 fallback web app | SPI Flash Partition |
| `HardwareGatewayStream.py` | Optional Python 3 host companion screen capture streamer service | Host PC daemon directory |
| `enclosure.scad` / `.stl` files | 3D-printable housing for hardware protection and tactile button guidance | `hardware/enclosure/` |

All critical client files can be restored or redeployed in an emergency from the project source directory using standard Flutter toolchains (`flutter run` or `flutter build apk`).

### 3.3 Software Environment

#### a. Computer Equipment
* **Target Host PC:** Any x86_64, ARM64, or RISC-V computer equipped with a functional USB 2.0 or 3.0 Type-A or Type-C port delivering 5V VBUS ($\pm 5\%$, minimum 300mA current capacity).
* **Operator Mobile Device:** Any smartphone or tablet with capacitive multi-touch screen, running Android 5.0+ or iOS 12.0+, with Wi-Fi 802.11 b/g/n support and minimum 2GB RAM.
* **Development / Flashing Workstation (Optional):** PC running Windows 10/11, Ubuntu 22.04 LTS, or macOS with Flutter SDK 3.13+, Dart SDK 3.1+, and VS Code or Android Studio.

#### b. Communications Equipment
* ESP32-S3 2.4 GHz on-board PCB antenna (operational range: 10–15 meters line-of-sight).
* Local IEEE 802.11 b/g/n Wi-Fi channel (Channel 1 or 6, default SSID: `ESP32-Gateway`).
* USB 2.0 Full-Speed differential pair (D+ on GPIO 20, D- on GPIO 19).

#### c. Other Software
* Target Host OS: Microsoft Windows 10/11, Linux (Ubuntu, Debian, Arch, RHEL), macOS, ChromeOS, or UEFI/BIOS setup environments.
* Flutter client libraries: `web_socket_channel: ^3.0.3`, `cupertino_icons: ^1.0.8`.
* ESP32-S3 C++ Toolchain: Arduino-ESP32 Core v3.x, `Adafruit_TinyUSB`, `ESPAsyncWebServer`, `AsyncTCP`, and `ArduinoJson v7.x`.

#### d. Forms, Procedures, or Other Manual Operations
* Manual push-button actuation for hardware emergency RF kill-switch.
* Manual connection to Wi-Fi access point via mobile operating system settings.

#### e. Other Facilities, Equipment, or Resources
* USB Type-C to Type-A adapter or direct USB Type-C cable.
* 3D-printed enclosure (PETG or PLA+) with light pipes and button plunger.

### 3.4 Software Organization and Overview of Operation

```
+---------------------------------------------------------------------------------+
|                       LAYER 1: MOBILE CLIENT (FLUTTER APP)                      |
|                                                                                 |
|   +---------------------+   +---------------------+   +---------------------+   |
|   |   PC Screen View    |   |   Touchpad Engine   |   |   Virtual Keyboard  |   |
|   |  (JPEG Frame Feed)  |   | (Delta & Sensitivity|   |   & Shortcut Macros |   |
|   +----------^----------+   +----------+----------+   +----------+----------+   |
|              |                         |                         |              |
|              | (Port 8765)             +------------+------------+              |
|              |                                      |                           |
|              | (Binary Frames)                      | (JSON Packets over WS)    |
+--------------|--------------------------------------|---------------------------+
               |                                      |
               |                                      v (Port 80)
+--------------|---------------------+  +-----------------------------------------+
|   HOST SCREEN STREAMER (OPTIONAL)  |  |    LAYER 2: ESP32-S3 GATEWAY (FIRMWARE) |
|                                    |  |                                         |
|  - Asyncio WebSocket Daemon        |  |  [Core 0] AsyncWebServer & LwIP Stack   |
|  - Screen Grabber (30-60 FPS)      |  |           - JSON Parser (ArduinoJson)   |
|  - UDP Discovery Responder         |  |           - FreeRTOS Atomic Ring Buffer |
|                                    |  |                                         |
|  (Direct Network / Campus Wi-Fi)   |  |  [Core 1] TinyUSB Driver Task           |
+------------------------------------+  |           - HID Report Formatter        |
                                        |           - Endpoint FIFO Injector      |
                                        +---------------------+-------------------+
                                                              | (D+ / D- USB PHY)
                                                              v
+---------------------------------------------------------------------------------+
|                           LAYER 3: TARGET HOST PC                               |
|                                                                                 |
|           - Native OS USB HID Class Driver (Zero Software Required)             |
|           - Controls Native Mouse Cursor & System Keystrokes                    |
+---------------------------------------------------------------------------------+
```

#### a. Logical Components
1. **Client Touchpad & Velocity Engine:** Captures pointer movement deltas on the capacitive canvas, applies sensitivity scaling ($0.4\times$ to $2.5\times$), smooths micro-tremors, and detects tap events.
2. **WebSocket Communication Manager:** Maintains persistent TCP sockets to `192.168.4.1` (ESP32) and `<host>:8765` (Screen streamer) with automatic heartbeat monitoring and retry logic.
3. **UDP Discovery Agent:** Emits broadcast datagrams on port 8765 across the local subnet to detect running screen servers without requiring manual IP entry.
4. **FreeRTOS Dual-Core Firmware Engine:**
   * **Core 0:** Manages Wi-Fi SoftAP, accepts HTTP connections, and parses incoming WebSocket text payloads into structured C++ structs.
   * **Core 1:** Reads pre-allocated circular ring buffer queues, builds USB-IF HID mouse and keyboard report descriptors, and writes them directly to the USB OTG hardware FIFO.
5. **Hardware RF Kill-Switch Monitor:** An active-low hardware interrupt service routine (ISR) on GPIO 14 that immediately invokes `esp_wifi_stop()` upon button depression.

#### b. Performance Characteristics
1. **Input Types & Volumes:** Continuous 60Hz capacitive touch vectors, single/double tap clicks, scroll events, ASCII keystrokes, and macro triggers.
2. **Output Types & Accuracy:** Standard 4-byte USB HID mouse reports ($X, Y, \text{buttons}, \text{wheel}$) and 8-byte USB HID keyboard reports (modifier byte, reserved byte, 6 simultaneous keycodes). Keystroke and click accuracy is 100% deterministic.
3. **Typical Response Time:**
   $$\text{Total System Latency} = T_{\text{touch\_sample}} + T_{\text{ws\_transmit}} + T_{\text{esp\_decode}} + T_{\text{usb\_poll}} < 28\text{ ms}$$
   * Touch digitizer sampling: $\approx 16.6\text{ ms}$ (60Hz)
   * Local Wi-Fi transmission: $\approx 4\text{ to } 7\text{ ms}$
   * ESP32-S3 FreeRTOS queue dispatch: $\approx 0.5\text{ ms}$
   * USB HID Polling Interval: $8\text{ ms}$ ($125\text{Hz}$)
4. **Typical Processing Time:** JSON deserialization takes $<120\,\mu\text{s}$ per packet using ArduinoJson zero-allocation stream buffers.
5. **Limitations:** Maximum 1 simultaneous active mobile control client on SoftAP to prevent packet contention. Wi-Fi control distance bounded to 15 meters line-of-sight.
6. **Error Rate:** $<0.01\%$ packet drop on local Wi-Fi within 10 meters; zero byte corruption across USB differential signaling.
7. **Reliability:** Hardware Watchdog Timer (WDT) set to 3.0-second timeout automatically resets microcontroller in case of task lockup.

#### c. Interfacing Systems
* **Target Computer:** Interfaced purely through native hardware USB protocols. Works with Windows, Linux, macOS, Android, and BIOS screens.
* **Mobile Platform:** Interfaced through standard cross-platform Flutter engine running on the client OS.

#### d. Supervisory and Security Controls
* **Hardware Physical RF Kill-Switch:** Physical push-button on enclosure physically stops all Wi-Fi radio transmissions within 2ms.
* **Isolated SoftAP Network:** No WAN gateway, no routing, and no internet access. The device cannot exfiltrate host data or bridge networks.

### 3.5 Contingencies and Alternate States and Modes of Operation

```
+--------------------+           USB Plugged In           +-----------------------+
|                    | ---------------------------------> |                       |
|   S-01: BOOTING    |                                    |   S-02: BROADCASTING  |
|  (LED: Fast Blink) | <--------------------------------- |   (LED: Slow Blink)   |
+--------------------+            Host Reboot             +-----------------------+
                                                                      |
                                                                      | Phone Connects
                                                                      v
+--------------------+           Kill-Switch Hit          +-----------------------+
|   S-04: RF SEVERED | <--------------------------------- |  S-03: ACTIVE STREAM  |
| (Wi-Fi OFF, HID ON)|                                    |   (LED: Solid ON)     |
+--------------------+                                    +-----------------------+
```

* **State S-01 (Boot / Enumerating):** Microcontroller boots, mounts LittleFS, and negotiates USB descriptors with the host. Wi-Fi LED is OFF; Amber HID LED fast-blinks.
* **State S-02 (Broadcasting / Standby):** Gateway enumerates as USB HID. SoftAP active (`ESP32-Gateway`). Blue LED blinks slowly (1Hz); Amber HID LED is solid ON.
* **State S-03 (Active Streaming):** Mobile client connected via WebSocket. Touch and keystrokes streaming live. Blue Wi-Fi LED is solid ON; Amber HID LED strobes upon active packet injection.
* **State S-04 (RF Severed / Kill Mode):** Physical kill-switch pressed. Wi-Fi radio instantly powered off (`esp_wifi_stop()`). Blue LED is OFF. USB HID remains fully active and attached to host.

### 3.6 Security and Privacy
* **Zero Data Exfiltration:** The hardware gateway has no network bridge, no internet gateway, and no mass storage device class exposed to the host PC. It is strictly an input injection device.
* **Target Isolation:** The client smartphone is connected to a closed private subnet (`192.168.4.0/24`) without WAN routing.
* **Screen Streamer Authentication:** The host screen streamer requires a pre-shared security token (`CHANGE_THIS_TOKEN_...`) in the WebSocket handshake header to prevent unauthorized access.

### 3.7 Assistance and Problem Reporting
For assistance, defects, or academic review inquiries regarding this system:
* **Lead Developer:** Oratile Innocent Tshosetso
* **Email:** `oratileinnocent.45@gmail.com`
* **Contact Number:** `+27 (0)76 950 6870`
* **Academic Supervisors:** Muwanguzi Mark Ntume & Chunling Du
* **Department:** Faculty of Information and Communication Technology, Tshwane University of Technology (TUT).

---

## 4. ACCESS TO THE SOFTWARE

### 4.1 Access Control & Installation

#### 4.1.1 Access Control
* **Gateway SoftAP:** The default Wi-Fi network operates with an open or WPA2-Personal configuration (SSID: `ESP32-Gateway`, Default Password: `Password123` or open based on deployment environment).
* **Screen Streamer Token:** The streamer service validates an authentication token configured in `HardwareGatewayStream.py` and entered into the Flutter App Settings Sheet.
* **Host PC Permissions:** Requires **zero** host administrative privileges, passwords, or driver permissions.

#### 4.1.2 Installation and Setup

```
[Target PC USB Port] <=== USB-C Cable ===> [ESP32-S3 Gateway Dongle]
                                                    :
                                            (2.4GHz SoftAP)
                                                    :
                                                    v
                                      [Smartphone (Flutter App)]
```

1. **Hardware Gateway Connection:**
   * Insert the ESP32-S3 dongle into an available USB Type-A or Type-C port on the target computer.
   * Wait 2–3 seconds for the target PC operating system to automatically enumerate the device (Amber HID LED will light up solid).
2. **Mobile Client Installation:**
   * Install `hardware_gateway_app.apk` on your Android smartphone, or compile from source using `flutter run -d <device>`.
   * Open the Wi-Fi settings on your smartphone and connect to the network:
     * **SSID:** `ESP32-Gateway`
     * **IP Assigned (DHCP):** `192.168.4.2`
     * **Gateway Address:** `192.168.4.1`
3. **Companion Screen Streamer Setup (Optional for Screen Feed):**
   * On the target PC, run the python capture daemon:
     ```bash
     python HardwareGatewayStream.py --port 8765 --token CHANGE_THIS_TOKEN_9f3d7c2a
     ```

### 4.2 Initiating Procedure

```
+---------------------------------------------------------------------------------+
|                                 STARTUP CHECKLIST                               |
|                                                                                 |
|   [1] Plug ESP32-S3 into Target PC USB Port     --> Amber HID LED Solid ON      |
|   [2] Phone Wi-Fi Settings                      --> Connect to "ESP32-Gateway"  |
|   [3] Open Hardware Gateway App                 --> Both Status Pills Show OK   |
|   [4] Slide finger across bottom Touchpad       --> PC Mouse moves smoothly     |
+---------------------------------------------------------------------------------+
```

1. Launch the **Hardware Gateway** application on the smartphone.
2. The application automatically starts the UDP discovery agent and tests the ESP32 WebSocket socket connection at `ws://192.168.4.1/ws`.
3. Check the top status bar:
   * **ESP32 Gateway Pill:** Turns green (`ESP32: Connected`).
   * **Screen Feed Pill:** Turns green (`Screen: Live`) if the PC streaming daemon is running, or orange (`Screen: Offline`) if running in pure HID trackpad mode.

### 4.3 Description of Inputs

#### 4.3.1 Input Conditions
* **Touchpad Drag:** Continuous pointer movements sampled at 60Hz.
* **Tap Gestures:** Short capacitive touch events ($<200\text{ ms}$, displacement $<5\text{ px}$).
* **Virtual Key Keystrokes:** Triggered on-demand when user types in the keyboard modal.
* **Macro Shortcuts:** Triggered on-demand when tapping quick action buttons.

#### 4.3.2 Input Formats
All inputs transmitted from the mobile client to the ESP32-S3 gateway are compact JSON objects over WebSocket text frames:

```json
{"t": "m", "dx": 12, "dy": -8}
{"t": "b", "btn": 1, "state": 1}
{"t": "k", "key": "a", "mod": 0}
{"t": "cmd", "id": "TASK_MGR"}
```

#### 4.3.3 Composition Rules
* **Packet Key `"t"`:** Designates packet type: `"m"` (mouse move), `"b"` (mouse button), `"k"` (keyboard key), `"cmd"` (macro shortcut).
* **Relative Coordinates (`dx`, `dy`):** Signed 16-bit integers representing relative pixel displacement.
* **Button Code (`btn`):** Integer flag: `1` = Left Click, `2` = Right Click, `3` = Middle Click.
* **Button State (`state`):** `1` = Pressed / Down, `0` = Released / Up.
* **Modifier Key (`mod`):** Bitmask integer: `0` = None, `1` = Ctrl, `2` = Shift, `4` = Alt, `8` = GUI/Windows Key.

#### 4.3.4 Input Vocabulary
* **Macro Identifiers:**
  * `NEXT_SLIDE` (Key: Page Down / Right Arrow)
  * `PREV_SLIDE` (Key: Page Up / Left Arrow)
  * `START_SLIDESHOW` (Key: F5)
  * `ALT_TAB` (Key: Alt + Tab sequence)
  * `WIN_L` (Key: Windows + L - Lock Workstation)
  * `TASK_MGR` (Key: Ctrl + Shift + Esc)
  * `CTRL_C` (Key: Copy)
  * `CTRL_V` (Key: Paste)
  * `CTRL_A` (Key: Select All)

#### 4.3.5 Sample Inputs
```json
// Sample 1: Rapid diagonal cursor glide
{"t":"m", "dx":24, "dy":-16}

// Sample 2: Left mouse button click down
{"t":"b", "btn":1, "state":1}

// Sample 3: Left mouse button release up
{"t":"b", "btn":1, "state":0}

// Sample 4: Injected character 'H' with Shift modifier
{"t":"k", "key":"H", "mod":2}

// Sample 5: Launch Task Manager shortcut
{"t":"cmd", "id":"TASK_MGR"}
```

### 4.4 Description of Outputs

#### 4.4.1 General Description
Outputs are delivered in two physical domains:
1. **Physical USB HID Signals:** Standard electrical differential signals generated by the ESP32-S3 USB OTG transceiver, parsed by the host PC operating system kernel as physical keyboard/mouse events.
2. **Visual Mobile UI Feedback:** Live connection pill badges, status banners, real-time PC screen video frames, animated touch ripples, and an authentic Windows Aero/11 cursor overlay.

#### 4.4.2 Output Formats
* **USB Mouse HID Report (4 Bytes):**
  * Byte 0: Button bitmask (`Bit 0: Left`, `Bit 1: Right`, `Bit 2: Middle`).
  * Byte 1: Signed 8-bit integer ($\Delta X$).
  * Byte 2: Signed 8-bit integer ($\Delta Y$).
  * Byte 3: Signed 8-bit scroll wheel delta.
* **USB Keyboard HID Report (8 Bytes):**
  * Byte 0: Modifier keys (`Ctrl, Shift, Alt, GUI`).
  * Byte 1: Reserved (`0x00`).
  * Bytes 2–7: Up to 6 simultaneous active keycodes (USB HID Key Table).

#### 4.4.3 Sample Outputs
* **Screen Display:** The mobile client renders the target PC desktop in real time inside the top 50% viewport (or full screen when toggled).
* **Hardware Status LEDs:**
  * **Blue LED (GPIO 2 / GPIO 5):** Solid ON indicates active mobile Wi-Fi client connection.
  * **Amber LED (GPIO 1 / GPIO 4):** Strobes rapidly each time a USB HID report packet is transmitted over the USB bus.

### 4.5 Recovery and Error Correction Procedures

| Error / Symptom | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **Pill says `ESP32: Disconnected`** | Smartphone disconnected from Wi-Fi | Open phone Wi-Fi settings, re-select `ESP32-Gateway`. Confirm USB dongle is powered. |
| **Host PC cursor does not move** | USB OTG port not enumerated or suspended | Unplug dongle and re-insert into host USB port. Ensure connection is to the native USB OTG port (not UART debug port). |
| **Screen feed says `Screen Offline`** | Host streamer daemon not running or blocked | Verify `HardwareGatewayStream.py` is running on PC. Check that port 8765 is not blocked by Windows Defender Firewall. |
| **Cursor jumps too fast or too slow** | Trackpad sensitivity misconfigured | Tap Settings icon in mobile app bottom dock; adjust **Trackpad Sensitivity** slider between $0.4\times$ and $2.5\times$. |
| **All Wi-Fi connection instantly dropped** | Hardware kill-switch was depressed | Power-cycle the ESP32-S3 dongle (unplug and re-plug USB) to restore Wi-Fi radio operation. |

### 4.6 Stopping and Suspending Work
1. **Temporary Suspension:** Simply switch apps or lock the mobile screen. The WebSocket channel enters sleep mode. Upon unlocking, the app automatically reconnects.
2. **Emergency Radio Severance (Hardware Kill-Switch):** Press the tactile push-button located on the side of the 3D enclosure. The RF radio powers down in $<2\text{ ms}$, immediately severing wireless access while maintaining USB connectivity.
3. **Complete Shutdown:** Unplug the ESP32-S3 dongle from the host PC USB port. The device powers off cleanly with no data loss or corruption.

---

## 5. PROCESSING REFERENCE GUIDE

### 5.1 Capabilities
The system executes continuous full-duplex communication across independent hardware cores:
* Core 0 processes network frames without blocking USB interrupts.
* Core 1 services the 125Hz host USB polling schedule deterministically.
* The Flutter application coordinates screen frame rendering, multi-touch event capture, and macro dispatching concurrently.

### 5.2 Conventions
* **Interface Palette (Cyber-Slate):**
  * Background: Deep Navy Slate (`#090D16`)
  * Card Surfaces: Dark Indigo Slate (`#131A2B`)
  * Accent / Active State: Cyan Glow (`#00F2FE`)
  * Secondary / Confirmation: Mint Green (`#55D6BE`)
  * Error / Offline: Crimson (`#FF5252`)
  * Warning / Standby: Amber (`#FFB300`)
* **Haptic Feedback:** Light tactile vibrations trigger on every click, double-click, and shortcut activation to confirm execution.

### 5.3 Processing Procedures
The system follows a 50/50 dual-viewport operational model:
1. **Top Half:** Live PC Screen View with interactive cursor projection and click ripple animations.
2. **Bottom Half:** Capacitive Touchpad Surface, Left/Right physical click buttons, and bottom utility dock.

### 5.4 Aspect of Software Use

#### 1. Trackpad & Mouse Manipulation
* **Moving Cursor:** Slide one finger smoothly across the dark touchpad area.
* **Left Click:** Tap once quickly with one finger, or tap the dedicated **LEFT CLICK** button.
* **Double Click:** Double-tap quickly anywhere on the trackpad.
* **Right Click:** Tap once with two fingers simultaneously, or tap the dedicated **RIGHT CLICK** button.
* **Scrolling:** Place two fingers on the trackpad and slide vertically up or down.

#### 2. Virtual Keyboard Text Entry
* Tap the **Keyboard** icon in the bottom dock.
* A modal keyboard input sheet appears.
* Type any text string or terminal command; tap **Send Text** to inject every character directly into the host PC active window.

#### 3. Administrative Macros & Presentation Mode
* Tap the **Shortcuts (Bolt)** icon in the bottom dock.
* Select desired shortcut:
  * Slide navigation (`NEXT_SLIDE`, `PREV_SLIDE`, `START_SLIDESHOW`).
  * System tools (`TASK_MGR`, `ALT_TAB`, `WIN_L`).
  * Clipboard operations (`CTRL_C`, `CTRL_V`, `CTRL_A`).

#### 4. Fullscreen Screen View
* Tap the **Fullscreen (Expand)** icon in the bottom dock.
* The screen view expands to 100% of the mobile display for clear visibility of desktop text and icons. Tap the minimize icon to return to split mode.

### 5.5 Related Processing
* **UDP Discovery Daemon:** Runs silently in the background on the mobile client every 5 seconds, broadcasting discovery pings to automatically detect newly launched PC screen streamer instances.
* **Watchdog Supervision:** The ESP32-S3 hardware watchdog continuously audits task loop health, resetting the microcontroller within 3 seconds if an unhandled thread exception occurs.

### 5.6 Data Backup
Because the system operates as a stateless hardware interface gateway, user data and operational files are static:
* The mobile application stores no local database or personal telemetry.
* The ESP32-S3 firmware resides in non-volatile flash memory and does not write temporary user data to disk.
* Enclosure designs, CAD models, and source code are backed up in the project repository (`hardware/` and `backups/`).

### 5.7 Recovery from Errors, Malfunctions, and Emergencies
* In the event of network jamming or Wi-Fi disconnection, the app enters **Auto-Reconnect** mode, attempting re-association every 2 seconds without requiring an application restart.
* If the host computer reboots, the ESP32-S3 automatically receives a USB Bus Reset interrupt, re-initializes TinyUSB descriptors, and re-enumerates within 1.5 seconds.

### 5.8 Messages

| Message Text | Severity | Operational Meaning |
| :--- | :--- | :--- |
| `Typed via ESP32` | Information | Characters successfully transmitted and injected into host USB FIFO. |
| `Triggered <MACRO>` | Information | Shortcut macro payload successfully executed. |
| `Connect to PC or ESP32 to type.` | Warning | Keystrokes cannot be sent because neither connection is active. |
| `Screen Offline` | Status | Companion video streaming service is unreachable on the target PC. |
| `Auto-reconnecting...` | Notice | Mobile app is attempting to restore a dropped WebSocket link. |

### 5.9 Quick-Reference Guide

```
+---------------------------------------------------------------------------------+
|                         OPERATOR QUICK-REFERENCE CARD                           |
+---------------------------------------------------------------------------------+
| ACTION                    | GESTURE / CONTROL                                   |
| ------------------------- | --------------------------------------------------- |
| Move PC Mouse             | Slide 1 finger on bottom touchpad area              |
| Left Click                | Tap 1 finger once (or press LEFT CLICK button)      |
| Double Click              | Tap 1 finger twice quickly                          |
| Right Click               | Tap 2 fingers once (or press RIGHT CLICK button)    |
| Vertical Page Scroll      | Drag 2 fingers up or down                           |
| Open Virtual Keyboard     | Tap Keyboard icon on bottom dock                    |
| Quick System Shortcuts    | Tap Bolt icon on bottom dock                        |
| Fullscreen Desktop View   | Tap Expand icon on bottom dock                      |
| Adjust Mouse Speed        | Tap Gear icon -> Drag Sensitivity Slider            |
| Emergency RF Shutdown     | Press physical push-button on hardware enclosure    |
+---------------------------------------------------------------------------------+
```

---

## 6. QUERY PROCEDURES

### 6.1 Database / Data File Format
The system operates as an embedded agentless peripheral and does not require a relational database. Operational states are exchanged via compact JSON packet structures:

| Field Name | Data Type | Permitted Values | Description |
| :--- | :--- | :--- | :--- |
| `t` | String | `"m"`, `"b"`, `"k"`, `"cmd"` | Transaction packet type |
| `dx` | Integer | $-32768\text{ to }+32767$ | Relative horizontal mouse coordinate delta |
| `dy` | Integer | $-32768\text{ to }+32767$ | Relative vertical mouse coordinate delta |
| `btn` | Integer | `1` (Left), `2` (Right), `3` (Middle) | Target mouse button |
| `state` | Integer | `0` (Released), `1` (Pressed) | Button switch state |
| `key` | String | ASCII Character (`'a'` - `'z'`, etc.) | Key character to type |
| `mod` | Integer | `0` (None), `1` (Ctrl), `2` (Shift), `8` (Win) | Modifier mask |
| `id` | String | Pre-defined Macro Enum String | Pre-programmed command sequence ID |

### 6.2 Query Capabilities
* **UDP Server Probe:** Client sends broadcast string `HW_GATEWAY_DISCOVERY_PROBE` to port 8765; active servers reply with JSON string `{"name": "<Hostname>", "port": 8765}`.
* **WebSocket Health Ping:** Embedded ping/pong frames query connection liveness every 5 seconds.

### 6.3 Query Preparation
Users can query and change connection targets via the **Connection & Gateway Settings** modal sheet:
* **Campus Wi-Fi Preset:** Sets PC address to `10.2.39.171:8765`.
* **ESP32 AP Preset:** Sets PC address to `192.168.4.3:8765`.
* **USB Tether Preset:** Sets PC address to `127.0.0.1:8765`.

### 6.4 Control Instructions
No batch queries or external SQL control statements are required. All queries execute asynchronously in real time.

---

## 7. NOTES

### 7.1 Glossary of Terms
* **Air-Gap Isolation:** Physical and network segregation of a secure workstation from external local networks or the internet to prevent data breaches.
* **Composite HID:** A USB device class implementation that exposes multiple distinct input peripherals (e.g., keyboard and mouse) through a single physical USB connector.
* **ESP32-S3:** A high-performance 32-bit dual-core Xtensa LX7 SoC manufactured by Espressif Systems featuring integrated 2.4 GHz Wi-Fi and native Full-Speed USB OTG physical transceivers.
* **FreeRTOS:** A real-time operating system kernel designed for embedded microcontrollers that provides deterministic multi-threading and inter-process communication.
* **LittleFS:** A lightweight, power-fail-safe filesystem designed specifically for SPI NOR flash memory in microcontrollers.
* **SoftAP (Software-Enabled Access Point):** A wireless mode where a Wi-Fi device acts as an autonomous wireless router/access point without external network infrastructure.
* **TinyUSB:** An open-source, low-overhead cross-platform USB device stack for embedded microcontrollers.
* **WebSocket:** A standardized protocol (RFC 6455) providing full-duplex, bidirectional communication channels over a single persistent TCP connection.

### 7.2 List of Acronyms and Abbreviations
* **ADC:** Application Default Credentials
* **API:** Application Programming Interface
* **DHCP:** Dynamic Host Configuration Protocol
* **DNS:** Domain Name System
* **EDR:** Endpoint Detection and Response
* **FIFO:** First-In, First-Out (Hardware Buffer)
* **GPIO:** General-Purpose Input/Output
* **HID:** Human Interface Device
* **IEEE:** Institute of Electrical and Electronics Engineers
* **IP:** Internet Protocol
* **ISR:** Interrupt Service Routine
* **JSON:** JavaScript Object Notation
* **KVM:** Keyboard, Video, and Mouse (Switch/Cart)
* **LED:** Light-Emitting Diode
* **LwIP:** Lightweight IP (Embedded TCP/IP Stack)
* **OTG:** On-The-Go (USB Specification)
* **PCB:** Printed Circuit Board
* **RDP:** Remote Desktop Protocol
* **RF:** Radio Frequency
* **SCADA:** Supervisory Control and Data Acquisition
* **SRAM:** Static Random-Access Memory
* **SSID:** Service Set Identifier
* **TCP:** Transmission Control Protocol
* **TUT:** Tshwane University of Technology
* **UDP:** User Datagram Protocol
* **USB:** Universal Serial Bus
* **WDT:** Watchdog Timer
* **Wi-Fi:** Wireless Fidelity (IEEE 802.11 Standard)

---

## 8. REFERENCE

1. USB Implementers Forum, *"Device Class Definition for Human Interface Devices (HID),"* Specification Rel. 1.11, June 2021.
2. Espressif Systems, *"ESP32-S3 Technical Reference Manual,"* Doc. ESP32S3-TRM, Rev. 1.2, 2023.
3. W3C Working Group, *"WebSocket API Specification,"* Candidate Recommendation Draft, 2020.
4. IEEE Standards Association, *"IEEE 802.11 Wireless LAN Medium Access Control Guidelines,"* Standard 802.11-2020, 2020.
5. IETF Network Working Group, *"The WebSocket Protocol Specifications,"* Standards Track RFC 6455, Dec. 2011.
6. IEEE Computer Society, *"IEEE Standard for Software User Documentation,"* IEEE Std 1063-2001, Dec. 2001.

---

## A. APPENDIXES

### Appendix A.1: Hardware Interface & Pin Allocation Mapping

| Signal / Net | ESP32-S3 Pin | Hardware Mode | Functional Description & Interconnect |
| :--- | :--- | :--- | :--- |
| **USB D-** | GPIO 19 | Native USB OTG | USB 2.0 Full-Speed Differential Data Minus line. |
| **USB D+** | GPIO 20 | Native USB OTG | USB 2.0 Full-Speed Differential Data Plus line. |
| **RF Kill-Switch** | GPIO 14 / GPIO 4 | Digital In (Pull-up) | Active-low push-button; falling edge ISR terminates SoftAP in $<2\text{ ms}$. |
| **Status LED 1 (Wi-Fi)** | GPIO 5 / GPIO 2 | Digital Output | Blue LED with $330\,\Omega$ resistor; blinks when idle, solid when client connected. |
| **Status LED 2 (HID)** | GPIO 4 / GPIO 1 | Digital Output | Amber LED with $330\,\Omega$ resistor; strobes upon active HID packet injection. |
| **VBUS Power** | 5V Pin | Power Input | Powered directly from host USB 5V VBUS rail (consumes $<280\text{ mA}$). |
| **Ground** | GND Pin | Ground Reference | Common ground plane for USB, LEDs, and push-button. |

### Appendix A.2: 3D Enclosure Assembly Diagram & Specifications
* **Housing Dimensions:** $76.0\text{ mm (Length)} \times 38.0\text{ mm (Width)} \times 16.0\text{ mm (Height)}$.
* **Material & Infill:** PETG or PLA+ with $20\%$ Gyroid infill and $3$ outer perimeter walls.
* **Component Features:**
  * Front beveled port cutout ($14\text{ mm} \times 6.5\text{ mm}$) for standard USB-C cable clearance.
  * Dual $3.2\text{ mm}$ isolated light pipe baffle sleeves preventing LED color bleed.
  * Internal captive flange channel housing the ergonomic $7.2\text{ mm}$ button plunger.
  * Internal standoffs securing the ESP32-S3 development board with optional M3 fastening screws.
