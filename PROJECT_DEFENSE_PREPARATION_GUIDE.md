# TSHWANE UNIVERSITY OF TECHNOLOGY
## FACULTY OF INFORMATION AND COMMUNICATION TECHNOLOGY
### NATIONAL DIPLOMA: COMPUTER SYSTEMS ENGINEERING
### PROJECT DESIGN III: PJD 301B / IDC30BI

---

# ORAL DEFENSE & PRESENTATION PREPARATION GUIDE
### High-Probability Panel Questions &bull; Spoken English Answers &bull; Technical Cheat Sheet

| Parameter | Details |
| :--- | :--- |
| **PROJECT TITLE** | **Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation** |
| **STUDENT NAME** | Oratile Innocent Tshosetso |
| **STUDENT NUMBER** | 222883253 |
| **EXAMINERS / LECTURERS** | Muwanguzi Mark Ntume & Chunling Du |
| **ACADEMIC YEAR** | 2026 (Final Deliverable) |

---

## 1. The 2-Minute Opening Pitch (Spoken Speech Script)

> *"Good morning Mr. Ntume, Dr. Du, and esteemed examiners. My name is Oratile Innocent Tshosetso (Student Number: 222883253).*  
>  
> *Today I present my final project: the **Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation**.*  
>  
> *In modern IT administration, data centers, and industrial SCADA facilities, traditional remote desktop tools like TeamViewer or AnyDesk cannot be used because host security policies strictly prohibit unauthorized software installations, open firewall ports, and external internet connectivity.*  
>  
> *My project solves this by moving remote control from software down to the **physical hardware layer**. When plugged into a target PC, the ESP32-S3 microcontroller natively enumerates as a driverless USB Composite Human Interface Device (standard mouse and keyboard). It broadcasts an isolated Wi-Fi Access Point (`ESP32-Gateway`) that connects to a mobile smartphone over full-duplex WebSockets.*  
>  
> *Touch gestures and keystrokes from the smartphone are translated into hardware USB signals with an end-to-end response time under **28.1 milliseconds**. The system costs only **R645.00** to construct, leaves zero software footprint on the target computer, and includes an active hardware RF kill-switch for immediate physical safety cutoff.*  
>  
> *I am prepared to demonstrate the device and answer any questions from the panel."*

---

## 2. Section I: Project Proposal & Motivation Q&A

### Q1: Why did you build a hardware device when software tools like TeamViewer, AnyDesk, or RDP already exist?
* **Panel Intent:** Testing whether you understand the genuine engineering problem versus existing market software.
* **Spoken Answer:**  
  *"Sir, existing software tools require three things that are strictly banned in high-security, banking, and air-gapped environments:  
  1. They require host administrator permissions to install agent software,  
  2. they require open incoming firewall ports, and  
  3. they require external internet connectivity.  
  My device works from the **hardware layer**. It requires **zero software and zero drivers** on the target computer. The operating system accepts it immediately as a standard, physical plug-and-play USB mouse and keyboard, leaving no logs, background services, or registry traces behind."*

### Q2: Who is the target market for this device and where will it be deployed?
* **Panel Intent:** Verifying real-world industrial and commercial relevance as required by IDC30BI curriculum.
* **Spoken Answer:**  
  *"The primary target markets are:  
  1. **Data Center Technicians:** It eliminates the need to push heavy KVM crash carts (bulky monitors and keyboards) through cramped server aisles.  
  2. **Industrial SCADA & Field Engineers:** Working on locked-down industrial PLCs and consoles where software installation is forbidden.  
  3. **Accessibility Users:** Allowing users with motor impairments to control standard desktop workstations via mobile touchscreens."*

### Q3: Did you manage to stay within your proposed R645.00 budget and project timetable?
* **Panel Intent:** Evaluating project engineering management, procurement diligence, and risk mitigation.
* **Spoken Answer:**  
  *"Yes, ma'am. The total expenditure strictly adhered to the R645.00 budget. All components were procured locally from Micro Robotics and Communica to eliminate customs lead times:  
  * Dual ESP32-S3 boards (with 1 hardware redundancy unit): R370.00  
  * Tactile switches, resistors, and status LEDs: R25.00  
  * Prototyping breadboard and jumper wires: R85.00  
  * Custom 3D-printed enclosure fabrication: R120.00  
  All 4 phases—from September breadboard prototyping to November testing and documentation—were delivered on schedule."*

### Q4: What technical features were intentionally declared out of scope?
* **Panel Intent:** Checking boundary management and realistic technical scope definition.
* **Spoken Answer:**  
  *"In the project proposal, I specifically demarcated direct video capture hardware (like on-board HDMI capture) and Bluetooth audio as out of scope. Including heavy video encoding directly on the microcontroller would saturate the 2.4 GHz radio and cause touch latency jitter. Keeping the embedded dongle focused purely on low-latency USB HID input ensured deterministic sub-30ms performance."*

---

## 3. Section II: Technical Design & Architecture Q&A (IEEE 1016)

### Q5: Why did you select the ESP32-S3 chip rather than a classic ESP32, ESP8266, or Arduino?
* **Panel Intent:** The #1 technical question. They want to verify that you know microcontroller peripherals.
* **Spoken Answer:**  
  *"The classic ESP32, ESP8266, and Arduino Uno do not have an on-die USB OTG physical transceiver. Their USB ports are connected to an external USB-to-UART bridge (like CH340 or CP2102) which can only transmit serial text and cannot emulate USB HID hardware.  
  The **ESP32-S3** features an integrated Full-Speed USB 2.0 OTG peripheral with native physical differential lines (**GPIO 19 for D-** and **GPIO 20 for D+**). This internal hardware allows the microcontroller itself to act directly as a true USB device running the TinyUSB stack."*

### Q6: How does the host operating system recognize your device without driver installation?
* **Panel Intent:** Testing knowledge of USB-IF industry standards and descriptor architecture.
* **Spoken Answer:**  
  *"The device complies with the **USB-IF HID Specification v1.11**. Modern operating systems (Windows, macOS, Linux) have native class drivers pre-installed for HID devices. During USB bus enumeration, the ESP32-S3 presents a **Composite HID Descriptor** containing two collections:  
  * A **4-byte Mouse Report:** Byte 0 for button bitmask (Left, Right, Middle), Bytes 1 & 2 for signed X/Y relative deltas, Byte 3 for scroll wheel.  
  * An **8-byte Keyboard Report:** Byte 0 for modifiers (Ctrl, Shift, Alt, GUI), Byte 1 reserved, Bytes 2–7 for standard 6-key rollover keycodes.  
  The host OS accepts these reports natively without third-party drivers."*

### Q7: How is the dual-core architecture of the ESP32-S3 utilized in FreeRTOS?
* **Panel Intent:** Assessing multithreaded embedded software design and real-time computing principles.
* **Spoken Answer:**  
  *"I decoupled the system into two independent FreeRTOS pipelines running on separate Xtensa LX7 cores:  
  * **Core 0 (Networking & Protocol):** Runs the LwIP TCP/IP stack, manages the 802.11 b/g/n SoftAP, handles client WebSocket connections on Port 80, and parses incoming JSON packets.  
  * **Core 1 (Hardware Execution):** Reads decoded input events from an atomic, thread-safe circular ring buffer and writes formatted HID reports directly into the physical USB hardware endpoint FIFO.  
  This core isolation prevents Wi-Fi beacon processing or network bursts on Core 0 from stalling or jittering the 125 Hz USB polling schedule on Core 1."*

### Q8: How did you calculate and verify the total system latency of 28.1 milliseconds?
* **Panel Intent:** Mathematical and empirical verification of real-time performance claims.
* **Spoken Answer:**  
  *"The end-to-end latency is the cumulative sum of four discrete hardware and software stages:  
  $$T_{\text{total}} = T_{\text{touch}} + T_{\text{ws}} + T_{\text{esp}} + T_{\text{usb}}$$  
  1. **Mobile Digitizer Sampling ($T_{\text{touch}}$):** ~16.6 ms (operating at standard 60 Hz touch polling).  
  2. **Wi-Fi WebSocket Transit ($T_{\text{ws}}$):** ~4.0 to 7.0 ms over local peer-to-peer 2.4 GHz SoftAP.  
  3. **ESP32 JSON Deserialization ($T_{\text{esp}}$):** <0.5 ms using ArduinoJson zero-copy memory buffers.  
  4. **Host USB Polling Interval ($T_{\text{usb}}$):** 8.0 ms (standard 125 Hz USB HID poll rate).  
  Summing these gives approximately **28.1 ms**, well below the 50 ms human perceptual lag threshold."*

### Q9: Explain the touch velocity formula: $V = \alpha \cdot (\Delta D)^{1.2}$.
* **Panel Intent:** Checking mathematical modeling and ergonomics of the touch tracking engine.
* **Spoken Answer:**  
  *"Linear 1-to-1 touch mapping creates a tradeoff: cursor movement is either too sluggish across large desktop displays or too jittery for clicking small icons. I implemented a non-linear velocity curve where:  
  * $\Delta D$ represents physical touch vector displacement.  
  * The exponent $1.2$ suppresses micro-tremors during fine movements while scaling exponentially during rapid swipes.  
  * $\alpha$ is the sensitivity multiplier adjusted by the user in the mobile app ($0.4\times$ to $2.5\times$)."*

### Q10: Is this device a security vulnerability, like a Rubber Ducky (BadUSB)?
* **Panel Intent:** Ethical engineering, cybersecurity governance, and defense mechanisms.
* **Spoken Answer:**  
  *"No, sir. A Rubber Ducky is an autonomous penetration-testing tool designed to inject pre-scripted malicious payloads the millisecond it is inserted. My gateway is strictly an **interactive human administrative bridge**:  
  1. **No Autonomous Payloads:** It contains zero autorun scripts; it only transmits commands actively initiated by a human operator.  
  2. **Physical Proximity Requirement:** It operates strictly over local SoftAP within a 10–15 meter radius.  
  3. **Hardware RF Kill-Switch:** A physical push-button directly halts all radio transmissions in under 2 ms if unauthorized access is suspected."*

### Q11: How does the hardware RF kill-switch function electrically and logically?
* **Panel Intent:** Verifying low-level interrupt handling and fail-safe design.
* **Spoken Answer:**  
  *"The kill-switch is a tactile push-button wired to **GPIO 14** configured with an internal pull-up resistor. Pressing the button pulls the pin to ground (active-low), triggering a falling-edge hardware Interrupt Service Routine (ISR). Rather than waiting for a software polling cycle, the ISR invokes `esp_wifi_stop()` immediately, terminating RF broadcasting in **under 2 ms** while maintaining USB bus enumeration."*

---

## 4. Section III: User Manual & Troubleshooting Q&A (IEEE 1063)

### Q12: Walk the panel through the exact initiation and operational procedure.
* **Panel Intent:** Evaluating operational usability and user manual adherence.
* **Spoken Answer:**  
  *"Operation requires three straightforward steps:  
  1. **Hardware Insertion:** Plug the ESP32-S3 dongle into the host PC USB port. The PC immediately enumerates the HID collections.  
  2. **Wireless Association:** Connect the smartphone to the Wi-Fi SSID `ESP32-Gateway` (Passphrase: `Password123`).  
  3. **Launch Client:** Open the `Hardware Gateway` mobile application. The status indicator displays `ESP32: Connected`, and the operator can immediately navigate the mouse, double-tap, right-click, and input text."*

### Q13: What diagnostic feedback do the two LEDs on the enclosure provide?
* **Panel Intent:** Checking hardware diagnostics and human-machine interface (HMI) design.
* **Spoken Answer:**  
  *"The enclosure incorporates two isolated LEDs channeled through 3.2 mm light pipes:  
  * **Blue LED (GPIO 5):** Indicates Wi-Fi state. It flashes slowly at 1 Hz when the SoftAP is idle, and switches to solid illumination once a mobile client establishes a WebSocket handshake.  
  * **Amber LED (GPIO 4):** Indicates USB HID bus activity. It strobes momentarily whenever an active mouse delta or keyboard report is injected into the host PC."*

### Q14: What does it mean if the mobile app displays 'Screen Offline', and does input stop?
* **Panel Intent:** Understanding system modularity and graceful degradation.
* **Spoken Answer:**  
  *"Mouse and keyboard control continue to operate with 100% functionality. The visual screen feed is an optional companion feature. `Screen Offline` simply indicates that the companion Python screen capture daemon (`HardwareGatewayStream.py`) is not running on the target PC or port 8765 is blocked by Windows Defender. Launching the daemon restores the video feed without affecting HID control."*

### Q15: What fail-safe measures prevent repeated keys if the phone disconnects mid-keystroke?
* **Panel Intent:** Verifying fault tolerance, recovery procedures, and software reliability.
* **Spoken Answer:**  
  *"The system incorporates three layers of fail-safe protection:  
  1. **Explicit Release Events:** The client software transmits distinct `key_down` and `key_up` packets.  
  2. **Buffer Flush on Disconnect:** If the WebSocket connection drops unexpectedly, the Core 1 HID task automatically clears the keyboard report buffer to all zeros to prevent key-repeat loops.  
  3. **Hardware Watchdog Timer (WDT):** The ESP32-S3 hardware watchdog is configured with a 3.0-second timeout to reset the chip automatically in case of execution deadlock."*

### Q16: Describe the design and fabrication specifications of the 3D-printed enclosure.
* **Panel Intent:** Checking mechanical integration, CAD modeling, and manufacturing standards.
* **Spoken Answer:**  
  *"The enclosure was modeled in OpenSCAD and 3D printed using durable PETG filament with a 0.16 mm layer height and 20% Gyroid infill. Its mechanical features include:  
  * A front beveled port cutout (14 mm &times; 6.5 mm) providing clearance for standard USB-C cables.  
  * Dual internal 3.2 mm isolation light pipe sleeves that prevent optical bleed between the Blue and Amber LEDs.  
  * A captive flange guide channel holding the ergonomic 7.2 mm tactile plunger button to reliably actuate the kill-switch."*

---

## 5. Summary Technical Memory Sheet

| Parameter / Component | Technical Specification | Engineering Purpose |
| :--- | :--- | :--- |
| **Microcontroller Unit (MCU)** | ESP32-S3-WROOM-1 (Xtensa LX7 Dual-Core @ 240 MHz) | Dual-core isolation: Core 0 (Wi-Fi/WS), Core 1 (USB HID) |
| **USB OTG Physical Pins** | **GPIO 19** (D-) & **GPIO 20** (D+) | Direct Full-Speed USB differential data connection to host |
| **Hardware Kill-Switch** | **GPIO 14** (Active-Low Hardware ISR) | Calls `esp_wifi_stop()` in <2 ms to cut all RF broadcasting |
| **Wi-Fi Status LED** | **GPIO 5** (Blue LED with 330 &Omega; resistor) | Blinks at 1 Hz when idle; solid when mobile client connects |
| **HID Activity LED** | **GPIO 4** (Amber LED with 330 &Omega; resistor) | Strobes during active USB mouse or keyboard report injection |
| **Total System Latency** | **28.1 ms** (Cumulative end-to-end) | 16.6ms touch + 4.5ms WS + 0.5ms decode + 8.0ms USB poll |
| **Wireless SoftAP Config** | SSID: `ESP32-Gateway`, TCP Port 80 | Local isolated 802.11 b/g/n WebSocket channel (RFC 6455) |
| **Host Screen Streamer** | Python 3 Asyncio WebSocket, Port 8765 | Optional companion daemon for remote JPEG frame streaming |
| **Total Project Cost** | **R 645.00 ZAR** | Strict compliance with proposed procurement budget |
| **Standards Followed** | IEEE 1016 (Design), IEEE 1063 (Manual), USB-IF v1.11 | Formal academic compliance for TUT National Diploma |

---

## 6. Presentation Day Protocol & Tactical Advice

### Live Demonstration Strategy (The 30-Second Rule):
1. **Connect & Confirm:** Plug the dongle into your laptop. Show the Blue LED turn solid when your phone connects, and the status pill in the Flutter app turn green (`ESP32: Connected`).
2. **Demonstrate Velocity & Typing:** Move the cursor across the screen smoothly, open Notepad, and type a quick sentence using the mobile virtual keyboard.
3. **Actuate the Kill-Switch:** Press the physical push-button on the enclosure. Point out that the phone immediately disconnects and the Blue LED turns off—proving physical air-gap security works in real-time.

### How to Handle Difficult Questions:
If asked something outside your immediate scope, do not panic or say *"I don't know"*. Use this professional phrasing:  
> **"That is an excellent engineering consideration, Mr. Ntume / Dr. Du. In this prototype, our primary objective under IEEE 1016 was guaranteeing deterministic sub-30ms input latency and physical air-gap safety. That proposed feature represents an ideal architectural milestone for Phase 2 implementation."**
