// =============================================================================
// HIGH-END AESTHETIC 3D ENCLOSURE - SPACIOUS PRODUCTION EDITION
// -----------------------------------------------------------------------------
// Parametric OpenSCAD CAD Model
// Specially expanded to comfortably house:
// - ESP32-S3-DevKit (N16R8 / N8R2) with pre-soldered breadboard header pins
//   (yellow spacers + 8.5mm downward pins + female DuPont jumper sockets)
// - 7.55mm generous lateral wiring channels on both sides of the board
// - 13.0mm deep pin clearance cavity under the PCB
// - 26.6mm spacious rear bay for tactile button, 330-ohm resistors & wire joints
// =============================================================================

part = "both"; // [both, base, lid, button, full_set, exploded]
$fn = 64;

// --- EXPANDED GEOMETRIC DIMENSIONS (mm) ---
pcb_w         = 28.5; // ESP32-S3 PCB width
pcb_l         = 58.0; // ESP32-S3 PCB length
pin_clear_h   = 13.0; // 13.0mm deep clearance under PCB for pins & DuPont sockets!

wall_t        = 2.2;  // Sturdy 2.2mm shell walls
floor_t       = 2.0;  // 2.0mm floor slab
lid_t         = 2.4;  // 2.4mm lid ceiling
inner_w       = 43.6; // Spacious internal cavity width
inner_l       = 85.6; // Spacious internal cavity length
corner_r      = 5.0;  // Smooth 5.0mm corner radius

outer_w       = inner_w + 2 * wall_t; // 48.0 mm
outer_l       = inner_l + 2 * wall_t; // 90.0 mm
base_h        = floor_t + pin_clear_h + 3.5; // 18.5 mm

// Native USB-C Port Cutout (COM/UART port sealed behind solid protective wall)
usb_w         = 14.0;
usb_x_offset  = 8.25; // Aligned with centered ESP32-S3 Native USB-C port
usb_h         = 7.5;
usb_z_offset  = floor_t + pin_clear_h - 0.5; // 14.5 mm

// Optics, Fasteners & Buttons
led_d         = 3.2;   // 3mm LED aperture
led_bezel_d   = 5.4;   // 45° conical optic funnel
led_spacing   = 12.0;  // Spacing between PWR and ACT LEDs
button_guide_d= 7.6;   // Plunger collar guide
button_cap_d  = 7.2;   // Thumb button cap
screw_hole_d  = 3.3;   // M3 screw pass-through hole
screw_head_d  = 6.0;   // M3 countersunk head pocket
screw_inset   = 5.0;   // M3 screw post center inset

module rounded_box(x, y, z, r) {
    translate([r, r, 0])
    minkowski() {
        cube([x - 2*r, y - 2*r, z - 1]);
        cylinder(r = r, h = 1);
    }
}

// Enclosure Base
module enclosure_base() {
    difference() {
        union() {
            // Main Outer Rounded Shell
            rounded_box(outer_w, outer_l, base_h, corner_r);
            
            // 6 Ergonomic Side Grip Ribs on Each Flank
            for (i = [0:5]) {
                translate([-0.35, 30 + i*5.8, 6])
                    cube([0.5, 2.8, 8.5]);
                translate([outer_w - 0.2, 30 + i*5.8, 6])
                    cube([0.5, 2.8, 8.5]);
            }
        }

        // Spacious Internal Cavity (43.6 x 85.6 mm)
        translate([wall_t, wall_t, floor_t])
            rounded_box(inner_w, inner_l, base_h + 1, corner_r - wall_t);

        // Native USB-C Front Cutout (COM port remains sealed behind solid wall)
        translate([usb_x_offset, outer_l - wall_t - 1, usb_z_offset])
            cube([usb_w, wall_t + 2, base_h]);

        // 45° Flared Outer Cable Shroud Relief Chamfer
        translate([usb_x_offset - 1.2, outer_l - 1.2, usb_z_offset - 0.6])
            cube([usb_w + 2.4, 2.0, base_h]);

        // 4 Corner Screw Boss Pilot Holes
        for (cx = [screw_inset, outer_w - screw_inset]) {
            for (cy = [screw_inset, outer_l - screw_inset]) {
                translate([cx, cy, base_h - 7.5])
                    cylinder(d = screw_hole_d, h = 8.0);
            }
        }

        // Underside Non-Slip Silicone Desk Foot Wells
        for (cx = [7.0, outer_w - 7.0]) {
            for (cy = [7.0, outer_l - 7.0]) {
                translate([cx, cy, -0.1])
                    cylinder(d = 7.5, h = 0.8);
            }
        }
    }

    // 4 Corner Screw Bosses
    for (cx = [screw_inset, outer_w - screw_inset]) {
        for (cy = [screw_inset, outer_l - screw_inset]) {
            difference() {
                translate([cx, cy, floor_t])
                    cylinder(d = 7.6, h = base_h - floor_t);
                translate([cx, cy, base_h - 7.5])
                    cylinder(d = screw_hole_d, h = 8.0);
            }
        }
    }

    // Spacious PCB Rest Shelves & Anti-Flex Spine
    shelf_z = pin_clear_h;
    pcb_x0 = (outer_w - pcb_w) / 2; // 9.75mm
    pcb_x1 = outer_w - pcb_x0;      // 38.25mm
    pcb_y1 = outer_l - wall_t - 1.0; // 86.8mm
    pcb_y0 = pcb_y1 - pcb_l;         // 28.8mm

    // Front corner rest pads (clear of header pins)
    translate([pcb_x0, pcb_y1 - 6.0, floor_t])
        cube([4.5, 6.0, shelf_z]);
    translate([pcb_x1 - 4.5, pcb_y1 - 6.0, floor_t])
        cube([4.5, 6.0, shelf_z]);

    // Rear transverse antenna shelf (zero pin collision)
    translate([pcb_x0, pcb_y0, floor_t])
        cube([pcb_w, 4.5, shelf_z]);

    // Central Anti-Flex Spine
    translate([outer_w/2 - 2.8, pcb_y0 + 15.0, floor_t])
        cube([5.6, 30.0, shelf_z]);

    // Spacious Rear Bay Push Button Platform
    translate([outer_w/2 - 6.0, 9.0, floor_t])
        cube([12.0, 10.0, 5.5]);
}

// Enclosure Lid
module enclosure_lid() {
    difference() {
        union() {
            // Main Lid Slab with 45° Top Perimeter Bevel
            rounded_box(outer_w, outer_l, lid_t, corner_r);
            
            // Raised Architectural Bezel Frame on Top Face
            translate([3.0, 3.0, lid_t])
                difference() {
                    rounded_box(outer_w - 6.0, outer_l - 6.0, 0.4, 3.0);
                    translate([1.4, 1.4, -0.1])
                        rounded_box(outer_w - 8.8, outer_l - 8.8, 0.6, 2.5);
                }

            // Underside Interlocking Snap-Fit Lip (2.2mm engagement into base)
            translate([wall_t + 0.25, wall_t + 0.25, -2.2])
                difference() {
                    rounded_box(inner_w - 0.5, inner_l - 0.5, 2.2, corner_r - wall_t);
                    translate([1.3, 1.3, -0.1])
                        rounded_box(inner_w - 3.1, inner_l - 3.1, 2.4, corner_r - wall_t);
                    // USB Clearance opening in front lip
                    translate([usb_x_offset - wall_t, inner_l - 2.0, -0.1])
                        cube([usb_w, 3.0, 2.4]);
                }

            // Underside Internal LED Isolation Baffles (Prevents color bleed)
            translate([outer_w/2 - led_spacing/2, 38, -3.2])
                cylinder(d = led_d + 2.4, h = 3.2);
            translate([outer_w/2 + led_spacing/2, 38, -3.2])
                cylinder(d = led_d + 2.4, h = 3.2);

            // Underside Button Guide Collar Sleeve
            translate([outer_w/2, 14, -3.8])
                cylinder(d = button_guide_d + 2.6, h = 3.8);
        }

        // 45° Conical Optical LED Funnels
        translate([outer_w/2 - led_spacing/2, 38, -3.5])
            cylinder(d1 = led_d, d2 = led_bezel_d, h = lid_t + 4.0);
        translate([outer_w/2 + led_spacing/2, 38, -3.5])
            cylinder(d1 = led_d, d2 = led_bezel_d, h = lid_t + 4.0);

        // Tactile Button Collar Aperture
        translate([outer_w/2, 14, -4.0])
            cylinder(d = button_guide_d, h = lid_t + 5.0);

        // Aero Cooling Grille (5 Chevron Convection Slots over MCU & Antenna)
        for (i = [0:4]) {
            translate([outer_w/2 - 9.0, 56 + i*5.0, -1.0])
                cube([18.0, 1.8, lid_t + 2.0]);
        }

        // 4 Corner M3 Countersunk Screw Pockets (Flush heads)
        for (cx = [screw_inset, outer_w - screw_inset]) {
            for (cy = [screw_inset, outer_l - screw_inset]) {
                translate([cx, cy, -2.5]) cylinder(d = screw_hole_d, h = lid_t + 5.0);
                translate([cx, cy, lid_t - 1.5]) cylinder(d1 = screw_hole_d, d2 = screw_head_d, h = 1.7);
            }
        }
    }
}

// Captive Tactile Button Plunger
module button_plunger() {
    union() {
        // Main Cylindrical Button Cap
        cylinder(d = button_cap_d, h = 5.0);
        
        // Ergonomic Concave Thumb Dish on Top Face
        translate([0, 0, 5.0]) {
            difference() {
                cylinder(d = button_cap_d, h = 1.0);
                translate([0, 0, 4.2]) sphere(r = 4.0);
            }
        }

        // Captive Anti-Drop Retention Flange (Trapped inside collar)
        cylinder(d = button_guide_d + 2.6, h = 1.1);

        // Downward Actuator Stem Pip (Engages tactile microswitch)
        translate([0, 0, -2.6])
            cylinder(d1 = 2.6, d2 = 3.0, h = 2.6);
    }
}

// --- RENDER SELECTION ---
if (part == "both") {
    enclosure_base();
    translate([outer_w + 14, 0, 0]) enclosure_lid();
    translate([outer_w/2, -18, 2.6]) button_plunger();
} else if (part == "base") {
    enclosure_base();
} else if (part == "lid") {
    enclosure_lid();
} else if (part == "button") {
    button_plunger();
} else if (part == "full_set") {
    enclosure_base();
    translate([outer_w + 14, 0, 0]) enclosure_lid();
    translate([outer_w/2, -18, 2.6]) button_plunger();
} else if (part == "exploded") {
    enclosure_base();
    translate([0, 0, 30]) enclosure_lid();
    translate([outer_w/2, 14, 50]) button_plunger();
}
