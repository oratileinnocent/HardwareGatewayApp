# TSHWANE UNIVERSITY OF TECHNOLOGY
## FACULTY OF INFORMATION AND COMMUNICATION TECHNOLOGY
### NATIONAL DIPLOMA: COMPUTER SYSTEMS ENGINEERING
### PROJECT DESIGN III: PJD 301B / IDC30BI

---

# COMPREHENSIVE PROJECT PORTFOLIO
### PROJECT PROPOSAL &bull; DESIGN DOCUMENTATION &bull; USER MANUAL

| Parameter | Details |
| :--- | :--- |
| **PROJECT TITLE** | **Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation** |
| **LECTURER NAMES** | Muwanguzi Mark Ntume and Chunling Du |
| **STUDENT NAME** | Oratile Innocent Tshosetso |
| **STUDENT NUMBER** | 222883253 |
| **EMAIL ADDRESS** | oratileinnocent.45@gmail.com |
| **CONTACT NUMBERS** | 076 950 6870 |
| **ACADEMIC YEAR** | 2026 |
| **DOCUMENT REVISION** | Final Master Submission (Unified Binder) |

---

## MASTER PORTFOLIO TABLE OF CONTENTS

- [PART I: PROJECT PROPOSAL](#part-i-project-proposal)
  - 1. [Introduction](#1-introduction)
  - 2. [Project Objectives](#2-project-objectives)
  - 3. [Project Description & Target Market](#3-project-description)
  - 4. [Project Technology](#4-project-technology)
  - 5. [Timetable](#5-timetable)
  - 6. [Budget & Financial Procurement](#6-budget)
  - 7. [Conclusion & References](#7-conclusion--references)
- [PART II: TECHNICAL DESIGN DOCUMENTATION](#part-ii-technical-design-documentation)
  - 1. [Introduction & Demarcation](#1-introduction-1)
  - 2. [Systems Overview](#2-systems-overview)
  - 3. [Design Considerations](#3-design-considerations)
  - 4. [Assumptions and Dependencies](#4-assumptions-and-dependencies)
  - 5. [Goals and Guidelines](#5-goals-and-guidelines)
  - 6. [Development Methods & Standards](#6-development-methods)
  - 7. [Architectural Strategies](#7-architectural-strategies)
  - 8. [System & Subsystem Architecture](#8-system-architecture)
  - 9. [Hardware Interface & Pin Allocation](#9-hardware-interface--pin-allocation)
  - 10. [Detailed System Design (IEEE 1016)](#10-detailed-system-design)
  - 11. [Functional Flow & State Analysis](#11-functional-flow--state-analysis)
  - 12. [Conclusion, Glossary & Bibliography](#12-conclusion-glossary--bibliography)
- [PART III: SOFTWARE & HARDWARE USER MANUAL](#part-iii-software--hardware-user-manual)
  - 1. [Scope & System Overview](#1-scope)
  - 2. [Referenced Documents](#2-referenced-documents)
  - 3. [Software Summary](#3-software-summary)
  - 4. [Access to Software & Setup](#4-access-to-the-software)
  - 5. [Processing Reference Guide](#5-processing-reference-guide)
  - 6. [Query Procedures](#6-query-procedures)
  - 7. [Notes, Glossary & Acronyms](#7-notes-glossary--acronyms)
  - 8. [References & Appendixes](#8-reference-1)

---

# PART I: PROJECT PROPOSAL
*Submitted 08 September 2026*

## 1. Introduction
In modern IT administration, remote troubleshooting, and digital workflow management, seamless cross-device control is essential. However, traditional software-based remote desktop solutions (such as TeamViewer, AnyDesk, and Windows RDP) present significant operational constraints. They mandate pre-installed agent software, elevated host administrative permissions, persistent internet access, and unrestricted firewall permissions. In high-security, air-gapped, or restricted environments, installing external client software is frequently blocked by host security policies.

This project addresses these gaps by proposing a **Hardware-Level USB Remote Access Gateway** powered by an ESP32-S3 microcontroller. By emulating native USB Human Interface Device (HID) protocols directly at the hardware layer, the target computer recognizes the gateway as a standard, driverless physical keyboard and mouse. A mobile smartphone connects wirelessly to the gateway's embedded WebSocket server, transmitting real-time touch vectors and keystrokes. This creates an agentless, zero-configuration remote access bridge that operates independently of the target host's operating system, software permissions, or network firewalls.

## 2. Project Objectives
The primary objective of this project is to design, construct, and evaluate a zero-driver hardware gateway that translates wireless mobile inputs into native USB HID events:
* **Hardware HID Emulation:** Configure the ESP32-S3 USB OTG peripheral to natively register as a combined USB Keyboard and Mouse device on Windows, Linux, and macOS.
* **Low-Latency Wireless Streaming:** Implement an embedded C++ WebSocket server on the ESP32-S3 delivering sub-30ms round-trip latency for real-time touch vector transmission.
* **Mobile Control Web Application:** Develop a responsive HTML5 touch interface (hosted directly from LittleFS flash memory) featuring a touchpad area, multi-touch scroll, right-click actions, and a virtual keyboard.
* **Macro Execution Engine:** Implement one-tap shortcut execution for complex keystroke sequences (e.g., Win+R, terminal scripts, system control shortcuts).
* **Hardware Security Integration:** Incorporate a physical GPIO kill-switch and status LED indicators to instantly drop wireless broadcasting at the hardware layer when activated.

## 3. Project Description
The system consists of an embedded hardware dongle that bridges a smartphone and a host computer. Upon insertion into a host USB port, the target machine automatically enumerates the device as a standard USB human input device without requiring driver installations or administrative rights.

* **Target Market:** Designed as an independent prototype for IT support engineers, system administrators managing headless or air-gapped computers, network technicians performing field maintenance, and accessibility users requiring mobile-driven PC control.
* **Scope & Features:** Physical USB HID signal injection, local peer-to-peer Wi-Fi (SoftAP) hosting, real-time touch vector parsing, and physical security cutoff mechanisms. Out of scope for this initial phase are video feed capture and Bluetooth Classic audio passthrough, maintaining a strict focus on low-latency input control and high reliability.

## 4. Project Technology
* **ESP32-S3 Microcontroller:** Dual-core Xtensa LX7 processor with native USB OTG hardware support required for USB HID stack emulation.
* **Firmware Framework:** C++ utilizing Arduino ESP32 core and Adafruit_TinyUSB / USBHID libraries for native descriptor configuration.
* **Communication Protocol:** Asynchronous WebSockets over HTTP (ESPAsyncWebServer) operating over a 2.4 GHz SoftAP Wi-Fi network.
* **Mobile UI:** Lightweight HTML5, CSS3, and JavaScript touch-event handling library compiled into flash storage using LittleFS filesystem.
* **Hardware Peripherals:** Physical tactile pushbuttons for hardware RF disablement and dual-color status LEDs (Wi-Fi activity and HID bus state).

## 5. Timetable
| Activity | Description of Work | Start and End Dates |
| :--- | :--- | :--- |
| **Phase 1** | Requirements analysis, hardware component procurement, and ESP32-S3 USB HID stack prototyping. | 01 Sep 2026 – 20 Sep 2026 |
| **Phase 2** | Embedded C++ firmware development, WebSocket server setup, and mobile UI HTML5 touch gesture engine implementation. | 21 Sep 2026 – 15 Oct 2026 |
| **Phase 3** | Hardware assembly, GPIO kill-switch integration, system latency benchmarking, and cross-OS (Win/Linux/Mac) compatibility testing. | 16 Oct 2026 – 05 Nov 2026 |
| **Phase 4** | Final data analysis, PJD2316 report compilation, visual schematic design, and project presentation defense. | 06 Nov 2026 – 25 Nov 2026 |

## 6. Budget
| Items | Supplier | Quantity | Unit Price (ZAR) | Total (ZAR) |
| :--- | :--- | :--- | :--- | :--- |
| ESP32-S3 Dev Board (Dual USB-C) | Micro Robotics | 2 | R 185.00 | R 370.00 |
| Micro SD Card Module (SPI) | Communica | 1 | R 45.00 | R 45.00 |
| Tactile Push Buttons & LEDs | Communica | 5 | R 5.00 | R 25.00 |
| Breadboard & Jumper Wire Pack | Micro Robotics | 1 | R 85.00 | R 85.00 |
| Custom Prototyping Enclosure (3D Print) | Local Lab Service | 1 | R 120.00 | R 120.00 |
| **Total Estimated Budget:** | | | | **R 645.00** |

* **Budget Management Strategy:** Procurement will be sourced locally from certified South African electronics distributors to avoid import customs delays. Hardware redundancy (2x ESP32-S3 boards) is budgeted to mitigate risk of component failure during breadboard prototyping.

## 7. Conclusion & References
The proposed Hardware-Level USB Remote Access Gateway provides an innovative, agentless approach to cross-device computer interaction. By shifting remote control functionality from software applications down to physical USB HID emulation, the project solves long-standing challenges associated with administrative locks, OS compatibility, and firewall restrictions.
1. USB Implementers Forum, *“Device Class Definition for Human Interface Devices (HID),”* Version 1.11, 2021.
2. Espressif Systems, *“ESP32-S3 Technical Reference Manual,”* Version 1.2, 2023.
3. W3C, *“The WebSocket API – W3C Candidate Recommendation,”* 2020.

---

# PART II: TECHNICAL DESIGN DOCUMENTATION
*Submitted 15 September 2026*

## 1. Introduction & Demarcation
* **Primary Intent & Engineering Purpose:** This technical design documentation defines the architectural blueprints, firmware decomposition, electrical interconnects, and protocol workflows for the Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation for Project Design III (PJD 301B).
* **System Demarcation & Technical Scope:** Centers on the implementation of the Espressif ESP32-S3 dual-core microcontroller, leveraging its on-die Full-Speed USB OTG physical transceiver for direct differential signaling (D+/D-) on GPIO pins 19 and 20. Firmware encompasses embedded C++ utilizing FreeRTOS multiprocessing, TinyUSB descriptor generation, an isolated 802.11 b/g/n Wi-Fi Access Point (SoftAP), and LittleFS flash memory.
* **Stakeholder & Academic Governance:** Submitted for academic review by project supervisors Muwanguzi Mark Ntume and Chunling Du, fulfilling curriculum evaluation benchmarks for the National Diploma in Computer Systems Engineering at TUT.

## 2. Systems Overview
The system operates as an autonomous, agentless hardware dongle that establishes a responsive human-interface bridge between a mobile smartphone and a target host computer. When plugged directly into a host USB receptacle, the ESP32-S3 hardware natively enumerates as a standard USB Composite Human Interface Device (HID), exposing integrated keyboard and mouse collections that require zero host-side drivers or administrator privileges.

Concurrently, the gateway initializes an isolated, high-speed 2.4 GHz SoftAP network (`SSID: ESP32-Gateway`). The mobile client opens a persistent full-duplex WebSocket channel over TCP port 80. Real-time touch coordinates, tap events, gestures, and keystrokes are serialized into compact JSON packets and streamed to the gateway. The microcontroller's firmware parses these packets across a FreeRTOS inter-core queue, translates them into compliant USB HID report buffers, and injects them into the physical USB endpoint FIFO with guaranteed sub-30ms latency.

## 3. Design Considerations
* **Sub-30ms End-to-End Latency Target:** Total system latency ($T_{\text{total}} = T_{\text{touch\_sample}} + T_{\text{ws\_transmit}} + T_{\text{esp\_decode}} + T_{\text{usb\_poll}}$) is engineered to consistently remain below 30ms through 60Hz digitizer sampling, asynchronous non-blocking sockets, zero-copy memory dispatching, and a 125Hz USB polling rate.
* **Zero-Driver Universal Compatibility:** Compliance with USB-IF HID Specification v1.11 ensures that the gateway is recognized out-of-the-box by Windows 10/11, macOS, and Linux without administrative privileges, driver installers, or background daemons.
* **Air-Gap Integrity & Physical Radio Cutoff:** Operates strictly in local SoftAP mode without WAN uplinks or bridge interfaces. An active-low tactile push-button tied to hardware GPIO 4/14 triggers an immediate interrupt terminating RF broadcasting within 2ms.
* **Power and Thermal Budgeting:** Operates solely from the host 5V VBUS rail (5V ± 5%, max 500mA). Peak power consumption remains below 280mA (1.4W) under continuous Wi-Fi transmission and active USB enumeration.

## 4. Assumptions and Dependencies
* **Related Software & Hardware Stacks:** Espressif ESP32-S3-WROOM-1 module (Xtensa LX7 dual-core @ 240MHz, 16MB Flash, 8MB PSRAM); host computer with standard USB 2.0/3.0 port; Arduino-ESP32 Core v3.x, Adafruit_TinyUSB framework, AsyncTCP, ESPAsyncWebServer, ArduinoJson v7.x; smartphone supporting Touch Events Level 2 and WebSocket API.
* **Target Operator Characteristics:** Field technicians, enterprise IT administrators, and accessibility users.
* **General Constraints:** Line-of-sight range 10–15m; strict bill-of-materials budget capped at R 645.00 ZAR.

## 5. Goals and Guidelines
* **KISS Principle:** Zero-framework vanilla client delivery (<100ms load time from flash).
* **Throughput Maximization vs. Deterministic Memory Limits:** Core 0 dedicated to wireless sockets; Core 1 dedicated to USB HID formatting; fixed-size circular ring buffers.
* **Ergonomic Tactile Parity:** Non-linear velocity scaling algorithm ($V = \alpha \cdot (\Delta D)^{1.2}$) smoothing micro-tremors while allowing rapid flick gestures.

## 6. Development Methods & Standards
* **Standards:** IEEE 1016 Systems Design Documentation Standard, USB-IF HID Specification v1.11, IETF RFC 6455 WebSocket Protocol.
* **Alternatives Evaluated:** Waterfall Lifecycle (rejected due to rigid stages), Software Remote Desktop (rejected due to host permission mandates), Bluetooth Classic (rejected due to pairing latency).

## 7. Architectural Strategies
* C++ Arduino/ESP-IDF toolchain.
* Component reuse (`Adafruit_TinyUSB`, `AsyncTCP`, `ESPAsyncWebServer`, `ArduinoJson`).
* Direct differential USB PHY routing to GPIO 19 and 20.
* Hardware WDT set to 3.0-second timeout.
* Active-low emergency RF termination interrupt executing `esp_wifi_stop()`.

## 8. System & Subsystem Architecture
```
+------------------------------------+      +------------------------------------+      +------------------------------------+
|        LAYER 1: MOBILE CLIENT      |      |      LAYER 2: ESP32-S3 GATEWAY     |      |        LAYER 3: TARGET PC          |
|   HTML5 Touch Canvas (60Hz)        |      |   AsyncWebServer & LwIP (Core 0)   |      |   Native OS HID Driver             |
|   Gesture & Velocity Math Engine   | ===> |   Packet Parser & Atomic Queue     | ===> |   Mouse Cursor & Keystroke         |
|   WebSocket Client Serializer      |      |   TinyUSB Composite HID (Core 1)   |      |   Ingestion                        |
+------------------------------------+      +------------------------------------+      +------------------------------------+
            [Wi-Fi SoftAP / WS]                               [USB OTG D+ / D-]
```
* **Subsystems:** 1. Network & Communication; 2. Touch & Input Processing; 3. USB HID Translation; 4. Hardware Safety & Power.

## 9. Hardware Interface & Pin Allocation
| Signal / Net | ESP32-S3 Pin | Hardware Mode | Functional Description |
| :--- | :--- | :--- | :--- |
| **USB D-** | GPIO 19 | Native USB OTG | USB 2.0 Full-Speed Differential Data Minus line. |
| **USB D+** | GPIO 20 | Native USB OTG | USB 2.0 Full-Speed Differential Data Plus line. |
| **RF Kill-Switch** | GPIO 4 / 14 | Digital In (Pull-up) | Active-low push-button; falling edge ISR terminates SoftAP in <2ms. |
| **Wi-Fi Status LED** | GPIO 2 / 5 | Digital Output | Blue LED; blinks when idle, solid when client is connected. |
| **HID Activity LED** | GPIO 1 / 4 | Digital Output | Amber LED; strobes on active HID packet transmission to host. |
| **MicroSD SPI (Opt)** | GPIO 10, 11, 12, 13 | SPI Bus | Optional flash card storage interface for macro sequences. |

## 10. Detailed System Design (IEEE 1016)
* **Classes:** `TouchEngine` (JS), `AsyncWsHandler` (C++), `PacketParser` (C++), `UsbHidManager` (C++), `KillSwitchISR` (Hardware ISR).
* **Packet Formats:**
  * Mouse Vector: `{"t":"m", "dx":14, "dy":-8}`
  * Mouse Click: `{"t":"b", "btn":1, "state":1}`
  * Key Injection: `{"t":"k", "key":"a", "mod":0}`
  * Macro Command: `{"t":"cmd", "id":"WIN_R_CMD"}`

## 11. Functional Flow & State Analysis
| Process ID | Name | Trigger | Description & Output |
| :--- | :--- | :--- | :--- |
| **P-01** | USB Enumeration | Plugged into host USB | Host registers Composite HID; Amber LED stays ON. |
| **P-02** | SoftAP Init | Microcontroller boot | Wi-Fi broadcasts `ESP32-Gateway`; Web server port 80; Blue LED blinks. |
| **P-03** | Client WS Handshake | Phone connects to Wi-Fi | HTTP loads UI; WebSocket opens; Blue LED turns solid. |
| **P-04** | Touch Vector Stream | Finger drags on canvas | JSON packets sent at 60Hz over WebSockets. |
| **P-05** | HID Event Injection | WS packet received | Core 1 decodes deltas and writes reports to USB OTG FIFO. |
| **P-06** | Kill-Switch Cutoff | Button pressed | ISR calls `esp_wifi_stop()`; RF terminates; USB persists. |

## 12. Conclusion, Glossary & Bibliography
* **Glossary:** Air-Gap Isolation, Composite HID, LittleFS, Native USB OTG PHY, SoftAP, TinyUSB, WebSocket, Xtensa LX7.
* **Bibliography:** USB-IF HID Specification v1.11, Espressif ESP32-S3 TRM v1.2, W3C WebSocket Draft, IEEE 802.11 Guidelines, RFC 6455.

---

# PART III: SOFTWARE & HARDWARE USER MANUAL
*TUT Official IDC30BI / PJD301B Format*

## 1. Scope & System Overview
The user manual provides end-to-end instructions for deploying and operating the hardware dongle and companion Flutter client (`hardware_gateway_app`) across Windows, Linux, macOS, and mobile devices.

## 2. Referenced Documents
USB-IF HID Specification v1.11, ESP32-S3 TRM v1.2, RFC 6455 WebSockets, IEEE Std 1063-2001.

## 3. Software Summary
* **Capabilities:** 60Hz touch sampling, velocity curves, tap-to-click, 2-finger scroll, virtual keyboard, administrative shortcuts, and live screen feed.
* **Inventory:** `hardware_gateway_app.apk`, `lib/main.dart`, `firmware.bin`, `HardwareGatewayStream.py`.
* **Latency Profile:** Total end-to-end response time $\approx 28.1\text{ ms}$.

## 4. Access to Software & Setup
1. **Hardware Connection:** Plug ESP32-S3 dongle into host PC USB port.
2. **Network Connection:** Connect smartphone to `ESP32-Gateway` (Passphrase: `Password123`).
3. **Launch App:** Open `Hardware Gateway` app; observe status pills (`ESP32: Connected`, `Screen: Live`).
4. **Touch & Keystroke Input:** Use lower touchpad zone to glide cursor; tap keyboard icon to inject ASCII text.
5. **Emergency Cutoff:** Press the push-button on the enclosure to power down the Wi-Fi radio in $<2\text{ ms}$.

## 5. Processing Reference Guide
* **Gestures:** 1-finger glide (move), 1-finger tap (left click), double-tap (double click), 2-finger tap (right click), 2-finger vertical slide (scroll).
* **Macros:** `TASK_MGR`, `WIN_L`, `ALT_TAB`, `START_SLIDESHOW`, `NEXT_SLIDE`, `PREV_SLIDE`, `CTRL_C`, `CTRL_V`, `CTRL_A`.
* **Troubleshooting:** Table of common symptoms, root causes, and corrective actions.

## 6. Query Procedures
* UDP discovery broadcasts (`port 8765`), tokenized screen streamer handshake, and network presets (Campus Wi-Fi, SoftAP, USB Tether).

## 7. Notes, Glossary & Acronyms
Complete listing of technical terms (Air-Gap, Composite HID, SoftAP, TinyUSB) and acronyms (ADC, DHCP, FIFO, GPIO, HID, ISR, JSON, LED, OTG, PCB, RF, SoC, TUT, UDP, USB, WDT).

## 8. Appendixes
* **Appendix A.1:** Hardware Interface & Pin Allocation Mapping.
* **Appendix A.2:** 3D Enclosure Fabrication (PETG, $0.16\text{ mm}$ layer height, $20\%$ Gyroid infill, captive button plunger assembly).
