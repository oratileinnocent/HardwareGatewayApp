const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let logoHtml = '';
try {
  const logoBase64 = fs.readFileSync(path.join(__dirname, 'tut_logo.png')).toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;
  logoHtml = `
  <div style="display: flex; align-items: center; gap: 14px;">
    <img src="${logoDataUri}" style="height: 50px; width: auto; object-fit: contain;" alt="TUT Emblem">
    <div style="text-align: left;">
      <div style="font-size: 13pt; font-weight: 800; color: #003366; line-height: 1.15;">Tshwane University of Technology</div>
      <div style="font-size: 8.5pt; font-style: italic; font-weight: 600; color: #C62828;">Department of Computer Systems Engineering</div>
    </div>
  </div>`;
} catch (_) {
  logoHtml = `<div style="font-size: 14pt; font-weight: 800; color: #003366;">Tshwane University of Technology</div>`;
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Plain English Presentation - Hardware-Level USB Remote Access Gateway</title>
<style>
  @page {
    size: 297mm 210mm; /* A4 Landscape */
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
    line-height: 1.5;
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
    border-radius: 10px;
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
    padding-bottom: 3.5mm;
    margin-bottom: 3.5mm;
  }

  .slide-category {
    font-size: 9pt;
    font-weight: 800;
    color: #0284C7;
    letter-spacing: 1.2px;
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
    gap: 4.5mm;
  }

  .card {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 4mm 5mm;
  }
  .card-blue { border-top: 4px solid #003366; }
  .card-sky { border-top: 4px solid #0284C7; }
  .card-amber { border-top: 4px solid #D97706; }
  .card-green { border-top: 4px solid #16A34A; }

  .card h3 {
    font-size: 13pt;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 2mm;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card p, .card li {
    font-size: 10pt;
    color: #334155;
    line-height: 1.5;
  }
  .card ul {
    padding-left: 5mm;
  }
  .card li {
    margin-bottom: 2mm;
  }

  .highlight-box {
    background: #EFF6FF;
    border: 1px dashed #3B82F6;
    padding: 3.5mm 4.5mm;
    border-radius: 8px;
    font-size: 10.5pt;
    color: #1E3A8A;
    line-height: 1.45;
  }

  .stat-badge {
    background: #F0FDF4;
    border: 1px solid #86EFAC;
    padding: 3mm 4mm;
    border-radius: 8px;
    text-align: center;
  }
  .stat-badge .num {
    font-size: 24pt;
    font-weight: 800;
    color: #16A34A;
  }
  .stat-badge .lbl {
    font-size: 8.5pt;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
  }

  /* Spoken Script Box */
  .spoken-script-box {
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    border-left: 4px solid #16A34A;
    padding: 2.5mm 4mm;
    border-radius: 0 6px 6px 0;
    font-size: 9pt;
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
       SLIDE 1: THE BIG IDEA (THE HOOK)
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      ${logoHtml}
      <div class="slide-number-badge">SLIDE 01 / 12</div>
    </div>
    <div class="slide-body">
      <div style="text-align: center; margin: 2mm 0 4mm 0;">
        <div class="slide-category">FINAL YEAR INNOVATION • COMPUTER SYSTEMS ENGINEERING</div>
        <h1 style="font-size: 26pt; font-weight: 800; color: #003366; line-height: 1.2; margin: 2mm 0;">
          Turning Any Smartphone into a Physical Mouse & Keyboard<br>
          <span style="color: #0284C7;">For Any Computer in the World</span>
        </h1>
        <div style="font-size: 11pt; color: #475569; font-weight: 600;">
          No Internet Required • Zero Software Needed on the Computer • Completely Unblockable
        </div>
      </div>

      <div class="grid-2">
        <div class="card card-blue">
          <h3>👨‍🎓 Created By</h3>
          <p><strong>Student:</strong> Oratile Innocent Tshosetso (222883253)</p>
          <p><strong>Department:</strong> Computer Systems Engineering, TUT</p>
          <p><strong>Supervisors & Examiners:</strong> Mr. Muwanguzi Mark Ntume & Dr. Chunling Du</p>
        </div>
        <div class="card card-sky">
          <h3>💡 What Is This In Plain English?</h3>
          <p>A pocket-sized USB gadget that connects to a computer, talks wirelessly to your smartphone, and lets you glide the mouse and type keys on the computer from across the room.</p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say (The 10-Second Hook):</strong> "Good morning. Imagine you could turn your smartphone into a physical wireless mouse and keyboard that can control any computer in the world—even if that computer is locked down, has no internet, and forbids installing any software. That is what I built."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Plain English Presentation Deck</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 2: THE REAL-WORLD PROBLEM
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">The Everyday Dilemma</div>
        <div class="slide-title">Why Apps Like TeamViewer & AnyDesk <span>Fail</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 02 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-amber">
          <h3>1. They Need the Internet 🌐</h3>
          <p>If the computer has no internet (like bank servers, hospital machines, or broken PCs), software tools are completely useless.</p>
        </div>
        <div class="card card-amber">
          <h3>2. Security IT Blocks Them 🔒</h3>
          <p>You cannot install apps on locked computers. Company rules strictly ban downloading third-party software.</p>
        </div>
        <div class="card card-amber">
          <h3>3. Heavy "Crash Carts" 🛒</h3>
          <p>IT workers are forced to push heavy rolling carts with physical screens and keyboards through server aisles just to fix one machine.</p>
        </div>
      </div>
      <div class="highlight-box">
        <strong>The Big Problem:</strong> Software tools live inside the computer's operating system. If the computer is locked, broken, or offline, software can't help you.
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "We all know apps like TeamViewer or AnyDesk that let you control a computer remotely. But they have a fatal flaw: they only work if the PC has internet and if IT allows you to install them. In banks, hospitals, and server rooms, installing apps is strictly illegal. When something breaks, technicians are forced to push heavy physical carts with monitors and keyboards into server rooms just to fix it."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>The Problem: Software Limitations</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 3: THE SECRET TRICK (HARDWARE LEVEL)
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">The Clever Engineering Trick</div>
        <div class="slide-title">Fooling the Computer: <span>"I'm Just a USB Mouse"</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 03 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>🔌 What the Computer Thinks</h3>
          <p>When you plug a normal Dell or HP mouse into a computer, it works instantly. It never asks for a password or asks to install software.</p>
          <p style="margin-top:2mm;"><strong>My device does the exact same thing:</strong> It pretends to be a normal, physical USB mouse and keyboard. The computer accepts it unconditionally.</p>
        </div>
        <div class="card card-sky">
          <h3>📱 What is Actually Happening</h3>
          <p>Inside the little box is a powerful microchip with its own built-in private Wi-Fi.</p>
          <p style="margin-top:2mm;">It broadcasts a private Wi-Fi signal to your phone. When you swipe or type on your phone screen, the little box whispers to the PC: <em>'The user just clicked the mouse'</em> or <em>'The user just typed a letter.'</em></p>
        </div>
      </div>
      <div class="highlight-box">
        <strong>The Result:</strong> Zero software. Zero drivers. Zero traces left behind. Works on Windows, Mac, Linux, and even during computer startup menus!
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "So instead of using software, I built a tiny physical gadget. When you plug it into any computer, the computer gets completely fooled in a good way: it thinks I just plugged in a regular USB mouse and keyboard from Dell. It doesn't ask for permission and requires no software. It broadcasts its own private Wi-Fi directly to my phone, and my phone becomes the mouse and keyboard."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Hardware-Layer Emulation Explained Simply</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 4: THE HANDS AND THE EYES (THE CAR ANALOGY)
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">The Big Analogy</div>
        <div class="slide-title">The Hands and The Eyes: <span>The Toy Car Analogy</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 04 / 12</div>
    </div>
    <div class="slide-body">
      <div class="highlight-box" style="font-size: 11pt; border-left: 5px solid #0284C7; background: #F0F9FF;">
        🏎️ <strong>Imagine driving a remote-controlled toy car, but you’re standing in another room behind a wall...</strong><br>
        You have the remote in your hands, so you can steer and hit the gas... but you're blind because you can't see where the car is going! To fix that, you put a <strong>tiny live camera on the car dashboard</strong> that beams video straight to your phone. Now you can drive it anywhere!
      </div>
      <div class="grid-2">
        <div class="card card-blue">
          <h3>🖐️ The USB Dongle = The Hands</h3>
          <ul>
            <li>Does the physical clicking, scrolling, and typing.</li>
            <li>100% independent. Works even if the video camera is off.</li>
            <li>Needs zero internet and zero software on the computer.</li>
          </ul>
        </div>
        <div class="card card-sky">
          <h3>👁️ HardwareGatewayStream = The Eyes</h3>
          <ul>
            <li>Companion program on the PC acting like the dashboard camera.</li>
            <li>Takes 15 pictures of the PC screen every second and beams them to your phone.</li>
            <li>Shows you exactly what you are clicking on in real time!</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "Imagine driving a remote-controlled car from behind a wall. You have the steering wheel in your hands, but you're blind because you can't see where it's going. You put a tiny camera on the car dashboard that streams to your phone screen. That is my project: The USB dongle is the hands (it clicks and types), and HardwareGatewayStream is the eyes (it streams the screen so you can see what you are doing)."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>The Hands and The Eyes Analogy</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 5: WHY SEPARATING THEM IS GENIUS
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Engineering Common Sense</div>
        <div class="slide-title">Why Separate Them? <span>"Smart Division of Labor"</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 05 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-amber">
          <h3>❌ The Bad Way: Putting Video on the USB Stick</h3>
          <ul>
            <li>Microcontrollers have tiny processors and little memory.</li>
            <li>Compressing video makes the microchip overheat and choke.</li>
            <li>The mouse cursor starts lagging, jumping, and freezing.</li>
            <li>If the video crashes, the whole mouse stops working!</li>
          </ul>
        </div>
        <div class="card card-green">
          <h3>✔️ My Way: Smart Division of Labor</h3>
          <ul>
            <li>The computer's powerful processor handles the video snapshots (The Eyes).</li>
            <li>The tiny USB stick stays <strong>100% focused on moving the mouse at lightning speed</strong> (The Hands).</li>
            <li><strong>The Big Win:</strong> Even if the video stops, your hands NEVER stop working! The mouse and keyboard continue to work flawlessly.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "Someone might ask: 'Why didn't you just make the tiny USB stick do the video streaming too?' Think of it like a smart division of labor: if you make the tiny USB stick do heavy video broadcasting, it gets hot, runs out of memory, and the mouse starts to lag. By letting the computer handle the video camera, the USB stick stays 100% focused on lightning-fast mouse glide. And even if the video is closed, your hands never stop working."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Why Smart Division of Labor Matters</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 6: THE PHYSICAL GADGET & 3D BOX
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Physical Construction</div>
        <div class="slide-title">The Gadget: <span>Circuit Board & 3D-Printed Box</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 06 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>🔧 Inside the Box (The Circuit)</h3>
          <ul>
            <li><strong>ESP32-S3 Microchip:</strong> The brain with dual processors and native USB pins.</li>
            <li><strong>Vero Board Carrier:</strong> Clean soldered wiring with clearance channels for pins.</li>
            <li><strong>Two LED Traffic Lights:</strong>
              <ul>
                <li><span style="color:#0284C7; font-weight:bold;">Blue LED:</span> Blinks when waiting; stays solid when phone connects.</li>
                <li><span style="color:#D97706; font-weight:bold;">Amber LED:</span> Flashes every time a click or keystroke happens.</li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="card card-sky">
          <h3>🖨️ Outside the Box (The 3D Casing)</h3>
          <ul>
            <li>Designed by me in 3D CAD (OpenSCAD) and printed in tough PETG plastic.</li>
            <li>Pocket-sized snap-fit design that protects the electronics.</li>
            <li>Internal light tubes so the blue and amber LED colors don't bleed together.</li>
            <li>A comfortable push-button on top for the emergency kill-switch.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "I didn't just write code; I built the complete physical product. Inside is a compact circuit board with status LEDs that tell you when your phone is connected and when keys are being typed. I designed a custom snap-fit enclosure in 3D CAD and printed it in durable plastic with internal light tunnels and an emergency safety button."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Circuit Assembly & 3D Printed Enclosure</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 7: THE MOBILE TOUCHPAD EXPERIENCE
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">The User Experience</div>
        <div class="slide-title">The Phone App: <span>Smooth Like a Laptop Trackpad</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 07 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-blue">
          <h3>🧈 Silky Smooth Glide</h3>
          <p>Glides at up to 120 frames per second without stuttering, just like an expensive Apple or Dell glass trackpad.</p>
        </div>
        <div class="card card-sky">
          <h3>🎯 No "Dead Zone"</h3>
          <p>Slow, tiny microscopic finger movements are never lost. You can easily click tiny buttons on the computer screen.</p>
        </div>
        <div class="card card-amber">
          <h3>🖱️ Only One True Cursor</h3>
          <p>You see the actual Windows cursor moving on your phone in perfect sync with the computer monitor—no ghost cursors!</p>
        </div>
      </div>
      <div class="highlight-box">
        <strong>Intuitive Gestures:</strong> 1-finger glide to move • Tap to click • 2-finger scroll to browse pages • Long-press for right-click.
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "On the phone, I created an app that feels just like a premium laptop trackpad. It moves at 120 frames per second with zero lag. Even if you move your finger a fraction of a millimeter, the mouse tracks it smoothly. And most importantly, you see only one single cursor on your phone that moves in perfect lockstep with the computer monitor."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Touchpad Mechanics & Single-Cursor Parity</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 8: LIGHTNING SPEED (28 MILLISECONDS)
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Speed & Responsiveness</div>
        <div class="slide-title">Lightning Speed: <span>Faster Than the Blink of an Eye</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 08 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>⚡ How Fast Is 28 Milliseconds?</h3>
          <ul>
            <li>A human eye blink takes <strong>100 to 150 milliseconds</strong>.</li>
            <li>The human brain can only notice lag if it takes more than <strong>50 milliseconds</strong>.</li>
            <li>My device responds in <strong>28 milliseconds</strong> from finger touch to the computer reacting!</li>
            <li><strong>Meaning:</strong> It feels completely instantaneous—like your finger is physically glued to the mouse.</li>
          </ul>
        </div>
        <div class="card card-green" style="display:flex; flex-direction:column; justify-content:center; align-items:center;">
          <div class="stat-badge" style="width: 85%;">
            <div class="num">28.1 ms</div>
            <div class="lbl">Total Response Time</div>
          </div>
          <p style="text-align: center; font-size: 9.5pt; color: #166534; margin-top: 3mm; font-weight: 600;">
            ✅ 2x Faster than the human lag threshold (50 ms)!
          </p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "How fast is this? From the moment your finger touches the phone screen, through the air via Wi-Fi, into the USB stick, and onto the computer takes only 28 milliseconds. A human eye blink takes 100 milliseconds. Because 28 milliseconds is twice as fast as what the human eye can detect, it feels completely instantaneous with zero lag."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Speed Verification & Human Perception</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 9: THE PANIC BUTTON (SAFETY)
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Built-In Safety</div>
        <div class="slide-title">The Panic Button: <span>Instant Physical Safety Cutoff</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 09 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>🛡️ Not a Hacking Tool</h3>
          <p>Some people hear 'USB gadget' and think of hacker tools like a Rubber Ducky.</p>
          <p style="margin-top:2mm;"><strong>My device is strictly an administrative bridge:</strong> It has zero automatic hacking scripts. It only clicks or types when a human being actively touches the phone screen.</p>
        </div>
        <div class="card card-amber">
          <h3>🚨 The Physical Emergency Button</h3>
          <p>See that little push-button on top of the box? That is a physical <strong>Kill-Switch</strong>.</p>
          <p style="margin-top:2mm;">If you ever suspect someone is trying to connect without permission, you press the button. In less than <strong>2 milliseconds</strong>, all wireless signals die completely like pulling an emergency brake cord.</p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "This is not a hacking tool. It has no autonomous scripts; it only moves when a human touches the phone. Even better, I built an emergency safety feature: a real physical kill-switch button on the box. If you ever want to disconnect immediately, you tap that button, and all wireless signals shut down in 2 milliseconds. It's like pulling an emergency brake."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Safety Mechanisms & Physical Kill-Switch</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 10: SAVING THOUSANDS OF RANDS
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Cost & Value</div>
        <div class="slide-title">Huge Savings: <span>R600 vs. R10,000 Equipment</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 10 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>🏢 Industrial Server Room Equipment</h3>
          <ul>
            <li>Companies buy digital "Crash Cart Adapters" to plug into servers.</li>
            <li>Brands like StarTech charge between <strong>R8,000 and R15,000</strong> per unit.</li>
            <li>They are bulky, require specialized laptop cables, and break easily.</li>
          </ul>
        </div>
        <div class="card card-green">
          <h3>💡 My Custom Built Solution</h3>
          <ul>
            <li>Built for only <strong>R600.00</strong> using locally sourced components.</li>
            <li>Fits directly into a technician’s pocket.</li>
            <li>Uses the smartphone the technician already carries every day.</li>
            <li><strong>Saves companies over 90% on equipment costs!</strong></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "Big companies buy specialized digital crash-cart adapters to manage their servers, and those commercial gadgets cost between R8,000 and R15,000 each. I built this entire working prototype for just R600 using locally procured parts. It fits right in your pocket and uses the phone you already own, saving over 90% on equipment costs."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Financial Budget & Real-World Cost Comparison</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 11: THE 30-SECOND LIVE DEMO
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">Seeing Is Believing</div>
        <div class="slide-title">The 30-Second <span>Live Magic Trick Demo</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 11 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-blue">
          <h3>1. Plug It In 🔌</h3>
          <p>Plug the dongle into a laptop that has no internet. The blue light blinks, and the computer instantly accepts the USB mouse.</p>
        </div>
        <div class="card card-sky">
          <h3>2. Glide & Type 🖱️</h3>
          <p>Open the phone app. Swipe across the phone screen to move the laptop cursor, and type 'Hello World' into Notepad.</p>
        </div>
        <div class="card card-amber">
          <h3>3. Hit the Kill-Switch 🚨</h3>
          <p>Press the button on top of the box. The phone instantly disconnects and the blue light turns off, proving real-time safety.</p>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "Seeing is believing, so let's do a quick 30-second live demonstration: First, notice the laptop has no internet. I plug in the little box, and the laptop immediately recognizes it. I glide my finger on my phone, and the mouse moves smoothly. I type on my phone, and words appear in Notepad. Finally, I press the emergency button—the connection cuts instantly."
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Live Demonstration Protocol</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

  <!-- =========================================================================
       SLIDE 12: CONCLUSION (THE WRAP UP)
       ========================================================================= -->
  <div class="slide">
    <div class="slide-header">
      <div>
        <div class="slide-category">The Summary</div>
        <div class="slide-title">Conclusion: <span>The Future of Remote IT Access</span></div>
      </div>
      <div class="slide-number-badge">SLIDE 12 / 12</div>
    </div>
    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-blue">
          <h3>🎯 What We Proved Today</h3>
          <ul>
            <li>You don't need internet or software to control a computer remotely.</li>
            <li>Hardware-level control is faster, safer, and completely unblockable.</li>
            <li>Built an end-to-end system: circuit board, 3D casing, and phone app for R600.</li>
            <li>All technical and academic milestones completed on schedule.</li>
          </ul>
        </div>
        <div class="card card-sky">
          <h3>🚀 What Comes Next (Phase 2)</h3>
          <ul>
            <li>Adding on-chip micro-camera streaming directly from the USB stick.</li>
            <li>Enhanced enterprise security passwords and digital certificates.</li>
            <li>Bluetooth fallback mode for areas where Wi-Fi is restricted.</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="spoken-script-box">
      <strong>🎙️ What to Say:</strong> "In conclusion, this project proves that remote computer control can be achieved safely from physical hardware without software risks or expensive equipment. It delivers a fast, secure, and affordable tool for IT technicians. Thank you so much for your time. I am ready for any questions!"
    </div>
    <div class="slide-footer">
      <span class="candidate-tag">Oratile Innocent Tshosetso (222883253)</span>
      <span>Final Conclusion & Q&A</span>
      <span>Tshwane University of Technology</span>
    </div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'PRESENTATION_FOR_EVERYONE.html');
const pdfPath = path.join(__dirname, 'PRESENTATION_FOR_EVERYONE.pdf');

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('Created PRESENTATION_FOR_EVERYONE.html');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const command = `"${chromePath}" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;

console.log('Generating Plain English PDF via Chrome headless...');
try {
  execSync(command, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`SUCCESS: PRESENTATION_FOR_EVERYONE.pdf created! Size: ${stats.size} bytes`);
  } else {
    console.error('ERROR: PDF was not generated.');
    process.exit(1);
  }
} catch (err) {
  console.error('Execution error generating PDF:', err.message);
  process.exit(1);
}
