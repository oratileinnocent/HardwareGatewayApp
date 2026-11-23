const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getBase64DataUri(filePath, mimeType = 'image/jpeg') {
  if (fs.existsSync(filePath)) {
    const b64 = fs.readFileSync(filePath).toString('base64');
    return `data:${mimeType};base64,${b64}`;
  }
  return '';
}

const tutLogoUri = getBase64DataUri(path.join(__dirname, 'tut_logo_full.jpg'), 'image/jpeg') || 
                   getBase64DataUri(path.join(__dirname, 'tut_logo.png'), 'image/png');

const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Official Exhibition Poster Print Requisition & Project Submission Form</title>
<style>
  @page {
    size: A4 portrait;
    margin: 12mm 15mm 12mm 15mm;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    font-size: 9.8pt;
    line-height: 1.45;
    padding: 6mm 8mm;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header-table {
    width: 100%;
    border-collapse: collapse;
    border-bottom: 2.5px solid #002855;
    padding-bottom: 3mm;
    margin-bottom: 4mm;
  }
  .header-logo {
    height: 18mm;
    width: auto;
    object-fit: contain;
  }
  .header-text-right {
    text-align: right;
  }
  .univ-title {
    font-size: 13.5pt;
    font-weight: 900;
    color: #002855;
    letter-spacing: -0.2px;
  }
  .univ-sub {
    font-size: 8.5pt;
    font-weight: 700;
    color: #d12630;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 0.5mm;
  }
  .faculty-title {
    font-size: 10pt;
    font-weight: 800;
    color: #002855;
    margin-top: 1mm;
  }
  .dept-title {
    font-size: 9pt;
    font-weight: 600;
    color: #475569;
  }

  .doc-banner {
    background: linear-gradient(135deg, #001f3f 0%, #002855 100%);
    color: #ffffff;
    border-radius: 4px;
    padding: 2.5mm 5mm;
    margin-bottom: 4mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .doc-title {
    font-size: 11pt;
    font-weight: 900;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .doc-badge {
    background: #ffb81c;
    color: #002855;
    font-size: 8pt;
    font-weight: 900;
    padding: 1mm 2.5mm;
    border-radius: 3px;
    text-transform: uppercase;
  }

  h2 {
    font-size: 10.5pt;
    font-weight: 800;
    color: #002855;
    margin-top: 3.5mm;
    margin-bottom: 1.8mm;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 0.8mm;
    display: flex;
    align-items: center;
    gap: 2mm;
  }
  h2 span {
    background: #002855;
    color: #ffffff;
    font-size: 8pt;
    padding: 0.5mm 2mm;
    border-radius: 2px;
  }

  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 3mm;
    font-size: 9pt;
  }
  table.data-table th, table.data-table td {
    border: 1px solid #cbd5e1;
    padding: 1.8mm 3mm;
    text-align: left;
  }
  table.data-table th {
    background-color: #f1f5f9;
    color: #002855;
    font-weight: 800;
    width: 28%;
  }
  table.data-table td {
    color: #1e293b;
  }
  .highlight-val {
    font-weight: 700;
    color: #0f172a;
  }

  .abstract-box {
    background: #f8fafc;
    border-left: 3.5px solid #002855;
    padding: 2.5mm 4mm;
    font-size: 8.8pt;
    color: #334155;
    text-align: justify;
    line-height: 1.4;
    margin-bottom: 3mm;
    border-radius: 0 4px 4px 0;
  }

  .checklist-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5mm;
    margin-bottom: 3.5mm;
  }
  .check-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 2mm 3mm;
    font-size: 8.5pt;
  }
  .check-item strong {
    color: #002855;
  }

  .sign-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4mm;
    font-size: 8.5pt;
  }
  .sign-table td {
    border: 1px solid #cbd5e1;
    padding: 2.5mm 3mm;
    vertical-align: top;
    height: 16mm;
  }
  .sign-label {
    font-size: 7.5pt;
    font-weight: 800;
    color: #64748b;
    text-transform: uppercase;
  }

  .footer-notice {
    font-size: 7.5pt;
    color: #64748b;
    text-align: center;
    margin-top: 3.5mm;
    border-top: 1px solid #e2e8f0;
    padding-top: 1.5mm;
  }
</style>
</head>
<body>

  <!-- HEADER -->
  <table class="header-table">
    <tr>
      <td style="vertical-align: middle;">
        ${tutLogoUri ? `<img src="${tutLogoUri}" class="header-logo" alt="TUT Crest">` : ''}
      </td>
      <td class="header-text-right">
        <div class="univ-title">Tshwane University of Technology</div>
        <div class="univ-sub">We empower people</div>
        <div class="faculty-title">Faculty of Information and Communication Technology</div>
        <div class="dept-title">Department of Computer Systems Engineering</div>
      </td>
    </tr>
  </table>

  <!-- BANNER -->
  <div class="doc-banner">
    <div class="doc-title">Exhibition Poster Print Requisition &amp; Project Submission</div>
    <div class="doc-badge">A3 PRINT REQUISITION</div>
  </div>

  <!-- SECTION 1: CANDIDATE & PROJECT DETAILS -->
  <h2><span>01</span> Candidate &amp; Project Identification</h2>
  <table class="data-table">
    <tr>
      <th>Student Full Name</th>
      <td class="highlight-val">Oratile Innocent Tshosetso</td>
    </tr>
    <tr>
      <th>Student Number</th>
      <td class="highlight-val">222883253</td>
    </tr>
    <tr>
      <th>Academic Programme</th>
      <td>National Diploma: Computer Systems Engineering</td>
    </tr>
    <tr>
      <th>Subject Code &amp; Offering</th>
      <td><strong>PJD301B / IDC30BI</strong> (Computer Systems Engineering Design Project III)</td>
    </tr>
    <tr>
      <th>Project Title</th>
      <td class="highlight-val">Hardware-Level USB Remote Access Gateway via ESP32-S3</td>
    </tr>
    <tr>
      <th>Project Supervisors</th>
      <td>Mr. Muwanguzi Mark Ntume &amp; Prof. Chunling Du</td>
    </tr>
    <tr>
      <th>Student Contact</th>
      <td>Cell: <strong>+27 76 950 6870</strong> &nbsp;|&nbsp; Email: <strong>oratileinnocent.45@gmail.com</strong></td>
    </tr>
    <tr>
      <th>Event &amp; Exhibition Date</th>
      <td><strong>Tuesday, 24 November 2026</strong> &nbsp;(Theme: <em>Innovation, Entrepreneurship &amp; Excellence</em>)</td>
    </tr>
  </table>

  <!-- SECTION 2: PRINTING SPECIFICATIONS -->
  <h2><span>02</span> Technical Printing Specifications for Print Lab Officer</h2>
  <table class="data-table">
    <tr>
      <th>Required Print Size</th>
      <td><span class="highlight-val">ISO A3 (297 mm × 420 mm)</span> &nbsp;(Compliant with departmental exhibition display board standards)</td>
    </tr>
    <tr>
      <th>Print Orientation</th>
      <td><strong>Portrait (Vertical)</strong></td>
    </tr>
    <tr>
      <th>Recommended Paper Stock</th>
      <td><strong>200 – 250 gsm Satin / Semi-Gloss Coated Cardstock</strong> (Reduces harsh venue lighting reflections)</td>
    </tr>
    <tr>
      <th>Color Profile &amp; Resolution</th>
      <td><strong>Full Color (CMYK Process)</strong>, High-Density 300+ DPI, Scalable Vector Graphics</td>
    </tr>
    <tr>
      <th>Master Print File Attached</th>
      <td><code>EXHIBITION_POSTER_A3.pdf</code> &nbsp;(Stand-alone vector PDF, embedded typography, zero font-lock dependencies)</td>
    </tr>
    <tr>
      <th>Interactive Digital Source</th>
      <td><code>EXHIBITION_POSTER_A3.html</code> &nbsp;(Self-contained single-file HTML layout with vector SVG diagrams)</td>
    </tr>
  </table>

  <!-- SECTION 3: PROJECT ABSTRACT -->
  <h2><span>03</span> Project Abstract &amp; System Overview</h2>
  <div class="abstract-box">
    <strong>Abstract:</strong> This capstone project introduces an air-gap compliant, out-of-band hardware gateway engineered using the dual-core Espressif ESP32-S3 microcontroller. Unlike conventional remote desktop software (TeamViewer, AnyDesk, RDP) which require host operating system daemons and privileged background access, this system operates entirely at the physical bus layer by emulating composite USB Human Interface Device (HID) optical mouse and keyboard hardware via native on-chip USB 2.0 OTG PHY. Remote user input is transmitted from a custom cross-platform Flutter application over low-latency WebSockets (<25 ms RTT) directly into physical differential D+/D- lines. The system guarantees 100% pre-boot UEFI/BIOS accessibility, leaves a 0 MB host software footprint, and provides complete air-gap isolation at one-tenth the cost of enterprise IP-KVM solutions.
  </div>

  <!-- SECTION 4: DEMONSTRATION & BOOTH ASSETS -->
  <h2><span>04</span> Exhibition Booth Hardware &amp; Deliverables Checklist</h2>
  <div class="checklist-grid">
    <div class="check-item">
      <strong>[x] 3D Mouse Enclosure &amp; Hardware:</strong> Ergonomic mouse-form factor housing with debossed TUT emblem, front-right USB-C port, tactile clicker, and dual-color status LEDs.
    </div>
    <div class="check-item">
      <strong>[x] Mobile Controller App:</strong> Flutter 3.x client with multi-touch precision touchpad, quick-dock shortcuts, and real-time MJPEG desktop stream.
    </div>
    <div class="check-item">
      <strong>[x] Embedded Firmware:</strong> FreeRTOS dual-core embedded C++ pipeline separating network ingestion (Core 0) from hardware USB HID timing (Core 1).
    </div>
    <div class="check-item">
      <strong>[x] Exhibition Poster File:</strong> <code>EXHIBITION_POSTER_A3.pdf</code> generated and verified, ready for high-resolution plotting.
    </div>
  </div>

  <!-- SECTION 5: APPROVAL & SIGN-OFF -->
  <h2><span>05</span> Academic Supervisor &amp; Print Lab Authorization</h2>
  <table class="sign-table">
    <tr>
      <td style="width: 50%;">
        <div class="sign-label">Project Supervisor Approval</div>
        <p style="margin-top: 1mm; font-size: 8pt; color: #475569;">I confirm that the attached poster meets the departmental standards for the 2026 Exhibition.</p>
        <div style="margin-top: 6mm; border-bottom: 1px dotted #94a3b8; width: 85%;"></div>
        <div style="font-size: 7.5pt; color: #64748b; margin-top: 1mm;">Signature: Mr. M.M. Ntume / Prof. C. Du &nbsp;&nbsp;|&nbsp;&nbsp; Date: ____/____/2026</div>
      </td>
      <td style="width: 50%;">
        <div class="sign-label">Departmental Print Lab / Admin Officer</div>
        <p style="margin-top: 1mm; font-size: 8pt; color: #475569;">Received and scheduled for A3 plotting.</p>
        <div style="margin-top: 6mm; border-bottom: 1px dotted #94a3b8; width: 85%;"></div>
        <div style="font-size: 7.5pt; color: #64748b; margin-top: 1mm;">Print Officer Signature: __________________ &nbsp;&nbsp;|&nbsp;&nbsp; Completed: [ &nbsp; ]</div>
      </td>
    </tr>
  </table>

  <div class="footer-notice">
    Tshwane University of Technology • Faculty of ICT • Department of Computer Systems Engineering • #fromGOOD2GREAT
  </div>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'POSTER_PRINT_SUBMISSION_REQUEST.html'), htmlDoc, 'utf8');
console.log('✔ Generated: POSTER_PRINT_SUBMISSION_REQUEST.html');

console.log('Compiling official A4 submission PDF via Headless Chrome...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.join(__dirname, 'POSTER_PRINT_SUBMISSION_REQUEST.html');
const pdfPath = path.join(__dirname, 'POSTER_PRINT_SUBMISSION_REQUEST.pdf');

try {
  execSync(
    `"${chromePath}" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`,
    { stdio: 'inherit', timeout: 45000 }
  );
  const stats = fs.statSync(pdfPath);
  console.log(`✔ SUCCESS: POSTER_PRINT_SUBMISSION_REQUEST.pdf generated! Size: ${(stats.size / 1024).toFixed(1)} KB`);
} catch (err) {
  console.error('Error compiling submission PDF:', err.message);
}
