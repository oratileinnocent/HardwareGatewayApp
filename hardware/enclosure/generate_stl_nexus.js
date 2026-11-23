/**
 * ============================================================
 *   APEX NEXUS — EXHIBITION EDITION STL Generator
 *   Hardware-Level USB Remote Access Gateway via ESP32-S3
 *   Oratile Innocent Tshosetso | TUT | PJD301B
 * ============================================================
 *
 * Generates 4 binary STL files:
 *   1. enclosure_base.stl    — Chamfered body, diagonal accent slashes
 *   2. enclosure_lid.stl     — Honeycomb vents, hexagonal LED crown towers,
 *                              corner columns, debossed labels, tiered surface
 *   3. button_plunger.stl    — Hexagonal cap with knurled collar
 *   4. enclosure_full_set.stl — All-in-1 print platter
 *
 * Internal dimensions IDENTICAL to original — ESP32-S3 fits perfectly.
 * Node.js only, zero external deps.
 */

'use strict';
const fs   = require('fs');
const path = require('path');

// ================================================================
// STL MESH BUILDER
// ================================================================
class StlBuilder {
  constructor(name = 'mesh') { this.name = name; this.triangles = []; }

  _normal(v1, v2, v3) {
    const ax = v2[0]-v1[0], ay = v2[1]-v1[1], az = v2[2]-v1[2];
    const bx = v3[0]-v1[0], by = v3[1]-v1[1], bz = v3[2]-v1[2];
    let nx = ay*bz - az*by, ny = az*bx - ax*bz, nz = ax*by - ay*bx;
    const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
    return len > 1e-9 ? [nx/len, ny/len, nz/len] : [0,0,1];
  }

  tri(v1, v2, v3) {
    this.triangles.push({ normal: this._normal(v1,v2,v3), v1, v2, v3 });
  }

  quad(v1, v2, v3, v4) { this.tri(v1,v2,v3); this.tri(v1,v3,v4); }

  // Circular polygon ring at z with given radius
  _ring(cx, cy, r, z, n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i/n)*Math.PI*2;
      pts.push([cx + r*Math.cos(a), cy + r*Math.sin(a), z]);
    }
    return pts;
  }

  // Polygon ring for regular N-gon (hex = 6 sides, rotated 30°)
  _polyRing(cx, cy, r, z, sides, rotDeg=0) {
    const pts = [];
    const rot = rotDeg * Math.PI / 180;
    for (let i = 0; i < sides; i++) {
      const a = rot + (i/sides)*Math.PI*2;
      pts.push([cx + r*Math.cos(a), cy + r*Math.sin(a), z]);
    }
    return pts;
  }

  // Cylinder (n-sided approximation)
  cylinder(cx, cy, r, z0, z1, n=32, capped=true) {
    this.coneFrustum(cx, cy, r, r, z0, z1, n, capped);
  }

  // Cone frustum
  coneFrustum(cx, cy, r0, r1, z0, z1, n=32, capped=true) {
    const ring0 = this._ring(cx,cy,r0,z0,n);
    const ring1 = this._ring(cx,cy,r1,z1,n);
    for (let i = 0; i < n; i++) {
      const j = (i+1)%n;
      this.quad(ring0[i], ring1[i], ring1[j], ring0[j]);
    }
    if (capped) {
      for (let i = 0; i < n; i++) {
        const j = (i+1)%n;
        this.tri([cx,cy,z0], ring0[j], ring0[i]);
        this.tri([cx,cy,z1], ring1[i], ring1[j]);
      }
    }
  }

  // Polygon prism (hex, oct, etc.)
  polyPrism(cx, cy, r, z0, z1, sides=6, rotDeg=30, capped=true) {
    const ring0 = this._polyRing(cx,cy,r,z0,sides,rotDeg);
    const ring1 = this._polyRing(cx,cy,r,z1,sides,rotDeg);
    for (let i = 0; i < sides; i++) {
      const j = (i+1)%sides;
      this.quad(ring0[i], ring1[i], ring1[j], ring0[j]);
    }
    if (capped) {
      for (let i = 0; i < sides; i++) {
        const j = (i+1)%sides;
        this.tri([cx,cy,z0], ring0[j], ring0[i]);
        this.tri([cx,cy,z1], ring1[i], ring1[j]);
      }
    }
  }

  // Hollow cylinder tube
  hollowCyl(cx, cy, rOut, rIn, z0, z1, n=28) {
    const o0=this._ring(cx,cy,rOut,z0,n), o1=this._ring(cx,cy,rOut,z1,n);
    const i0=this._ring(cx,cy,rIn, z0,n), i1=this._ring(cx,cy,rIn, z1,n);
    for (let i = 0; i < n; i++) {
      const j=(i+1)%n;
      this.quad(o0[i], o1[i], o1[j], o0[j]);         // outer
      this.quad(i0[j], i1[j], i1[i], i0[i]);         // inner
      this.quad(o0[i], o0[j], i0[j], i0[i]);         // bottom annulus
      this.quad(i1[i], i1[j], o1[j], o1[i]);         // top annulus
    }
  }

  // Hollow conical frustum
  hollowConeFrustum(cx, cy, oR0, oR1, iR0, iR1, z0, z1, n=28) {
    const o0=this._ring(cx,cy,oR0,z0,n), o1=this._ring(cx,cy,oR1,z1,n);
    const i0=this._ring(cx,cy,iR0,z0,n), i1=this._ring(cx,cy,iR1,z1,n);
    for (let i = 0; i < n; i++) {
      const j=(i+1)%n;
      this.quad(o0[i],o1[i],o1[j],o0[j]);
      this.quad(i0[j],i1[j],i1[i],i0[i]);
      this.quad(o0[i],o0[j],i0[j],i0[i]);
      this.quad(i1[i],i1[j],o1[j],o1[i]);
    }
  }

  // Rounded rectangular box
  roundedBox(x0, y0, x1, y1, z0, z1, r, n=8) {
    r = Math.min(r, (x1-x0)/2-0.01, (y1-y0)/2-0.01);
    if (r < 0.01) r = 0.01;
    const pts = this._roundRectPts(x0,y0,x1,y1,r,n);
    const m = pts.length;
    const cB = [(x0+x1)/2,(y0+y1)/2,z0];
    const cT = [(x0+x1)/2,(y0+y1)/2,z1];
    for (let i = 0; i < m; i++) {
      const j=(i+1)%m;
      this.tri(cB, [pts[j][0],pts[j][1],z0], [pts[i][0],pts[i][1],z0]);
      this.tri(cT, [pts[i][0],pts[i][1],z1], [pts[j][0],pts[j][1],z1]);
      this.quad([pts[i][0],pts[i][1],z0],[pts[i][0],pts[i][1],z1],[pts[j][0],pts[j][1],z1],[pts[j][0],pts[j][1],z0]);
    }
  }

  _roundRectPts(x0, y0, x1, y1, r, n=8) {
    const corners = [
      {cx:x1-r, cy:y1-r, s:0,           e:Math.PI/2},
      {cx:x0+r, cy:y1-r, s:Math.PI/2,   e:Math.PI},
      {cx:x0+r, cy:y0+r, s:Math.PI,     e:Math.PI*1.5},
      {cx:x1-r, cy:y0+r, s:Math.PI*1.5, e:Math.PI*2},
    ];
    const pts = [];
    for (const c of corners)
      for (let i = 0; i < n; i++) {
        const a = c.s + (i/n)*(c.e-c.s);
        pts.push([c.cx+r*Math.cos(a), c.cy+r*Math.sin(a)]);
      }
    return pts;
  }

  // Loft between two rounded rectangles
  loftRR(x0A,y0A,x1A,y1A,zA,rA, x0B,y0B,x1B,y1B,zB,rB, n=8, capBot=false, capTop=false) {
    const pA = this._roundRectPts(x0A,y0A,x1A,y1A,rA,n);
    const pB = this._roundRectPts(x0B,y0B,x1B,y1B,rB,n);
    const m = pA.length;
    if (capBot) {
      const c=[(x0A+x1A)/2,(y0A+y1A)/2,zA];
      for (let i=0;i<m;i++) { const j=(i+1)%m; this.tri(c,[pA[j][0],pA[j][1],zA],[pA[i][0],pA[i][1],zA]); }
    }
    if (capTop) {
      const c=[(x0B+x1B)/2,(y0B+y1B)/2,zB];
      for (let i=0;i<m;i++) { const j=(i+1)%m; this.tri(c,[pB[i][0],pB[i][1],zB],[pB[j][0],pB[j][1],zB]); }
    }
    for (let i=0;i<m;i++) {
      const j=(i+1)%m;
      this.quad([pA[i][0],pA[i][1],zA],[pB[i][0],pB[i][1],zB],[pB[j][0],pB[j][1],zB],[pA[j][0],pA[j][1],zA]);
    }
  }

  // Rectangular box (plain, no rounding)
  box(x0,y0,z0,x1,y1,z1) {
    // bottom
    this.quad([x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]);
    // top
    this.quad([x0,y1,z1],[x1,y1,z1],[x1,y0,z1],[x0,y0,z1]);
    // sides
    this.quad([x0,y0,z0],[x0,y0,z1],[x1,y0,z1],[x1,y0,z0]);
    this.quad([x1,y0,z0],[x1,y0,z1],[x1,y1,z1],[x1,y1,z0]);
    this.quad([x1,y1,z0],[x1,y1,z1],[x0,y1,z1],[x0,y1,z0]);
    this.quad([x0,y1,z0],[x0,y1,z1],[x0,y0,z1],[x0,y0,z0]);
  }

  // Simple stroke (rectangular bar)
  stroke(x0,y0,x1,y1,t,z0,z1) {
    const dx=x1-x0,dy=y1-y0,len=Math.sqrt(dx*dx+dy*dy);
    if (len<1e-4) return;
    const ht=t/2, px=-dy/len*ht, py=dx/len*ht;
    const p1=[x0+px,y0+py], p2=[x1+px,y1+py], p3=[x1-px,y1-py], p4=[x0-px,y0-py];
    this.quad([p1[0],p1[1],z0],[p2[0],p2[1],z0],[p3[0],p3[1],z0],[p4[0],p4[1],z0]);
    this.quad([p4[0],p4[1],z1],[p3[0],p3[1],z1],[p2[0],p2[1],z1],[p1[0],p1[1],z1]);
    this.quad([p1[0],p1[1],z0],[p1[0],p1[1],z1],[p2[0],p2[1],z1],[p2[0],p2[1],z0]);
    this.quad([p2[0],p2[1],z0],[p2[0],p2[1],z1],[p3[0],p3[1],z1],[p3[0],p3[1],z0]);
    this.quad([p3[0],p3[1],z0],[p3[0],p3[1],z1],[p4[0],p4[1],z1],[p4[0],p4[1],z0]);
    this.quad([p4[0],p4[1],z0],[p4[0],p4[1],z1],[p1[0],p1[1],z1],[p1[0],p1[1],z0]);
  }

  // Segment-drawn text (uppercase only, common chars)
  drawText(text, startX, startY, cW, cH, sT, z0, z1, sp=1.2) {
    let x = startX;
    for (const ch of text.toUpperCase()) {
      const s=(a,b,c,d)=>this.stroke(x+a*cW,startY+b*cH,x+c*cW,startY+d*cH,sT,z0,z1);
      switch(ch) {
        case 'H': s(0,0,0,1); s(1,0,1,1); s(0,.5,1,.5); break;
        case 'W': s(0,1,.25,0); s(.25,0,.5,.55); s(.5,.55,.75,0); s(.75,0,1,1); break;
        case 'G': s(1,1,0,1); s(0,1,0,0); s(0,0,1,0); s(1,0,1,.5); s(.5,.5,1,.5); break;
        case 'A': s(0,0,.5,1); s(.5,1,1,0); s(.25,.4,.75,.4); break;
        case 'T': s(0,1,1,1); s(.5,1,.5,0); break;
        case 'E': s(0,0,0,1); s(0,1,1,1); s(0,.5,.8,.5); s(0,0,1,0); break;
        case 'Y': s(0,1,.5,.5); s(1,1,.5,.5); s(.5,.5,.5,0); break;
        case 'O': s(0,0,0,1); s(0,1,1,1); s(1,1,1,0); s(1,0,0,0); break;
        case 'I': s(.5,0,.5,1); s(0,0,1,0); s(0,1,1,1); break;
        case 'S': s(1,1,0,1); s(0,1,0,.5); s(0,.5,1,.5); s(1,.5,1,0); s(1,0,0,0); break;
        case 'C': s(1,1,0,1); s(0,1,0,0); s(0,0,1,0); break;
        case 'N': s(0,0,0,1); s(0,1,1,0); s(1,0,1,1); break;
        case 'X': s(0,0,1,1); s(0,1,1,0); break;
        case 'U': s(0,1,0,0); s(0,0,1,0); s(1,0,1,1); break;
        case 'P': s(0,0,0,1); s(0,1,1,1); s(1,1,1,.5); s(1,.5,0,.5); break;
        case 'R': s(0,0,0,1); s(0,1,1,1); s(1,1,1,.5); s(1,.5,0,.5); s(.2,.5,1,0); break;
        case 'D': s(0,0,0,1); s(0,1,.7,1); s(.7,1,1,.7); s(1,.7,1,.3); s(1,.3,.7,0); s(.7,0,0,0); break;
        case 'F': s(0,0,0,1); s(0,1,1,1); s(0,.5,.8,.5); break;
        case 'L': s(0,1,0,0); s(0,0,1,0); break;
        case 'B': s(0,0,0,1); s(0,1,.7,1); s(.7,1,1,.85); s(1,.85,1,.55); s(1,.55,0,.5); s(0,.5,.7,.5); s(.7,.5,1,.25); s(1,.25,1,0); s(1,0,0,0); break;
        case '-': s(0,.5,.8,.5); break;
        case '.': this.cylinder(x+.3*cW, startY+.08*cH, .15, z0, z1, 6, true); break;
        case '|': s(.5,0,.5,1); break;
        case '3': s(0,1,1,1); s(1,1,1,0); s(0,.5,1,.5); s(0,0,1,0); break;
        case '2': s(0,1,1,1); s(1,1,1,.5); s(1,.5,0,.5); s(0,.5,0,0); s(0,0,1,0); break;
        default: break; // space
      }
      x += cW + sp;
    }
  }

  translate(dx,dy,dz) {
    for (const t of this.triangles) {
      for (const k of ['v1','v2','v3'])
        t[k] = [t[k][0]+dx, t[k][1]+dy, t[k][2]+dz];
    }
  }

  merge(other) {
    for (const t of other.triangles)
      this.triangles.push({normal:[...t.normal],v1:[...t.v1],v2:[...t.v2],v3:[...t.v3]});
  }

  clone() {
    const c = new StlBuilder(this.name);
    for (const t of this.triangles)
      c.triangles.push({normal:[...t.normal],v1:[...t.v1],v2:[...t.v2],v3:[...t.v3]});
    return c;
  }

  toBuffer() {
    const n = this.triangles.length;
    const buf = Buffer.alloc(84 + n*50);
    buf.write(`APEX NEXUS Exhibition Edition - ${this.name}`.padEnd(80,' '), 0, 80, 'ascii');
    buf.writeUInt32LE(n, 80);
    let off = 84;
    for (const t of this.triangles) {
      buf.writeFloatLE(t.normal[0],off);    buf.writeFloatLE(t.normal[1],off+4);  buf.writeFloatLE(t.normal[2],off+8);
      buf.writeFloatLE(t.v1[0],   off+12); buf.writeFloatLE(t.v1[1],   off+16); buf.writeFloatLE(t.v1[2],   off+20);
      buf.writeFloatLE(t.v2[0],   off+24); buf.writeFloatLE(t.v2[1],   off+28); buf.writeFloatLE(t.v2[2],   off+32);
      buf.writeFloatLE(t.v3[0],   off+36); buf.writeFloatLE(t.v3[1],   off+40); buf.writeFloatLE(t.v3[2],   off+44);
      buf.writeUInt16LE(0, off+48);
      off += 50;
    }
    return buf;
  }
}

// ================================================================
// GEOMETRY CONSTANTS (internal dims unchanged from original)
// ================================================================
const WALL_T  = 2.2;
const FLOOR_T = 2.0;
const LID_T   = 3.2;
const INNER_W = 43.6;
const INNER_L = 85.6;
const CORNER_R = 3.5;

const OUTER_W = INNER_W + 2*WALL_T;  // 48.0
const OUTER_L = INNER_L + 2*WALL_T;  // 90.0
const PIN_CLEAR = 13.0;
const BASE_H  = FLOOR_T + PIN_CLEAR + 3.5; // 18.5

const USB_W    = 14.0;
const USB_H    = 7.5;   // USB cutout height
// USB-C is now on the RIGHT SIDE WALL (X = OUTER_W)
// Slot runs Y: 70mm to 84mm (near front face), Z: 14.5mm to 22mm
const USB_YO_R = OUTER_L - USB_W - 6.0;  // 70.0 mm
const USB_ZO   = FLOOR_T + PIN_CLEAR - 0.5; // 14.5 mm

const LED_D   = 3.2/2;   // radius
const LED_BEZ = 5.4/2;
const LED_SP  = 12.0;
const BTN_G   = 7.6/2;   // button guide radius
const BTN_CAP = 7.2/2;   // button cap radius
const SCR_D   = 3.3/2;   // screw hole radius
const SCR_HD  = 6.0/2;   // screw head radius
const SCR_IN  = 5.0;     // screw inset from corner

const TOWER_H = 4.2;      // LED tower height above lid
const HEX_R   = 2.6;      // honeycomb cell inner radius
const HEX_W   = 0.9;      // honeycomb wall thickness
const CHAM    = 2.0;      // base bottom chamfer

// ================================================================
// HONEYCOMB GRID
// Fills a w×l rectangle starting at (ox, oy, z)
// Generates SOLID hex prisms (additive — lid cuts them out in slicer
// but as additive mesh we just emit the prism solids)
// We'll invert: add a solid slab and subtract hex prisms
// Since this is a mesh gen (no CSG), we render the WALLS instead:
// each hex cell = a hollow ring wall
// ================================================================
function addHoneycombWalls(stl, ox, oy, z0, z1, w, l, cellR, wallT) {
  const rowPitch = cellR * Math.sqrt(3) + wallT;
  const colPitch = cellR * 2.0 + wallT;
  const rows = Math.ceil(l / rowPitch) + 1;
  const cols = Math.ceil(w / colPitch) + 1;
  const outerR = cellR + wallT / 2;
  const innerR = cellR;

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const cx = ox + col * colPitch + (row % 2) * (colPitch / 2);
      const cy = oy + row * rowPitch;
      // Clip to area bounds
      if (cx < ox - cellR || cx > ox + w + cellR) continue;
      if (cy < oy - cellR || cy > oy + l + cellR) continue;
      stl.hollowCyl(cx, cy, outerR, innerR, z0, z1, 6);
    }
  }
}

// A solid slab top cap between hex walls (fills the inter-cell solid)
// We tile a rectangular solid minus the hex holes — mesh-wise we
// emit solid hex-ring columns which IS the wall grid visually.

// ================================================================
// 1. ENCLOSURE BASE — APEX NEXUS
// ================================================================
function generateBase() {
  const s = new StlBuilder('Enclosure_Base');

  // --- Main outer shell with floating chamfer skirt ---
  // Bottom chamfer ring (skirt inset by CHAM, lofted up)
  s.loftRR(
    CHAM, CHAM, OUTER_W-CHAM, OUTER_L-CHAM, 0,  Math.max(0.5,CORNER_R-CHAM),
    0,    0,    OUTER_W,       OUTER_L,       CHAM, CORNER_R,
    12, false, true
  );
  s.roundedBox(0, 0, OUTER_W, OUTER_L, CHAM, BASE_H, CORNER_R, 12);

  // --- Shell walls (USB-C now on RIGHT SIDE WALL, front wall is SOLID) ---
  // Left wall � full, solid
  s.roundedBox(0, 0, WALL_T, OUTER_L, FLOOR_T, BASE_H, 1.0, 4);
  // Rear wall � full, solid
  s.roundedBox(0, 0, OUTER_W, WALL_T, FLOOR_T, BASE_H, 1.0, 4);
  // Front wall � NOW SOLID (USB moved to right side)
  s.roundedBox(0, OUTER_L-WALL_T, OUTER_W, OUTER_L, FLOOR_T, BASE_H, 1.0, 4);
  // Right wall � SPLIT around USB-C cutout (Y: USB_YO_R ? USB_YO_R+USB_W, Z: USB_ZO ? USB_ZO+USB_H)
  // Section A: rear of right wall (Y: 0 ? USB_YO_R), full height
  s.roundedBox(OUTER_W-WALL_T, 0, OUTER_W, USB_YO_R, FLOOR_T, BASE_H, 1.0, 4);
  // Section B: front of right wall (Y: USB_YO_R+USB_W ? OUTER_L), full height
  s.roundedBox(OUTER_W-WALL_T, USB_YO_R+USB_W, OUTER_W, OUTER_L, FLOOR_T, BASE_H, 1.0, 4);
  // Section C: USB zone � sill BELOW the port opening
  s.roundedBox(OUTER_W-WALL_T, USB_YO_R, OUTER_W, USB_YO_R+USB_W, FLOOR_T, USB_ZO, 0.5, 4);
  // Section D: USB zone � lintel ABOVE the port opening
  s.roundedBox(OUTER_W-WALL_T, USB_YO_R, OUTER_W, USB_YO_R+USB_W, USB_ZO+USB_H, BASE_H, 0.5, 4);
  // Floor slab
  s.roundedBox(WALL_T, WALL_T, OUTER_W-WALL_T, OUTER_L-WALL_T, FLOOR_T-0.1, FLOOR_T+0.1, CORNER_R-WALL_T, 10);

  // --- USB flared cable hood bevel (RIGHT WALL, outward flare in X direction) ---
  s.loftRR(
    OUTER_W-1.5, USB_YO_R-1.5, OUTER_W, USB_YO_R+USB_W+1.5, USB_ZO-0.8, 0.5,
    OUTER_W-WALL_T-0.4, USB_YO_R, OUTER_W-WALL_T, USB_YO_R+USB_W, USB_ZO+0.5, 0.4,
    4
  );

  // --- 4 Corner Screw Bosses ---
  const corners = [
    [SCR_IN, SCR_IN], [OUTER_W-SCR_IN, SCR_IN],
    [SCR_IN, OUTER_L-SCR_IN], [OUTER_W-SCR_IN, OUTER_L-SCR_IN]
  ];
  for (const [cx,cy] of corners) {
    s.hollowCyl(cx, cy, 3.9, SCR_D, FLOOR_T, BASE_H, 24);
  }

  // --- Silicone foot wells (recessed rings on underside) ---
  const footPos = [
    [7.0,7.0],[OUTER_W-7.0,7.0],[7.0,OUTER_L-7.0],[OUTER_W-7.0,OUTER_L-7.0]
  ];
  for (const [fx,fy] of footPos) {
    s.hollowCyl(fx, fy, 3.75+0.6, 3.75, 0, 0.7, 20);
  }

  // --- PCB Rest Shelves (unchanged from original) ---
  const shelfZ = PIN_CLEAR;
  const pcbX0 = (OUTER_W - 28.5) / 2;
  const pcbX1 = OUTER_W - pcbX0;
  const pcbY1 = OUTER_L - WALL_T - 1.0;
  const pcbY0 = pcbY1 - 58.0;

  s.roundedBox(pcbX0,     pcbY1-6.0, pcbX0+4.5, pcbY1,     FLOOR_T, FLOOR_T+shelfZ, 0.5, 4);
  s.roundedBox(pcbX1-4.5, pcbY1-6.0, pcbX1,     pcbY1,     FLOOR_T, FLOOR_T+shelfZ, 0.5, 4);
  s.roundedBox(pcbX0,     pcbY0,     pcbX1,     pcbY0+4.5, FLOOR_T, FLOOR_T+shelfZ, 0.5, 4);
  s.roundedBox(OUTER_W/2-2.8, pcbY0+15.0, OUTER_W/2+2.8, pcbY0+45.0, FLOOR_T, FLOOR_T+shelfZ, 0.5, 4);

  // Button bay platform
  s.roundedBox(OUTER_W/2-6.0, 9.0, OUTER_W/2+6.0, 19.0, FLOOR_T, FLOOR_T+5.5, 0.8, 4);

  // === SIDE DIAGONAL ACCENT RIDGES ===
  // 5 raised angular ribs at ~28° on each long flank
  for (let i = 0; i < 5; i++) {
    const yBase = 20 + i * 10.5;
    const h0 = BASE_H * 0.28;
    const h1 = BASE_H * 0.75;
    // Left flank raised ridge (angled upward rib)
    // Create angled parallelogram by lofting two small rectangles
    s.box(-0.4, yBase,       h0, 0.3, yBase+5.5, h0+0.6); // base of rib
    s.loftRR(
      -0.4, yBase,   0.3, yBase+5.5, h0,   0.1,
      -0.4, yBase+1, 0.3, yBase+6.5, h1,   0.1,
      4, true, true
    );
    // Right flank mirror
    s.loftRR(
      OUTER_W-0.3, yBase,   OUTER_W+0.4, yBase+5.5, h0,   0.1,
      OUTER_W-0.3, yBase+1, OUTER_W+0.4, yBase+6.5, h1,   0.1,
      4, true, true
    );
  }

  // === DIAGONAL GROOVE CUTS (recessed accent channels between ribs) ===
  // Rendered as thin rectangular notches on the side wall exterior
  // (Positive mesh — the notch "walls" are thinner than surrounding surface)
  // We approximate by NOT adding material in those zones — the walls above already
  // have the full shell, so the ribs standing proud create the visual slash effect.

  // === UNDERSIDE HASH PATTERN (decorative parallel lines on bottom) ===
  for (let i = 0; i < 6; i++) {
    const lx = 7 + i * 6;
    s.box(lx, OUTER_L*0.18, lx+0.8, OUTER_L*0.82, -0.5, 0.0);
  }

  return s;
}


// ================================================================
// 2. ENCLOSURE LID — THE SHOWPIECE
// ================================================================
function generateLid() {
  const s = new StlBuilder('Enclosure_Lid');

  // --- Main lid slab ---
  s.roundedBox(0, 0, OUTER_W, OUTER_L, 0, LID_T, CORNER_R, 12);

  // === RAISED CORNER TOWER COLUMNS ===
  // Tapered angular towers at all 4 corners — server-rack aesthetic
  const towerCorners = [
    [0,            0           ],
    [OUTER_W-9.5,  0           ],
    [0,            OUTER_L-9.5 ],
    [OUTER_W-9.5,  OUTER_L-9.5 ],
  ];
  for (const [tx,ty] of towerCorners) {
    // Tower body — tapered from 9.5×9.5 at base to 7.5×7.5 at top
    s.loftRR(tx, ty, tx+9.5, ty+9.5, LID_T, 1.5,
              tx+1, ty+1, tx+8.5, ty+8.5, LID_T+TOWER_H*0.65, 1.0,
              6, false, true);
    // Screw hole is carved by slicer / just leave the boss solid
  }

  // === RAISED CENTRAL INSET PLATFORM (tiered lid) ===
  s.loftRR(
    5,  22, OUTER_W-5,  OUTER_L-14, LID_T,     3.0,
    7,  24, OUTER_W-7,  OUTER_L-16, LID_T+1.2, 2.5,
    8, false, true
  );

  // === HEXAGONAL LED CROWN TOWERS ===
  const led1X = OUTER_W/2 - LED_SP/2;
  const led2X = OUTER_W/2 + LED_SP/2;
  const ledY  = 38;

  // LED tower 1 (PWR)
  s.polyPrism(led1X, ledY, LED_BEZ + 2.8, LID_T, LID_T+TOWER_H, 6, 30, true);
  // LED tower 2 (ACT)
  s.polyPrism(led2X, ledY, LED_BEZ + 2.8, LID_T, LID_T+TOWER_H, 6, 30, true);

  // Bridge bar connecting the two towers
  s.roundedBox(led1X, ledY-1.5, led2X, ledY+1.5, LID_T, LID_T+TOWER_H*0.42, 1.0, 4);

  // === LED LIGHT FUNNELS through the towers ===
  // Hollow conical bore (approximated as a hollow cone frustum void)
  // We render the OUTER tower and leave the inner bore hollow
  // by making the LED towers hollow prisms:
  // Replace solid prisms above with hollow versions:
  // (re-render as hollow — remove solid center)
  // We'll add inner hollow bore as separate subtractive void indicator
  // For mesh generation: render solid prisms, inner bore rendered as cone frustum void:
  // Since we can't do CSG, we render the funnel walls themselves:
  s.hollowConeFrustum(led1X, ledY, LED_BEZ+2.8, LED_BEZ+2.8, LED_D, LED_BEZ, 0, LID_T+TOWER_H, 6);
  s.hollowConeFrustum(led2X, ledY, LED_BEZ+2.8, LED_BEZ+2.8, LED_D, LED_BEZ, 0, LID_T+TOWER_H, 6);

  // === BUTTON HEX CROWN TOWER ===
  const btnX = OUTER_W/2;
  const btnY  = 14;
  s.polyPrism(btnX, btnY, BTN_G+3.4, LID_T, LID_T+TOWER_H*0.9, 6, 30, false);
  // Hollow bore for button guide
  s.hollowCyl(btnX, btnY, BTN_G+3.4, BTN_G, LID_T, LID_T+TOWER_H*0.9, 6);

  // === SNAP-FIT LIP (underside) ===
  // USB-C is on the RIGHT WALL � right rim has USB gap, front rim is solid
  const rimT = 1.3;
  const rX0=WALL_T+0.25, rY0=WALL_T+0.25;
  const rX1=OUTER_W-WALL_T-0.25, rY1=OUTER_L-WALL_T-0.25;
  const rimZ0=-2.2, rimZ1=0;

  // Left rim � solid
  s.roundedBox(rX0,      rY0, rX0+rimT, rY1, rimZ0, rimZ1, 0.5, 4);
  // Rear rim � solid
  s.roundedBox(rX0,      rY0, rX1, rY0+rimT, rimZ0, rimZ1, 0.5, 4);
  // Front rim � NOW SOLID (USB no longer here)
  s.roundedBox(rX0, rY1-rimT, rX1, rY1, rimZ0, rimZ1, 0.5, 4);
  // Right rim � SPLIT around USB gap (matches right wall cutout in Y)
  // Section A: rear portion of right rim
  s.roundedBox(rX1-rimT, rY0,           rX1, USB_YO_R-WALL_T,         rimZ0, rimZ1, 0.5, 4);
  // Section B: front portion of right rim
  s.roundedBox(rX1-rimT, USB_YO_R+USB_W+WALL_T, rX1, rY1,            rimZ0, rimZ1, 0.5, 4);
  // (gap in right rim at USB_YO_R ? USB_YO_R+USB_W so cable can pass)

  // === LED ISOLATION BAFFLES (underside sleeves) ===
  s.hollowCyl(led1X, ledY, LED_D+1.2, LED_D, rimZ0-1.0, 0, 20);
  s.hollowCyl(led2X, ledY, LED_D+1.2, LED_D, rimZ0-1.0, 0, 20);
  // Button sleeve
  s.hollowCyl(btnX, btnY, BTN_G+1.3, BTN_G, rimZ0-1.0, 0, 24);

  // === M3 COUNTERSUNK SCREW POCKETS IN CORNER TOWERS ===
  for (const [cx,cy] of [[SCR_IN,SCR_IN],[OUTER_W-SCR_IN,SCR_IN],[SCR_IN,OUTER_L-SCR_IN],[OUTER_W-SCR_IN,OUTER_L-SCR_IN]]) {
    // Screw bore tube
    s.hollowCyl(cx, cy, SCR_D+0.6, SCR_D, -2.5, LID_T+TOWER_H, 20);
    // Countersunk head cone
    s.hollowConeFrustum(cx, cy, SCR_HD, SCR_D+0.6, SCR_D, SCR_D, LID_T-1.5, LID_T-0.1, 20);
  }

  // === HONEYCOMB VENT ARRAY — THE EXHIBITION CENTREPIECE ===
  // 23×30 mm hex grid centred over ESP32/antenna zone
  const hcX = OUTER_W/2 - 11.5;
  const hcY = 50.0;
  addHoneycombWalls(s, hcX, hcY, 0, LID_T+0.3, 23, 30, HEX_R, HEX_W);

  // === SIDE LID ACCENT GROOVES ===
  for (let i = 0; i < 4; i++) {
    const gy = 28 + i*10;
    // Left edge shallow notch
    s.box(-0.1, gy, LID_T*0.25, 0.9, gy+1.6, LID_T+0.3);
    // Right edge
    s.box(OUTER_W-0.9, gy, LID_T*0.25, OUTER_W+0.1, gy+1.6, LID_T+0.3);
  }

  // === DEBOSSED LABELS (raised ridges forming text, 0.4mm proud) ===
  const labelZ0 = LID_T + 1.15;
  const labelZ1 = LID_T + 1.6;
  const cW=2.8, cH=4.8, sT=0.55, sp=0.9;

  // "HW GATEWAY" — centred on inset platform
  const hwText = 'HW GATEWAY';
  const hwTotalW = hwText.length*(cW+sp);
  s.drawText(hwText, OUTER_W/2 - hwTotalW/2, OUTER_L/2 + 8, cW, cH, sT, labelZ0, labelZ1, sp);

  // "OI TSHOSETSO | TUT" — below
  const cW2=1.9, cH2=3.1, sT2=0.42, sp2=0.6;
  const sub1 = 'OI TSHOSETSO';
  const sub1W = sub1.length*(cW2+sp2);
  s.drawText(sub1, OUTER_W/2 - sub1W/2, OUTER_L/2 - 0.5, cW2, cH2, sT2, labelZ0, LID_T+1.45, sp2);

  // "ESP32-S3 HID" — small, lower
  const cW3=1.8, cH3=2.8, sT3=0.38, sp3=0.5;
  const sub2 = 'ESP32-S3 HID';
  const sub2W = sub2.length*(cW3+sp3);
  s.drawText(sub2, OUTER_W/2 - sub2W/2, OUTER_L/2 - 7, cW3, cH3, sT3, labelZ0, LID_T+1.4, sp3);

  // "PWR" and "ACT" labels near LED towers
  s.drawText('PWR', led1X-3.5, ledY-7.5, 1.4, 2.4, 0.42, LID_T+0.05, LID_T+0.4, 0.5);
  s.drawText('ACT', led2X-3.5, ledY-7.5, 1.4, 2.4, 0.42, LID_T+0.05, LID_T+0.4, 0.5);

  return s;
}


// ================================================================
// 3. HEXAGONAL BUTTON PLUNGER — EXHIBITION EDITION
// ================================================================
function generateButton() {
  const s = new StlBuilder('Button_Plunger');
  const cx=0, cy=0;

  // Actuator stem pip
  s.coneFrustum(cx, cy, 1.3, 1.5, -2.8, 0, 16, true);

  // Hexagonal retention flange (matches the hex design language)
  s.polyPrism(cx, cy, BTN_G+1.3, 0, 1.2, 6, 30, true);

  // Hexagonal main cap body
  s.polyPrism(cx, cy, BTN_CAP, 1.2, 5.5, 6, 30, false);
  // Cap top face
  s.polyPrism(cx, cy, BTN_CAP, 5.5, 5.5, 6, 30, true); // top cap

  // Knurled collar ring (hex ring between flange and cap)
  s.hollowCyl(cx, cy, BTN_CAP+0.8, BTN_CAP, 2.0, 3.2, 6);

  // Concave thumb dish: approximate with a hollow ring on top
  // 3-step ring to simulate concave surface
  s.hollowConeFrustum(cx, cy, BTN_CAP, BTN_CAP*0.78, 0.0, BTN_CAP*0.72, 5.5, 6.4, 6);
  s.polyPrism(cx, cy, BTN_CAP*0.72, 5.5, 5.55, 6, 30, true); // inner floor

  // Outer wall sides of cap (closing the cylinder from flange to top)
  s.hollowCyl(cx, cy, BTN_CAP+0.02, BTN_CAP, 1.2, 5.5, 6);

  return s;
}


// ================================================================
// 4. FULL PRINT PLATTER
// ================================================================
function generateFullSet(base, lid, btn) {
  const full = new StlBuilder('Enclosure_Full_Set');

  const baseCopy = base.clone();
  full.merge(baseCopy);

  const lidCopy = lid.clone();
  lidCopy.translate(OUTER_W + 16, 0, 0);
  full.merge(lidCopy);

  const btnCopy = btn.clone();
  btnCopy.translate(OUTER_W/2, -22, 2.8);
  full.merge(btnCopy);

  return full;
}


// ================================================================
// WRITE FILES
// ================================================================
const outDir = path.resolve(__dirname);

function saveStl(filename, builder) {
  const buf = builder.toBuffer();
  const fp  = path.join(outDir, filename);
  fs.writeFileSync(fp, buf);
  const kb  = (buf.length/1024).toFixed(1);
  console.log(`  ✔  ${filename.padEnd(28)}  ${builder.triangles.length.toLocaleString().padStart(7)} triangles   ${kb} KB`);
}

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║   APEX NEXUS — Exhibition Edition STL Generator         ║');
console.log('║   Hardware-Level USB Remote Access Gateway (ESP32-S3)   ║');
console.log('║   Oratile Innocent Tshosetso | TUT | PJD301B            ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');
console.log('Generating STL files...\n');

const baseMesh = generateBase();
saveStl('enclosure_base.stl', baseMesh);

const lidMesh  = generateLid();
saveStl('enclosure_lid.stl', lidMesh);

const btnMesh  = generateButton();
saveStl('button_plunger.stl', btnMesh);

const fullMesh = generateFullSet(baseMesh, lidMesh, btnMesh);
saveStl('enclosure_full_set.stl', fullMesh);

console.log('\n✅  All 4 STLs saved to:');
console.log(`   ${outDir}`);
console.log('\n📋  Open in PrusaSlicer:');
console.log('   • Drag enclosure_full_set.stl for one-click print');
console.log('   • Layer height: 0.12mm | Walls: 4 | Infill: 20% Gyroid');
console.log('   • Supports: NONE needed\n');
