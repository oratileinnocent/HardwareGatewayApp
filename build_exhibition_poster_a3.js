const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper to convert local image to Base64 data URI
function getBase64DataUri(filePath, mimeType = 'image/jpeg') {
  if (fs.existsSync(filePath)) {
    const b64 = fs.readFileSync(filePath).toString('base64');
    return `data:${mimeType};base64,${b64}`;
  }
  return '';
}

const tutLogoUri = getBase64DataUri(path.join(__dirname, 'tut_logo_full.jpg'), 'image/jpeg') || 
                   getBase64DataUri(path.join(__dirname, 'tut_logo.png'), 'image/png');
const hardwarePhotoUri = getBase64DataUri(path.join(__dirname, 'prototype_hardware_photo.jpg'), 'image/jpeg');
const appScreenshotUri = getBase64DataUri(path.join(__dirname, 'app_live_screenshot.jpg'), 'image/jpeg');

const { generateRealQrSvg } = require('./qr_engine');

// Real Mathematical SVG QR Code generator (Decodable by any smartphone camera)
function generateSvgQr() {
  return generateRealQrSvg('https://github.com/oratileinnocent/HardwareGatewayApp', '#002b49', 55);
}

// System Architecture Diagram tuned specifically for A3 layout
function generateSystemDiagramA3Svg() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 135" width="100%" height="auto" style="border-radius: 6px; background: #071120; border: 1px solid #1e3a5f;">
    <defs>
      <linearGradient id="gradNode" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#162238"/>
        <stop offset="100%" stop-color="#0b1324"/>
      </linearGradient>
      <linearGradient id="gradEspA3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#003366"/>
        <stop offset="100%" stop-color="#001830"/>
      </linearGradient>
      <marker id="arrCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#00E5FF" />
      </marker>
      <marker id="arrGold" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#FFB81C" />
      </marker>
    </defs>

    <!-- NODE 1: Mobile Client (Flutter) -->
    <rect x="12" y="16" width="138" height="102" rx="7" fill="url(#gradNode)" stroke="#00E5FF" stroke-width="1.6"/>
    <text x="81" y="36" font-family="'Segoe UI', Arial, sans-serif" font-size="10.5" font-weight="800" fill="#00E5FF" text-anchor="middle">CLIENT DEVICE</text>
    <text x="81" y="50" font-family="'Segoe UI', Arial, sans-serif" font-size="8.5" fill="#94a3b8" text-anchor="middle">Flutter Android App</text>
    <rect x="22" y="58" width="118" height="16" rx="3" fill="#1e293b"/>
    <text x="81" y="70" font-family="'Segoe UI', Arial, sans-serif" font-size="7.5" fill="#38bdf8" text-anchor="middle">Precision Trackpad</text>
    <rect x="22" y="78" width="118" height="16" rx="3" fill="#1e293b"/>
    <text x="81" y="90" font-family="'Segoe UI', Arial, sans-serif" font-size="7.5" fill="#cbd5e1" text-anchor="middle">MJPEG Screen Stream</text>
    <text x="81" y="108" font-family="'Segoe UI', Arial, sans-serif" font-size="6.8" fill="#64748b" text-anchor="middle">WiFi 2.4GHz / AP Mode</text>

    <!-- ARROW 1: Wi-Fi WebSocket -->
    <line x1="150" y1="67" x2="194" y2="67" stroke="#00E5FF" stroke-width="2" stroke-dasharray="3,2" marker-end="url(#arrCyan)"/>
    <text x="172" y="55" font-family="'Segoe UI', Arial, sans-serif" font-size="7.2" font-weight="700" fill="#38bdf8" text-anchor="middle">WebSocket</text>
    <text x="172" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="6.5" fill="#64748b" text-anchor="middle">&lt;25ms RTT</text>

    <!-- NODE 2: Hardware Gateway (ESP32-S3) -->
    <rect x="198" y="10" width="150" height="114" rx="8" fill="url(#gradEspA3)" stroke="#FFB81C" stroke-width="2"/>
    <text x="273" y="30" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="900" fill="#FFB81C" text-anchor="middle">ESP32-S3 GATEWAY</text>
    <text x="273" y="44" font-family="'Segoe UI', Arial, sans-serif" font-size="8.5" fill="#e2e8f0" text-anchor="middle">Hardware USB Bridge</text>
    <rect x="208" y="52" width="130" height="17" rx="3" fill="#0f2744"/>
    <text x="273" y="64" font-family="'Segoe UI', Arial, sans-serif" font-size="7.5" fill="#67e8f9" text-anchor="middle">Core 0: Async WebSocket Server</text>
    <rect x="208" y="73" width="130" height="17" rx="3" fill="#0f2744"/>
    <text x="273" y="85" font-family="'Segoe UI', Arial, sans-serif" font-size="7.5" fill="#fde047" text-anchor="middle">Core 1: FreeRTOS HID Pipeline</text>
    <rect x="208" y="94" width="130" height="17" rx="3" fill="#051726" stroke="#FFB81C" stroke-width="0.8"/>
    <text x="273" y="106" font-family="'Segoe UI', Arial, sans-serif" font-size="7.2" font-weight="bold" fill="#facc15" text-anchor="middle">Hardware USB OTG PHY</text>

    <!-- ARROW 2: Hardware USB D+/D- -->
    <line x1="348" y1="67" x2="394" y2="67" stroke="#FFB81C" stroke-width="2.2" marker-end="url(#arrGold)"/>
    <text x="371" y="55" font-family="'Segoe UI', Arial, sans-serif" font-size="7.2" font-weight="700" fill="#facc15" text-anchor="middle">USB-C</text>
    <text x="371" y="82" font-family="'Segoe UI', Arial, sans-serif" font-size="6.5" fill="#94a3b8" text-anchor="middle">D+ / D- Pins</text>

    <!-- NODE 3: Target Host PC -->
    <rect x="398" y="16" width="130" height="102" rx="7" fill="url(#gradNode)" stroke="#475569" stroke-width="1.6"/>
    <text x="463" y="36" font-family="'Segoe UI', Arial, sans-serif" font-size="10.5" font-weight="800" fill="#f1f5f9" text-anchor="middle">TARGET HOST</text>
    <text x="463" y="50" font-family="'Segoe UI', Arial, sans-serif" font-size="8.5" fill="#38bdf8" text-anchor="middle">Any PC / Server</text>
    <rect x="408" y="58" width="110" height="16" rx="3" fill="#1e293b"/>
    <text x="463" y="70" font-family="'Segoe UI', Arial, sans-serif" font-size="7.5" fill="#86efac" text-anchor="middle">0 MB Host Footprint</text>
    <rect x="408" y="78" width="110" height="16" rx="3" fill="#1e293b"/>
    <text x="463" y="90" font-family="'Segoe UI', Arial, sans-serif" font-size="7.5" fill="#fca5a5" text-anchor="middle">BIOS / Pre-Boot / Air-Gap</text>
    <text x="463" y="108" font-family="'Segoe UI', Arial, sans-serif" font-size="6.8" fill="#64748b" text-anchor="middle">Plug-and-Play USB HID</text>
  </svg>
  `;
}

// Complete Eye-Catching A3 Poster HTML
const htmlA3 = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TUT CSE Exhibition Poster (A3) - Hardware Gateway</title>
<style>
  @page {
    size: A3 portrait;
    margin: 0;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background-color: #f1f5f9;
    width: 297mm;
    min-height: 420mm;
    height: 420mm;
    max-height: 420mm;
    overflow: hidden;
    padding: 5.5mm 7mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* COLOR PALETTE */
  :root {
    --tut-blue: #002855;
    --tut-blue-light: #004b87;
    --tut-gold: #FFB81C;
    --tut-red: #D12630;
    --accent-cyan: #00b4d8;
    --dark-surface: #0b1329;
    --card-bg: #ffffff;
    --border-color: #cbd5e1;
  }

  /* TOP HEADER ROW */
  .header-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border: 1.5px solid var(--border-color);
    border-radius: 4mm;
    padding: 2.2mm 5mm;
    box-shadow: 0 2px 8px rgba(0, 40, 85, 0.06);
  }

  .header-logo-group {
    display: flex;
    align-items: center;
    gap: 3.5mm;
  }

  .header-logo-img {
    height: 18mm;
    width: auto;
    object-fit: contain;
  }

  .header-univ-text {
    display: flex;
    flex-direction: column;
  }

  .header-univ-name {
    font-size: 13pt;
    font-weight: 900;
    color: var(--tut-blue);
    letter-spacing: -0.2px;
    line-height: 1.1;
  }

  .header-univ-motto {
    font-size: 8pt;
    font-weight: 700;
    color: var(--tut-red);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 0.5mm;
  }

  .header-faculty-text {
    text-align: right;
  }

  .header-faculty-title {
    font-size: 11pt;
    font-weight: 800;
    color: var(--tut-blue);
    line-height: 1.2;
  }

  .header-dept-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #475569;
    margin-top: 0.5mm;
  }

  /* EXHIBITION BANNER BAR */
  .banner-bar {
    background: linear-gradient(135deg, #001f3f 0%, #002855 60%, #003d73 100%);
    color: #ffffff;
    border-radius: 3mm;
    padding: 2mm 5mm;
    margin-top: 2.2mm;
    margin-bottom: 2.5mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 3px 10px rgba(0, 31, 63, 0.18);
    border: 1px solid rgba(255, 184, 28, 0.3);
  }

  .banner-date {
    font-size: 8.5pt;
    font-weight: 900;
    color: var(--tut-gold);
    letter-spacing: 0.8px;
    background: rgba(255, 255, 255, 0.1);
    padding: 1mm 2.5mm;
    border-radius: 2mm;
  }

  .banner-event {
    font-size: 9.5pt;
    font-weight: 800;
    letter-spacing: 0.3px;
    text-align: center;
    color: #ffffff;
  }

  .banner-theme {
    font-size: 7.5pt;
    font-weight: 600;
    color: #e2e8f0;
    font-style: italic;
    text-align: right;
  }

  /* PROJECT TITLE & PITCH */
  .title-section {
    background: #ffffff;
    border: 1.5px solid var(--border-color);
    border-radius: 4mm;
    padding: 2.8mm 5mm;
    margin-bottom: 2.5mm;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }

  .project-title {
    font-size: 17.5pt;
    font-weight: 900;
    color: var(--tut-blue);
    line-height: 1.15;
    letter-spacing: -0.4px;
    text-transform: uppercase;
  }

  .project-title span {
    color: var(--tut-red);
    background: -webkit-linear-gradient(45deg, #d12630, #ff4d4d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .project-pitch {
    font-size: 9pt;
    font-weight: 600;
    color: #334155;
    margin-top: 1.2mm;
    line-height: 1.3;
  }

  /* METADATA BAR (STUDENT / SUPERVISORS / PROGRAMME) */
  .meta-bar {
    display: grid;
    grid-template-columns: 1.1fr 1.2fr 1fr;
    gap: 3mm;
    background: #e2e8f0;
    border-radius: 3mm;
    padding: 2mm 4mm;
    margin-bottom: 2.5mm;
    border: 1px solid #cbd5e1;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
  }

  .meta-label {
    font-size: 6.8pt;
    font-weight: 800;
    color: var(--tut-blue);
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  .meta-value {
    font-size: 8.5pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
  }

  .meta-sub {
    font-size: 7.2pt;
    font-weight: 600;
    color: #475569;
  }

  /* MAIN TWO-COLUMN LAYOUT */
  .content-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 3.5mm;
    flex-grow: 1;
  }

  /* CARDS */
  .section-card {
    background: var(--card-bg);
    border: 1.5px solid var(--border-color);
    border-radius: 3.5mm;
    padding: 3mm 4mm;
    margin-bottom: 2.8mm;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 2.5mm;
    margin-bottom: 1.8mm;
    border-bottom: 1.5px solid #f1f5f9;
    padding-bottom: 1.2mm;
  }

  .section-num {
    font-size: 11pt;
    font-weight: 900;
    color: #ffffff;
    background: var(--tut-blue);
    padding: 0.5mm 2.2mm;
    border-radius: 1.5mm;
    line-height: 1;
  }

  .section-title {
    font-size: 10.5pt;
    font-weight: 800;
    color: var(--tut-blue);
    letter-spacing: -0.2px;
  }

  .section-body {
    font-size: 7.8pt;
    font-weight: 450;
    color: #334155;
    line-height: 1.4;
    text-align: justify;
  }

  .highlight-bold {
    font-weight: 700;
    color: #0f172a;
  }

  .tech-pill {
    display: inline-block;
    font-size: 6.8pt;
    font-weight: 700;
    background: #e0f2fe;
    color: #0369a1;
    padding: 0.4mm 1.8mm;
    border-radius: 1.2mm;
    margin-right: 1mm;
  }

  /* VISUAL SHOWCASE (RIGHT COLUMN) */
  .visuals-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3mm;
    margin-bottom: 2.8mm;
  }

  .visual-card {
    background: #ffffff;
    border: 1.5px solid var(--border-color);
    border-radius: 3mm;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
  }

  .visual-header-badge {
    background: linear-gradient(90deg, #002855 0%, #003d73 100%);
    color: #ffffff;
    font-size: 7pt;
    font-weight: 800;
    padding: 1.2mm 2.5mm;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .visual-header-badge span {
    color: var(--tut-gold);
    font-weight: 700;
    font-size: 6.5pt;
  }

  .visual-media-box {
    background: #090f1d;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5mm;
    height: 38mm;
  }

  .visual-media-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 1.5mm;
  }

  .visual-caption {
    padding: 1.5mm 2.5mm;
    font-size: 6.8pt;
    font-weight: 500;
    color: #475569;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    line-height: 1.25;
    flex-grow: 1;
  }

  /* METRICS ROW (SECTION 03) */
  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2mm;
    margin: 2mm 0;
  }

  .metric-card {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 1.5px solid var(--tut-blue);
    border-radius: 2.5mm;
    padding: 2mm 1.5mm;
    text-align: center;
  }

  .metric-val {
    font-size: 15pt;
    font-weight: 900;
    color: var(--tut-blue);
    line-height: 1;
  }

  .metric-val span {
    color: var(--tut-red);
  }

  .metric-label {
    font-size: 6.8pt;
    font-weight: 800;
    color: #0f172a;
    margin-top: 0.8mm;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .metric-sub {
    font-size: 5.8pt;
    font-weight: 600;
    color: #64748b;
  }

  /* FOOTER */
  .footer-box {
    background: linear-gradient(135deg, #001f3f 0%, #002855 100%);
    color: #ffffff;
    border-radius: 3.5mm;
    padding: 2.2mm 5mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5mm;
    border: 1px solid rgba(255, 184, 28, 0.4);
    box-shadow: 0 3px 10px rgba(0, 31, 63, 0.2);
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 3.5mm;
  }

  .footer-qr-container {
    background: #ffffff;
    padding: 1mm;
    border-radius: 2mm;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer-info {
    display: flex;
    flex-direction: column;
  }

  .footer-scan-title {
    font-size: 8.5pt;
    font-weight: 900;
    color: var(--tut-gold);
    letter-spacing: 0.4px;
  }

  .footer-scan-subtitle {
    font-size: 7.2pt;
    font-weight: 600;
    color: #e2e8f0;
  }

  .footer-contact {
    font-size: 6.5pt;
    color: #94a3b8;
    margin-top: 0.5mm;
  }

  .footer-hashtag {
    font-size: 13pt;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.6px;
    text-shadow: 0 2px 6px rgba(0,0,0,0.5);
  }

  .footer-hashtag span {
    color: var(--tut-gold);
  }
</style>
</head>
<body>

  <!-- TOP HEADER ROW -->
  <header class="header-box">
    <div class="header-logo-group">
      ${tutLogoUri ? `<img src="${tutLogoUri}" class="header-logo-img" alt="TUT Logo">` : ''}
      <div class="header-univ-text">
        <div class="header-univ-name">Tshwane University of Technology</div>
        <div class="header-univ-motto">We empower people</div>
      </div>
    </div>
    <div class="header-faculty-text">
      <div class="header-faculty-title">Faculty of Information and Communication Technology</div>
      <div class="header-dept-title">Department of Computer Systems Engineering</div>
    </div>
  </header>

  <!-- EXHIBITION BANNER BAR -->
  <div class="banner-bar">
    <div class="banner-date">24 NOVEMBER 2026</div>
    <div class="banner-event">2026 TUT Computer Systems Engineering Project Exhibition</div>
    <div class="banner-theme">Innovation, Entrepreneurship &amp; Technological Excellence</div>
  </div>

  <!-- PROJECT TITLE & PITCH -->
  <div class="title-section">
    <h1 class="project-title">Hardware-Level USB Remote Access <span>Gateway</span> via ESP32-S3</h1>
    <p class="project-pitch">A driverless, air-gap compliant hardware remote bridge emulating USB Composite HID peripherals over full-duplex WebSockets to control computers without host software or network agents.</p>
  </div>

  <!-- STUDENT / SUPERVISOR / PROGRAMME BAR -->
  <div class="meta-bar">
    <div class="meta-item">
      <div class="meta-label">STUDENT</div>
      <div class="meta-value">Oratile Innocent Tshosetso</div>
      <div class="meta-sub">Student Number: 222883253</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">SUPERVISORS</div>
      <div class="meta-value">Muwanguzi Mark Ntume &amp; Chunling Du</div>
      <div class="meta-sub">Dept. of Computer Systems Engineering</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">PROGRAMME &amp; SUBJECT</div>
      <div class="meta-value">National Diploma: Computer Systems Eng.</div>
      <div class="meta-sub">Subject: PJD301B / IDC30BI (Design Project III)</div>
    </div>
  </div>

  <!-- MAIN TWO-COLUMN CONTENT GRID -->
  <main class="content-grid">

    <!-- LEFT COLUMN -->
    <div class="left-col">
      
      <!-- 01 THE PROBLEM -->
      <section class="section-card">
        <div class="section-header">
          <span class="section-num">01</span>
          <h2 class="section-title">The Problem</h2>
        </div>
        <p class="section-body">
          Traditional software remote access solutions (<span class="highlight-bold">TeamViewer, AnyDesk, Windows RDP</span>) depend fundamentally on host OS daemons, admin privileges, and open network listening ports. Consequently, they are <span class="highlight-bold">strictly prohibited in air-gapped industrial SCADA environments, defense systems, and financial server rooms</span> due to cybersecurity vulnerabilities. Furthermore, software tools fail entirely during <span class="highlight-bold">pre-boot UEFI/BIOS configuration, OS installation lockouts, or kernel crashes</span>, leaving remote engineers locked out.
        </p>
      </section>

      <!-- 02 OUR APPROACH -->
      <section class="section-card">
        <div class="section-header">
          <span class="section-num">02</span>
          <h2 class="section-title">Our Approach</h2>
        </div>
        <p class="section-body">
          We developed a <span class="highlight-bold">driverless, out-of-band hardware gateway</span> using the dual-core <span class="highlight-bold">Espressif ESP32-S3</span> microcontroller, exploiting its on-die <span class="highlight-bold">USB 2.0 Full-Speed On-The-Go (OTG) PHY</span>. The embedded C++ firmware running on FreeRTOS emulates standard USB Composite HID peripherals (optical mouse and 104-key keyboard). Control inputs from a cross-platform <span class="highlight-bold">Flutter client application</span> are transmitted over low-latency WebSockets and injected into host PC hardware via physical differential USB data lines (D+/D-).
        </p>

        <!-- SYSTEM ARCHITECTURE DIAGRAM -->
        <div style="margin-top: 2.2mm;">
          <div style="font-size: 7.2pt; font-weight: 800; color: var(--tut-blue); margin-bottom: 1mm; text-transform: uppercase; letter-spacing: 0.4px;">
            System Interconnect &amp; Signal Routing Diagram
          </div>
          ${generateSystemDiagramA3Svg()}
        </div>
      </section>

    </div>

    <!-- RIGHT COLUMN -->
    <div class="right-col">

      <!-- VISUAL SHOWCASE: 3D Enclosure (Fig A) and Live App (Fig B) -->
      <div class="visuals-container">
        
        <!-- FIGURE A: 3D ENCLOSURE -->
        <div class="visual-card">
          <div class="visual-header-badge">
            3D-PRINTED HARDWARE
            <span>Figure A</span>
          </div>
          <div class="visual-media-box">
            ${hardwarePhotoUri ? `<img src="${hardwarePhotoUri}" class="visual-media-img" alt="3D Enclosure Hardware Prototype">` : ''}
          </div>
          <div class="visual-caption">
            <strong>Figure A:</strong> Custom 3D-printed mouse-form gateway with integrated USB-C port, tactile clicker, and dual-color status LEDs.
          </div>
        </div>

        <!-- FIGURE B: LIVE APP SCREENSHOT -->
        <div class="visual-card">
          <div class="visual-header-badge">
            MOBILE CONTROLLER
            <span>Figure B</span>
          </div>
          <div class="visual-media-box">
            ${appScreenshotUri ? `<img src="${appScreenshotUri}" class="visual-media-img" alt="Live Flutter App Screenshot">` : ''}
          </div>
          <div class="visual-caption">
            <strong>Figure B:</strong> Live Windows 11 remote desktop control via responsive multi-touch precision touchpad and quick-action dock.
          </div>
        </div>

      </div>

      <!-- 03 KEY RESULTS -->
      <section class="section-card">
        <div class="section-header">
          <span class="section-num">03</span>
          <h2 class="section-title">Key Results &amp; Benchmarks</h2>
        </div>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-val">&lt; <span>25</span> ms</div>
            <div class="metric-label">Latency</div>
            <div class="metric-sub">125 Hz USB HID</div>
          </div>
          <div class="metric-card">
            <div class="metric-val"><span>0</span> MB</div>
            <div class="metric-label">Host Footprint</div>
            <div class="metric-sub">100% Agentless</div>
          </div>
          <div class="metric-card">
            <div class="metric-val"><span>100</span> %</div>
            <div class="metric-label">Air-Gap Access</div>
            <div class="metric-sub">BIOS / Pre-Boot</div>
          </div>
        </div>

        <p class="section-body" style="margin-top: 1.5mm;">
          Extensive laboratory stress tests confirmed <span class="highlight-bold">0% packet drop across 25,000 transmitted HID reports</span> with sub-pixel cursor accuracy. Successful cold-boot recovery was executed inside <span class="highlight-bold">UEFI/BIOS setup menus</span> without tripping enterprise EDR or endpoint security alarms.
        </p>
      </section>

      <!-- 04 IMPACT & NEXT STEPS -->
      <section class="section-card">
        <div class="section-header">
          <span class="section-num">04</span>
          <h2 class="section-title">Impact, Innovation &amp; Next Steps</h2>
        </div>
        <p class="section-body">
          <span class="highlight-bold">Cost Disruption:</span> Delivers enterprise-grade out-of-band management at <span class="highlight-bold">under 10% the cost</span> of commercial IP-KVM units ($15 vs $500+). <br>
          <span class="highlight-bold">Security Compliance:</span> Operates without touching host operating systems or modifying network policies, rendering it fully compliant with strict defense and banking zero-trust air gaps. <br>
          <span class="highlight-bold">Future Roadmap:</span> Implementing on-chip hardware-accelerated H.264 video streaming and hardware crypto-token two-factor authentication.
        </p>
      </section>

    </div>

  </main>

  <!-- FOOTER ROW -->
  <footer class="footer-box">
    <div class="footer-left">
      <div class="footer-qr-container">
        ${generateSvgQr()}
      </div>
      <div class="footer-info">
        <div class="footer-scan-title">SCAN FOR SOURCE CODE &amp; LIVE DEMO</div>
        <div class="footer-scan-subtitle">github.com/oratileinnocent/HardwareGatewayApp · Live Demo &amp; Portfolio</div>
        <div class="footer-contact">Oratile Innocent Tshosetso · oratileinnocent.45@gmail.com · +27 76 950 6870</div>
      </div>
    </div>
    <div class="footer-hashtag">
      #from<span>GOOD</span>2<span>GREAT</span>
    </div>
  </footer>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'EXHIBITION_POSTER_A3.html'), htmlA3, 'utf8');
console.log('✔ Generated: EXHIBITION_POSTER_A3.html');

// Compile to A3 PDF using Headless Chrome
console.log('Compiling print-ready A3 vector PDF via Headless Chrome...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.join(__dirname, 'EXHIBITION_POSTER_A3.html');
const pdfPath = path.join(__dirname, 'EXHIBITION_POSTER_A3.pdf');

try {
  execSync(
    `"${chromePath}" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`,
    { stdio: 'inherit', timeout: 45000 }
  );
  const stats = fs.statSync(pdfPath);
  console.log(`✔ SUCCESS: EXHIBITION_POSTER_A3.pdf generated! Size: ${(stats.size / 1024).toFixed(1)} KB`);
} catch (err) {
  console.error('Error compiling PDF:', err.message);
}
