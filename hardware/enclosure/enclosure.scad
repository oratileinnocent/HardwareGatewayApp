// =============================================================================
//  CYBERMOUSE GATEWAY — FINAL PRODUCTION EXHIBITION EDITION
//  - Ergonomic Computer Mouse Silhouette with "GATEWAY" Branding
//  - Base with Front-Right USB-C Port Cutout (Symmetric to native port)
//  - Official Geometric TUT Crest on Underside
//  - "HARDWARE GATEWAY" on Left Thumb Grip Flank
//  - Knurled Clickable Mouse Scroll Wheel Plunger
//  - 100% Hollow Interior with 13.0mm Pin Clearance for ESP32-S3
//  Author: Oratile Innocent Tshosetso | Tshwane University of Technology (TUT)
// =============================================================================

part = "both"; // [both, base, lid, button, full_set, exploded]
$fn = 64;

// --- INTERNAL COMPATIBILITY DIMENSIONS (ESP32-S3 fits perfectly) ---
pcb_w         = 28.5;   // ESP32-S3 PCB width
pcb_l         = 58.0;   // ESP32-S3 PCB length
pin_clear_h   = 13.0;   // Downward pin clearance trough

wall_t        = 2.2;
floor_t       = 2.0;
lid_t         = 2.4;
inner_w       = 43.6;
inner_l       = 85.6;
corner_r      = 5.0;

outer_w       = inner_w + 2 * wall_t; // 48.0 mm
outer_l       = inner_l + 2 * wall_t; // 90.0 mm
base_h        = floor_t + pin_clear_h + 3.5; // 18.5 mm

// FRONT WALL USB-C Port (Shifted to the RIGHT side)
usb_w         = 14.0;
usb_h         = 7.5;
usb_x_offset  = outer_w - 8.25 - usb_w; // 25.75 mm (Right side of front face)
usb_z_offset  = floor_t + pin_clear_h - 0.5; // 14.5 mm

screw_hole_d  = 3.3;
screw_inset   = 5.0;

module rounded_box(x, y, z, r) {
    r = max(r, 0.1);
    translate([r, r, 0])
    minkowski() {
        cube([max(x - 2*r, 0.1), max(y - 2*r, 0.1), max(z - 1, 0.1)]);
        cylinder(r = r, h = 1);
    }
}

// =============================================================================
// ENCLOSURE BASE (WITH FRONT-RIGHT USB PORT, TUT LOGO & SIDE BRANDING)
// =============================================================================
module enclosure_base() {
    difference() {
        union() {
            // Main outer mouse-contoured shell
            rounded_box(outer_w, outer_l, base_h, corner_r);

            // Left Wall Ergonomic Thumb Grip Track with Embossed "HARDWARE GATEWAY"
            translate([-0.6, 14.0, 7.5])
            rotate([90, 0, 90])
                linear_extrude(height = 0.8)
                    text("HARDWARE GATEWAY", size = 4.2, font = "Liberation Sans:style=Bold");
        }

        // Inner Cavity (ESP32-S3 Safe Space)
        translate([wall_t, wall_t, floor_t])
            rounded_box(inner_w, inner_l, base_h + 1, corner_r - wall_t);

        // Front Wall USB-C Cutout (Right Side)
        translate([usb_x_offset, outer_l - wall_t - 1, usb_z_offset])
            cube([usb_w, wall_t + 2, base_h]);

        // Flared Outer Cable Shroud Chamfer on Front-Right Port
        translate([usb_x_offset - 1.2, outer_l - 1.2, usb_z_offset - 0.6])
            cube([usb_w + 2.4, 2.0, base_h]);

        // 4 Corner Screw Holes
        for (cx = [screw_inset, outer_w - screw_inset]) {
            for (cy = [screw_inset, outer_l - screw_inset]) {
                translate([cx, cy, base_h - 7.5])
                    cylinder(d = screw_hole_d, h = 8.0);
            }
        }

        // --- UNDERSIDE MOUSE SKATE PADS ---
        translate([8.0, outer_l - 8.5, -0.1]) rounded_box(outer_w - 16.0, 4.5, 0.6, 2.0);
        translate([8.0, 4.0, -0.1])          rounded_box(outer_w - 16.0, 4.5, 0.6, 2.0);
        translate([3.5, 30.0, -0.1])         rounded_box(3.0, 32.0, 0.6, 1.5);
        translate([outer_w - 6.5, 30.0, -0.1]) rounded_box(3.0, 32.0, 0.6, 1.5);

        // --- OFFICIAL GEOMETRIC TUT LOGO UNDER BASE (Z = 0) ---
        translate([outer_w / 2, 50.0, -0.1]) {
            linear_extrude(height = 0.7) {
                // 1. Head circle
                translate([0, 12, 0]) circle(r = 2.2);

                // 2. Top tier book leaves (Red)
                polygon([[-0.7, 8.8], [-4.8, 10.4], [-5.8, 7.8], [-0.7, 6.6]]);
                polygon([[0.7, 8.8], [0.7, 6.6], [5.8, 7.8], [4.8, 10.4]]);

                // 3. Middle tier book leaves (Gold & Blue)
                polygon([[-0.7, 5.8], [-7.5, 7.2], [-8.4, 4.0], [-0.7, 3.0]]);
                polygon([[0.7, 5.8], [0.7, 3.0], [8.4, 4.0], [7.5, 7.2]]);

                // 4. Large horizontal triangle wings
                polygon([[-1.2, 1.2], [-11.2, 4.2], [-11.2, -3.8]]);
                polygon([[1.2, 1.2], [11.2, -3.8], [11.2, 4.2]]);

                // 5. Bottom 3 vertical base pillars
                polygon([[-1.6, -0.5], [1.6, -0.5], [1.6, -10.5], [-1.6, -10.5]]);
                polygon([[-4.8, -1.5], [-2.2, -1.5], [-2.2, -10.0], [-4.8, -8.2]]);
                polygon([[2.2, -1.5], [4.8, -1.5], [4.8, -8.2], [2.2, -10.0]]);

                // 6. Cradling crescent swoosh
                difference() {
                    translate([0, 1.5, 0]) circle(r = 14.5);
                    translate([0, 3.2, 0]) circle(r = 12.8);
                    translate([-20, 5, 0]) square([40, 20]);
                }

                // 7. Text below emblem
                translate([0, -18.5, 0])
                    text("TUT", size = 6.8, halign = "center", valign = "center", font = "Liberation Sans:style=Bold");
                translate([0, -22.0, 0])
                    text("TSHWANE UNIVERSITY", size = 1.6, halign = "center", valign = "center", font = "Liberation Sans:style=Bold");
                translate([0, -25.0, 0])
                    text("OF TECHNOLOGY", size = 1.6, halign = "center", valign = "center", font = "Liberation Sans:style=Bold");
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

    // PCB Rest Shelves & Anti-Flex Spine
    shelf_z = pin_clear_h;
    pcb_x0 = (outer_w - pcb_w) / 2;
    pcb_x1 = outer_w - pcb_x0;
    pcb_y1 = outer_l - wall_t - 1.0;
    pcb_y0 = pcb_y1 - pcb_l;

    translate([pcb_x0, pcb_y1 - 6.0, floor_t]) cube([4.5, 6.0, shelf_z]);
    translate([pcb_x1 - 4.5, pcb_y1 - 6.0, floor_t]) cube([4.5, 6.0, shelf_z]);
    translate([pcb_x0, pcb_y0, floor_t]) cube([pcb_w, 4.5, shelf_z]);
    translate([outer_w/2 - 2.8, pcb_y0 + 15.0, floor_t]) cube([5.6, 30.0, shelf_z]);
    translate([outer_w/2 - 6.0, 9.0, floor_t]) cube([12.0, 10.0, 5.5]);
}

// =============================================================================
// ENCLOSURE LID (MOUSE SHELL WITH "GATEWAY" BRANDING & SCROLL WHEEL)
// =============================================================================
module enclosure_lid() {
    difference() {
        union() {
            rounded_box(outer_w, outer_l, lid_t, corner_r);

            // Ergonomic Palm Rest Hump
            translate([2.5, 4.0, lid_t])
                rounded_box(outer_w - 5.0, outer_l - 8.0, 2.4, corner_r - 1.5);

            translate([5.5, 10.0, lid_t + 2.4])
                rounded_box(outer_w - 11.0, 42.0, 5.0, corner_r - 3.0);

            // Scroll Wheel Housing Collar
            translate([outer_w/2 - 6.0, 54.0, lid_t + 1.0])
                rounded_box(12.0, 16.0, 3.2, 2.5);

            // Underside Snap-Fit Lip (with front-right USB clearance window)
            translate([wall_t + 0.25, wall_t + 0.25, -2.2])
                difference() {
                    rounded_box(inner_w - 0.5, inner_l - 0.5, 2.2, corner_r - wall_t);
                    translate([1.3, 1.3, -0.1])
                        rounded_box(inner_w - 3.1, inner_l - 3.1, 2.4, corner_r - wall_t);
                    // Front-right USB clearance window
                    translate([usb_x_offset - wall_t, inner_l - 2.0, -0.1])
                        cube([usb_w, 3.0, 2.4]);
                }
        }

        // Left & Right Click Button Center Separation Groove
        translate([outer_w/2 - 0.6, 48.0, lid_t + 0.5])
            cube([1.2, outer_l - 48.0, 4.0]);

        // Scroll Wheel Aperture
        translate([outer_w/2 - 4.5, 54.0, -1.0])
            cube([9.0, 16.0, lid_t + 6.0]);

        // Status Indicator LEDs
        translate([outer_w/2 - 6.5, 38.0, -2.0]) cylinder(d = 3.2, h = lid_t + 9.0);
        translate([outer_w/2 + 6.5, 38.0, -2.0]) cylinder(d = 3.2, h = lid_t + 9.0);

        // Aero Cooling Louvers on Palm Rest
        for (i = [0:3]) {
            translate([outer_w/2 - 8.0, 20.0 + i*4.5, lid_t + 1.0])
                cube([16.0, 2.0, 6.0]);
        }

        // Debossed Branding "GATEWAY" on Palm Arch
        translate([outer_w/2, 12.0, lid_t + 7.5 - 0.3])
            linear_extrude(height = 0.8)
                text("GATEWAY", size = 4.2, halign = "center", valign = "center", font = "Liberation Sans:style=Bold");

        // 4 Corner Screw Pockets
        for (cx = [screw_inset, outer_w - screw_inset]) {
            for (cy = [screw_inset, outer_l - screw_inset]) {
                translate([cx, cy, -2.5]) cylinder(d = screw_hole_d, h = lid_t + 6.0);
            }
        }
    }
}

// =============================================================================
// BUTTON PLUNGER (CLICKABLE MOUSE SCROLL WHEEL WITH RUBBER TREADS)
// =============================================================================
module button_plunger() {
    union() {
        translate([0, 0, -2.8]) cylinder(d1 = 2.8, d2 = 3.2, h = 2.8);
        cylinder(d = 10.0, h = 1.2);

        translate([-3.4, -6.0, 1.2])
            rounded_box(6.8, 12.0, 6.0, 2.0);

        for (i = [0:6]) {
            translate([-3.6, -4.5 + i*1.5, 6.5])
                cube([7.2, 0.7, 1.0]);
        }
    }
}

// --- RENDER SELECTION ---
if (part == "both") {
    enclosure_base();
    translate([outer_w + 16, 0, 0]) enclosure_lid();
    translate([outer_w/2, -22, 2.8]) button_plunger();
} else if (part == "base") {
    enclosure_base();
} else if (part == "lid") {
    enclosure_lid();
} else if (part == "button") {
    button_plunger();
} else if (part == "full_set") {
    enclosure_base();
    translate([outer_w + 16, 0, 0]) enclosure_lid();
    translate([outer_w/2, -22, 2.8]) button_plunger();
} else if (part == "exploded") {
    enclosure_base();
    translate([0, 0, 35]) enclosure_lid();
    translate([outer_w/2, 62, 50]) button_plunger();
}
