# 🖱️ Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation

[![Live Web Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Interactive%20Exhibition%20Showcase-00F2FE?style=for-the-badge&logo=googlechrome&logoColor=black)](https://oratileinnocent.github.io/HardwareGatewayApp/)
[![TUT CSE](https://img.shields.io/badge/TUT-Computer%20Systems%20Engineering-002B49?style=for-the-badge&logo=institution&logoColor=white)](https://www.tut.ac.za/)
[![Exhibition 2026](https://img.shields.io/badge/Exhibition%20Date-24%20November%202026-C59B27?style=for-the-badge)](https://oratileinnocent.github.io/HardwareGatewayApp/)

> **Tshwane University of Technology (TUT)**  
> **Department of Computer Systems Engineering**  
> **Final Year Project Exhibition — 24 November 2026**  
> **Student:** Oratile Innocent Tshosetso (`Student No: 222883253`)  
> **Supervisors:** Muwanguzi Mark Ntume & Chunling Du  
> **Contact:** oratileinnocent.45@gmail.com | +27 76 950 6870  

---

## 🌐 Live Interactive Exhibition Web Demo

Experience the full interactive simulation of the Hardware Gateway right inside your browser:  
👉 **[Launch Live Web Demo & Portfolio Portal](https://oratileinnocent.github.io/HardwareGatewayApp/)**

- **Interactive Mobile Trackpad:** Drag to control the virtual cursor with live delta telemetry and USB HID report hex streams.
- **Pre-Boot UEFI/BIOS & Windows Recovery Simulator:** See how out-of-band hardware control functions where traditional software remote desktop tools (TeamViewer, AnyDesk, RDP) are completely blind.
- **Interactive 3D Virtual Twin:** Orbit and inspect the custom 3D-printed enclosure with debossed TUT university crest and front-right USB-C port cutout.

---

## 📑 Official Project Documentation & Downloads

| Document | Format | Description |
| :--- | :--- | :--- |
| 📄 **[Final Project Report](FINAL_PROJECT_REPORT.pdf)** | PDF (953 KB) | Complete 50+ page technical research dissertation covering architecture, FreeRTOS firmware, and empirical testing. |
| 🖼️ **[Exhibition Poster (A1 Vector)](EXHIBITION_POSTER.pdf)** | PDF (240 KB) | Official A1 vector exhibition poster featuring the scannable mathematical QR code. |
| 🖼️ **[Exhibition Poster (A3 Print)](EXHIBITION_POSTER_A3.pdf)** | PDF (631 KB) | High-resolution A3 desktop print edition of the exhibition poster. |
| 📊 **[Project Defense Slides](PRESENTATION_SLIDES.pdf)** | PDF (1.1 MB) | Final defense slide deck presented to the academic assessment panel. |
| 📖 **[User & Operations Manual](USER_MANUAL.pdf)** | PDF (441 KB) | Hardware setup, pinout diagrams, ESP-IDF flashing, and client deployment guide. |
| 📋 **[Defense Preparation Guide](PROJECT_DEFENSE_PREPARATION_GUIDE.pdf)** | PDF (449 KB) | Viva defense questions, examiner talking points, and technical benchmark index. |
| 📦 **[3D Enclosure Platter (STL)](hardware/enclosure/enclosure_full_set.stl)** | STL (399 KB) | Production-ready 3D printable platter (Base, Mouse Lid, and Scroll Plunger). |

---

## 01 Problem Statement

Traditional software-based remote administration software (**TeamViewer, AnyDesk, Windows RDP**) rely on host operating system daemons, administrative privileges, and open network inbound ports. Consequently:
1. **Strictly Prohibited in Air-Gapped Environments:** Financial transaction hubs, forensic laboratories, and industrial SCADA facilities forbid them due to severe attack vectors.
2. **Blind to Critical Failures:** Software agents are 100% inoperative during **pre-boot UEFI/BIOS configuration**, kernel panics (BSOD/kernel panic), OS installation lockouts, or firewall misconfigurations.

---

## 02 Our Approach & Technical Architecture

We engineered a **driverless, out-of-band hardware gateway** utilizing the dual-core **Espressif ESP32-S3** microcontroller, leveraging its integrated on-die **USB 2.0 Full-Speed On-The-Go (OTG) PHY**:

```
+-------------------+        2.4 GHz Dedicated Wi-Fi        +--------------------+        USB OTG PHY        +--------------------+
|   CLIENT DEVICE   | ------------------------------------> |  ESP32-S3 GATEWAY  | ------------------------> |   TARGET HOST PC   |
| Flutter Client App|          Low-Latency Async WS         | FreeRTOS Embedded  |    Differential D+/D-     | Zero Host Software |
| Multi-Touch Pad   |             < 12ms RTT                | Core 0: WebSockets |    Genuine USB Composite  | 100% Driverless    |
| Live MJPEG Stream |                                       | Core 1: TinyUSB HID|    Optical Mouse/Keyboard | Pre-Boot UEFI/BIOS |
+-------------------+                                       +--------------------+                           +--------------------+
```

### Key Technical Specifications

- **Microcontroller:** Espressif ESP32-S3 (Dual-Core Xtensa LX7 @ 240 MHz, 512KB SRAM, 8MB PSRAM).
- **USB Interface:** Native on-die USB 2.0 Full-Speed PHY (12 Mbps) executing TinyUSB composite stack.
- **Wireless Link:** Dedicated 2.4 GHz SoftAP running asynchronous HTTP/WebSocket server.
- **Client Application:** Cross-platform Flutter client with gesture velocity smoothing and sub-millisecond packet dispatch.
- **Target Host Footprint:** **0 KB RAM, 0% CPU, Zero software daemons or drivers required.**

---

## 03 Empirical Bench Test Results

- **Packet Transmission Reliability:** **0% packet drop across 25,000 transmitted HID reports** over dedicated 2.4 GHz wireless links.
- **Latency Performance:** Mean round-trip latency of **11.4 ms** (well within the rigorous &lt; 25ms SLA benchmark).
- **Security & Endpoint Compliance:** Successfully operated inside locked Windows 11 security desktops and UEFI/BIOS setup menus with **zero endpoint detection and response (EDR) or antivirus alarms**.

---

## 04 Repository Structure

```
hardware_gateway_app/
├── docs/                               # GitHub Pages web live showcase
│   └── index.html                      # Interactive live web demo & portfolio
├── hardware/
│   └── enclosure/                      # OpenSCAD models & 3D printable STLs
│       ├── enclosure.scad              # Parametric OpenSCAD source code
│       ├── enclosure_full_set.stl      # 3D printable full mouse platter
│       ├── enclosure_base.stl          # Base plate with TUT crest & USB cutout
│       ├── enclosure_lid.stl           # Ergonomic palm rest with "GATEWAY" text
│       └── view_3d.html                # Interactive 3D Three.js model viewer
├── lib/
│   └── main.dart                       # Flutter client application source code
├── EXHIBITION_POSTER.pdf               # A1 Vector Exhibition Poster
├── EXHIBITION_POSTER_A3.pdf            # A3 Vector Exhibition Poster
├── FINAL_PROJECT_REPORT.pdf            # Complete 50+ page academic report
├── PRESENTATION_SLIDES.pdf             # Defense slide deck
├── USER_MANUAL.pdf                     # User & operations manual
├── qr_engine.js                        # Zero-dependency mathematical QR code engine
├── build_exhibition_poster.js          # A1 poster vector generator
└── build_exhibition_poster_a3.js       # A3 poster vector generator
```

---

## 🏛️ Academic Attribution

- **Institution:** [Tshwane University of Technology](https://www.tut.ac.za/)
- **Faculty:** Faculty of Information and Communication Technology
- **Department:** Department of Computer Systems Engineering
- **Qualification:** Diploma / Advanced Diploma in Computer Systems Engineering (PJD301B / IDC30BI)
- **Author:** Oratile Innocent Tshosetso (Student Number: `222883253`)
- **Supervisors:** Muwanguzi Mark Ntume & Chunling Du

*#fromGOOD2GREAT*
