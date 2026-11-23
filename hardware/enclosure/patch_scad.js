const fs = require('fs');
let scad = fs.readFileSync('enclosure.scad', 'utf8');

const target = '        // 4 Corner M3 Countersunk Screw Pockets (Flush heads)';
const addition = `        // Debossed Branding "GATEWAY"
        translate([outer_w/2, outer_l - 9.5, lid_t - 0.4])
            linear_extrude(height = 0.6)
                text("GATEWAY", size = 3.2, halign = "center", valign = "center", font = "Liberation Sans:style=Bold");

        // 4 Corner M3 Countersunk Screw Pockets (Flush heads)`;

scad = scad.replace(target, addition);
fs.writeFileSync('enclosure.scad', scad, 'utf8');
console.log('Updated enclosure.scad successfully!');
