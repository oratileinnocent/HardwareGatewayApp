/**
 * =============================================================================
 *   CYBERMOUSE GATEWAY — FINAL PRODUCTION EXHIBITION EDITION
 *   - Ergonomic Computer Mouse Lid with "GATEWAY" Branding
 *   - Base with Front-Right USB-C Port Cutout (Symmetric to native port)
 *   - Official Geometric TUT Crest on Underside
 *   - "HARDWARE GATEWAY" on Left Thumb Grip Flank
 *   - Knurled Clickable Mouse Scroll Wheel Plunger
 *   - 100% Hollow Interior with 13.0mm Pin Clearance for ESP32-S3
 * =============================================================================
 */

'use strict';
const fs = require('fs');
const path = require('path');

class StlBuilder {
  constructor(name = 'mesh') {
    this.name = name;
    this.triangles = [];
  }

  _normal(v1, v2, v3) {
    const ax = v2[0] - v1[0], ay = v2[1] - v1[1], az = v2[2] - v1[2];
    const bx = v3[0] - v1[0], by = v3[1] - v1[1], bz = v3[2] - v1[2];
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    return len > 1e-9 ? [nx / len, ny / len, nz / len] : [0, 0, 1];
  }

  tri(v1, v2, v3) {
    this.triangles.push({ normal: this._normal(v1, v2, v3), v1, v2, v3 });
  }

  quad(v1, v2, v3, v4) {
    this.tri(v1, v2, v3);
    this.tri(v1, v3, v4);
  }

  box(x0, y0, z0, x1, y1, z1) {
    // bottom
    this.quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]);
    // top
    this.quad([x0, y1, z1], [x1, y1, z1], [x1, y0, z1], [x0, y0, z1]);
    // 4 sides
    this.quad([x0, y0, z0], [x0, y0, z1], [x1, y0, z1], [x1, y0, z0]);
    this.quad([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]);
    this.quad([x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [x0, y1, z0]);
    this.quad([x0, y1, z0], [x0, y1, z1], [x0, y0, z1], [x0, y0, z0]);
  }

  cylinder(cx, cy, r, z0, z1, n = 32, capped = true) {
    this.coneFrustum(cx, cy, r, r, z0, z1, n, capped);
  }

  coneFrustum(cx, cy, r0, r1, z0, z1, n = 32, capped = true) {
    const ring0 = [], ring1 = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      ring0.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), z0]);
      ring1.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1]);
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      this.quad(ring0[i], ring1[i], ring1[j], ring0[j]);
    }
    if (capped) {
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        this.tri([cx, cy, z0], ring0[j], ring0[i]);
        this.tri([cx, cy, z1], ring1[i], ring1[j]);
      }
    }
  }

  hollowCyl(cx, cy, rOut, rIn, z0, z1, n = 28) {
    const o0 = [], o1 = [], i0 = [], i1 = [];
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      o0.push([cx + rOut * Math.cos(a), cy + rOut * Math.sin(a), z0]);
      o1.push([cx + rOut * Math.cos(a), cy + rOut * Math.sin(a), z1]);
      i0.push([cx + rIn * Math.cos(a), cy + rIn * Math.sin(a), z0]);
      i1.push([cx + rIn * Math.cos(a), cy + rIn * Math.sin(a), z1]);
    }
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n;
      this.quad(o0[k], o1[k], o1[j], o0[j]);
      this.quad(i0[j], i1[j], i1[k], i0[k]);
      this.quad(o0[k], o0[j], i0[j], i0[k]);
      this.quad(i1[k], i1[j], o1[j], o1[k]);
    }
  }

  _roundRectPts(x0, y0, x1, y1, r, n = 8) {
    r = Math.min(r, (x1 - x0) / 2 - 0.01, (y1 - y0) / 2 - 0.01);
    if (r < 0.01) r = 0.01;
    const corners = [
      { cx: x1 - r, cy: y1 - r, s: 0, e: Math.PI / 2 },
      { cx: x0 + r, cy: y1 - r, s: Math.PI / 2, e: Math.PI },
      { cx: x0 + r, cy: y0 + r, s: Math.PI, e: Math.PI * 1.5 },
      { cx: x1 - r, cy: y0 + r, s: Math.PI * 1.5, e: Math.PI * 2 },
    ];
    const pts = [];
    for (const c of corners) {
      for (let i = 0; i < n; i++) {
        const a = c.s + (i / n) * (c.e - c.s);
        pts.push([c.cx + r * Math.cos(a), c.cy + r * Math.sin(a)]);
      }
    }
    return pts;
  }

  roundedBox(x0, y0, x1, y1, z0, z1, r, n = 8) {
    r = Math.min(r, (x1 - x0) / 2 - 0.01, (y1 - y0) / 2 - 0.01);
    if (r < 0.01) r = 0.01;
    const pts = this._roundRectPts(x0, y0, x1, y1, r, n);
    const m = pts.length;
    const cB = [(x0 + x1) / 2, (y0 + y1) / 2, z0];
    const cT = [(x0 + x1) / 2, (y0 + y1) / 2, z1];
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m;
      this.tri(cB, [pts[j][0], pts[j][1], z0], [pts[i][0], pts[i][1], z0]);
      this.tri(cT, [pts[i][0], pts[i][1], z1], [pts[j][0], pts[j][1], z1]);
      this.quad([pts[i][0], pts[i][1], z0], [pts[i][0], pts[i][1], z1], [pts[j][0], pts[j][1], z1], [pts[j][0], pts[j][1], z0]);
    }
  }

  loftRR(x0A, y0A, x1A, y1A, zA, rA, x0B, y0B, x1B, y1B, zB, rB, n = 8, capBot = false, capTop = false) {
    const pA = this._roundRectPts(x0A, y0A, x1A, y1A, rA, n);
    const pB = this._roundRectPts(x0B, y0B, x1B, y1B, rB, n);
    const m = pA.length;
    if (capBot) {
      const c = [(x0A + x1A) / 2, (y0A + y1A) / 2, zA];
      for (let i = 0; i < m; i++) {
        const j = (i + 1) % m;
        this.tri(c, [pA[j][0], pA[j][1], zA], [pA[i][0], pA[i][1], zA]);
      }
    }
    if (capTop) {
      const c = [(x0B + x1B) / 2, (y0B + y1B) / 2, zB];
      for (let i = 0; i < m; i++) {
        const j = (i + 1) % m;
        this.tri(c, [pB[i][0], pB[i][1], zB], [pB[j][0], pB[j][1], zB]);
      }
    }
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m;
      this.quad([pA[i][0], pA[i][0 + 1], zA], [pB[i][0], pB[i][0 + 1], zB], [pB[j][0], pB[j][0 + 1], zB], [pA[j][0], pA[j][0 + 1], zA]);
    }
  }

  addPolygonPrism(pts, z0, z1) {
    const m = pts.length;
    if (m < 3) return;
    let cx = 0, cy = 0;
    for (const p of pts) { cx += p[0]; cy += p[1]; }
    cx /= m; cy /= m;

    const cBot = [cx, cy, z0];
    const cTop = [cx, cy, z1];

    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m;
      this.tri(cBot, [pts[j][0], pts[j][1], z0], [pts[i][0], pts[i][1], z0]);
      this.tri(cTop, [pts[i][0], pts[i][1], z1], [pts[j][0], pts[j][1], z1]);
      this.quad([pts[i][0], pts[i][1], z0], [pts[i][0], pts[i][1], z1],
                [pts[j][0], pts[j][1], z1], [pts[j][0], pts[j][1], z0]);
    }
  }

  stroke(x0, y0, x1, y1, t, z0, z1) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-4) return;
    const ht = t / 2, px = -dy / len * ht, py = dx / len * ht;
    const p1 = [x0 + px, y0 + py], p2 = [x1 + px, y1 + py], p3 = [x1 - px, y1 - py], p4 = [x0 - px, y0 - py];
    this.quad([p1[0], p1[1], z0], [p2[0], p2[1], z0], [p3[0], p3[1], z0], [p4[0], p4[1], z0]);
    this.quad([p4[0], p4[1], z1], [p3[0], p3[1], z1], [p2[0], p2[1], z1], [p1[0], p1[1], z1]);
    this.quad([p1[0], p1[1], z0], [p1[0], p1[1], z1], [p2[0], p2[1], z1], [p2[0], p2[1], z0]);
    this.quad([p2[0], p2[1], z0], [p2[0], p2[1], z1], [p3[0], p3[1], z1], [p3[0], p3[1], z0]);
    this.quad([p3[0], p3[1], z0], [p3[0], p3[1], z1], [p4[0], p4[1], z1], [p4[0], p4[1], z0]);
    this.quad([p4[0], p4[1], z0], [p4[0], p4[1], z1], [p1[0], p1[1], z1], [p1[0], p1[1], z0]);
  }

  strokeYZ(fixedX, y0, z0, y1, z1, t, xThickness) {
    const dy = y1 - y0, dz = z1 - z0, len = Math.sqrt(dy * dy + dz * dz);
    if (len < 1e-4) return;
    const ht = t / 2, py = -dz / len * ht, pz = dy / len * ht;
    const p1 = [y0 + py, z0 + pz], p2 = [y1 + py, z1 + pz], p3 = [y1 - py, z1 - pz], p4 = [y0 - py, z0 - pz];
    const x0 = fixedX, x1 = fixedX + xThickness;
    this.quad([x1, p1[0], p1[1]], [x1, p2[0], p2[1]], [x1, p3[0], p3[1]], [x1, p4[0], p4[1]]);
    this.quad([x0, p4[0], p4[1]], [x0, p3[0], p3[1]], [x0, p2[0], p2[1]], [x0, p1[0], p1[1]]);
    this.quad([x0, p1[0], p1[1]], [x1, p1[0], p1[1]], [x1, p2[0], p2[1]], [x0, p2[0], p2[1]]);
    this.quad([x0, p2[0], p2[1]], [x1, p2[0], p2[1]], [x1, p3[0], p3[1]], [x0, p3[0], p3[1]]);
    this.quad([x0, p3[0], p3[1]], [x1, p3[0], p3[1]], [x1, p4[0], p4[1]], [x0, p4[0], p4[1]]);
    this.quad([x0, p4[0], p4[1]], [x1, p4[0], p4[1]], [x1, p1[0], p1[1]], [x0, p1[0], p1[1]]);
  }

  drawText(text, startX, startY, cW, cH, sT, z0, z1, sp = 1.2) {
    let x = startX;
    for (const ch of text.toUpperCase()) {
      const s = (a, b, c, d) => this.stroke(x + a * cW, startY + b * cH, x + c * cW, startY + d * cH, sT, z0, z1);
      switch (ch) {
        case 'G': s(1, 1, 0, 1); s(0, 1, 0, 0); s(0, 0, 1, 0); s(1, 0, 1, .5); s(.5, .5, 1, .5); break;
        case 'A': s(0, 0, .5, 1); s(.5, 1, 1, 0); s(.25, .4, .75, .4); break;
        case 'T': s(0, 1, 1, 1); s(.5, 1, .5, 0); break;
        case 'E': s(0, 0, 0, 1); s(0, 1, 1, 1); s(0, .5, .8, .5); s(0, 0, 1, 0); break;
        case 'W': s(0, 1, .25, 0); s(.25, 0, .5, .55); s(.5, .55, .75, 0); s(.75, 0, 1, 1); break;
        case 'Y': s(0, 1, .5, .5); s(1, 1, .5, .5); s(.5, .5, .5, 0); break;
        case 'H': s(0, 0, 0, 1); s(1, 0, 1, 1); s(0, .5, 1, .5); break;
        case 'R': s(0, 0, 0, 1); s(0, 1, 1, 1); s(1, 1, 1, .5); s(1, .5, 0, .5); s(.2, .5, 1, 0); break;
        case 'D': s(0, 0, 0, 1); s(0, 1, .7, 1); s(.7, 1, 1, .7); s(1, .7, 1, .3); s(1, .3, .7, 0); s(.7, 0, 0, 0); break;
        case 'U': s(0, 1, 0, 0); s(0, 0, 1, 0); s(1, 0, 1, 1); break;
        case 'S': s(1, 1, 0, 1); s(0, 1, 0, .5); s(0, .5, 1, .5); s(1, .5, 1, 0); s(1, 0, 0, 0); break;
        case 'C': s(1, 1, 0, 1); s(0, 1, 0, 0); s(0, 0, 1, 0); break;
        case 'O': s(0, 0, 0, 1); s(0, 1, 1, 1); s(1, 1, 1, 0); s(1, 0, 0, 0); break;
        case 'M': s(0, 0, 0, 1); s(0, 1, .5, .5); s(.5, .5, 1, 1); s(1, 1, 1, 0); break;
        case 'P': s(0, 0, 0, 1); s(0, 1, 1, 1); s(1, 1, 1, .5); s(1, .5, 0, .5); break;
        case 'N': s(0, 0, 0, 1); s(0, 1, 1, 0); s(1, 0, 1, 1); break;
        case 'I': s(.5, 0, .5, 1); s(0, 0, 1, 0); s(0, 1, 1, 1); break;
        case 'V': s(0, 1, .5, 0); s(.5, 0, 1, 1); break;
        case 'L': s(0, 1, 0, 0); s(0, 0, 1, 0); break;
        case 'F': s(0, 0, 0, 1); s(0, 1, 1, 1); s(0, .5, .8, .5); break;
        default: break;
      }
      x += cW + sp;
    }
  }

  drawTextSideYZ(text, fixedX, startY, startZ, cY, cZ, sT, xThickness, sp = 1.0) {
    let y = startY;
    for (const ch of text.toUpperCase()) {
      const s = (a, b, c, d) => this.strokeYZ(fixedX, y + a * cY, startZ + b * cZ, y + c * cY, startZ + d * cZ, sT, xThickness);
      switch (ch) {
        case 'H': s(0, 0, 0, 1); s(1, 0, 1, 1); s(0, .5, 1, .5); break;
        case 'A': s(0, 0, .5, 1); s(.5, 1, 1, 0); s(.25, .4, .75, .4); break;
        case 'R': s(0, 0, 0, 1); s(0, 1, 1, 1); s(1, 1, 1, .5); s(1, .5, 0, .5); s(.2, .5, 1, 0); break;
        case 'D': s(0, 0, 0, 1); s(0, 1, .7, 1); s(.7, 1, 1, .7); s(1, .7, 1, .3); s(1, .3, .7, 0); s(.7, 0, 0, 0); break;
        case 'W': s(0, 1, .25, 0); s(.25, 0, .5, .55); s(.5, .55, .75, 0); s(.75, 0, 1, 1); break;
        case 'G': s(1, 1, 0, 1); s(0, 1, 0, 0); s(0, 0, 1, 0); s(1, 0, 1, .5); s(.5, .5, 1, .5); break;
        case 'T': s(0, 1, 1, 1); s(.5, 1, .5, 0); break;
        case 'E': s(0, 0, 0, 1); s(0, 1, 1, 1); s(0, .5, .8, .5); s(0, 0, 1, 0); break;
        case 'Y': s(0, 1, .5, .5); s(1, 1, .5, .5); s(.5, .5, .5, 0); break;
        default: break;
      }
      y += cY + sp;
    }
  }

  translate(dx, dy, dz) {
    for (const t of this.triangles) {
      for (const k of ['v1', 'v2', 'v3']) {
        t[k] = [t[k][0] + dx, t[k][1] + dy, t[k][2] + dz];
      }
    }
  }

  merge(other) {
    for (const t of other.triangles) {
      this.triangles.push({ normal: [...t.normal], v1: [...t.v1], v2: [...t.v2], v3: [...t.v3] });
    }
  }

  clone() {
    const c = new StlBuilder(this.name);
    for (const t of this.triangles) {
      c.triangles.push({ normal: [...t.normal], v1: [...t.v1], v2: [...t.v2], v3: [...t.v3] });
    }
    return c;
  }

  toBuffer() {
    const n = this.triangles.length;
    const buf = Buffer.alloc(84 + n * 50);
    buf.write(`CYBERMOUSE GATEWAY - ${this.name}`.padEnd(80, ' '), 0, 80, 'ascii');
    buf.writeUInt32LE(n, 80);
    let off = 84;
    for (const t of this.triangles) {
      buf.writeFloatLE(t.normal[0], off);
      buf.writeFloatLE(t.normal[1], off + 4);
      buf.writeFloatLE(t.normal[2], off + 8);
      buf.writeFloatLE(t.v1[0], off + 12);
      buf.writeFloatLE(t.v1[1], off + 16);
      buf.writeFloatLE(t.v1[2], off + 20);
      buf.writeFloatLE(t.v2[0], off + 24);
      buf.writeFloatLE(t.v2[1], off + 28);
      buf.writeFloatLE(t.v2[2], off + 32);
      buf.writeFloatLE(t.v3[0], off + 36);
      buf.writeFloatLE(t.v3[1], off + 40);
      buf.writeFloatLE(t.v3[2], off + 44);
      buf.writeUInt16LE(0, off + 48);
      off += 50;
    }
    return buf;
  }
}

// =============================================================================
// GEOMETRIC CONSTANTS
// =============================================================================
const OUTER_W   = 48.0; // Mouse waist width
const OUTER_L   = 90.0; // Mouse length
const WALL_T    = 2.2;  // Shell wall thickness
const FLOOR_T   = 2.0;  // Floor slab
const PIN_CLEAR = 13.0; // Under-PCB pin trough
const BASE_H    = FLOOR_T + PIN_CLEAR + 3.5; // 18.5 mm
const CORNER_R  = 5.0;  // Mouse corner radius

// FRONT WALL USB-C PORT (SHIFTED TO THE RIGHT SIDE)
// Left port was: X = 8.25 to 22.25 mm
// Right port is: X = 25.75 to 39.75 mm (aligned with second ESP32-S3 port)
const USB_W    = 14.0;
const USB_X0   = OUTER_W - 8.25 - USB_W; // 25.75 mm
const USB_X1   = OUTER_W - 8.25;         // 39.75 mm
const USB_Z0   = FLOOR_T + PIN_CLEAR - 0.5; // 14.5 mm
const USB_H    = 7.5;

const SCR_D  = 3.3 / 2;
const SCR_IN = 5.0;

// =============================================================================
// 1. GENERATE BASE (PROPER HOLLOW CAVITY + FRONT-RIGHT USB PORT)
// =============================================================================
function generateBase() {
  const s = new StlBuilder('Enclosure_Base');

  // A. Bottom Floor Slab with 45° floating lead-in chamfer (Z = 0 to FLOOR_T)
  const cham = 1.0;
  s.loftRR(
    cham, cham, OUTER_W - cham, OUTER_L - cham, 0, Math.max(0.5, CORNER_R - cham),
    0, 0, OUTER_W, OUTER_L, cham, CORNER_R,
    14, false, true
  );
  // Solid floor slab from Z = cham to Z = FLOOR_T (2.0mm) - interior above this is 100% HOLLOW!
  s.roundedBox(0, 0, OUTER_W, OUTER_L, cham, FLOOR_T, CORNER_R, 14);

  // B. Left, Right, and Rear Perimeter Walls (Hollow Inside!)
  // Left wall
  s.roundedBox(0, 0, WALL_T, OUTER_L, FLOOR_T, BASE_H, 1.0, 4);
  // Right wall
  s.roundedBox(OUTER_W - WALL_T, 0, OUTER_W, OUTER_L, FLOOR_T, BASE_H, 1.0, 4);
  // Rear wall (palm side)
  s.roundedBox(0, 0, OUTER_W, WALL_T, FLOOR_T, BASE_H, 1.0, 4);

  // C. Front Wall with USB-C Port Shifted to the RIGHT Side (Y = OUTER_L)
  // Left solid pillar of front wall (covering the first port): X = 0 to USB_X0 (25.75mm)
  s.roundedBox(0, OUTER_L - WALL_T, USB_X0, OUTER_L, FLOOR_T, BASE_H, 1.0, 4);
  // Right corner pillar of front wall: X = USB_X1 (39.75mm) to OUTER_W (48.0mm)
  s.roundedBox(USB_X1, OUTER_L - WALL_T, OUTER_W, OUTER_L, FLOOR_T, BASE_H, 1.0, 4);
  // Front sill UNDER the right USB-C port: X = USB_X0 to USB_X1, Z = FLOOR_T to USB_Z0 (14.5mm)
  s.roundedBox(USB_X0, OUTER_L - WALL_T, USB_X1, OUTER_L, FLOOR_T, USB_Z0, 0.5, 4);

  // 45° Flared Outer Cable Shroud Relief Chamfer on the Right USB Port
  s.loftRR(
    USB_X0 - 1.2, OUTER_L - 0.8, USB_X1 + 1.2, OUTER_L, USB_Z0 - 0.6, 0.5,
    USB_X0, OUTER_L - WALL_T, USB_X1, OUTER_L - WALL_T + 0.6, USB_Z0 + 1.0, 0.4,
    4
  );

  // D. 4 Corner M3 Screw Bosses
  const corners = [
    [SCR_IN, SCR_IN], [OUTER_W - SCR_IN, SCR_IN],
    [SCR_IN, OUTER_L - SCR_IN], [OUTER_W - SCR_IN, OUTER_L - SCR_IN]
  ];
  for (const [cx, cy] of corners) {
    s.hollowCyl(cx, cy, 3.8, SCR_D, FLOOR_T, BASE_H, 24);
  }

  // E. PCB Rest Shelves & Anti-Flex Spine (13.0mm Pin Clearance)
  const shelfZ = PIN_CLEAR;
  const pcbX0 = (OUTER_W - 28.5) / 2;
  const pcbX1 = OUTER_W - pcbX0;
  const pcbY1 = OUTER_L - WALL_T - 1.0;
  const pcbY0 = pcbY1 - 58.0;

  s.roundedBox(pcbX0, pcbY1 - 6.0, pcbX0 + 4.5, pcbY1, FLOOR_T, FLOOR_T + shelfZ, 0.5, 4);
  s.roundedBox(pcbX1 - 4.5, pcbY1 - 6.0, pcbX1, pcbY1, FLOOR_T, FLOOR_T + shelfZ, 0.5, 4);
  s.roundedBox(pcbX0, pcbY0, pcbX1, pcbY0 + 4.5, FLOOR_T, FLOOR_T + shelfZ, 0.5, 4);
  s.roundedBox(OUTER_W / 2 - 2.8, pcbY0 + 15.0, OUTER_W / 2 + 2.8, pcbY0 + 45.0, FLOOR_T, FLOOR_T + shelfZ, 0.5, 4);
  s.roundedBox(OUTER_W / 2 - 6.0, 9.0, OUTER_W / 2 + 6.0, 19.0, FLOOR_T, FLOOR_T + 5.5, 0.8, 4);

  // F. 6 Ergonomic Side Grip Ribs on Left & Right Flanks
  for (let i = 0; i < 6; i++) {
    const ry = 28.0 + i * 5.8;
    s.box(-0.35, ry, 6.0, 0.2, ry + 2.8, 14.5);
    s.box(OUTER_W - 0.2, ry, 6.0, OUTER_W + 0.35, ry + 2.8, 14.5);
  }

  // G. Left Wall Embossed "HARDWARE GATEWAY"
  s.drawTextSideYZ('HARDWARE GATEWAY', -0.6, 14.0, 7.5, 3.4, 5.2, 0.65, 0.8, 0.9);

  // H. Underside 4 Mouse Skates (Recessed Glide Pads)
  const skateH = 0.5;
  s.roundedBox(8.0, OUTER_L - 8.5, OUTER_W - 8.0, OUTER_L - 4.0, -skateH, 0.05, 2.0, 8);
  s.roundedBox(8.0, 4.0, OUTER_W - 8.0, 8.5, -skateH, 0.05, 2.0, 8);
  s.roundedBox(3.5, 30.0, 6.5, 62.0, -skateH, 0.05, 1.5, 6);
  s.roundedBox(OUTER_W - 6.5, 30.0, OUTER_W - 3.5, 62.0, -skateH, 0.05, 1.5, 6);

  // I. Official Geometric TUT Emblem Under Base (Z = 0)
  const tutZ0 = -0.65;
  const tutZ1 = 0.02;
  const Xc = OUTER_W / 2;
  const Yc = 50.0;

  // 1. Head circle
  s.cylinder(Xc, Yc + 12.0, 2.2, tutZ0, tutZ1, 24, true);

  // 2. Top tier book leaves (Red)
  s.addPolygonPrism([[Xc - 0.7, Yc + 8.8], [Xc - 4.8, Yc + 10.4], [Xc - 5.8, Yc + 7.8], [Xc - 0.7, Yc + 6.6]], tutZ0, tutZ1);
  s.addPolygonPrism([[Xc + 0.7, Yc + 8.8], [Xc + 0.7, Yc + 6.6], [Xc + 5.8, Yc + 7.8], [Xc + 4.8, Yc + 10.4]], tutZ0, tutZ1);

  // 3. Middle tier book leaves (Gold & Blue)
  s.addPolygonPrism([[Xc - 0.7, Yc + 5.8], [Xc - 7.5, Yc + 7.2], [Xc - 8.4, Yc + 4.0], [Xc - 0.7, Yc + 3.0]], tutZ0, tutZ1);
  s.addPolygonPrism([[Xc + 0.7, Yc + 5.8], [Xc + 0.7, Yc + 3.0], [Xc + 8.4, Yc + 4.0], [Xc + 7.5, Yc + 7.2]], tutZ0, tutZ1);

  // 4. Large horizontal triangle wings
  s.addPolygonPrism([[Xc - 1.2, Yc + 1.2], [Xc - 11.2, Yc + 4.2], [Xc - 11.2, Yc - 3.8]], tutZ0, tutZ1);
  s.addPolygonPrism([[Xc + 1.2, Yc + 1.2], [Xc + 11.2, Yc - 3.8], [Xc + 11.2, Yc + 4.2]], tutZ0, tutZ1);

  // 5. Bottom 3 vertical base pillars
  s.addPolygonPrism([[Xc - 1.6, Yc - 0.5], [Xc + 1.6, Yc - 0.5], [Xc + 1.6, Yc - 10.5], [Xc - 1.6, Yc - 10.5]], tutZ0, tutZ1);
  s.addPolygonPrism([[Xc - 4.8, Yc - 1.5], [Xc - 2.2, Yc - 1.5], [Xc - 2.2, Yc - 10.0], [Xc - 4.8, Yc - 8.2]], tutZ0, tutZ1);
  s.addPolygonPrism([[Xc + 2.2, Yc - 1.5], [Xc + 4.8, Yc - 1.5], [Xc + 4.8, Yc - 8.2], [Xc + 2.2, Yc - 10.0]], tutZ0, tutZ1);

  // 6. Sweeping cradle crescent
  const crescentPts = [];
  const arcN = 28;
  const tipAngle = Math.PI * 0.16;
  const rOut = 14.5, rIn = 12.8;
  const cyOut = Yc + 1.5, cyIn = Yc + 3.2;
  for (let i = 0; i <= arcN; i++) {
    const t = i / arcN;
    const a = Math.PI + tipAngle + t * (Math.PI - 2 * tipAngle);
    crescentPts.push([Xc + rOut * Math.cos(a), cyOut + rOut * Math.sin(a)]);
  }
  for (let i = arcN; i >= 0; i--) {
    const t = i / arcN;
    const a = Math.PI + tipAngle + t * (Math.PI - 2 * tipAngle);
    crescentPts.push([Xc + rIn * Math.cos(a), cyIn + rIn * Math.sin(a)]);
  }
  s.addPolygonPrism(crescentPts, tutZ0, tutZ1);

  // 7. Text below emblem: TUT
  s.drawText('TUT', Xc - (3 * 4.8 + 2 * 1.5) / 2, Yc - 18.5, 4.8, 6.8, 1.0, tutZ0, tutZ1, 1.5);
  const name1 = 'TSHWANE UNIVERSITY';
  s.drawText(name1, Xc - (name1.length * 1.75) / 2, Yc - 22.0, 1.3, 2.1, 0.38, tutZ0, tutZ1, 0.45);
  const name2 = 'OF TECHNOLOGY';
  s.drawText(name2, Xc - (name2.length * 1.75) / 2, Yc - 25.0, 1.3, 2.1, 0.38, tutZ0, tutZ1, 0.45);

  return s;
}

// =============================================================================
// 2. GENERATE LID — ERGONOMIC MOUSE SHELL WITH "GATEWAY" BRANDING
// =============================================================================
function generateLid() {
  const s = new StlBuilder('Enclosure_Lid');

  const lidCeilingT = 2.4;
  const palmPeakZ = 7.5;

  // Layer 1: Base lid slab
  s.roundedBox(0, 0, OUTER_W, OUTER_L, 0, lidCeilingT, CORNER_R, 14);

  // Layer 2: Contoured Mouse Palm Shell (Arched Ergonomic Loft)
  s.loftRR(
    2.5, 4.0, OUTER_W - 2.5, OUTER_L - 4.0, lidCeilingT, CORNER_R - 1.5,
    4.5, 8.0, OUTER_W - 4.5, OUTER_L - 8.0, lidCeilingT + 2.4, CORNER_R - 2.5,
    12, false, true
  );

  // Layer 3: High Palm Arch Hump (Rear Half)
  s.loftRR(
    5.5, 10.0, OUTER_W - 5.5, 52.0, lidCeilingT + 2.4, CORNER_R - 3.0,
    7.5, 14.0, OUTER_W - 7.5, 46.0, lidCeilingT + palmPeakZ, CORNER_R - 4.0,
    10, false, true
  );

  // Left & Right Click Separation Groove (Y = 48mm to 90mm)
  s.stroke(OUTER_W / 2, 48.0, OUTER_W / 2, OUTER_L, 1.2, lidCeilingT + 1.2, lidCeilingT + 3.8);

  // Click finger saddles
  s.box(6.0, 52.0, lidCeilingT + 0.8, 18.0, OUTER_L - 3.0, lidCeilingT + 1.8);
  s.box(OUTER_W - 18.0, 52.0, lidCeilingT + 0.8, OUTER_W - 6.0, OUTER_L - 3.0, lidCeilingT + 1.8);

  // Scroll Wheel Well
  const wheelX = OUTER_W / 2;
  const wheelY = 62.0;
  const wheelWellW = 9.0;
  const wheelWellL = 16.0;

  s.roundedBox(wheelX - wheelWellW / 2 - 1.5, wheelY - wheelWellL / 2 - 1.5,
               wheelX + wheelWellW / 2 + 1.5, wheelY + wheelWellL / 2 + 1.5,
               lidCeilingT + 1.0, lidCeilingT + 4.2, 2.5, 8);

  s.roundedBox(wheelX - wheelWellW / 2, wheelY - wheelWellL / 2,
               wheelX + wheelWellW / 2, wheelY + wheelWellL / 2,
               0, lidCeilingT + 5.0, 2.0, 6);

  s.hollowCyl(wheelX, wheelY, 5.0, 3.8, -3.8, 0, 24);

  // Status Indicator Optics (LEDs)
  const ledY = 38.0;
  const ledSpacing = 13.0;
  const led1X = OUTER_W / 2 - ledSpacing / 2;
  const led2X = OUTER_W / 2 + ledSpacing / 2;

  s.coneFrustum(led1X, ledY, 1.6, 2.8, lidCeilingT + 1.0, lidCeilingT + palmPeakZ + 0.5, 24, false);
  s.coneFrustum(led2X, ledY, 1.6, 2.8, lidCeilingT + 1.0, lidCeilingT + palmPeakZ + 0.5, 24, false);

  s.hollowCyl(led1X, ledY, 2.8, 1.65, -3.2, 0, 20);
  s.hollowCyl(led2X, ledY, 2.8, 1.65, -3.2, 0, 20);

  // Aero Palm Louvers
  for (let i = 0; i < 4; i++) {
    const vy = 20.0 + i * 4.5;
    const vw = 18.0 - i * 1.5;
    s.roundedBox(OUTER_W / 2 - vw / 2, vy, OUTER_W / 2 + vw / 2, vy + 2.0, lidCeilingT + 2.0, lidCeilingT + palmPeakZ + 0.5, 0.8, 4);
  }

  // BRANDING TEXT ON PALM ARCH: "GATEWAY" (Clean, high-tech debossing)
  const brandText = 'GATEWAY';
  const btW = 2.4, btH = 4.2, btS = 0.55, btSp = 0.9;
  const btTotalW = brandText.length * (btW + btSp) - btSp;
  s.drawText(brandText, OUTER_W / 2 - btTotalW / 2, 12.0, btW, btH, btS, lidCeilingT + palmPeakZ - 0.25, lidCeilingT + palmPeakZ + 0.45, btSp);

  // Underside Snap-Fit Lip with Clearance Window for Front-Right USB Port
  const rimT = 1.3;
  const rX0 = WALL_T + 0.25, rY0 = WALL_T + 0.25;
  const rX1 = OUTER_W - WALL_T - 0.25, rY1 = OUTER_L - WALL_T - 0.25;
  const rimZ0 = -2.2, rimZ1 = 0;

  // Left, Right and Rear rims are solid
  s.roundedBox(rX0, rY0, rX0 + rimT, rY1, rimZ0, rimZ1, 0.5, 4);
  s.roundedBox(rX1 - rimT, rY0, rX1, rY1, rimZ0, rimZ1, 0.5, 4);
  s.roundedBox(rX0, rY0, rX1, rY0 + rimT, rimZ0, rimZ1, 0.5, 4);

  // Front rim has clearance window at USB_X0 to USB_X1 (Right side of front face)
  s.roundedBox(rX0, rY1 - rimT, USB_X0 - 0.5, rY1, rimZ0, rimZ1, 0.5, 4);
  s.roundedBox(USB_X1 + 0.5, rY1 - rimT, rX1, rY1, rimZ0, rimZ1, 0.5, 4);

  // 4 Corner M3 Countersunk Screw Pockets
  for (const [cx, cy] of [[SCR_IN, SCR_IN], [OUTER_W - SCR_IN, SCR_IN], [SCR_IN, OUTER_L - SCR_IN], [OUTER_W - SCR_IN, OUTER_L - SCR_IN]]) {
    s.hollowCyl(cx, cy, 3.6, SCR_D, rimZ0, lidCeilingT + 1.0, 20);
  }

  return s;
}

// =============================================================================
// 3. GENERATE BUTTON PLUNGER (CLICKABLE MOUSE SCROLL WHEEL)
// =============================================================================
function generateButtonPlunger() {
  const s = new StlBuilder('Button_Plunger');
  const cx = 0, cy = 0;

  s.coneFrustum(cx, cy, 1.4, 1.6, -2.8, 0, 20, true);
  s.cylinder(cx, cy, 5.0, 0, 1.2, 28, true);

  s.roundedBox(-3.4, -6.0, 3.4, 6.0, 1.2, 7.2, 2.5, 8);

  for (let i = 0; i < 7; i++) {
    const ry = -4.5 + i * 1.5;
    s.box(-3.6, ry - 0.35, 6.5, 3.6, ry + 0.35, 7.55);
  }
  s.box(-1.2, -6.2, 6.8, 1.2, 6.2, 7.6);

  return s;
}

// =============================================================================
// 4. GENERATE FULL BUILD PLATTER
// =============================================================================
function generateFullSet(base, lid, btn) {
  const full = new StlBuilder('Enclosure_Full_Set');

  const baseCopy = base.clone();
  full.merge(baseCopy);

  const lidCopy = lid.clone();
  lidCopy.translate(OUTER_W + 16, 0, 0);
  full.merge(lidCopy);

  const btnCopy = btn.clone();
  btnCopy.translate(OUTER_W / 2, -22, 2.8);
  full.merge(btnCopy);

  return full;
}

// =============================================================================
// WRITE STL FILES
// =============================================================================
const outDir = path.resolve(__dirname);

function saveStl(filename, builder) {
  const buf = builder.toBuffer();
  const fp = path.join(outDir, filename);
  fs.writeFileSync(fp, buf);
  const kb = (buf.length / 1024).toFixed(1);
  console.log(`  ✔  ${filename.padEnd(28)}  ${builder.triangles.length.toLocaleString().padStart(7)} triangles   ${kb} KB`);
}

console.log('\n=============================================================');
console.log('CYBERMOUSE GATEWAY — FINAL EXHIBITION EDITION');
console.log('• Mouse Lid with "GATEWAY" Debossed Branding');
console.log('• Base with Front-Right USB-C Cutout & Official TUT Emblem');
console.log('=============================================================\n');

const baseMesh = generateBase();
saveStl('enclosure_base.stl', baseMesh);

const lidMesh = generateLid();
saveStl('enclosure_lid.stl', lidMesh);

const btnMesh = generateButtonPlunger();
saveStl('button_plunger.stl', btnMesh);

const fullMesh = generateFullSet(baseMesh, lidMesh, btnMesh);
saveStl('enclosure_full_set.stl', fullMesh);

console.log('\nAll 4 STLs generated successfully!\n');
