const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logoBase64 = fs.readFileSync(path.join(__dirname, 'tut_logo.png')).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const logoHtml = `
<div style="display: inline-flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 5px;">
  <img src="${logoDataUri}" style="height: 75px; width: auto; object-fit: contain;" alt="TUT Emblem">
  <div style="text-align: left;">
    <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 19pt; font-weight: 800; color: #003366; line-height: 1.15;">Tshwane University<br>of Technology</div>
    <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; font-style: italic; font-weight: 600; color: #C62828; margin-top: 3px;">We empower people</div>
  </div>
</div>
`;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Oral Defense & Presentation Preparation Guide - Hardware-Level USB Remote Access Gateway</title>
<style>
  @page {
    size: A4 portrait;
    margin: 14mm 14mm 14mm 14mm;
    @top-right {
      content: "TUT - PJD301B / IDC30BI Defense Preparation Guide";
      font-size: 8pt;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #666;
    }
    @bottom-center {
      content: "Page " counter(page);
      font-size: 8.5pt;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #555;
    }
  }

  @page :first {
    @top-right { content: none; }
    @bottom-center { content: none; }
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #222;
    background-color: #fff;
    line-height: 1.5;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
  }

  .header-container {
    text-align: center;
    border-bottom: 3px double #003366;
    padding-bottom: 12px;
    margin-bottom: 15px;
  }

  .doc-title {
    font-size: 16pt;
    font-weight: 800;
    color: #003366;
    margin: 10px 0 4px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .doc-subtitle {
    font-size: 10pt;
    font-weight: 600;
    color: #C62828;
    margin-bottom: 10px;
  }

  .meta-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    font-size: 8.5pt;
  }

  .meta-table td {
    border: 1px solid #dcdcdc;
    padding: 4.5px 8px;
  }

  .meta-label {
    background-color: #f3f6fa;
    font-weight: 700;
    color: #003366;
    width: 25%;
  }

  h1 {
    font-size: 13pt;
    font-weight: 800;
    color: #003366;
    border-bottom: 2px solid #003366;
    padding-bottom: 4px;
    margin-top: 18px;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  h2 {
    font-size: 11pt;
    font-weight: 700;
    color: #0b4f8a;
    margin-top: 14px;
    margin-bottom: 6px;
    border-left: 3px solid #C62828;
    padding-left: 6px;
  }

  .qa-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 10px;
    page-break-inside: avoid;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .question-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 4px;
  }

  .q-badge {
    background-color: #003366;
    color: #fff;
    font-size: 8pt;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 3px;
    white-space: nowrap;
  }

  .q-text {
    font-size: 10pt;
    font-weight: 700;
    color: #1a202c;
  }

  .intent-box {
    font-size: 8pt;
    color: #718096;
    font-style: italic;
    margin-bottom: 6px;
    padding-left: 2px;
  }

  .answer-box {
    background-color: #f8fafc;
    border-left: 3px solid #3182ce;
    padding: 6px 10px;
    font-size: 9pt;
    color: #2d3748;
    line-height: 1.45;
  }

  .answer-box strong {
    color: #003366;
  }

  .answer-box p {
    margin: 4px 0;
  }

  .speech-script {
    background: #f0f7ff;
    border: 1.5px solid #bee3f8;
    border-radius: 6px;
    padding: 10px 14px;
    margin: 10px 0;
    font-size: 9pt;
    color: #2b6cb0;
    line-height: 1.5;
  }

  .alert-box {
    background-color: #fffaf0;
    border-left: 4px solid #dd6b20;
    padding: 8px 12px;
    margin: 10px 0;
    font-size: 8.5pt;
  }

  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 8.5pt;
  }

  table.data-table th, table.data-table td {
    border: 1px solid #cbd5e0;
    padding: 5px 8px;
    text-align: left;
  }

  table.data-table th {
    background-color: #003366;
    color: #ffffff;
    font-weight: 700;
  }

  table.data-table tr:nth-child(even) {
    background-color: #f7fafc;
  }

  .formula-highlight {
    font-family: 'Consolas', 'Courier New', monospace;
    background-color: #edf2f7;
    padding: 1px 4px;
    border-radius: 3px;
    color: #b83280;
    font-weight: 600;
  }

  .page-break {
    page-break-before: always;
  }
</style>
</head>
<body>

<div class="header-container">
  ${logoHtml}
  <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; font-weight: 700; color: #333; margin-top: 4px;">FACULTY OF INFORMATION AND COMMUNICATION TECHNOLOGY</div>
  <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 10pt; font-weight: 600; color: #555;">DEPARTMENT OF COMPUTER SYSTEMS ENGINEERING &bull; PJD 301B / IDC30BI</div>
  <div class="doc-title">Project Defense & Oral Examination Preparation Manual</div>
  <div class="doc-subtitle">High-Probability Panel Inquiries &bull; Plain English Spoken Responses &bull; Technical Cheat Sheet</div>

  <table class="meta-table">
    <tr>
      <td class="meta-label">PROJECT TITLE</td>
      <td><strong>Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation</strong></td>
      <td class="meta-label">DATE OF DEFENSE</td>
      <td>November 2026 (Final Deliverable)</td>
    </tr>
    <tr>
      <td class="meta-label">STUDENT NAME</td>
      <td><strong>Oratile Innocent Tshosetso</strong></td>
      <td class="meta-label">STUDENT NUMBER</td>
      <td><strong>222883253</strong></td>
    </tr>
    <tr>
      <td class="meta-label">PROJECT EXAMINERS</td>
      <td><strong>Muwanguzi Mark Ntume & Chunling Du</strong></td>
      <td class="meta-label">QUALIFICATION</td>
      <td>National Diploma: Computer Systems Engineering</td>
    </tr>
  </table>
</div>

<h1>1. The 2-Minute Opening Pitch (Spoken Speech Script)</h1>
<p><em>Deliver this opening statement with a calm, steady, and confident posture. Address both lecturers by name:</em></p>

<div class="speech-script">
  <strong>"Good morning Mr. Ntume, Dr. Du, and esteemed examiners. My name is Oratile Innocent Tshosetso (Student Number: 222883253).</strong><br><br>
  Today I present my final project: the <strong>Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation</strong>.<br><br>
  In modern IT environments, data centers, and industrial SCADA facilities, traditional remote desktop tools like TeamViewer or AnyDesk cannot be used because host security policies prohibit unauthorized software installations, open firewall ports, and external internet connectivity.<br><br>
  My project solves this by moving remote control from software down to the <strong>physical hardware layer</strong>. When plugged into a target PC, the ESP32-S3 microcontroller natively enumerates as a driverless USB Composite Human Interface Device (standard mouse and keyboard). It broadcasts an isolated Wi-Fi Access Point (<code>ESP32-Gateway</code>) that connects to a mobile smartphone over full-duplex WebSockets.<br><br>
  Touch gestures and keystrokes from the smartphone are translated into hardware USB signals with an end-to-end response time under <strong>28.1 milliseconds</strong>. The system costs only <strong>R645.00</strong> to construct, leaves zero software footprint on the target computer, and includes an active hardware RF kill-switch for immediate physical safety cutoff.<br><br>
  I am prepared to demonstrate the device and answer any questions from the panel."
</div>

<h1>2. Section I: Project Proposal & Motivation Q&A</h1>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 1</span>
    <span class="q-text">Why did you build a hardware device when software tools like TeamViewer, AnyDesk, or RDP already exist?</span>
  </div>
  <div class="intent-box">Panel Intent: Testing whether you understand the genuine engineering problem versus existing market software.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"Sir, existing software tools require three things that are strictly banned in high-security, banking, and air-gapped environments:
    <strong>(1)</strong> They require host administrator permissions to install agent software, 
    <strong>(2)</strong> they require open incoming firewall ports, and 
    <strong>(3)</strong> they require external internet connectivity."</p>
    <p>"My device works from the <strong>hardware layer</strong>. It requires <strong>zero software and zero drivers</strong> on the target computer. The operating system accepts it immediately as a standard, physical plug-and-play USB mouse and keyboard, leaving no logs, background services, or registry traces behind."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 2</span>
    <span class="q-text">Who is the target market for this device and where will it be deployed?</span>
  </div>
  <div class="intent-box">Panel Intent: Verifying real-world industrial and commercial relevance as required by IDC30BI curriculum.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"The primary target markets are:
    <br>1. <strong>Data Center Technicians:</strong> It eliminates the need to push heavy KVM crash carts (bulky monitors and keyboards) through cramped server aisles.
    <br>2. <strong>Industrial SCADA & Field Engineers:</strong> Working on locked-down industrial PLCs and consoles where software installation is forbidden.
    <br>3. <strong>Accessibility Users:</strong> Allowing users with motor impairments to control standard desktop workstations via mobile touchscreens."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 3</span>
    <span class="q-text">Did you manage to stay within your proposed R645.00 budget and project timetable?</span>
  </div>
  <div class="intent-box">Panel Intent: Evaluating project engineering management, procurement diligence, and risk mitigation.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"Yes, ma'am. The total expenditure strictly adhered to the R645.00 budget. All components were procured locally from Micro Robotics and Communica to eliminate customs lead times:
    <br>&bull; <strong>Dual ESP32-S3 boards (with 1 hardware redundancy unit):</strong> R370.00
    <br>&bull; <strong>Tactile switches, resistors, and status LEDs:</strong> R25.00
    <br>&bull; <strong>Prototyping breadboard and jumper wires:</strong> R85.00
    <br>&bull; <strong>Custom 3D-printed enclosure fabrication:</strong> R120.00
    <br>All 4 phases—from September breadboard prototyping to November testing and documentation—were delivered on schedule."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 4</span>
    <span class="q-text">What technical features were intentionally declared out of scope?</span>
  </div>
  <div class="intent-box">Panel Intent: Checking boundary management and realistic technical scope definition.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"In the project proposal, I specifically demarcated direct video capture hardware (like on-board HDMI capture) and Bluetooth audio as out of scope. Including heavy video encoding directly on the microcontroller would saturate the 2.4 GHz radio and cause touch latency jitter. Keeping the embedded dongle focused purely on low-latency USB HID input ensured deterministic sub-30ms performance."</p>
  </div>
</div>

<div class="page-break"></div>

<h1>3. Section II: Technical Design & Architecture Q&A (IEEE 1016)</h1>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 5</span>
    <span class="q-text">Why did you select the ESP32-S3 chip rather than a classic ESP32, ESP8266, or Arduino?</span>
  </div>
  <div class="intent-box">Panel Intent: The #1 technical question. They want to verify that you know microcontroller peripherals.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"The classic ESP32, ESP8266, and Arduino Uno do not have an on-die USB OTG physical transceiver. Their USB ports are connected to an external USB-to-UART bridge (like CH340 or CP2102) which can only transmit serial text and cannot emulate USB HID hardware."</p>
    <p>"The <strong>ESP32-S3</strong> features an integrated Full-Speed USB 2.0 OTG peripheral with native physical differential lines (<span class="formula-highlight">GPIO 19 for D-</span> and <span class="formula-highlight">GPIO 20 for D+</span>). This internal hardware allows the microcontroller itself to act directly as a true USB device running the TinyUSB stack."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 6</span>
    <span class="q-text">How does the host operating system recognize your device without driver installation?</span>
  </div>
  <div class="intent-box">Panel Intent: Testing knowledge of USB-IF industry standards and descriptor architecture.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"The device complies with the <strong>USB-IF HID Specification v1.11</strong>. Modern operating systems (Windows, macOS, Linux) have native class drivers pre-installed for HID devices. During USB bus enumeration, the ESP32-S3 presents a <strong>Composite HID Descriptor</strong> containing two collections:
    <br>&bull; A <strong>4-byte Mouse Report:</strong> Byte 0 for button bitmask (Left, Right, Middle), Bytes 1 & 2 for signed X/Y relative deltas, Byte 3 for scroll wheel.
    <br>&bull; An <strong>8-byte Keyboard Report:</strong> Byte 0 for modifiers (Ctrl, Shift, Alt, GUI), Byte 1 reserved, Bytes 2–7 for standard 6-key rollover keycodes.
    The host OS accepts these reports natively without third-party drivers."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 7</span>
    <span class="q-text">How is the dual-core architecture of the ESP32-S3 utilized in FreeRTOS?</span>
  </div>
  <div class="intent-box">Panel Intent: Assessing multithreaded embedded software design and real-time computing principles.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"I decoupled the system into two independent FreeRTOS pipelines running on separate Xtensa LX7 cores:
    <br>&bull; <strong>Core 0 (Networking & Protocol):</strong> Runs the LwIP TCP/IP stack, manages the 802.11 b/g/n SoftAP, handles client WebSocket connections on Port 80, and parses incoming JSON packets.
    <br>&bull; <strong>Core 1 (Hardware Execution):</strong> Reads decoded input events from an atomic, thread-safe circular ring buffer and writes formatted HID reports directly into the physical USB hardware endpoint FIFO.
    This core isolation prevents Wi-Fi beacon processing or network bursts on Core 0 from stalling or jittering the 125 Hz USB polling schedule on Core 1."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 8</span>
    <span class="q-text">How did you calculate and verify the total system latency of 28.1 milliseconds?</span>
  </div>
  <div class="intent-box">Panel Intent: Mathematical and empirical verification of real-time performance claims.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"The end-to-end latency is the cumulative sum of four discrete hardware and software stages:
    <br><span class="formula-highlight">T_total = T_touch + T_ws + T_esp + T_usb</span>
    <br>1. <strong>Mobile Digitizer Sampling (T_touch):</strong> ~16.6 ms (operating at standard 60 Hz touch polling).
    <br>2. <strong>Wi-Fi WebSocket Transit (T_ws):</strong> ~4.0 to 7.0 ms over local peer-to-peer 2.4 GHz SoftAP.
    <br>3. <strong>ESP32 JSON Deserialization (T_esp):</strong> &lt;0.5 ms using ArduinoJson zero-copy memory buffers.
    <br>4. <strong>Host USB Polling Interval (T_usb):</strong> 8.0 ms (standard 125 Hz USB HID poll rate).
    <br>Summing these gives approximately <strong>28.1 ms</strong>, well below the 50 ms human perceptual lag threshold."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 9</span>
    <span class="q-text">Explain the touch velocity formula: V = &alpha; &times; (&Delta;D)^1.2.</span>
  </div>
  <div class="intent-box">Panel Intent: Checking mathematical modeling and ergonomics of the touch tracking engine.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"Linear 1-to-1 touch mapping creates a tradeoff: cursor movement is either too sluggish across large desktop displays or too jittery for clicking small icons. I implemented a non-linear velocity curve where:
    <br>&bull; <span class="formula-highlight">&Delta;D</span> represents physical touch vector displacement.
    <br>&bull; The exponent <span class="formula-highlight">1.2</span> suppresses micro-tremors during fine movements while scaling exponentially during rapid swipes.
    <br>&bull; <span class="formula-highlight">&alpha;</span> is the sensitivity multiplier adjusted by the user in the mobile app (0.4&times; to 2.5&times;)."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 10</span>
    <span class="q-text">Is this device a security vulnerability, like a Rubber Ducky (BadUSB)?</span>
  </div>
  <div class="intent-box">Panel Intent: Ethical engineering, cybersecurity governance, and defense mechanisms.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"No, sir. A Rubber Ducky is an autonomous penetration-testing tool designed to inject pre-scripted malicious payloads the millisecond it is inserted. My gateway is strictly an <strong>interactive human administrative bridge</strong>:
    <br>1. <strong>No Autonomous Payloads:</strong> It contains zero autorun scripts; it only transmits commands actively initiated by a human operator.
    <br>2. <strong>Physical Proximity Requirement:</strong> It operates strictly over local SoftAP within a 10–15 meter radius.
    <br>3. <strong>Hardware RF Kill-Switch:</strong> A physical push-button directly halts all radio transmissions in under 2 ms if unauthorized access is suspected."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 11</span>
    <span class="q-text">How does the hardware RF kill-switch function electrically and logically?</span>
  </div>
  <div class="intent-box">Panel Intent: Verifying low-level interrupt handling and fail-safe design.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"The kill-switch is a tactile push-button wired to <strong>GPIO 14</strong> configured with an internal pull-up resistor. Pressing the button pulls the pin to ground (active-low), triggering a falling-edge hardware Interrupt Service Routine (ISR). Rather than waiting for a software polling cycle, the ISR invokes <span class="formula-highlight">esp_wifi_stop()</span> immediately, terminating RF broadcasting in <strong>under 2 ms</strong> while maintaining USB bus enumeration."</p>
  </div>
</div>

<div class="page-break"></div>

<h1>4. Section III: User Manual & Troubleshooting Q&A (IEEE 1063)</h1>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 12</span>
    <span class="q-text">Walk the panel through the exact initiation and operational procedure.</span>
  </div>
  <div class="intent-box">Panel Intent: Evaluating operational usability and user manual adherence.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"Operation requires three straightforward steps:
    <br>1. <strong>Hardware Insertion:</strong> Plug the ESP32-S3 dongle into the host PC USB port. The PC immediately enumerates the HID collections.
    <br>2. <strong>Wireless Association:</strong> Connect the smartphone to the Wi-Fi SSID <code>ESP32-Gateway</code> (Passphrase: <code>Password123</code>).
    <br>3. <strong>Launch Client:</strong> Open the <code>Hardware Gateway</code> mobile application. The status indicator displays <code>ESP32: Connected</code>, and the operator can immediately navigate the mouse, double-tap, right-click, and input text."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 13</span>
    <span class="q-text">What diagnostic feedback do the two LEDs on the enclosure provide?</span>
  </div>
  <div class="intent-box">Panel Intent: Checking hardware diagnostics and human-machine interface (HMI) design.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"The enclosure incorporates two isolated LEDs channeled through 3.2 mm light pipes:
    <br>&bull; <strong>Blue LED (GPIO 5):</strong> Indicates Wi-Fi state. It flashes slowly at 1 Hz when the SoftAP is idle, and switches to solid illumination once a mobile client establishes a WebSocket handshake.
    <br>&bull; <strong>Amber LED (GPIO 4):</strong> Indicates USB HID bus activity. It strobes momentarily whenever an active mouse delta or keyboard report is injected into the host PC."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 14</span>
    <span class="q-text">What does it mean if the mobile app displays 'Screen Offline', and does input stop?</span>
  </div>
  <div class="intent-box">Panel Intent: Understanding system modularity and graceful degradation.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"Mouse and keyboard control continue to operate with 100% functionality. The visual screen feed is an optional companion feature. <code>Screen Offline</code> simply indicates that the companion Python screen capture daemon (<code>HardwareGatewayStream.py</code>) is not running on the target PC or port 8765 is blocked by Windows Defender. Launching the daemon restores the video feed without affecting HID control."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 15</span>
    <span class="q-text">What fail-safe measures prevent repeated keys if the phone disconnects mid-keystroke?</span>
  </div>
  <div class="intent-box">Panel Intent: Verifying fault tolerance, recovery procedures, and software reliability.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"The system incorporates three layers of fail-safe protection:
    <br>1. <strong>Explicit Release Events:</strong> The client software transmits distinct <code>key_down</code> and <code>key_up</code> packets.
    <br>2. <strong>Buffer Flush on Disconnect:</strong> If the WebSocket connection drops unexpectedly, the Core 1 HID task automatically clears the keyboard report buffer to all zeros to prevent key-repeat loops.
    <br>3. <strong>Hardware Watchdog Timer (WDT):</strong> The ESP32-S3 hardware watchdog is configured with a 3.0-second timeout to reset the chip automatically in case of execution deadlock."</p>
  </div>
</div>

<div class="qa-card">
  <div class="question-header">
    <span class="q-badge">Question 16</span>
    <span class="q-text">Describe the design and fabrication specifications of the 3D-printed enclosure.</span>
  </div>
  <div class="intent-box">Panel Intent: Checking mechanical integration, CAD modeling, and manufacturing standards.</div>
  <div class="answer-box">
    <p><strong>Spoken Answer:</strong></p>
    <p>"The enclosure was modeled in OpenSCAD and 3D printed using durable PETG filament with a 0.16 mm layer height and 20% Gyroid infill. Its mechanical features include:
    <br>&bull; A front beveled port cutout (14 mm &times; 6.5 mm) providing clearance for standard USB-C cables.
    <br>&bull; Dual internal 3.2 mm isolation light pipe sleeves that prevent optical bleed between the Blue and Amber LEDs.
    <br>&bull; A captive flange guide channel holding the ergonomic 7.2 mm tactile plunger button to reliably actuate the kill-switch."</p>
  </div>
</div>

<h1>5. Summary Technical Memory Sheet (Quick-Recall Reference)</h1>

<table class="data-table">
  <tr>
    <th style="width: 30%;">Parameter / Component</th>
    <th style="width: 35%;">Technical Specification</th>
    <th style="width: 35%;">Engineering Purpose</th>
  </tr>
  <tr>
    <td><strong>Microcontroller Unit (MCU)</strong></td>
    <td>ESP32-S3-WROOM-1 (Xtensa LX7 Dual-Core @ 240 MHz)</td>
    <td>Dual-core isolation: Core 0 (Wi-Fi/WS), Core 1 (USB HID)</td>
  </tr>
  <tr>
    <td><strong>USB OTG Physical Pins</strong></td>
    <td><strong>GPIO 19</strong> (D-) & <strong>GPIO 20</strong> (D+)</td>
    <td>Direct Full-Speed USB differential data connection to host</td>
  </tr>
  <tr>
    <td><strong>Hardware Kill-Switch</strong></td>
    <td><strong>GPIO 14</strong> (Active-Low Hardware ISR)</td>
    <td>Calls <code>esp_wifi_stop()</code> in &lt;2 ms to cut all RF broadcasting</td>
  </tr>
  <tr>
    <td><strong>Wi-Fi Status LED</strong></td>
    <td><strong>GPIO 5</strong> (Blue LED with 330 &Omega; resistor)</td>
    <td>Blinks at 1 Hz when idle; solid when mobile client connects</td>
  </tr>
  <tr>
    <td><strong>HID Activity LED</strong></td>
    <td><strong>GPIO 4</strong> (Amber LED with 330 &Omega; resistor)</td>
    <td>Strobes during active USB mouse or keyboard report injection</td>
  </tr>
  <tr>
    <td><strong>Total System Latency</strong></td>
    <td><strong>28.1 ms</strong> (Cumulative end-to-end)</td>
    <td>16.6ms touch + 4.5ms WS + 0.5ms decode + 8.0ms USB poll</td>
  </tr>
  <tr>
    <td><strong>Wireless SoftAP Config</strong></td>
    <td>SSID: <code>ESP32-Gateway</code>, TCP Port 80</td>
    <td>Local isolated 802.11 b/g/n WebSocket channel (RFC 6455)</td>
  </tr>
  <tr>
    <td><strong>Host Screen Streamer</strong></td>
    <td>Python 3 Asyncio WebSocket, Port 8765</td>
    <td>Optional companion daemon for remote JPEG frame streaming</td>
  </tr>
  <tr>
    <td><strong>Total Project Cost</strong></td>
    <td><strong>R 645.00 ZAR</strong></td>
    <td>Strict compliance with proposed procurement budget</td>
  </tr>
  <tr>
    <td><strong>Standards Followed</strong></td>
    <td>IEEE 1016 (Design), IEEE 1063 (Manual), USB-IF v1.11</td>
    <td>Formal academic compliance for TUT National Diploma</td>
  </tr>
</table>

<h1>6. Presentation Day Protocol & Tactical Advice</h1>

<div class="alert-box">
  <strong>Live Demonstration Strategy (The 30-Second Rule):</strong><br>
  1. <strong>Connect & Confirm:</strong> Plug the dongle into your laptop. Show the Blue LED turn solid when your phone connects, and the status pill in the Flutter app turn green (<code>ESP32: Connected</code>).<br>
  2. <strong>Demonstrate Velocity & Typing:</strong> Move the cursor across the screen smoothly, open Notepad, and type a quick sentence using the mobile virtual keyboard.<br>
  3. <strong>Actuate the Kill-Switch:</strong> Press the physical push-button on the enclosure. Point out that the phone immediately disconnects and the Blue LED turns off—proving physical air-gap security works in real-time.
</div>

<div class="alert-box" style="background-color: #f0fff4; border-left-color: #38a169;">
  <strong>How to Handle Difficult Questions:</strong><br>
  If asked something outside your immediate scope, do not panic or say "I don't know."<br>
  <em>Use this professional phrasing:</em><br>
  <strong>"That is an excellent engineering consideration, Mr. Ntume / Dr. Du. In this prototype, our primary objective under IEEE 1016 was guaranteeing deterministic sub-30ms input latency and physical air-gap safety. That proposed feature represents an ideal architectural milestone for Phase 2 implementation."</strong>
</div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'PROJECT_DEFENSE_PREPARATION_GUIDE.html');
const pdfPath = path.join(__dirname, 'PROJECT_DEFENSE_PREPARATION_GUIDE.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('Created PROJECT_DEFENSE_PREPARATION_GUIDE.html with official TUT logo');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const command = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;

console.log('Generating PDF via Chrome headless...');
try {
  execSync(command, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`SUCCESS: PROJECT_DEFENSE_PREPARATION_GUIDE.pdf created! Size: ${stats.size} bytes`);
  } else {
    console.error('ERROR: PDF was not generated.');
    process.exit(1);
  }
} catch (err) {
  console.error('Execution error generating PDF:', err.message);
  process.exit(1);
}
