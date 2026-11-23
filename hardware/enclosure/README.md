# 🖱️ CYBERMOUSE GATEWAY — Final Exhibition Edition
## Hardware-Level USB Remote Access Gateway via ESP32-S3 HID Emulation
**Author:** Oratile Innocent Tshosetso | **Department:** Computer Systems Engineering | **Institution:** Tshwane University of Technology (TUT)

---

## 💎 Features

1. **🖱️ Ergonomic Mouse Form-Factor (As Uploaded):**
   - **Arched Palm Rest:** High-contour palm rest matching your uploaded lid, debossed with **"GATEWAY"** branding.
   - **Click Separation Groove:** Front centerline channel dividing the surface into Left Click and Right Click areas.
   - **Clickable Scroll Wheel:** Tactical mouse wheel button plunger with 7 gripping rubber-tread ribs.
2. **🔌 Base with Front-Right USB-C Port Cutout:**
   - Cutout is located on the **front wall shifted to the right side** ($X = 25.75 \rightarrow 39.75\text{ mm}$), directly aligning with the second USB-C port of the ESP32-S3.
   - Flared $45^\circ$ lead-in bevel on the front for easy cable insertion.
3. **🏛️ Official TUT University Emblem (Underside $Z = 0$):**
   - Solid head circle at top.
   - 3 tiers of radiating book leaves/chevrons.
   - Wide horizontal triangular wings.
   - 3 vertical faceted book base pillars.
   - Smooth sweeping cradling crescent swoosh with sharp needle tips.
   - Debossed **"TUT"**, **"TSHWANE UNIVERSITY"**, and **"OF TECHNOLOGY"**.
4. **🏷️ Side Branding:**
   - Embossed **"HARDWARE GATEWAY"** along the left thumb grip groove.
5. **🛼 4 Underbody Mouse Skates:**
   - Front, rear, and lateral PTFE glide pads recessed into the base floor.

---

## 📁 3D Printable STL Files

| File | Size | Triangles | Description |
| :--- | :--- | :--- | :--- |
| **[`enclosure_full_set.stl`](file:///c:/Users/orati/hardware_gateway_app/hardware/enclosure/enclosure_full_set.stl)** ⭐ | **399 KB** | **8,160** | **Complete 3-in-1 print platter** (Base with front-right USB, Mouse Lid with "GATEWAY", and Scroll Wheel Plunger) |
| **[`enclosure_base.stl`](file:///c:/Users/orati/hardware_gateway_app/hardware/enclosure/enclosure_base.stl)** | **239 KB** | **4,884** | Base with front-right USB-C port, TUT crest, and side text |
| **[`enclosure_lid.stl`](file:///c:/Users/orati/hardware_gateway_app/hardware/enclosure/enclosure_lid.stl)** | **140 KB** | **2,860** | Mouse lid matching your uploaded model with **"GATEWAY"** text |
| **[`button_plunger.stl`](file:///c:/Users/orati/hardware_gateway_app/hardware/enclosure/button_plunger.stl)** | **20 KB** | **416** | Clickable scroll wheel button |
| **[`enclosure.scad`](file:///c:/Users/orati/hardware_gateway_app/hardware/enclosure/enclosure.scad)** | — | — | Parametric OpenSCAD source code |

---

## 🖨️ PrusaSlicer Settings

- **Layer Height:** `0.16 mm` (or `0.12 mm` for sharpest emblem and text detail)
- **Perimeters / Wall Loops:** `4`
- **Infill:** `15% - 20%` Gyroid
- **Supports:** **None required!**
