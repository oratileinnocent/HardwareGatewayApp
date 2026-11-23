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
  return generateRealQrSvg('https://github.com/oratileinnocent/HardwareGatewayApp', '#003366', 85);
}

// System Architecture Diagram in crisp SVG
function generateSystemDiagramSvg() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 180" width="100%" height="auto" style="border-radius: 8px; background: #0b1329; border: 1px solid #1e293b;">
    <defs>
      <linearGradient id="gradCard" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="gradEsp" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#003366"/>
        <stop offset="100%" stop-color="#001a33"/>
      </linearGradient>
      <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00F2FE"/>
        <stop offset="100%" stop-color="#4FACFE"/>
      </linearGradient>
      <marker id="arrCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#00F2FE" />
      </marker>
      <marker id="arrGold" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#FFB81C" />
      </marker>
    </defs>

    <!-- NODE 1: Mobile Client (Flutter) -->
    <rect x="25" y="30" width="180" height="120" rx="10" fill="url(#gradCard)" stroke="#00F2FE" stroke-width="2"/>
    <text x="115" y="58" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#00F2FE" text-anchor="middle">CLIENT DEVICE</text>
    <text x="115" y="78" font-family="'Segoe UI', Arial, sans-serif" font-size="11" fill="#e2e8f0" text-anchor="middle">Flutter Gateway App</text>
    <rect x="42" y="92" width="146" height="20" rx="4" fill="#334155"/>
    <text x="115" y="106" font-family="'Segoe UI', Arial, sans-serif" font-size="9.5" fill="#38bdf8" text-anchor="middle">Multi-Touch Trackpad</text>
    <rect x="42" y="118" width="146" height="20" rx="4" fill="#334155"/>
    <text x="115" y="132" font-family="'Segoe UI', Arial, sans-serif" font-size="9.5" fill="#94a3b8" text-anchor="middle">MJPEG Screen Stream</text>

    <!-- ARROW 1: Wi-Fi WebSocket -->
    <line x1="205" y1="90" x2="265" y2="90" stroke="#00F2FE" stroke-width="2.5" stroke-dasharray="4,3" marker-end="url(#arrCyan)"/>
    <text x="235" y="75" font-family="'Segoe UI', Arial, sans-serif" font-size="9" font-weight="bold" fill="#38bdf8" text-anchor="middle">2.4 GHz Wi-Fi</text>
    <text x="235" y="112" font-family="'Segoe UI', Arial, sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">&lt; 25ms RTT</text>

    <!-- NODE 2: Hardware Gateway (ESP32-S3) -->
    <rect x="270" y="20" width="195" height="140" rx="12" fill="url(#gradEsp)" stroke="#FFB81C" stroke-width="2.5"/>
    <text x="367" y="46" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="800" fill="#FFB81C" text-anchor="middle">ESP32-S3 GATEWAY</text>
    <text x="367" y="64" font-family="'Segoe UI', Arial, sans-serif" font-size="10.5" fill="#f8fafc" text-anchor="middle">Hardware Remote Bridge</text>
    <rect x="285" y="76" width="165" height="22" rx="4" fill="#1e3a5f"/>
    <text x="367" y="91" font-family="'Segoe UI', Arial, sans-serif" font-size="9.5" fill="#67e8f9" text-anchor="middle">Core 0: Async WebSocket</text>
    <rect x="285" y="103" width="165" height="22" rx="4" fill="#1e3a5f"/>
    <text x="367" y="118" font-family="'Segoe UI', Arial, sans-serif" font-size="9.5" fill="#fde047" text-anchor="middle">Core 1: USB HID Engine</text>
    <rect x="285" y="130" width="165" height="20" rx="4" fill="#0f172a" stroke="#FFB81C" stroke-width="1"/>
    <text x="367" y="144" font-family="'Segoe UI', Arial, sans-serif" font-size="9" font-weight="bold" fill="#facc15" text-anchor="middle">Native USB 2.0 Full-Speed PHY</text>

    <!-- ARROW 2: Hardware USB D+/D- -->
    <line x1="465" y1="90" x2="525" y2="90" stroke="#FFB81C" stroke-width="3" marker-end="url(#arrGold)"/>
    <text x="495" y="75" font-family="'Segoe UI', Arial, sans-serif" font-size="9.5" font-weight="bold" fill="#facc15" text-anchor="middle">USB OTG</text>
    <text x="495" y="112" font-family="'Segoe UI', Arial, sans-serif" font-size="8.5" fill="#94a3b8" text-anchor="middle">D+ / D- Pins</text>

    <!-- NODE 3: Target Host PC -->
    <rect x="530" y="30" width="165" height="120" rx="10" fill="url(#gradCard)" stroke="#475569" stroke-width="2"/>
    <text x="612" y="58" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="bold" fill="#f1f5f9" text-anchor="middle">TARGET HOST PC</text>
    <text x="612" y="78" font-family="'Segoe UI', Arial, sans-serif" font-size="10.5" fill="#38bdf8" text-anchor="middle">Zero Software Footprint</text>
    <rect x="545" y="92" width="135" height="20" rx="4" fill="#1e293b"/>
    <text x="612" y="106" font-family="'Segoe UI', Arial, sans-serif" font-size="9" fill="#a7f3d0" text-anchor="middle">100% Driverless HID</text>
    <rect x="545" y="118" width="135" height="20" rx="4" fill="#1e293b"/>
    <text x="612" y="132" font-family="'Segoe UI', Arial, sans-serif" font-size="9" fill="#f87171" text-anchor="middle">UEFI / BIOS / Air-Gap</text>
  </svg>
  `;
}

// Complete Professional Poster HTML Template exactly matching the uploaded Word DOCX
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>2026 TUT Computer Systems Engineering Project Exhibition Poster - Hardware Gateway</title>
<style>
  @page {
    size: A1 portrait;
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
    background-color: #ffffff;
    width: 594mm;
    min-height: 841mm;
    height: 841mm;
    max-height: 841mm;
    overflow: hidden;
    padding: 16mm 20mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* COLOR PALETTE */
  :root {
    --tut-blue: #003366;
    --tut-gold: #FFB81C;
    --tut-red: #D12630;
    --slate-dark: #0f172a;
    --slate-card: #f8fafc;
    --slate-border: #cbd5e1;
    --accent-cyan: #0099cc;
  }

  /* TOP HEADER ROW */
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8mm;
    border-bottom: 2.5px solid var(--tut-blue);
  }

  .header-logo-group {
    display: flex;
    align-items: center;
    gap: 12mm;
  }

  .header-logo-img {
    height: 38mm;
    width: auto;
    object-fit: contain;
  }

  .header-faculty-text {
    text-align: right;
  }

  .header-faculty-title {
    font-size: 24pt;
    font-weight: 800;
    color: var(--tut-blue);
    line-height: 1.2;
    letter-spacing: -0.3px;
  }

  .header-dept-title {
    font-size: 19pt;
    font-weight: 600;
    color: #475569;
    margin-top: 2mm;
  }

  /* EXHIBITION BANNER BAR */
  .banner-bar {
    background: linear-gradient(135deg, #002244 0%, #003366 100%);
    color: #ffffff;
    border-radius: 6mm;
    padding: 5mm 10mm;
    margin-top: 5mm;
    margin-bottom: 6mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 15px rgba(0, 51, 102, 0.15);
  }

  .banner-date {
    font-size: 17pt;
    font-weight: 800;
    color: var(--tut-gold);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .banner-event {
    font-size: 19pt;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-align: center;
  }

  .banner-theme {
    font-size: 13pt;
    font-weight: 500;
    color: #e2e8f0;
    font-style: italic;
    text-align: right;
  }

  /* PROJECT TITLE & PITCH */
  .title-section {
    text-align: center;
    padding: 3mm 0 6mm 0;
  }

  .project-title {
    font-size: 44pt;
    font-weight: 900;
    color: var(--tut-blue);
    line-height: 1.15;
    letter-spacing: -1px;
    text-transform: uppercase;
  }

  .project-title span {
    color: var(--tut-red);
  }

  .project-pitch {
    font-size: 20pt;
    font-weight: 600;
    color: #334155;
    margin-top: 3.5mm;
    line-height: 1.35;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
  }

  /* METADATA BAR (STUDENT / SUPERVISOR / PROGRAMME) */
  .meta-bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8mm;
    background: #f1f5f9;
    border-radius: 5mm;
    border: 2px solid var(--slate-border);
    padding: 5mm 8mm;
    margin-bottom: 7mm;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
  }

  .meta-label {
    font-size: 12pt;
    font-weight: 800;
    color: var(--tut-blue);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1.5mm;
  }

  .meta-value {
    font-size: 16pt;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.25;
  }

  .meta-sub {
    font-size: 12.5pt;
    font-weight: 500;
    color: #64748b;
  }

  /* MAIN TWO-COLUMN CONTENT GRID */
  .content-grid {
    display: grid;
    grid-template-columns: 1.08fr 0.92fr;
    gap: 12mm;
    flex-grow: 1;
  }

  /* SECTION CARDS */
  .section-card {
    background: #ffffff;
    border: 2px solid var(--slate-border);
    border-radius: 6mm;
    padding: 7mm 8mm;
    margin-bottom: 7mm;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 5mm;
    margin-bottom: 4mm;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 2.5mm;
  }

  .section-num {
    font-size: 26pt;
    font-weight: 900;
    color: var(--tut-red);
    line-height: 1;
  }

  .section-title {
    font-size: 22pt;
    font-weight: 800;
    color: var(--tut-blue);
    letter-spacing: -0.3px;
  }

  .section-body {
    font-size: 15.5pt;
    font-weight: 450;
    color: #334155;
    line-height: 1.5;
    text-align: justify;
  }

  .highlight-bold {
    font-weight: 700;
    color: #0f172a;
  }

  /* VISUAL SHOWCASE TILES (RIGHT COLUMN) */
  .visuals-container {
    display: flex;
    flex-direction: column;
    gap: 6mm;
  }

  .visual-card {
    background: #ffffff;
    border: 2px solid var(--slate-border);
    border-radius: 6mm;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }

  .visual-header-badge {
    background: var(--tut-blue);
    color: #ffffff;
    font-size: 14pt;
    font-weight: 800;
    padding: 2.5mm 6mm;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .visual-header-badge span {
    color: var(--tut-gold);
    font-weight: 600;
    font-size: 11pt;
  }

  .visual-media-box {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0f172a;
    padding: 3mm;
  }

  .visual-media-img {
    width: 100%;
    height: auto;
    max-height: 52mm;
    object-fit: contain;
    border-radius: 3mm;
  }

  .visual-caption {
    padding: 3mm 5mm;
    font-size: 13pt;
    font-weight: 500;
    color: #475569;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    line-height: 1.35;
  }

  /* KEY RESULTS GRID (SECTION 03) */
  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 5mm;
    margin: 4.5mm 0;
  }

  .metric-card {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 2px solid var(--tut-blue);
    border-radius: 5mm;
    padding: 5mm 3mm;
    text-align: center;
  }

  .metric-val {
    font-size: 34pt;
    font-weight: 900;
    color: var(--tut-blue);
    line-height: 1.05;
  }

  .metric-val span {
    color: var(--tut-red);
  }

  .metric-label {
    font-size: 13pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 2mm;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-sub {
    font-size: 10.5pt;
    font-weight: 500;
    color: #64748b;
    margin-top: 1mm;
  }

  /* SECTION 04 IMPACT */
  .impact-card {
    background: #ffffff;
    border: 2px solid var(--slate-border);
    border-radius: 6mm;
    padding: 6mm 8mm;
    margin-bottom: 5mm;
  }

  /* FOOTER ROW */
  .footer-container {
    background: #002244;
    color: #ffffff;
    border-radius: 6mm;
    padding: 4mm 10mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3mm;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 8mm;
  }

  .footer-qr {
    background: #ffffff;
    padding: 2mm;
    border-radius: 4mm;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer-scan-text {
    display: flex;
    flex-direction: column;
  }

  .footer-scan-title {
    font-size: 17pt;
    font-weight: 800;
    color: var(--tut-gold);
    letter-spacing: 0.5px;
  }

  .footer-scan-link {
    font-size: 14pt;
    font-weight: 600;
    color: #e2e8f0;
    margin-top: 1mm;
  }

  .footer-contact {
    font-size: 12.5pt;
    color: #94a3b8;
    margin-top: 0.5mm;
  }

  .footer-hashtag {
    font-size: 26pt;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }

  .footer-hashtag span {
    color: var(--tut-gold);
  }
</style>
</head>
<body>

  <!-- TOP HEADER ROW -->
  <header class="header-container">
    <div class="header-logo-group">
      ${tutLogoUri ? `<img src="${tutLogoUri}" class="header-logo-img" alt="TUT Logo">` : ''}
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
    <div class="banner-theme">Empowering Students through Engineering Innovation &amp; Technological Excellence</div>
  </div>

  <!-- PROJECT TITLE & ONE-SENTENCE PITCH -->
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
      <div class="meta-label">PROGRAMME</div>
      <div class="meta-value">National Diploma: Computer Systems Eng.</div>
      <div class="meta-sub">Subject Code: PJD301B / IDC30BI</div>
    </div>
  </div>

  <!-- MAIN TWO-COLUMN CONTENT GRID -->
  <main class="content-grid">

    <!-- LEFT COLUMN: Problem, Approach & System Architecture -->
    <div class="left-col">
      
      <!-- 01 THE PROBLEM -->
      <section class="section-card">
        <div class="section-header">
          <span class="section-num">01</span>
          <h2 class="section-title">The Problem</h2>
        </div>
        <p class="section-body">
          Traditional software remote desktop solutions (<span class="highlight-bold">TeamViewer, AnyDesk, Windows RDP</span>) require host operating system daemons, administrative installation privileges, and open network inbound ports. Consequently, they are <span class="highlight-bold">strictly prohibited in air-gapped industrial control rooms, financial institutions, and secure forensic labs</span> due to massive cybersecurity attack surfaces. Furthermore, software tools are completely blind during <span class="highlight-bold">pre-boot UEFI/BIOS configuration, kernel crashes, or OS installation lockouts</span>, leaving engineers with no remote recourse.
        </p>
      </section>

      <!-- 02 OUR APPROACH -->
      <section class="section-card">
        <div class="section-header">
          <span class="section-num">02</span>
          <h2 class="section-title">Our Approach</h2>
        </div>
        <p class="section-body">
          We designed a <span class="highlight-bold">driverless, out-of-band hardware gateway</span> using the dual-core <span class="highlight-bold">Espressif ESP32-S3</span> microcontroller, leveraging its integrated on-die <span class="highlight-bold">USB 2.0 Full-Speed On-The-Go (OTG) PHY</span>. The firmware, written in embedded C++ on FreeRTOS, emulates a genuine USB Composite Human Interface Device (HID) optical mouse and 104-key keyboard. Remote inputs from a cross-platform <span class="highlight-bold">Flutter client application</span> are transmitted over low-latency WebSockets, decoded, and injected directly into target PC hardware via USB differential data lines (D+/D-).
        </p>

        <!-- SYSTEM ARCHITECTURE DIAGRAM -->
        <div style="margin-top: 5mm;">
          <div style="font-size: 13pt; font-weight: 700; color: var(--tut-blue); margin-bottom: 2mm; text-transform: uppercase; letter-spacing: 0.5px;">
            System Interconnect &amp; Signal Routing Diagram
          </div>
          ${generateSystemDiagramSvg()}
        </div>
      </section>

    </div>

    <!-- RIGHT COLUMN: Hardware Prototype, App Screenshot, Results & Impact -->
    <div class="right-col">

      <!-- VISUAL SHOWCASE: Hardware Photo & App Screenshot -->
      <div class="visuals-container" style="margin-bottom: 6mm;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6mm;">
          
          <!-- PHYSICAL HARDWARE PROTOTYPE -->
          <div class="visual-card">
            <div class="visual-header-badge">
              PHYSICAL HARDWARE GATEWAY
              <span>3D Custom Housing</span>
            </div>
            <div class="visual-media-box">
              ${hardwarePhotoUri ? `<img src="${hardwarePhotoUri}" class="visual-media-img" alt="Physical Hardware Gateway">` : ''}
            </div>
            <div class="visual-caption">
              <strong>Figure A:</strong> Deployed ESP32-S3 gateway in 3D-printed enclosure with native USB-C cable and live PWR/ACT status LEDs.
            </div>
          </div>

          <!-- FLUTTER CLIENT APPLICATION -->
          <div class="visual-card">
            <div class="visual-header-badge">
              MOBILE CLIENT APP (LIVE)
              <span>Flutter / Dart</span>
            </div>
            <div class="visual-media-box">
              ${appScreenshotUri ? `<img src="${appScreenshotUri}" class="visual-media-img" alt="Hardware Gateway Mobile App">` : ''}
            </div>
            <div class="visual-caption">
              <strong>Figure B:</strong> Live Windows 11 remote desktop stream with responsive multi-touch precision trackpad and quick-action dock.
            </div>
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
            <div class="metric-label">End-to-End Latency</div>
            <div class="metric-sub">Deterministic 125 Hz USB HID</div>
          </div>
          <div class="metric-card">
            <div class="metric-val"><span>0</span> MB</div>
            <div class="metric-label">Host Driver Footprint</div>
            <div class="metric-sub">100% Agentless &amp; Driverless</div>
          </div>
          <div class="metric-card">
            <div class="metric-val"><span>100</span> %</div>
            <div class="metric-label">BIOS / Air-Gap Access</div>
            <div class="metric-sub">Hardware Signal Emulation</div>
          </div>
        </div>

        <p class="section-body" style="margin-top: 3mm;">
          Empirical bench testing over dedicated 2.4 GHz wireless links demonstrated <span class="highlight-bold">0% packet drop across 25,000 transmitted HID reports</span>, sub-pixel cursor glide smoothness, and zero host CPU or RAM overhead. The system successfully executed cold-boot remote recovery directly inside the <span class="highlight-bold">UEFI/BIOS menu and Windows login security screens</span> without triggering any antivirus or EDR endpoint alarms.
        </p>
      </section>

      <!-- 04 IMPACT, INNOVATION & NEXT STEPS -->
      <section class="impact-card">
        <div class="section-header">
          <span class="section-num">04</span>
          <h2 class="section-title">Impact, Innovation &amp; Next Steps</h2>
        </div>
        <p class="section-body">
          <span class="highlight-bold">Commercial &amp; Cyber Impact:</span> Provides IT administrators, data centers, and defense agencies with a tamper-resistant, pocket-sized hardware KVM alternative costing <span class="highlight-bold">under 10% of commercial enterprise units</span>.  
          <br><br>
          <span class="highlight-bold">Next Steps:</span> Scaling the design to integrate on-die hardware-accelerated H.264 video compression, hardware cryptographic token authentication, and multi-host multiplexing.
        </p>
      </section>

    </div>

  </main>

  <!-- FOOTER BAR -->
  <footer class="footer-container">
    <div class="footer-left">
      <div class="footer-qr">
        ${generateSvgQr()}
      </div>
      <div class="footer-scan-text">
        <div class="footer-scan-title">Scan for Live Demo, Project Portfolio &amp; Full Report</div>
        <div class="footer-scan-link">github.com/oratileinnocent/HardwareGatewayApp</div>
        <div class="footer-contact">Oratile Innocent Tshosetso • oratileinnocent.45@gmail.com • +27 76 950 6870</div>
      </div>
    </div>
    <div class="footer-hashtag">#from<span>GOOD</span>2<span>GREAT</span></div>
  </footer>

</body>
</html>
`;

// Write files
const htmlPath = path.join(__dirname, 'EXHIBITION_POSTER.html');
const pdfPath = path.join(__dirname, 'EXHIBITION_POSTER.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('✔ Generated: EXHIBITION_POSTER.html');

// Compile to Vector PDF via Chrome Headless
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
if (fs.existsSync(chromePath)) {
  console.log('Compiling print-ready A1 vector PDF via Headless Chrome...');
  const command = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;
  try {
    execSync(command, { stdio: 'inherit' });
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      console.log(`✔ SUCCESS: EXHIBITION_POSTER.pdf generated! Size: ${(stats.size / 1024).toFixed(1)} KB`);
    }
  } catch (err) {
    console.error('Error generating PDF:', err.message);
  }
} else {
  console.log('Chrome not found at default path, HTML generated successfully.');
}
