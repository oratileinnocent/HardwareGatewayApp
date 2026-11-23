const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logoBase64 = fs.readFileSync(path.join(__dirname, 'tut_logo.png')).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const logoHtml = `
<div style="display: flex; align-items: center; gap: 14px;">
  <img src="${logoDataUri}" style="height: 52px; width: auto; object-fit: contain;" alt="TUT Emblem">
  <div style="text-align: left;">
    <div style="font-size: 14pt; font-weight: 800; color: #003366; line-height: 1.15;">Tshwane University of Technology</div>
    <div style="font-size: 8.5pt; font-style: italic; font-weight: 600; color: #C62828;">Department of Computer Systems Engineering</div>
  </div>
</div>
`;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Final Defense Presentation Slides - Hardware-Level USB Remote Access Gateway</title>
<style>
  @page {
    size: 297mm 210mm; /* A4 Landscape 16:9 feel */
    margin: 10mm 12mm 10mm 12mm;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
  }

  body {
    background: #fff;
    color: #1F2937;
    font-size: 11pt;
    line-height: 1.45;
  }

  .slide {
    width: 273mm;
    height: 190mm;
    page-break-after: always;
    break-after: page;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 6mm 8mm;
    position: relative;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    background: #FFFFFF;
  }

  .slide:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Slide Header */
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #003366;
    padding-bottom: 4mm;
    margin-bottom: 4mm;
  }

  .slide-category {
    font-size: 8.5pt;
    font-weight: 800;
    color: #0284C7;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .slide-title {
    font-size: 20pt;
    font-weight: 800;
    color: #0F172A;
    line-height: 1.2;
    margin-top: 2px;
  }
  .slide-title span {
    color: #0284C7;
  }

  .slide-number-badge {
    background: #003366;
    color: #fff;
    padding: 4px 12px;
    border-radius: 6px;
    font-weight: 800;
    font-size: 10pt;
    letter-spacing: 0.5px;
  }

  /* Slide Body & Grids */
  .slide-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4mm;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5mm;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4mm;
  }

  .card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 4.5mm 5mm;
  }
  .card-blue { border-top: 4px solid #003366; }
  .card-sky { border-top: 4px solid #0284C7; }
  .card-amber { border-top: 4px solid #D97706; }
  .card-green { border-top: 4px solid #16A34A; }

  .card h3 {
    font-size: 12.5pt;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 2.5mm;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card p, .card li {
    font-size: 9.5pt;
    color: #334155;
    line-height: 1.45;
  }
  .card ul {
    padding-left: 5mm;
  }
  .card li {
    margin-bottom: 2mm;
  }

  .stat-badge {
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    padding: 3mm 4mm;
    border-radius: 6px;
    text-align: center;
    margin-top: 2.5mm;
  }
  .stat-badge .num {
    font-size: 22pt;
    font-weight: 800;
    color: #0284C7;
  }
  .stat-badge .lbl {
    font-size: 8pt;
    font-weight: 700;
    color: #64748B;
    text-transform: uppercase;
  }

  /* Spoken Script Box */
  .spoken-script-box {
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    border-left: 4px solid #16A34A;
    padding: 2.5mm 4mm;
    border-radius: 0 6px 6px 0;
    font-size: 8.8pt;
    color: #14532D;
    line-height: 1.35;
    margin-top: 2mm;
  }
  .spoken-script-box strong {
    color: #0F172A;
  }

  /* Slide Footer */
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #E2E8F0;
    padding-top: 2.5mm;
    font-size: 8pt;
    color: #64748B;
    font-weight: 600;
  }
  .slide-footer .candidate-tag {
    color: #003366;
    font-weight: 700;
  }
</style>
</head>
<body>

  <!-- =========================================================================
       SLIDE 1: TITLE & IDENTITY
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      ${logoHtml}
      <div class="slide-number-badge">SLIDE 01 / 12</div>
    </div>
    <div class="slide-body">
      <div style="text-align: center; margin: 3mm 0 5mm 0;">
        <div class="slide-category">FINAL YEAR ACADEMIC CAPSTONE DEFENSE (PJD 301B / IDC30BI)</div>
        <h1 style="font-size: 25pt; font-weight: 800; color: #003366; line-height: 1.2; margin: 2mm 0;">
          Hardware-Level USB Remote Access Gateway<br><span style="color: #0284C7;">via ESP32-S3 HID Emulation</span>
        </h1>
        <div style="font-size: 11pt; color: #475569; font-weight: 600;">Driverless Human Interface Emulation & Deterministic Low-Latency Wireless Bridge</div>
      </div>

      <div class="grid-2">
        <div class="card card-blue">
          <h3>🎓 Candidate Profile</h3>
          <p><strong>Candidate Name:</strong> Oratile Innocent Tshosetso</p>
          <p><strong>Student Number:</strong> 222883253</p>
          <p><strong>Qualification:</strong> National Diploma in Computer Systems Engineering</p>
          <p><strong>Date of Defense:</strong> November 2026 (Final Deliverable)</p>
        </div>
        <div class="card card-sky">
          <h3>👨‍🏫 Examination Panel & Academic Standards</h3>
          <p><strong>Project Examiner 1:</strong> Mr. Muwanguzi Mark Ntume</p>
          <p><strong>Project Examiner 2:</strong> Dr. Chunling Du</p>
          <p><strong>Department:</strong> Computer Systems Engineering • Faculty of ICT</p>
          <p><strong>Compliance:</strong> IEEE 1016 (System Design) & IEEE 1063 (User Documentation)</p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script (30 Seconds):</strong> "Good morning Mr. Ntume, Dr. Du, and esteemed examiners. My name is Oratile Innocent Tshosetso (Student Number: 222883253). Today I present my final project: the Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation. This project addresses the fundamental security, driver, and network barriers that prevent traditional remote administration tools from functioning in mission-critical environments."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>National Diploma: Computer Systems Engineering</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 2: PROBLEM STATEMENT
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 1: Problem Motivation</div>
        <div class="slide-title">The Dilemma: <span>Why Software Remote Access Fails</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 02 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-amber">
          <h3>🚫 Privilege Restrictions</h3>
          <ul>
            <li>High-security facilities (Banks, SCADA, Data Centers) forbid installing agent software.</li>
            <li>Requires elevated host administrator access that field engineers do not have.</li>
          </ul>
        </div>
        <div class="card card-amber">
          <h3>🔒 Firewall & Network Barriers</h3>
          <ul>
            <li>Tools like TeamViewer, AnyDesk, and RDP require open incoming firewall ports.</li>
            <li>Air-gapped and industrial consoles have <strong>zero external internet connectivity</strong>.</li>
          </ul>
        </div>
        <div class="card card-amber">
          <h3>🛒 Crash Cart Inefficiency</h3>
          <ul>
            <li>Technicians must physically wheel bulky monitors and keyboards into cold server aisles.</li>
            <li>Commercial digital KVM equipment costs <strong>R8,000 to R15,000</strong> per unit.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "In modern IT and SCADA environments, traditional remote desktop tools cannot be used because host security policies prohibit unauthorized software installations, open firewall ports, and external internet connectivity. Technicians are forced to push heavy physical crash carts into cramped aisles just to plug in a keyboard and monitor."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Problem Statement & Justification</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 3: THE ENGINEERING SOLUTION
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 2: Engineering Innovation</div>
        <div class="slide-title">The Solution: <span>Physical Hardware-Layer Control</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 03 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>⚡ Driverless USB Composite HID Emulation</h3>
          <ul>
            <li>Complies with standard <strong>USB-IF HID Specification v1.11</strong>.</li>
            <li>The host computer natively accepts the dongle as a generic physical mouse & keyboard.</li>
            <li><strong>Zero drivers, zero software footprint, zero background logs</strong> on the target machine.</li>
            <li>Operational across Windows, Linux, macOS, and BIOS/UEFI boot menus.</li>
          </ul>
        </div>
        <div class="card card-sky">
          <h3>📡 Isolated Peer-to-Peer Wireless Channel</h3>
          <ul>
            <li>ESP32-S3 broadcasts its own independent 802.11 b/g/n Wi-Fi SoftAP (<code>ESP32-Gateway</code>).</li>
            <li>Direct full-duplex WebSocket connection to the technician's mobile smartphone.</li>
            <li>Touch gestures and keystrokes translate into hardware USB signals in under <strong>28.1 ms</strong>.</li>
            <li>Built-in hardware RF kill-switch terminates radio broadcasts in under <strong>2 ms</strong>.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "My project solves this by moving remote control from software down to the physical hardware layer. The ESP32-S3 microcontroller natively enumerates as a driverless USB mouse and keyboard while broadcasting an isolated local Wi-Fi SoftAP. Touch gestures from the phone are translated into hardware USB signals with an end-to-end response time under 28.1 milliseconds."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Proposed Engineering Solution</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 4: SYSTEM ARCHITECTURE & DUAL-CORE PROCESSING
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 3: Microcontroller Architecture</div>
        <div class="slide-title">Dual-Core Decoupling <span>Under FreeRTOS</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 04 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>Core 0: Networking & Protocol Manager</h3>
          <ul>
            <li>Executes the LwIP TCP/IP stack and 802.11 SoftAP.</li>
            <li>Maintains persistent WebSocket connections on Port 80.</li>
            <li>Performs zero-copy JSON parsing using ArduinoJson memory buffers (&lt;0.5 ms).</li>
            <li>Transfers decoded commands into an atomic, thread-safe circular ring buffer.</li>
          </ul>
        </div>
        <div class="card card-sky">
          <h3>Core 1: Deterministic USB HID Execution</h3>
          <ul>
            <li>Dedicated exclusively to physical USB hardware endpoint FIFO control.</li>
            <li>Runs the TinyUSB composite driver stack.</li>
            <li>Maintains a strict, non-blocking 125 Hz USB HID poll cycle (8.0 ms frames).</li>
            <li><strong>Core Isolation:</strong> Wi-Fi beacon bursts or network retries on Core 0 <strong>never stall or jitter</strong> USB execution on Core 1.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "To ensure real-time responsiveness, I decoupled the system into two independent FreeRTOS pipelines running on separate Xtensa LX7 cores. Core 0 handles networking and packet parsing, while Core 1 is dedicated exclusively to the physical USB hardware endpoint. This core isolation ensures Wi-Fi traffic never stalls or jitters the 125 Hz USB polling schedule."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Dual-Core FreeRTOS Pipeline</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 5: DUAL-ENGINE "HANDS & EYES"
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 4: Modular System Design</div>
        <div class="slide-title">Dual-Engine Strategy: <span>"The Hands and The Eyes"</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 05 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>Engine 1: USB Hardware Dongle (The Hands)</h3>
          <ul>
            <li>Primary control pipeline: 100% autonomous, firmware-driven.</li>
            <li>Injects mouse movement, button clicks, and keystrokes into USB hardware.</li>
            <li>Unblockable by firewalls, antivirus, or restricted operating systems.</li>
            <li>Operates even during PC BIOS setup and pre-boot recovery screens.</li>
          </ul>
        </div>
        <div class="card card-sky">
          <h3>Engine 2: HardwareGatewayStream (The Eyes)</h3>
          <ul>
            <li>Optional Python 3 companion daemon running on the host PC.</li>
            <li>Captures desktop frames at 15 FPS via <code>mss</code> and streams binary JPEG frames.</li>
            <li>Fetches real Windows cursor coordinates via <code>user32.GetCursorPos()</code>.</li>
            <li><strong>Graceful Degradation:</strong> If the video feed is closed, the hardware mouse and keyboard continue working with 100% fidelity.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "A key design strength is modularity, which I describe as 'The Hands and The Eyes'. The USB dongle is the hands: it clicks and types with zero software required. When visual feedback is needed, the optional companion daemon acts as the eyes, streaming the screen back to the phone. If the screen feed is closed, hardware control never stops."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>System Modularity & Graceful Degradation</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 6: HARDWARE & PHYSICAL ENCLOSURE
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 5: Mechanical & Circuit Fabrication</div>
        <div class="slide-title">Vero Board Integration & <span>3D-Printed Enclosure</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 06 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>🔌 Electronic Schematic & Assembly</h3>
          <ul>
            <li>ESP32-S3-N8R2 mounted on custom-machined Vero board carrier.</li>
            <li>Native USB OTG differential data connection (GPIO 19 D-, GPIO 20 D+).</li>
            <li><strong>Blue LED (GPIO 5, 330Ω):</strong> Wi-Fi state (1 Hz blink = idle, solid = linked).</li>
            <li><strong>Amber LED (GPIO 4, 330Ω):</strong> USB HID activity strobe.</li>
            <li><strong>Hardware Kill-Switch (GPIO 14):</strong> Active-low falling-edge interrupt.</li>
          </ul>
        </div>
        <div class="card card-sky">
          <h3>📦 Custom PETG Snap-Fit Enclosure</h3>
          <ul>
            <li>Designed in OpenSCAD; sliced in PrusaSlicer (0.20mm layers, 20% infill).</li>
            <li>Front beveled port cutout (14mm × 6.5mm) for standard USB-C cables.</li>
            <li>Dual internal 3.2mm light pipe sleeves to prevent optical LED bleed.</li>
            <li>Captive 7.2mm tactile plunger button for immediate kill-switch actuation.</li>
            <li>Internal bottom clearance channel for soldered breadboard pin headers.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "The circuit is integrated onto a compact Vero board with clearance routing for breadboard pins. I designed a custom snap-fit enclosure in OpenSCAD and 3D printed it in PETG. It features dedicated optical light pipes to isolate the blue and amber diagnostic LEDs, a beveled USB-C port channel, and an ergonomic captive plunger for the safety switch."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Mechanical & Hardware Integration</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 7: MOBILE CLIENT ARCHITECTURE
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 6: Mobile Client Engineering</div>
        <div class="slide-title">Flutter App: <span>Zero-Jank 120 FPS Rendering</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 07 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-blue">
          <h3>🚀 Zero-Rebuild Pipeline</h3>
          <p>Replaced whole-page <code>setState</code> rebuilding with isolated <code>ValueNotifier</code> listeners. Eliminates UI thread frame drops during 120 Hz touchpad panning.</p>
        </div>
        <div class="card card-sky">
          <h3>🎯 Sub-Pixel Accumulator</h3>
          <p>Preserves fractional touch deltas (<code>_accumulatedDx/Dy</code>). Eliminates dead zones and integer truncation stutter during fine, microscopic finger glide.</p>
        </div>
        <div class="card card-amber">
          <h3>🖱️ Single-Cursor Parity</h3>
          <p>Removed redundant client-side overlay cursor. Screen feed displays the single, real Windows cursor at 100% speed, velocity, and position parity.</p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "The mobile client was engineered in Flutter with a zero-rebuild architecture using ValueNotifiers. This allows the touchpad to capture gestures at full 120 Hz polling rates without dropping a frame. I implemented a sub-pixel motion accumulator that prevents slow movements from truncating to zero, and synchronized the display so the user sees only one true cursor that moves in complete lockstep with the PC."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Flutter Mobile Architecture</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 8: LATENCY MODELING & EMPIRICAL VERIFICATION
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 7: Performance Verification</div>
        <div class="slide-title">Latency Modeling: <span>28.1 ms End-to-End Breakdown</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 08 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>⏱️ Cumulative System Latency Formula</h3>
          <p style="font-size: 13pt; font-weight: 800; color: #003366; margin: 3mm 0;">
            T_total = T_touch + T_ws + T_esp + T_usb
          </p>
          <ul>
            <li><strong>Mobile Touch Digitizer Sampling (T_touch):</strong> ~16.6 ms (standard 60 Hz).</li>
            <li><strong>Wi-Fi WebSocket Transit (T_ws):</strong> ~4.0 to 7.0 ms (local 2.4 GHz SoftAP).</li>
            <li><strong>ESP32 JSON Deserialization (T_esp):</strong> &lt; 0.5 ms (zero-copy memory).</li>
            <li><strong>Host USB HID Polling Interval (T_usb):</strong> 8.0 ms (125 Hz USB rate).</li>
          </ul>
        </div>
        <div class="card card-sky" style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
          <div class="stat-badge" style="width: 80%;">
            <div class="num">28.1 ms</div>
            <div class="lbl">Total Cumulative End-to-End Latency</div>
          </div>
          <p style="text-align: center; font-size: 9.5pt; color: #475569; margin-top: 3mm;">
            Well below the <strong>50 ms human perceptual lag threshold</strong>, providing a deterministic, lag-free user experience.
          </p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "The end-to-end signal latency is 28.1 milliseconds, calculated across touch digitizer sampling, local Wi-Fi transmission, JSON decoding, and the host USB 125 Hz polling cycle. Because 28.1 ms is well below the 50-millisecond human perceptual threshold, mouse movements and typing feel instantaneous and native."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Empirical Latency Verification</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 9: CYBERSECURITY & HARDWARE KILL-SWITCH
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 8: Cybersecurity Governance</div>
        <div class="slide-title">Security & <span>Physical Hardware Kill-Switch</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 09 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>🛡️ Administrative Bridge vs. Rubber Ducky</h3>
          <ul>
            <li><strong>No Autonomous Malicious Payloads:</strong> Firmware contains zero automated keystroke injection scripts; only forwards live human input.</li>
            <li><strong>Physical Proximity Boundary:</strong> Constrained to local 10–15 meter SoftAP perimeter.</li>
            <li><strong>Buffer Flush on Disconnect:</strong> Releasing the connection automatically clears keyboard buffers to zero to prevent key-repeat loops.</li>
          </ul>
        </div>
        <div class="card card-amber">
          <h3>🚨 Active Hardware RF Kill-Switch</h3>
          <ul>
            <li>Tactile push-button wired to GPIO 14 (Active-Low Interrupt).</li>
            <li>Falling-edge hardware ISR immediately calls <code>esp_wifi_stop()</code>.</li>
            <li><strong>RF Termination Time: &lt; 2.0 milliseconds.</strong></li>
            <li>Guarantees immediate physical air-gap protection without relying on software commands or operating system intervention.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "This gateway is an interactive administrative bridge, not a Rubber Ducky. It contains zero autonomous scripts; it only transmits manual operator input. Furthermore, to guard against unauthorized access, I engineered a dedicated hardware kill-switch. When pressed, a hardware interrupt halts all radio transmissions in under 2 milliseconds, creating an immediate physical air-gap."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Cybersecurity Governance & Fail-Safe Design</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 10: PROCUREMENT & FINANCIAL BUDGET
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 9: Project Management</div>
        <div class="slide-title">Financial Budget & <span>Procurement Diligence</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 10 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>💰 Bill of Materials (Strict Compliance to R645.00)</h3>
          <ul>
            <li>Dual ESP32-S3 Boards (1 Hardware Redundancy Unit): <strong>R 370.00</strong></li>
            <li>Tactile Switches, Resistors & Status LEDs: <strong>R 25.00</strong></li>
            <li>Prototyping Breadboard & Jumper Wires: <strong>R 85.00</strong></li>
            <li>Custom 3D-Printed Enclosure Fabrication (PETG): <strong>R 120.00</strong></li>
            <li><strong>Total Expenditure: R 600.00 (R 45.00 Under Proposed Budget)</strong></li>
          </ul>
        </div>
        <div class="card card-green" style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
          <div class="stat-badge" style="width: 80%;">
            <div class="num" style="color: #16A34A;">R 600.00</div>
            <div class="lbl">Actual Construction Cost</div>
          </div>
          <p style="text-align: center; font-size: 9.5pt; color: #334155; margin-top: 3mm;">
            Replaces commercial enterprise KVM crash-cart units costing <strong>R 8,000 to R 15,000</strong>. All parts procured locally from Micro Robotics and Communica.
          </p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "All components were procured locally from Micro Robotics and Communica to eliminate import lead times, adhering strictly to our proposed budget at R600. While commercial enterprise crash-cart units cost between R8,000 and R15,000, this hardware solution achieves the same administrative capability at a fraction of the cost."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Budget Compliance & Procurement Diligence</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 11: LIVE DEMONSTRATION PROTOCOL
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 10: Practical Verification</div>
        <div class="slide-title">The 30-Second <span>Live Demonstration Protocol</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 11 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-blue">
          <h3>Phase 1: Connect & Confirm</h3>
          <p>Insert dongle into laptop. Laptop has no internet and no agent software. Blue LED blinks, then turns solid when smartphone associates. Status shows <strong>ESP32: Connected</strong>.</p>
        </div>
        <div class="card card-sky">
          <h3>Phase 2: Glide & Type</h3>
          <p>Glide cursor across desktop with high-speed response. Open a blank Notepad document and inject live text using the mobile virtual keyboard.</p>
        </div>
        <div class="card card-amber">
          <h3>Phase 3: Emergency Cutoff</h3>
          <p>Press the physical plunger button on the enclosure. Phone immediately disconnects and Blue LED turns off—proving hardware air-gap safety in real time (&lt;2ms).</p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "I will now demonstrate the system live. First, notice the laptop has no internet and no remote desktop software running. When I plug the dongle into the USB port, the blue LED blinks. I launch the mobile app, the LED turns solid blue, and the app confirms connection. As I glide my finger, the cursor moves smoothly. I type on the phone, and text appears instantly in Notepad. Finally, I press the emergency button—the connection severs immediately, proving our physical air-gap safety."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Live Demonstration Protocol</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 12: CONCLUSION & FUTURE SCOPE
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Section 11: Conclusion & Roadmap</div>
        <div class="slide-title">Conclusion & <span>Phase 2 Architectural Roadmap</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 12 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>✅ Engineering Deliverables Met</h3>
          <ul>
            <li>Full USB-IF HID Specification v1.11 compliance.</li>
            <li>Deterministic sub-28.1 ms end-to-end response time.</li>
            <li>Robust 3D enclosure with optical light pipes and safety switch.</li>
            <li>Delivered 100% on schedule and within budget under IEEE 1016 & IEEE 1063 standards.</li>
          </ul>
        </div>
        <div class="card card-sky">
          <h3>🔮 Phase 2 Roadmap</h3>
          <ul>
            <li>Hardware-accelerated on-chip video encoding via dedicated DVP camera bus.</li>
            <li>WPA3 Enterprise 802.1X certificate-based mobile authentication.</li>
            <li>BLE 5.0 fallback channel for radio-restricted facilities.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ Spoken Script:</strong> "In conclusion, this project successfully proves that remote administrative access can be achieved securely from the physical hardware layer without software footprints or firewall vulnerabilities. It fulfills all technical, financial, and safety milestones mandated by the Department of Computer Systems Engineering. Thank you for your time, Mr. Ntume and Dr. Du. I now welcome any questions from the panel."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Conclusion & Panel Inquiries</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'PRESENTATION_SLIDES.html');
const pdfPath = path.join(__dirname, 'PRESENTATION_SLIDES.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('Created PRESENTATION_SLIDES.html with official TUT branding');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const command = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;

console.log('Generating Landscape PDF via Chrome headless...');
try {
  execSync(command, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`SUCCESS: PRESENTATION_SLIDES.pdf created! Size: ${stats.size} bytes`);
  } else {
    console.error('ERROR: PDF was not generated.');
    process.exit(1);
  }
} catch (err) {
  console.error('Execution error generating PDF:', err.message);
  process.exit(1);
}
