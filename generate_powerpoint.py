import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6] # completely blank layout

    # Color Palette Definitions
    NAVY = RGBColor(0, 51, 102)        # #003366 - TUT Primary Navy
    CRIMSON = RGBColor(198, 40, 40)    # #C62828 - TUT Crimson
    SKY = RGBColor(2, 132, 199)        # #0284C7 - Accent Sky Blue
    DARK = RGBColor(15, 23, 42)        # #0F172A - Title Dark
    BODY = RGBColor(51, 65, 85)        # #334155 - Body Slate
    MUTED = RGBColor(100, 116, 139)    # #64748B - Muted Gray
    CARD_BG = RGBColor(248, 250, 252)  # #F8FAFC - Card Fill
    CARD_BORDER = RGBColor(226, 232, 240) # #E2E8F0 - Card Border
    WHITE = RGBColor(255, 255, 255)
    GREEN = RGBColor(22, 163, 74)      # #16A34A - Success Green
    AMBER = RGBColor(217, 119, 6)      # #D97706 - Warning Amber

    logo_path = os.path.abspath("tut_logo.png")

    def add_header(slide, slide_num_str, category_str, title_str):
        # Header banner shape
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(10.0), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p1 = tf.paragraphs[0]
        p1.text = category_str.upper()
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = SKY
        p1.space_after = Pt(2)

        p2 = tf.add_paragraph()
        p2.text = title_str
        p2.font.size = Pt(22)
        p2.font.bold = True
        p2.font.color.rgb = DARK

        # Slide Number Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(11.0), Inches(0.45), Inches(1.5), Inches(0.45))
        badge.fill.solid()
        badge.fill.fore_color.rgb = NAVY
        badge.line.color.rgb = NAVY
        btf = badge.text_frame
        bp = btf.paragraphs[0]
        bp.text = slide_num_str
        bp.font.size = Pt(11)
        bp.font.bold = True
        bp.font.color.rgb = WHITE
        bp.alignment = PP_ALIGN.CENTER

        # Separator Line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.55), Inches(11.733), Inches(0.03))
        line.fill.solid()
        line.fill.fore_color.rgb = NAVY
        line.line.color.rgb = NAVY

    def add_footer(slide):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.95), Inches(11.733), Inches(0.35))
        ftf = footer_box.text_frame
        ftf.margin_left = ftf.margin_top = ftf.margin_right = ftf.margin_bottom = 0
        p = ftf.paragraphs[0]
        p.text = "Oratile Innocent Tshosetso (222883253)  •  National Diploma: Computer Systems Engineering  •  Tshwane University of Technology"
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = MUTED

    def add_card(slide, left, top, width, height, title, items, border_color=NAVY):
        # Card background
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        # Top color accent stripe
        stripe = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, Inches(0.08))
        stripe.fill.solid()
        stripe.fill.fore_color.rgb = border_color
        stripe.line.fill.background()

        # Text box inside
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.18), width - Inches(0.4), height - Inches(0.25))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = DARK
        p.space_after = Pt(8)

        for item in items:
            p_item = tf.add_paragraph()
            p_item.text = f"•  {item}"
            p_item.font.size = Pt(11)
            p_item.font.color.rgb = BODY
            p_item.space_after = Pt(5)

    def set_speaker_notes(slide, script_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = f"ORAL DEFENSE SPOKEN SCRIPT:\n\n{script_text}"

    # =========================================================================
    # SLIDE 1: TITLE & IDENTITY
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)

    # TUT Logo
    if os.path.exists(logo_path):
        slide1.shapes.add_picture(logo_path, Inches(0.8), Inches(0.6), height=Inches(1.0))

    # University header text
    inst_tb = slide1.shapes.add_textbox(Inches(2.0), Inches(0.6), Inches(9.0), Inches(1.0))
    itf = inst_tb.text_frame
    itf.margin_left = itf.margin_top = itf.margin_right = itf.margin_bottom = 0
    ip1 = itf.paragraphs[0]
    ip1.text = "Tshwane University of Technology"
    ip1.font.size = Pt(18)
    ip1.font.bold = True
    ip1.font.color.rgb = NAVY
    ip2 = itf.add_paragraph()
    ip2.text = "Faculty of ICT  •  Department of Computer Systems Engineering  •  PJD 301B / IDC30BI"
    ip2.font.size = Pt(10.5)
    ip2.font.bold = True
    ip2.font.color.rgb = CRIMSON

    # Main Project Title
    title_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.733), Inches(1.8))
    ttf = title_box.text_frame
    ttf.word_wrap = True
    tp_sub = ttf.paragraphs[0]
    tp_sub.text = "FINAL YEAR ACADEMIC CAPSTONE DEFENSE"
    tp_sub.font.size = Pt(11)
    tp_sub.font.bold = True
    tp_sub.font.color.rgb = SKY
    tp_sub.space_after = Pt(4)

    tp_main = ttf.add_paragraph()
    tp_main.text = "Hardware-Level USB Remote Access Gateway\nvia ESP32-S3 HID Emulation"
    tp_main.font.size = Pt(28)
    tp_main.font.bold = True
    tp_main.font.color.rgb = NAVY
    tp_main.space_after = Pt(6)

    tp_desc = ttf.add_paragraph()
    tp_desc.text = "Driverless Human Interface Emulation & Deterministic Low-Latency Wireless Bridge"
    tp_desc.font.size = Pt(13)
    tp_desc.font.bold = True
    tp_desc.font.color.rgb = BODY

    # Two metadata cards
    add_card(slide1, Inches(0.8), Inches(3.9), Inches(5.7), Inches(2.7),
             "🎓 Candidate Profile",
             [
                 "Candidate Name: Oratile Innocent Tshosetso",
                 "Student Number: 222883253",
                 "Qualification: National Diploma in Computer Systems Engineering",
                 "Date of Defense: November 2026 (Final Deliverable)"
             ],
             border_color=NAVY)

    add_card(slide1, Inches(6.833), Inches(3.9), Inches(5.7), Inches(2.7),
             "👨‍🏫 Examination Panel & Academic Standards",
             [
                 "Project Examiner 1: Mr. Muwanguzi Mark Ntume",
                 "Project Examiner 2: Dr. Chunling Du",
                 "Department: Computer Systems Engineering • Faculty of ICT",
                 "Formal Compliance: IEEE 1016 (Design) & IEEE 1063 (Manual)"
             ],
             border_color=SKY)

    add_footer(slide1)
    set_speaker_notes(slide1, "Good morning Mr. Ntume, Dr. Du, and esteemed examiners. My name is Oratile Innocent Tshosetso (Student Number: 222883253). Today I present my final project: the Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation. This project addresses the fundamental security, driver, and network barriers that prevent traditional remote administration tools from functioning in mission-critical environments.")

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "SLIDE 02 / 12", "Section 1: Problem Motivation", "The Dilemma: Why Software Remote Access Fails")

    add_card(slide2, Inches(0.8), Inches(1.85), Inches(3.7), Inches(4.8),
             "🚫 Privilege Restrictions",
             [
                 "High-security facilities (Banks, SCADA, Data Centers) forbid installing agent software.",
                 "Requires host administrator permissions that field technicians do not have.",
                 "Strict corporate IT policies blacklist third-party background daemons."
             ], border_color=AMBER)

    add_card(slide2, Inches(4.816), Inches(1.85), Inches(3.7), Inches(4.8),
             "🔒 Firewall & Network Barriers",
             [
                 "Tools like TeamViewer, AnyDesk, and RDP require open incoming firewall ports.",
                 "Air-gapped and industrial consoles have ZERO external internet connectivity.",
                 "Outbound cloud relays violate financial and industrial data privacy standards."
             ], border_color=AMBER)

    add_card(slide2, Inches(8.833), Inches(1.85), Inches(3.7), Inches(4.8),
             "🛒 Crash Cart Inefficiency",
             [
                 "Technicians must physically wheel bulky monitors and keyboards into cold server aisles.",
                 "Commercial digital KVM crash-cart units cost between R8,000 and R15,000 per unit.",
                 "Substantially slows down emergency fault recovery and diagnostics."
             ], border_color=AMBER)

    add_footer(slide2)
    set_speaker_notes(slide2, "In modern IT and SCADA environments, traditional remote desktop tools cannot be used because host security policies prohibit unauthorized software installations, open firewall ports, and external internet connectivity. Technicians are forced to push heavy physical crash carts into cramped aisles just to plug in a keyboard and monitor.")

    # =========================================================================
    # SLIDE 3: THE SOLUTION
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "SLIDE 03 / 12", "Section 2: Engineering Innovation", "The Solution: Physical Hardware-Layer Control")

    add_card(slide3, Inches(0.8), Inches(1.85), Inches(5.7), Inches(4.8),
             "⚡ Driverless USB Composite HID Emulation",
             [
                 "Complies strictly with USB-IF HID Specification v1.11.",
                 "The host PC natively accepts the dongle as a generic physical mouse and keyboard.",
                 "Zero drivers, zero software footprint, zero background logs on the target PC.",
                 "Operational across Windows, Linux, macOS, and even BIOS/UEFI boot menus."
             ], border_color=NAVY)

    add_card(slide3, Inches(6.833), Inches(1.85), Inches(5.7), Inches(4.8),
             "📡 Isolated Peer-to-Peer Wireless Channel",
             [
                 "ESP32-S3 broadcasts its own independent 802.11 b/g/n Wi-Fi SoftAP (ESP32-Gateway).",
                 "Maintains direct full-duplex WebSocket connections to the technician's phone.",
                 "Touch gestures and keystrokes translate into hardware USB signals in under 28.1 ms.",
                 "Built-in hardware RF kill-switch terminates radio broadcasts in under 2.0 ms."
             ], border_color=SKY)

    add_footer(slide3)
    set_speaker_notes(slide3, "My project solves this by moving remote control from software down to the physical hardware layer. The ESP32-S3 microcontroller natively enumerates as a driverless USB mouse and keyboard while broadcasting an isolated local Wi-Fi SoftAP. Touch gestures from the phone are translated into hardware USB signals with an end-to-end response time under 28.1 milliseconds.")

    # =========================================================================
    # SLIDE 4: DUAL-CORE DECOUPLING UNDER FREERTOS
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "SLIDE 04 / 12", "Section 3: Microcontroller Architecture", "Dual-Core Decoupling Under FreeRTOS")

    add_card(slide4, Inches(0.8), Inches(1.85), Inches(5.7), Inches(4.8),
             "Core 0: Networking & Protocol Manager",
             [
                 "Runs LwIP TCP/IP stack and 802.11 b/g/n SoftAP.",
                 "Maintains persistent WebSocket connections on TCP Port 80.",
                 "Performs zero-copy JSON parsing using ArduinoJson memory buffers (<0.5 ms).",
                 "Transfers decoded commands into an atomic, thread-safe circular ring buffer."
             ], border_color=NAVY)

    add_card(slide4, Inches(6.833), Inches(1.85), Inches(5.7), Inches(4.8),
             "Core 1: Deterministic USB HID Execution",
             [
                 "Dedicated exclusively to physical USB hardware endpoint FIFO control.",
                 "Executes the TinyUSB composite driver stack natively.",
                 "Maintains a strict, non-blocking 125 Hz USB HID poll cycle (8.0 ms frames).",
                 "Core Isolation: Wi-Fi beacon bursts or network retries on Core 0 NEVER stall or jitter USB execution on Core 1."
             ], border_color=SKY)

    add_footer(slide4)
    set_speaker_notes(slide4, "To ensure real-time responsiveness, I decoupled the system into two independent FreeRTOS pipelines running on separate Xtensa LX7 cores. Core 0 handles networking and packet parsing, while Core 1 is dedicated exclusively to the physical USB hardware endpoint. This core isolation ensures Wi-Fi traffic never stalls or jitters the 125 Hz USB polling schedule.")

    # =========================================================================
    # SLIDE 5: DUAL-ENGINE "HANDS & EYES"
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "SLIDE 05 / 12", "Section 4: Modular System Design", "Dual-Engine Strategy: 'The Hands and The Eyes'")

    add_card(slide5, Inches(0.8), Inches(1.85), Inches(5.7), Inches(4.8),
             "Engine 1: USB Hardware Dongle (The Hands)",
             [
                 "Primary control pipeline: 100% autonomous, firmware-driven.",
                 "Injects mouse glide, clicks, and keystrokes directly into USB hardware.",
                 "Completely unblockable by firewalls, antivirus, or locked-down operating systems.",
                 "Operates even during PC BIOS setup and pre-boot recovery screens."
             ], border_color=NAVY)

    add_card(slide5, Inches(6.833), Inches(1.85), Inches(5.7), Inches(4.8),
             "Engine 2: HardwareGatewayStream (The Eyes)",
             [
                 "Optional Python 3 companion daemon running on the host PC.",
                 "Captures desktop frames at 15 FPS via mss and streams binary JPEG frames.",
                 "Fetches real Windows cursor coordinates via user32.GetCursorPos().",
                 "Graceful Degradation: If the video feed is closed, the hardware mouse and keyboard continue working with 100% fidelity."
             ], border_color=SKY)

    add_footer(slide5)
    set_speaker_notes(slide5, "A key design strength is modularity, which I describe as 'The Hands and The Eyes'. The USB dongle is the hands: it clicks and types with zero software required. When visual feedback is needed, the optional companion daemon acts as the eyes, streaming the screen back to the phone. If the screen feed is closed, hardware control never stops.")

    # =========================================================================
    # SLIDE 6: MECHANICAL & CIRCUIT FABRICATION
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "SLIDE 06 / 12", "Section 5: Mechanical & Circuit Fabrication", "Vero Board Integration & 3D-Printed Enclosure")

    add_card(slide6, Inches(0.8), Inches(1.85), Inches(5.7), Inches(4.8),
             "🔌 Electronic Schematic & Assembly",
             [
                 "ESP32-S3-N8R2 mounted on custom-machined Vero board carrier.",
                 "Native USB OTG differential data connection (GPIO 19 D-, GPIO 20 D+).",
                 "Blue LED (GPIO 5, 330Ω): Wi-Fi state (1 Hz blink = idle, solid = linked).",
                 "Amber LED (GPIO 4, 330Ω): USB HID activity strobe.",
                 "Hardware Kill-Switch (GPIO 14): Active-low falling-edge interrupt."
             ], border_color=NAVY)

    add_card(slide6, Inches(6.833), Inches(1.85), Inches(5.7), Inches(4.8),
             "📦 Custom PETG Snap-Fit Enclosure",
             [
                 "Designed in OpenSCAD; sliced in PrusaSlicer (0.20mm layers, 20% infill).",
                 "Front beveled port cutout (14mm × 6.5mm) for standard USB-C cables.",
                 "Dual internal 3.2mm light pipe sleeves to prevent optical LED bleed.",
                 "Captive 7.2mm tactile plunger button for immediate kill-switch actuation.",
                 "Internal bottom clearance channel for soldered breadboard pin headers."
             ], border_color=SKY)

    add_footer(slide6)
    set_speaker_notes(slide6, "The circuit is integrated onto a compact Vero board with clearance routing for breadboard pins. I designed a custom snap-fit enclosure in OpenSCAD and 3D printed it in PETG. It features dedicated optical light pipes to isolate the blue and amber diagnostic LEDs, a beveled USB-C port channel, and an ergonomic captive plunger for the safety switch.")

    # =========================================================================
    # SLIDE 7: FLUTTER APP ARCHITECTURE
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_header(slide7, "SLIDE 07 / 12", "Section 6: Mobile Client Engineering", "Flutter App: Zero-Jank 120 FPS Rendering")

    add_card(slide7, Inches(0.8), Inches(1.85), Inches(3.7), Inches(4.8),
             "🚀 Zero-Rebuild Pipeline",
             [
                 "Replaced whole-page setState rebuilding with isolated ValueNotifier listeners.",
                 "Eliminates UI thread frame drops during 120 Hz touchpad panning.",
                 "Guarantees responsive gesture polling with zero UI lag."
             ], border_color=NAVY)

    add_card(slide7, Inches(4.816), Inches(1.85), Inches(3.7), Inches(4.8),
             "🎯 Sub-Pixel Accumulator",
             [
                 "Preserves fractional touch deltas (_accumulatedDx/Dy).",
                 "Eliminates dead zones and integer truncation stutter during fine, microscopic finger glide.",
                 "Calibrated 2.0x velocity curve matching laptop trackpad ergonomics."
             ], border_color=SKY)

    add_card(slide7, Inches(8.833), Inches(1.85), Inches(3.7), Inches(4.8),
             "🖱️ Single-Cursor Parity",
             [
                 "Removed redundant client-side overlay cursor.",
                 "Screen feed displays the single, real Windows cursor at 100% speed, velocity, and position parity.",
                 "Eliminates cursor desynchronization entirely."
             ], border_color=AMBER)

    add_footer(slide7)
    set_speaker_notes(slide7, "The mobile client was engineered in Flutter with a zero-rebuild architecture using ValueNotifiers. This allows the touchpad to capture gestures at full 120 Hz polling rates without dropping a frame. I implemented a sub-pixel motion accumulator that prevents slow movements from truncating to zero, and synchronized the display so the user sees only one true cursor that moves in complete lockstep with the PC.")

    # =========================================================================
    # SLIDE 8: LATENCY MODELING
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    add_header(slide8, "SLIDE 08 / 12", "Section 7: Performance Verification", "Latency Modeling: 28.1 ms End-to-End Breakdown")

    add_card(slide8, Inches(0.8), Inches(1.85), Inches(6.5), Inches(4.8),
             "⏱️ Cumulative System Latency Formula",
             [
                 "T_total = T_touch + T_ws + T_esp + T_usb",
                 "Mobile Touch Digitizer Sampling (T_touch): ~16.6 ms (standard 60 Hz).",
                 "Wi-Fi WebSocket Transit (T_ws): ~4.0 to 7.0 ms (local 2.4 GHz SoftAP).",
                 "ESP32 JSON Deserialization (T_esp): < 0.5 ms (zero-copy memory).",
                 "Host USB HID Polling Interval (T_usb): 8.0 ms (125 Hz USB rate)."
             ], border_color=NAVY)

    # Stat Card
    stat_card = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.7), Inches(1.85), Inches(4.833), Inches(4.8))
    stat_card.fill.solid()
    stat_card.fill.fore_color.rgb = CARD_BG
    stat_card.line.color.rgb = CARD_BORDER

    tb_num = slide8.shapes.add_textbox(Inches(8.0), Inches(2.5), Inches(4.2), Inches(2.0))
    tf_num = tb_num.text_frame
    p_num = tf_num.paragraphs[0]
    p_num.text = "28.1 ms"
    p_num.font.size = Pt(46)
    p_num.font.bold = True
    p_num.font.color.rgb = SKY
    p_num.alignment = PP_ALIGN.CENTER

    p_lbl = tf_num.add_paragraph()
    p_lbl.text = "TOTAL END-TO-END LATENCY"
    p_lbl.font.size = Pt(11)
    p_lbl.font.bold = True
    p_lbl.font.color.rgb = MUTED
    p_lbl.alignment = PP_ALIGN.CENTER

    tb_desc = slide8.shapes.add_textbox(Inches(8.0), Inches(4.5), Inches(4.2), Inches(1.5))
    tf_desc = tb_desc.text_frame
    tf_desc.word_wrap = True
    p_d = tf_desc.paragraphs[0]
    p_d.text = "Significantly lower than the 50 ms human perceptual lag threshold, delivering a deterministic, lag-free user experience."
    p_d.font.size = Pt(11)
    p_d.font.color.rgb = BODY
    p_d.alignment = PP_ALIGN.CENTER

    add_footer(slide8)
    set_speaker_notes(slide8, "The end-to-end signal latency is 28.1 milliseconds, calculated across touch digitizer sampling, local Wi-Fi transmission, JSON decoding, and the host USB 125 Hz polling cycle. Because 28.1 ms is well below the 50-millisecond human perceptual threshold, mouse movements and typing feel instantaneous and native.")

    # =========================================================================
    # SLIDE 9: CYBERSECURITY & HARDWARE KILL-SWITCH
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    add_header(slide9, "SLIDE 09 / 12", "Section 8: Cybersecurity Governance", "Security & Physical Hardware Kill-Switch")

    add_card(slide9, Inches(0.8), Inches(1.85), Inches(5.7), Inches(4.8),
             "🛡️ Administrative Bridge vs. Rubber Ducky",
             [
                 "No Autonomous Malicious Payloads: Firmware contains zero automated keystroke injection scripts; only forwards live human input.",
                 "Physical Proximity Boundary: Constrained to local 10–15 meter SoftAP perimeter.",
                 "Buffer Flush on Disconnect: Releasing the connection automatically clears keyboard buffers to zero to prevent key-repeat loops."
             ], border_color=NAVY)

    add_card(slide9, Inches(6.833), Inches(1.85), Inches(5.7), Inches(4.8),
             "🚨 Active Hardware RF Kill-Switch",
             [
                 "Tactile push-button wired to GPIO 14 (Active-Low Interrupt).",
                 "Falling-edge hardware ISR immediately calls esp_wifi_stop().",
                 "RF Termination Time: < 2.0 milliseconds.",
                 "Guarantees immediate physical air-gap protection without relying on software commands or operating system intervention."
             ], border_color=AMBER)

    add_footer(slide9)
    set_speaker_notes(slide9, "This gateway is an interactive administrative bridge, not a Rubber Ducky. It contains zero autonomous scripts; it only transmits manual operator input. Furthermore, to guard against unauthorized access, I engineered a dedicated hardware kill-switch. When pressed, a hardware interrupt halts all radio transmissions in under 2 milliseconds, creating an immediate physical air-gap.")

    # =========================================================================
    # SLIDE 10: FINANCIAL BUDGET & PROCUREMENT
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    add_header(slide10, "SLIDE 10 / 12", "Section 9: Project Management", "Financial Budget & Procurement Diligence")

    add_card(slide10, Inches(0.8), Inches(1.85), Inches(6.5), Inches(4.8),
             "💰 Bill of Materials (Strict Compliance to R645.00)",
             [
                 "Dual ESP32-S3 Boards (1 Hardware Redundancy Unit): R 370.00",
                 "Tactile Switches, Resistors & Status LEDs: R 25.00",
                 "Prototyping Breadboard & Jumper Wires: R 85.00",
                 "Custom 3D-Printed Enclosure Fabrication (PETG): R 120.00",
                 "TOTAL EXPENDITURE: R 600.00  (R 45.00 Under Proposed Budget)"
             ], border_color=NAVY)

    # Cost Stat Card
    cost_card = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.7), Inches(1.85), Inches(4.833), Inches(4.8))
    cost_card.fill.solid()
    cost_card.fill.fore_color.rgb = CARD_BG
    cost_card.line.color.rgb = CARD_BORDER

    tb_cnum = slide10.shapes.add_textbox(Inches(8.0), Inches(2.5), Inches(4.2), Inches(2.0))
    tf_cnum = tb_cnum.text_frame
    p_cnum = tf_cnum.paragraphs[0]
    p_cnum.text = "R 600.00"
    p_cnum.font.size = Pt(46)
    p_cnum.font.bold = True
    p_cnum.font.color.rgb = GREEN
    p_cnum.alignment = PP_ALIGN.CENTER

    p_clbl = tf_cnum.add_paragraph()
    p_clbl.text = "ACTUAL CONSTRUCTION COST"
    p_clbl.font.size = Pt(11)
    p_clbl.font.bold = True
    p_clbl.font.color.rgb = MUTED
    p_clbl.alignment = PP_ALIGN.CENTER

    tb_cdesc = slide10.shapes.add_textbox(Inches(8.0), Inches(4.5), Inches(4.2), Inches(1.5))
    tf_cdesc = tb_cdesc.text_frame
    tf_cdesc.word_wrap = True
    p_cd = tf_cdesc.paragraphs[0]
    p_cd.text = "Replaces commercial enterprise KVM crash-cart units costing R 8,000 to R 15,000. All parts procured locally from Micro Robotics and Communica."
    p_cd.font.size = Pt(11)
    p_cd.font.color.rgb = BODY
    p_cd.alignment = PP_ALIGN.CENTER

    add_footer(slide10)
    set_speaker_notes(slide10, "All components were procured locally from Micro Robotics and Communica to eliminate import lead times, adhering strictly to our proposed budget at R600. While commercial enterprise crash-cart units cost between R8,000 and R15,000, this hardware solution achieves the same administrative capability at a fraction of the cost.")

    # =========================================================================
    # SLIDE 11: LIVE DEMONSTRATION PROTOCOL
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    add_header(slide11, "SLIDE 11 / 12", "Section 10: Practical Verification", "The 30-Second Live Demonstration Protocol")

    add_card(slide11, Inches(0.8), Inches(1.85), Inches(3.7), Inches(4.8),
             "Phase 1: Connect & Confirm",
             [
                 "Insert dongle into laptop.",
                 "Laptop has NO internet and NO agent software installed.",
                 "Blue LED blinks, then turns solid when smartphone associates.",
                 "Mobile app status indicator shows ESP32: Connected."
             ], border_color=NAVY)

    add_card(slide11, Inches(4.816), Inches(1.85), Inches(3.7), Inches(4.8),
             "Phase 2: Glide & Type",
             [
                 "Glide cursor across Windows desktop with high-speed response.",
                 "Open a blank Notepad document on the host PC.",
                 "Inject live keystrokes using the mobile virtual keyboard.",
                 "Demonstrate tap-to-click, double-click, and right-click actions."
             ], border_color=SKY)

    add_card(slide11, Inches(8.833), Inches(1.85), Inches(3.7), Inches(4.8),
             "Phase 3: Emergency Cutoff",
             [
                 "Press the physical plunger button on the 3D enclosure.",
                 "Phone immediately disconnects and Blue LED turns off.",
                 "Proves active hardware air-gap safety in real time (<2.0 ms cutoff)."
             ], border_color=AMBER)

    add_footer(slide11)
    set_speaker_notes(slide11, "I will now demonstrate the system live. First, notice the laptop has no internet and no remote desktop software running. When I plug the dongle into the USB port, the blue LED blinks. I launch the mobile app, the LED turns solid blue, and the app confirms connection. As I glide my finger, the cursor moves smoothly. I type on the phone, and text appears instantly in Notepad. Finally, I press the emergency button—the connection severs immediately, proving our physical air-gap safety.")

    # =========================================================================
    # SLIDE 12: CONCLUSION & FUTURE SCOPE
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    add_header(slide12, "SLIDE 12 / 12", "Section 11: Conclusion & Roadmap", "Conclusion & Phase 2 Architectural Roadmap")

    add_card(slide12, Inches(0.8), Inches(1.85), Inches(5.7), Inches(4.8),
             "✅ Engineering Deliverables Met",
             [
                 "Full USB-IF HID Specification v1.11 compliance.",
                 "Deterministic sub-28.1 ms end-to-end response time.",
                 "Robust 3D enclosure with optical light pipes and safety switch.",
                 "Delivered 100% on schedule and within budget under IEEE 1016 & IEEE 1063 standards."
             ], border_color=NAVY)

    add_card(slide12, Inches(6.833), Inches(1.85), Inches(5.7), Inches(4.8),
             "🔮 Phase 2 Roadmap",
             [
                 "Hardware-accelerated on-chip video encoding via dedicated DVP camera bus.",
                 "WPA3 Enterprise 802.1X certificate-based mobile authentication.",
                 "BLE 5.0 fallback channel for radio-restricted facilities."
             ], border_color=SKY)

    add_footer(slide12)
    set_speaker_notes(slide12, "In conclusion, this project successfully proves that remote administrative access can be achieved securely from the physical hardware layer without software footprints or firewall vulnerabilities. It fulfills all technical, financial, and safety milestones mandated by the Department of Computer Systems Engineering. Thank you for your time, Mr. Ntume and Dr. Du. I now welcome any questions from the panel.")

    output_path = os.path.abspath("PRESENTATION_SLIDES.pptx")
    prs.save(output_path)
    print(f"SUCCESS: PowerPoint saved to {output_path} (Size: {os.path.getsize(output_path)} bytes)")

if __name__ == "__main__":
    create_presentation()
