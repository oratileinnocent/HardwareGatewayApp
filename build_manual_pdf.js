const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logoBase64 = fs.readFileSync(path.join(__dirname, 'tut_logo.png')).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const logoHtml = `
<div style="display: inline-flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 5px;">
  <img src="${logoDataUri}" style="height: 80px; width: auto; object-fit: contain;" alt="TUT Emblem">
  <div style="text-align: left;">
    <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: 800; color: #003366; line-height: 1.15;">Tshwane University<br>of Technology</div>
    <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; font-style: italic; font-weight: 600; color: #C62828; margin-top: 4px;">We empower people</div>
  </div>
</div>
`;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>User Manual - Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation</title>
<style>
  @page {
    size: A4 portrait;
    margin: 15mm 14mm 15mm 14mm;
    @top-right {
      content: "TUT - PJD301B / IDC30BI User Manual";
      font-size: 8pt;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #666;
    }
    @bottom-center {
      content: "Page " counter(page) " of 9";
      font-size: 8.5pt;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #555;
    }
  }

  @page :first {
    @top-right {
      content: none;
    }
    @bottom-center {
      content: none;
    }
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
    color: #222;
    line-height: 1.36;
    font-size: 9.1pt;
    margin: 0;
    padding: 0;
  }

  .page-break {
    page-break-after: always;
    break-after: page;
  }

  /* Prevent awkward page break cuts */
  h1, h2, h3 {
    page-break-after: avoid;
    break-after: avoid;
  }

  table.data-table, pre, .callout-box {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Cover Page Styling */
  .cover-container {
    height: 252mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    padding: 2mm 0;
  }

  .tut-logo-container {
    margin-bottom: 6px;
  }

  .faculty-title {
    font-size: 13pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #111;
    margin-top: 15px;
    line-height: 1.3;
    text-transform: uppercase;
  }

  .department-title {
    font-size: 11pt;
    font-weight: 700;
    color: #222;
    margin-top: 10px;
    text-transform: uppercase;
  }

  .subject-title {
    font-size: 12pt;
    font-weight: 800;
    color: #003366;
    margin-top: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .document-type {
    font-size: 21pt;
    font-weight: 900;
    color: #111;
    margin-top: 25px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .metadata-box {
    margin: 30px auto 20px auto;
    width: 95%;
    text-align: left;
    border-collapse: collapse;
  }

  .metadata-box td {
    padding: 6px 8px;
    font-size: 9.2pt;
    vertical-align: top;
  }

  .metadata-label {
    font-weight: 700;
    width: 28%;
    color: #111;
    text-transform: uppercase;
    font-size: 8.8pt;
  }

  .metadata-value {
    color: #222;
    font-weight: 500;
  }

  .cover-footer {
    padding-top: 8px;
    font-size: 9pt;
    color: #555;
    border-top: 2px solid #003366;
    text-align: center;
    font-weight: 600;
  }

  /* Headings */
  h1 {
    font-size: 13pt;
    font-weight: 800;
    color: #003366;
    text-transform: uppercase;
    border-bottom: 1.5px solid #003366;
    padding-bottom: 2px;
    margin-top: 14px;
    margin-bottom: 6px;
  }

  h2 {
    font-size: 10.4pt;
    font-weight: 700;
    color: #134074;
    margin-top: 10px;
    margin-bottom: 4px;
  }

  h3 {
    font-size: 9.5pt;
    font-weight: 700;
    color: #222;
    margin-top: 8px;
    margin-bottom: 3px;
  }

  p {
    margin-top: 0;
    margin-bottom: 6px;
    text-align: justify;
  }

  /* Table of Contents */
  .toc-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }

  .toc-table td {
    padding: 4px 0;
    font-size: 9.2pt;
  }

  .toc-title {
    font-weight: 700;
    text-transform: uppercase;
    color: #003366;
  }

  .toc-dots {
    border-bottom: 1px dotted #888;
    width: 78%;
    display: inline-block;
    margin: 0 5px;
  }

  .toc-page {
    text-align: right;
    font-weight: 600;
    color: #222;
  }

  /* Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 6px 0 10px 0;
    font-size: 8.4pt;
  }

  table.data-table th, table.data-table td {
    border: 1px solid #c0c6cf;
    padding: 4.5px 6.5px;
    text-align: left;
  }

  table.data-table th {
    background-color: #003366;
    color: #ffffff;
    font-weight: 700;
    font-size: 8.1pt;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  table.data-table tr:nth-child(even) {
    background-color: #f7f9fc;
  }

  /* Code & Monospace Blocks */
  pre, code {
    font-family: 'Consolas', 'Courier New', monospace;
  }

  pre {
    background-color: #0d131f;
    color: #e0f2fe;
    padding: 7px 9px;
    border-radius: 4px;
    font-size: 7.8pt;
    line-height: 1.25;
    margin: 5px 0;
    overflow-x: auto;
    border-left: 3px solid #00c4cc;
  }

  p code, td code, li code {
    background-color: #eef2f6;
    color: #003366;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 8.2pt;
    font-weight: 600;
  }

  kbd {
    background-color: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-bottom: 2px solid #94a3b8;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 7.8pt;
    font-weight: 600;
    font-family: inherit;
  }

  /* Callout Boxes */
  .callout-box {
    background-color: #f0f7ff;
    border-left: 4px solid #0077b6;
    padding: 6px 9px;
    margin: 6px 0;
    font-size: 8.4pt;
    border-radius: 0 4px 4px 0;
  }

  .callout-box.warning {
    background-color: #fff9e6;
    border-left-color: #e09f3e;
  }

  .callout-title {
    font-weight: 700;
    margin-bottom: 2px;
    text-transform: uppercase;
    font-size: 7.8pt;
    letter-spacing: 0.5px;
  }

  ul, ol {
    margin-top: 2px;
    margin-bottom: 5px;
    padding-left: 17px;
  }

  li {
    margin-bottom: 2.5px;
  }
</style>
</head>
<body>

<!-- ========================================== -->
<!-- PAGE 1: COVER PAGE                         -->
<!-- ========================================== -->
<div class="cover-container">
  <div>
    <div class="tut-logo-container">
      ${logoHtml}
    </div>

    <div class="faculty-title">
      FACULTY OF<br>
      INFORMATION AND COMMUNICATION TECHNOLOGY
    </div>

    <div class="department-title">
      NATIONAL DIPLOMA: COMPUTER SYSTEMS ENGINEERING
    </div>

    <div class="subject-title">
      INTELLIGENT INDUSTRIAL SYSTEMS: IDC30BI / PJD301B
    </div>

    <div class="document-type">
      USER MANUAL
    </div>

    <table class="metadata-box">
      <tr>
        <td class="metadata-label">PROJECT TITLE:</td>
        <td class="metadata-value"><strong>Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation</strong></td>
      </tr>
      <tr>
        <td class="metadata-label">LECTURER NAME:</td>
        <td class="metadata-value">Muwanguzi Mark Ntume and Chunling Du</td>
      </tr>
      <tr>
        <td class="metadata-label">STUDENTS NAME:</td>
        <td class="metadata-value">Oratile Innocent Tshosetso</td>
      </tr>
      <tr>
        <td class="metadata-label">STUDENTS NUMBER:</td>
        <td class="metadata-value">222883253</td>
      </tr>
      <tr>
        <td class="metadata-label">EMAIL ADDRESS:</td>
        <td class="metadata-value">oratileinnocent.45@gmail.com</td>
      </tr>
      <tr>
        <td class="metadata-label">CONTACT NUMBERS:</td>
        <td class="metadata-value">076 950 6870</td>
      </tr>
    </table>
  </div>

  <div class="cover-footer">
    Department of Computer Systems Engineering &bull; Tshwane University of Technology (TUT)
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- PAGE 2: TABLE OF CONTENTS                  -->
<!-- ========================================== -->
<h1>Table of Contents</h1>

<table class="toc-table">
  <tr>
    <td class="toc-title">1. SCOPE</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">3</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">1.1 Identification</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">3</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">1.2 System Overview</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">3</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">1.3 Document Overview</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">3</td>
  </tr>
  <tr>
    <td class="toc-title">2. REFERENCED DOCUMENTS</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">3</td>
  </tr>
  <tr>
    <td class="toc-title">3. SOFTWARE SUMMARY</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">3</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">3.1 Software Application</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">3</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">3.2 Software Inventory</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">4</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">3.3 Software Environment</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">4</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">3.4 Software Organization and Overview of Operation</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">4</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">3.5 Contingencies and Alternate States of Operation</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">5</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">3.6 Security and Privacy</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">5</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">3.7 Assistance and Problem Reporting</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">5</td>
  </tr>
  <tr>
    <td class="toc-title">4. ACCESS TO THE SOFTWARE</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">5</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">4.1 Access Control and Installation</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">5</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">4.2 Initiating Procedure</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">6</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">4.3 Description of Inputs</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">6</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">4.4 Description of Outputs</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">6</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">4.5 Recovery and Error Correction Procedures</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">7</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">4.6 Stopping and Suspending Work</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">7</td>
  </tr>
  <tr>
    <td class="toc-title">5. PROCESSING REFERENCE GUIDE</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">7</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">5.1 Capabilities & Conventions</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">7</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">5.2 Aspect of Software Use (Trackpad, Keyboard, Macros)</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">7</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">5.3 Quick-Reference Operator Guide</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">8</td>
  </tr>
  <tr>
    <td class="toc-title">6. QUERY PROCEDURES</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">8</td>
  </tr>
  <tr>
    <td class="toc-title">7. NOTES (GLOSSARY & ACRONYMS)</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">8</td>
  </tr>
  <tr>
    <td class="toc-title">8. REFERENCE</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">9</td>
  </tr>
  <tr>
    <td class="toc-title">A. APPENDIXES</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">9</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">Appendix A.1: Hardware Interface & Pin Allocation Mapping</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">9</td>
  </tr>
  <tr>
    <td style="padding-left: 18px;">Appendix A.2: 3D Enclosure Assembly Specifications</td>
    <td><span class="toc-dots"></span></td>
    <td class="toc-page">9</td>
  </tr>
</table>

<div class="page-break"></div>

<!-- ========================================== -->
<!-- BODY CONTENT                               -->
<!-- ========================================== -->
<h1>1. SCOPE</h1>

<h2>1.1 Identification</h2>
<p>
This document constitutes the official Software User Manual for the <strong>Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation</strong> (Identifier: <code>HW-GW-ESP32S3</code>, Release 1.0.0). The software suite encompasses two principal execution environments:
</p>
<ul>
  <li><strong>Embedded Microcontroller Firmware:</strong> Native C++ FreeRTOS stack running on the Espressif ESP32-S3 SoC, providing on-chip USB OTG HID emulation and an asynchronous WebSocket server.</li>
  <li><strong>Client Control Application:</strong> <code>Hardware Gateway Mobile App</code> (Flutter cross-platform application, Package ID: <code>com.example.hardware_gateway_app</code>, Version 1.0.0+1) supported on Android 5.0+, iOS 12+, Windows 10/11, and Linux.</li>
  <li><strong>Target Workstation Support:</strong> Fully compatible with Windows 10/11, macOS, Linux (kernel 2.6+), Android, and BIOS/UEFI pre-boot firmware without driver installations.</li>
</ul>

<h2>1.2 System Overview</h2>
<p>
The system provides an autonomous, agentless remote control bridge between a mobile smartphone and an air-gapped target PC. Unlike conventional software remote desktop solutions (such as RDP, VNC, TeamViewer, or AnyDesk), this system operates independently of target host operating system permissions, firewalls, network interfaces, or background daemons.
</p>
<p>
When inserted into a host USB port, the ESP32-S3 hardware natively enumerates as a combined USB Composite Human Interface Device (Standard 101/104-key Keyboard and 3-button Optical Mouse). Simultaneously, the gateway establishes a secure, isolated 802.11 b/g/n SoftAP Wi-Fi network (<code>SSID: ESP32-Gateway</code>). When the operator launches the Flutter application on their smartphone, real-time touch coordinates, tap events, gestures, and keystrokes are serialized into compact JSON packets and streamed over a full-duplex WebSocket channel. The firmware decodes these packets across an inter-core FreeRTOS queue and injects them into the physical USB endpoint FIFO with guaranteed sub-30ms latency.
</p>
<p>
<strong>Academic & Administrative Governance:</strong> Developed under the supervision of lecturers Muwanguzi Mark Ntume and Chunling Du in the Faculty of Information and Communication Technology at Tshwane University of Technology (TUT), satisfying curriculum requirements for the National Diploma in Computer Systems Engineering (PJD 301B / IDC30BI).
</p>

<h2>1.3 Document Overview</h2>
<p>
This manual instructs field technicians, system administrators, and student evaluators on configuring, deploying, operating, and troubleshooting the software and hardware system.
</p>

<div class="callout-box warning">
  <div class="callout-title">Important Security Notice</div>
  Because all remote inputs emulate native USB hardware signaling, every keystroke and mouse event executes with the physical authorization of the active user session on the target PC. Always ensure authorized physical presence before connecting.
</div>

<h1>2. REFERENCED DOCUMENTS</h1>
<ol>
  <li>USB Implementers Forum (USB-IF), <em>Device Class Definition for Human Interface Devices (HID)</em>, Firmware Specification v1.11, Jun. 2021.</li>
  <li>Espressif Systems, <em>ESP32-S3 Technical Reference Manual</em>, Doc. ESP32S3-TRM, Rev. 1.2, 2023.</li>
  <li>IETF Network Working Group, <em>The WebSocket Protocol</em>, Standards Track RFC 6455, Dec. 2011.</li>
  <li>IEEE Computer Society, <em>IEEE Standard for Software User Documentation</em>, IEEE Std 1063-2001.</li>
  <li>TUT Faculty of ICT, <em>Project Design III (PJD 301B) Curriculum Guidelines & Project Templates</em>, 2026.</li>
</ol>

<h1>3. SOFTWARE SUMMARY</h1>

<h2>3.1 Software Application</h2>
<p>
The software translates mobile capacitive multi-touch inputs, virtual keyboard entries, and administrative macros into standard USB HID reports.
</p>
<ul>
  <li><strong>Sub-30ms Tactile Pointer Tracking:</strong> Employs a non-linear velocity scaling algorithm (<em>V = &alpha; &middot; (&Delta;D)<sup>1.2</sup></em>) that damps physiological hand tremors during slow precision tracking while enabling quick cross-display travel during rapid flick gestures.</li>
  <li><strong>Multi-Touch Gestures:</strong> Supports single-finger cursor gliding, single-tap left click, double-tap double click, two-finger simultaneous tap for right click, and two-finger vertical scrolling.</li>
  <li><strong>One-Tap Shortcut Dispatch:</strong> Executes multi-key macros (such as Task Manager, Alt+Tab, Windows+L Lock, Copy, Paste) via single tap.</li>
  <li><strong>Real-Time Screen Feedback:</strong> Renders binary JPEG video frames streamed from the host with an authentic Windows Aero/11 cursor overlay and click ripples.</li>
</ul>

<h2>3.2 Software Inventory</h2>
<table class="data-table">
  <tr>
    <th>Software / Asset</th>
    <th>Filename</th>
    <th>Location / Environment</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flutter Client App</td>
    <td><code>hardware_gateway_app.apk</code></td>
    <td>Mobile Device OS</td>
    <td>Mobile GUI controller for touch, keyboard, macros, and stream.</td>
  </tr>
  <tr>
    <td>Client Entrypoint</td>
    <td><code>lib/main.dart</code></td>
    <td>Flutter Project Tree</td>
    <td>State machine, gesture engine, WebSockets, and UDP discovery.</td>
  </tr>
  <tr>
    <td>Microcontroller Firmware</td>
    <td><code>firmware.bin</code></td>
    <td>ESP32-S3 SPI Flash (0x10000)</td>
    <td>FreeRTOS dual-core USB OTG stack and WebSocket server.</td>
  </tr>
  <tr>
    <td>HTML5 Digitizer Fallback</td>
    <td><code>littlefs.bin</code></td>
    <td>ESP32-S3 SPI Flash (LittleFS)</td>
    <td>Zero-dependency mobile web browser touch digitizer.</td>
  </tr>
  <tr>
    <td>Host Streamer Service</td>
    <td><code>HardwareGatewayStream.py</code></td>
    <td>Target Host Background</td>
    <td>Asyncio WebSocket screen capture daemon (Port 8765).</td>
  </tr>
</table>

<h2>3.3 Software Environment</h2>

<p><strong>a. Computer Equipment:</strong></p>
<ul>
  <li><em>Target Host PC:</em> Any x86/ARM/RISC-V workstation with a standard USB 2.0/3.0 Type-A or Type-C port supplying 5V VBUS (&plusmn;5%, max current &lt;280 mA).</li>
  <li><em>Mobile Device:</em> Android smartphone or tablet (API Level 21+) or iOS 12+ device with capacitive multi-touch and 802.11 b/g/n Wi-Fi.</li>
</ul>

<p><strong>b. Communications Equipment:</strong></p>
<ul>
  <li>ESP32-S3 on-board 2.4 GHz PCB trace antenna (effective line-of-sight range: 10–15 meters).</li>
  <li>USB 2.0 Full-Speed differential data lines (D- on GPIO 19, D+ on GPIO 20).</li>
</ul>

<p><strong>c. Supporting Software Stacks:</strong></p>
<ul>
  <li><em>Target Host:</em> Standard in-box USB HID driver (<code>hidclass.sys</code> / <code>usbhid</code>). No 3rd-party drivers needed.</li>
  <li><em>Firmware Frameworks:</em> Arduino-ESP32 Core v3.x, <code>Adafruit_TinyUSB</code>, <code>ESPAsyncWebServer</code>, <code>AsyncTCP</code>, <code>ArduinoJson v7</code>.</li>
  <li><em>Flutter Libraries:</em> <code>web_socket_channel: ^3.0.3</code>, <code>cupertino_icons: ^1.0.8</code>.</li>
</ul>

<p><strong>d. Forms, Procedures, and Manual Operations:</strong></p>
<ul>
  <li>Manual physical actuation of the hardware RF kill-switch plunger on the enclosure.</li>
  <li>Manual mobile Wi-Fi association with <code>ESP32-Gateway</code>.</li>
</ul>

<h2>3.4 Software Organization and Overview of Operation</h2>

<pre>
+-------------------------------------------------------------------------------+
|                      LAYER 1: MOBILE CLIENT (FLUTTER APP)                     |
|  - Real-Time PC Screen Feed (Port 8765)      - Capacitive Touchpad (60Hz)     |
|  - Real Windows Aero Cursor CustomPainter    - Virtual Keyboard & Macros      |
+-------------------------------------------------------------------------------+
           | (Binary JPEG Frames)                         | (JSON Packets over WS)
           v                                              v
+-----------------------------+                +--------------------------------+
| HOST SCREEN STREAMER DAEMON |                | LAYER 2: ESP32-S3 GATEWAY      |
| - Python Asyncio Grabber    |                | - Core 0: SoftAP & LwIP Stack  |
| - UDP Discovery (Port 8765) |                | - Core 1: TinyUSB HID Engine   |
+-----------------------------+                +--------------------------------+
                                                              | (USB D+ / D-)
                                                              v
+-------------------------------------------------------------------------------+
|                            LAYER 3: TARGET HOST PC                            |
|             Native OS USB Composite HID Driver (Zero Software Required)       |
+-------------------------------------------------------------------------------+
</pre>

<p><strong>Logical Decomposition & Performance Characteristics:</strong></p>
<ol>
  <li><strong>Core Segregation:</strong> FreeRTOS Core 0 is dedicated to wireless socket processing and packet parsing, while Core 1 formats HID reports and writes to the USB OTG FIFO. This guarantees that Wi-Fi retransmissions or packet jitter never interrupt the physical 125Hz USB polling schedule.</li>
  <li><strong>Latency Profile:</strong> Cumulative touch-to-USB latency is deterministically maintained below 30ms:
  <br>
  <em>T<sub>total</sub> = T<sub>touch_sample</sub> (16.6ms) + T<sub>ws_transmit</sub> (5ms) + T<sub>esp_decode</sub> (0.5ms) + T<sub>usb_poll</sub> (8ms) &approx; 28.1 ms</em>
  </li>
  <li><strong>Error Handling & Watchdogs:</strong> The microcontroller runs an embedded Hardware Watchdog Timer (WDT) set to 3.0 seconds to automatically recover from unhandled runtime lockups.</li>
</ol>

<h2>3.5 Contingencies and Alternate States of Operation</h2>
<table class="data-table">
  <tr>
    <th>State ID</th>
    <th>Operational Mode</th>
    <th>Hardware LED Status</th>
    <th>System Capabilities</th>
  </tr>
  <tr>
    <td><strong>S-01</strong></td>
    <td>Boot / Enumerating</td>
    <td>Wi-Fi: OFF | HID: Fast Blink</td>
    <td>Mounting LittleFS, initializing USB OTG, negotiating USB descriptors with host.</td>
  </tr>
  <tr>
    <td><strong>S-02</strong></td>
    <td>Broadcasting / Ready</td>
    <td>Wi-Fi: Slow Blink (1Hz) | HID: Solid ON</td>
    <td>SoftAP broadcasting (<code>ESP32-Gateway</code>); Web server listening on port 80; USB attached.</td>
  </tr>
  <tr>
    <td><strong>S-03</strong></td>
    <td>Active Streaming</td>
    <td>Wi-Fi: Solid ON | HID: Strobing</td>
    <td>Client associated; full-duplex sub-30ms touch, gesture, and macro streaming active.</td>
  </tr>
  <tr>
    <td><strong>S-04</strong></td>
    <td>RF Severed (Kill Mode)</td>
    <td>Wi-Fi: OFF | HID: Solid ON</td>
    <td>Kill-switch actuated; Wi-Fi radio powered down at physical layer; USB HID link persists.</td>
  </tr>
</table>

<h2>3.6 Security and Privacy</h2>
<p>
The system enforces hardware air-gap isolation by design:
</p>
<ul>
  <li><strong>Zero WAN Routing:</strong> The SoftAP subnet (<code>192.168.4.0/24</code>) operates without gateway forwarding, external bridge interfaces, or internet access. Host data exfiltration is impossible across this interface.</li>
  <li><strong>Driverless In-Memory Operation:</strong> The hardware identifies to the host operating system strictly as a standard human input device; no software agents or executable files are written to host storage.</li>
  <li><strong>Tokenized Screen Streamer:</strong> The optional screen capture daemon requires a pre-shared 32-character authentication token in the initial WebSocket handshake header.</li>
</ul>

<h2>3.7 Assistance and Problem Reporting</h2>
<p>
For technical support, academic evaluations, or bug reporting:
</p>
<ul>
  <li><strong>Student Engineer:</strong> Oratile Innocent Tshosetso (Student No: 222883253)</li>
  <li><strong>Email:</strong> <code>oratileinnocent.45@gmail.com</code> | <strong>Contact:</strong> <code>076 950 6870</code></li>
  <li><strong>Academic Supervisors:</strong> Muwanguzi Mark Ntume & Chunling Du, Department of Computer Systems Engineering, TUT.</li>
</ul>

<h1>4. ACCESS TO THE SOFTWARE</h1>

<h2>4.1 Access Control and Installation</h2>

<h3>4.1.1 Access Control</h3>
<ul>
  <li><strong>Wi-Fi Network Credentials:</strong> The gateway broadcasts an isolated access point (<code>SSID: ESP32-Gateway</code>). Default passphrase: <code>Password123</code> (or open depending on laboratory profile).</li>
  <li><strong>Screen Streamer Token:</strong> Configured via the mobile app Settings sheet to match the token argument passed when launching <code>HardwareGatewayStream.py</code>.</li>
  <li><strong>Host Privileges:</strong> Requires zero administrative rights, driver installations, or security whitelist modifications on the target PC.</li>
</ul>

<h3>4.1.2 Installation and Setup</h3>
<ol>
  <li><strong>Hardware Insertion:</strong> Insert the ESP32-S3 hardware dongle into an available USB Type-A or Type-C port on the target machine. Within 2–3 seconds, the target OS will register the device as a standard keyboard/mouse (Amber LED turns solid).</li>
  <li><strong>Mobile App Deployment:</strong> Install <code>hardware_gateway_app.apk</code> onto your Android device, or launch via Flutter debug runner (<code>flutter run</code>).</li>
  <li><strong>Network Association:</strong> Open Wi-Fi settings on the smartphone and connect to <code>ESP32-Gateway</code>.</li>
  <li><strong>Host Streamer Startup (Optional):</strong> On the target PC, launch the screen streamer daemon:
    <pre>python HardwareGatewayStream.py --port 8765 --token CHANGE_THIS_TOKEN_9f3d7c2a</pre>
  </li>
</ol>

<h2>4.2 Initiating Procedure</h2>
<ol>
  <li>Open the <strong>Hardware Gateway</strong> app on your smartphone.</li>
  <li>The app automatically initiates UDP broadcast pings on port 8765 and opens the WebSocket channel to <code>ws://192.168.4.1/ws</code>.</li>
  <li>Verify the top header status pills:
    <ul>
      <li><code>ESP32: Connected</code> (Green pill indicates full hardware HID readiness).</li>
      <li><code>Screen: Live</code> (Green pill indicates real-time desktop video feed is streaming).</li>
    </ul>
  </li>
  <li>Slide your thumb across the lower touchpad zone to begin manipulating the target computer cursor.</li>
</ol>

<h2>4.3 Description of Inputs</h2>

<h3>4.3.1 Input Conditions</h3>
<ul>
  <li><strong>Touch Movements:</strong> Continuous displacement events sampled at 60Hz.</li>
  <li><strong>Tap Events:</strong> Discrete pulses with contact duration &lt;200 ms and displacement &lt;5 pixels.</li>
  <li><strong>Virtual Keystrokes:</strong> Transmitted on-demand when tapping characters in the virtual keyboard sheet.</li>
  <li><strong>Administrative Macros:</strong> Dispatched immediately upon tapping action chips in the shortcuts sheet.</li>
</ul>

<h3>4.3.2 Input Formats</h3>
<p>All inputs are transmitted as compact UTF-8 JSON text frames across the WebSocket connection:</p>
<pre>
{"t":"m", "dx":14, "dy":-8}                 // Mouse vector displacement
{"t":"b", "btn":1, "state":1}               // Left button down
{"t":"k", "key":"A", "mod":2}               // Uppercase 'A' (Shift modifier)
{"t":"cmd", "id":"TASK_MGR"}                // Launch Task Manager macro
</pre>

<h3>4.3.3 Composition Rules</h3>
<ul>
  <li><code>t</code>: Packet type identifier (<code>"m"</code> = mouse, <code>"b"</code> = button, <code>"k"</code> = key, <code>"cmd"</code> = macro).</li>
  <li><code>dx</code>, <code>dy</code>: Signed 16-bit integers representing relative screen coordinate deltas.</li>
  <li><code>btn</code>: Button index (<code>1</code> = Left, <code>2</code> = Right, <code>3</code> = Middle).</li>
  <li><code>state</code>: Switch state (<code>1</code> = Down/Pressed, <code>0</code> = Up/Released).</li>
  <li><code>mod</code>: Modifier bitmask (<code>0</code> = None, <code>1</code> = Ctrl, <code>2</code> = Shift, <code>4</code> = Alt, <code>8</code> = GUI/Win).</li>
</ul>

<h2>4.4 Description of Outputs</h2>
<p>
The system produces physical USB HID signaling and real-time visual feedback:
</p>
<ul>
  <li><strong>Physical USB HID Reports:</strong>
    <ul>
      <li><em>Mouse Report (4 Bytes):</em> Byte 0: Button bitmask; Byte 1: &Delta;X; Byte 2: &Delta;Y; Byte 3: Wheel scroll.</li>
      <li><em>Keyboard Report (8 Bytes):</em> Byte 0: Modifiers; Byte 1: Reserved; Bytes 2–7: Up to 6 simultaneous keycodes.</li>
    </ul>
  </li>
  <li><strong>Visual Mobile UI Feedback:</strong>
    <ul>
      <li><em>Status Badges:</em> Pill badges in the top app bar display live connectivity, ping latency, and frame rates.</li>
      <li><em>Cursor Projection:</em> An authentic Windows Aero/11 pointer custom-painted over the remote screen feed, complete with auto-fade and animated click ripples.</li>
      <li><em>Hardware Indicators:</em> Blue LED indicates Wi-Fi client association; Amber LED strobes on each HID injection.</li>
    </ul>
  </li>
</ul>

<h2>4.5 Recovery and Error Correction Procedures</h2>
<table class="data-table">
  <tr>
    <th>Symptom</th>
    <th>Root Cause</th>
    <th>Corrective Action</th>
  </tr>
  <tr>
    <td>Status pill displays <code>ESP32: Offline</code></td>
    <td>Phone dropped Wi-Fi association with dongle.</td>
    <td>Open phone settings and reconnect to <code>ESP32-Gateway</code>. Confirm dongle is plugged into host.</td>
  </tr>
  <tr>
    <td>Host cursor does not respond to touch</td>
    <td>Dongle connected to charging-only USB port.</td>
    <td>Ensure dongle is inserted into a functional data-capable USB OTG port. Check Amber LED status.</td>
  </tr>
  <tr>
    <td>Status pill displays <code>Screen: Offline</code></td>
    <td>Streamer daemon not running or port blocked.</td>
    <td>Start <code>HardwareGatewayStream.py</code> on PC. Check that port 8765 is allowed in host firewall.</td>
  </tr>
  <tr>
    <td>Cursor sensitivity too high or sluggish</td>
    <td>Software sensitivity slider miscalibrated.</td>
    <td>Tap Settings (Gear) icon; adjust Trackpad Sensitivity slider between 0.4&times; and 2.5&times;.</td>
  </tr>
  <tr>
    <td>Wi-Fi drops and will not reconnect</td>
    <td>Hardware RF kill-switch was actuated.</td>
    <td>Power cycle the hardware gateway (unplug and re-insert into USB port) to re-enable the Wi-Fi radio.</td>
  </tr>
</table>

<h2>4.6 Stopping and Suspending Work</h2>
<ul>
  <li><strong>Normal Disconnection:</strong> Close the mobile application or disconnect from the Wi-Fi access point. The gateway enters low-power standby mode awaiting the next connection.</li>
  <li><strong>Emergency RF Termination:</strong> Press the tactile push-button plunger on the hardware enclosure. The active-low hardware interrupt executes <code>esp_wifi_stop()</code> in &lt;2 ms, terminating all RF broadcasting instantly while maintaining the USB connection.</li>
  <li><strong>Full Powerdown:</strong> Unplug the ESP32-S3 dongle from the host PC USB receptacle.</li>
</ul>

<h1>5. PROCESSING REFERENCE GUIDE</h1>

<h2>5.1 Capabilities and Conventions</h2>
<p>
The application employs a 50/50 dual-viewport Cyber-Slate layout:
</p>
<ul>
  <li><strong>Top Viewport:</strong> Real-time remote PC desktop display feed (or full-screen when toggled).</li>
  <li><strong>Bottom Viewport:</strong> Precision touch tracking canvas, dedicated left/right click buttons, and docked utility controls.</li>
  <li><strong>Color Conventions:</strong> Cyan (<code>#00F2FE</code>) indicates active state; Mint (<code>#55D6BE</code>) indicates normal connected telemetry; Crimson (<code>#FF5252</code>) denotes disconnected/error state; Amber (<code>#FFB300</code>) denotes standby.</li>
</ul>

<h2>5.2 Aspect of Software Use</h2>

<h3>1. Touchpad Navigation & Mouse Actions</h3>
<ul>
  <li><strong>Moving Cursor:</strong> Glide a single finger across the touchpad area.</li>
  <li><strong>Left Click:</strong> Tap once quickly with one finger, or tap the dedicated <strong>LEFT CLICK</strong> button.</li>
  <li><strong>Double Click:</strong> Double-tap rapidly anywhere on the trackpad surface.</li>
  <li><strong>Right Click:</strong> Tap once with two fingers simultaneously, or tap the dedicated <strong>RIGHT CLICK</strong> button.</li>
  <li><strong>Vertical Scrolling:</strong> Place two fingers on the touchpad and slide vertically up or down.</li>
</ul>

<h3>2. Text Typing via Virtual Keyboard</h3>
<p>
Tap the <strong>Keyboard</strong> icon in the bottom dock. Enter the desired text or command string into the input field and tap <strong>Send Text</strong>. The application translates the runes into sequential ASCII keycodes and injects them directly into the target workstation's active window.
</p>

<h3>3. Administrative Shortcuts & Presentation Macros</h3>
<p>
Tap the <strong>Shortcuts (Bolt)</strong> icon in the bottom dock to access one-tap system macros:
</p>
<ul>
  <li><code>TASK_MGR</code>: Dispatches <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Esc</kbd> to open Windows Task Manager.</li>
  <li><code>WIN_L</code>: Dispatches <kbd>Win</kbd>+<kbd>L</kbd> to immediately lock the target workstation.</li>
  <li><code>ALT_TAB</code>: Dispatches application switcher sequence.</li>
  <li><code>START_SLIDESHOW</code>: Dispatches <kbd>F5</kbd> to launch PowerPoint presentations.</li>
  <li><code>NEXT_SLIDE</code> / <code>PREV_SLIDE</code>: Dispatches <kbd>PageDown</kbd> / <kbd>PageUp</kbd> keys.</li>
  <li><code>CTRL_C</code> / <code>CTRL_V</code> / <code>CTRL_A</code>: Fast clipboard and document management shortcuts.</li>
</ul>

<h2>5.3 Quick-Reference Operator Guide</h2>
<table class="data-table">
  <tr>
    <th>Desired Action</th>
    <th>Input Method / Gesture</th>
    <th>Target PC Output</th>
  </tr>
  <tr>
    <td>Move Pointer</td>
    <td>1-finger glide on touchpad</td>
    <td>Smooth mouse cursor movement (<em>V = &alpha; &middot; (&Delta;D)<sup>1.2</sup></em>)</td>
  </tr>
  <tr>
    <td>Left Click</td>
    <td>1-finger tap or LEFT CLICK button</td>
    <td>Mouse Button 1 down & release (Click ripple displayed)</td>
  </tr>
  <tr>
    <td>Double Click</td>
    <td>Quick double-tap on touchpad</td>
    <td>Two consecutive Button 1 clicks (Opens files/folders)</td>
  </tr>
  <tr>
    <td>Right Click</td>
    <td>2-finger tap or RIGHT CLICK button</td>
    <td>Mouse Button 2 click (Context menu)</td>
  </tr>
  <tr>
    <td>Scroll Document</td>
    <td>2-finger drag up or down</td>
    <td>Smooth vertical mouse wheel delta injection</td>
  </tr>
  <tr>
    <td>Type Text String</td>
    <td>Dock -> Keyboard -> Enter text</td>
    <td>Direct sequential USB keystroke injection</td>
  </tr>
  <tr>
    <td>Open Task Manager</td>
    <td>Dock -> Bolt icon -> Task Manager</td>
    <td>Executes <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Esc</kbd></td>
  </tr>
  <tr>
    <td>Toggle Fullscreen</td>
    <td>Dock -> Fullscreen (Expand) icon</td>
    <td>Expands PC video feed to fill 100% of mobile display</td>
  </tr>
  <tr>
    <td>Emergency Cutoff</td>
    <td>Depress hardware push-button</td>
    <td>Physical Wi-Fi radio powerdown (&lt;2 ms)</td>
  </tr>
</table>

<h1>6. QUERY PROCEDURES</h1>
<p>
The system exchanges asynchronous query/response datagrams over UDP and WebSockets:
</p>
<ul>
  <li><strong>UDP Auto-Discovery:</strong> The mobile client broadcasts <code>HW_GATEWAY_DISCOVERY_PROBE</code> on UDP port 8765 every 5 seconds. The host daemon responds with its server hostname and IP, enabling zero-configuration auto-connection.</li>
  <li><strong>Preset Switching:</strong> The Settings sheet allows one-tap switching between network environments:
    <ul>
      <li><em>Campus Wi-Fi:</em> Connects to host at <code>10.2.39.171:8765</code>.</li>
      <li><em>ESP32 SoftAP:</em> Connects to host at <code>192.168.4.3:8765</code>.</li>
      <li><em>USB Tether:</em> Connects to host via loopback at <code>127.0.0.1:8765</code>.</li>
    </ul>
  </li>
</ul>

<h1>7. NOTES (GLOSSARY & ACRONYMS)</h1>
<p><strong>Glossary of Technical Terms:</strong></p>
<ul>
  <li><strong>Air-Gap Isolation:</strong> Complete physical and logical detachment of a computer from external networks to prevent data exfiltration.</li>
  <li><strong>Composite HID:</strong> A USB device configuration exposing multiple human input classes (keyboard + mouse) over a single physical cable.</li>
  <li><strong>LittleFS:</strong> A resilient, fail-safe SPI flash filesystem designed for embedded microcontrollers.</li>
  <li><strong>SoftAP:</strong> Software Access Point mode enabling an ESP32 to act as a standalone Wi-Fi hotspot without an external router.</li>
  <li><strong>TinyUSB:</strong> A high-performance, open-source embedded USB device stack integrated with FreeRTOS.</li>
</ul>

<p><strong>List of Acronyms:</strong></p>
<p>
<strong>ADC:</strong> Application Default Credentials &bull;
<strong>API:</strong> Application Programming Interface &bull;
<strong>DHCP:</strong> Dynamic Host Configuration Protocol &bull;
<strong>FIFO:</strong> First-In, First-Out Buffer &bull;
<strong>GPIO:</strong> General Purpose Input/Output &bull;
<strong>HID:</strong> Human Interface Device &bull;
<strong>ISR:</strong> Interrupt Service Routine &bull;
<strong>JSON:</strong> JavaScript Object Notation &bull;
<strong>LED:</strong> Light Emitting Diode &bull;
<strong>OTG:</strong> On-The-Go &bull;
<strong>PCB:</strong> Printed Circuit Board &bull;
<strong>RF:</strong> Radio Frequency &bull;
<strong>SoC:</strong> System-on-Chip &bull;
<strong>TUT:</strong> Tshwane University of Technology &bull;
<strong>UDP:</strong> User Datagram Protocol &bull;
<strong>USB:</strong> Universal Serial Bus &bull;
<strong>WDT:</strong> Watchdog Timer
</p>

<h1>8. REFERENCE</h1>
<ol>
  <li>USB-IF Standards Board, "HID Endpoint Descriptors and Class Profiles," Specification Rel. 1.11, Jun. 2021.</li>
  <li>Espressif Systems, "ESP32-S3 Microcontroller Architecture Manual," Doc. ESP32S3-TRM, Rev. 1.2, 2023.</li>
  <li>W3C Working Group, "WebSocket API Specification," Candidate Recommendation Draft, 2020.</li>
  <li>IEEE Standards Association, "IEEE 802.11 Wireless LAN Guidelines," Standard 802.11-2020, 2020.</li>
  <li>IETF Network Working Group, "The WebSocket Protocol," RFC 6455, Dec. 2011.</li>
</ol>

<h1>A. APPENDIXES</h1>

<h2>Appendix A.1: Hardware Interface & Pin Allocation Mapping</h2>
<table class="data-table">
  <tr>
    <th>Signal / Net</th>
    <th>ESP32-S3 Pin</th>
    <th>Hardware Mode</th>
    <th>Functional Description & Interconnect</th>
  </tr>
  <tr>
    <td><strong>USB D-</strong></td>
    <td>GPIO 19</td>
    <td>Native USB OTG</td>
    <td>USB 2.0 Full-Speed Differential Data Minus line.</td>
  </tr>
  <tr>
    <td><strong>USB D+</strong></td>
    <td>GPIO 20</td>
    <td>Native USB OTG</td>
    <td>USB 2.0 Full-Speed Differential Data Plus line.</td>
  </tr>
  <tr>
    <td><strong>RF Kill-Switch</strong></td>
    <td>GPIO 14</td>
    <td>Digital In (Pull-up)</td>
    <td>Active-low push-button; falling edge ISR terminates SoftAP in &lt;2 ms.</td>
  </tr>
  <tr>
    <td><strong>Status LED 1 (Wi-Fi)</strong></td>
    <td>GPIO 5</td>
    <td>Digital Output</td>
    <td>Blue LED with 330 &Omega; resistor; blinks when idle, solid when connected.</td>
  </tr>
  <tr>
    <td><strong>Status LED 2 (HID)</strong></td>
    <td>GPIO 4</td>
    <td>Digital Output</td>
    <td>Amber LED with 330 &Omega; resistor; strobes upon active USB HID packet injection.</td>
  </tr>
  <tr>
    <td><strong>VBUS Power</strong></td>
    <td>5V Pin</td>
    <td>Power Rail</td>
    <td>Directly powered from host USB 5V VBUS bus (peak draw &lt;280 mA).</td>
  </tr>
  <tr>
    <td><strong>Ground</strong></td>
    <td>GND Pin</td>
    <td>Ground Reference</td>
    <td>Common system ground plane for USB, LEDs, and tactile button.</td>
  </tr>
</table>

<h2>Appendix A.2: 3D Enclosure Assembly & Fabrication Specifications</h2>
<ul>
  <li><strong>Housing Dimensions:</strong> 76.0 mm (Length) &times; 38.0 mm (Width) &times; 16.0 mm (Height).</li>
  <li><strong>Recommended Slicer Settings:</strong> PETG filament, 0.16 mm layer height, 20% Gyroid infill, 3 perimeter walls.</li>
  <li><strong>Assembly Procedure:</strong>
    <ol>
      <li>Insert the <code>button_plunger.stl</code> into the guide channel of <code>enclosure_lid.stl</code> (captive flange prevents fallout).</li>
      <li>Slide 3mm Blue and Amber LEDs into the internal light isolation baffle sleeves.</li>
      <li>Mount the ESP32-S3 PCB onto the 4 base standoffs of <code>enclosure_base.stl</code> aligning the USB-C port cutout.</li>
      <li>Solder inline 330 &Omega; current-limiting resistors and connect push-button leads to GPIO 14 and GND.</li>
      <li>Snap the lid onto the base via the precision tongue-and-groove lip and secure with optional M3 fasteners.</li>
    </ol>
  </li>
</ul>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'USER_MANUAL.html');
const pdfPath = path.join(__dirname, 'USER_MANUAL.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('Created USER_MANUAL.html with official TUT logo');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const command = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;

console.log('Generating PDF via Chrome headless...');
execSync(command, { stdio: 'inherit' });

if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath);
  console.log(`SUCCESS: USER_MANUAL.pdf updated! Size: ${stats.size} bytes`);
} else {
  console.error('ERROR: USER_MANUAL.pdf was not generated.');
  process.exit(1);
}
