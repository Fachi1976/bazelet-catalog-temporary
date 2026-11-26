// single pre-roll tube on its own, with its sticker: 97 mm along the tube, 57.5 mm around it
import { io, node, save, xf } from './lib.mjs';
import { getBounds, prune } from '@gltf-transform/functions';
import fs from 'fs';
const MD = '/home/claude/bazelet-catalog-temporary/images/models/', out = process.argv[2];
const kill = (n) => { for (const c of n.listChildren()) kill(c); n.dispose(); };
const d = await io.read(MD + 'anim-pr15-std.glb'); for (const a of d.getRoot().listAnimations()) a.dispose();
const sc = d.getRoot().listScenes()[0]; for (const c of sc.listChildren()) if (c.getName() !== 't0') { sc.removeChild(c); kill(c); }
const t0 = node(d, 't0'); t0.setTranslation([0, 0.0006, 0]);
// radius profile of the body
const body = node(d, 't0_body'), W = body.getWorldMatrix(), pos = body.getMesh().listPrimitives()[0].getAttribute('POSITION'); let rmax = 0, top = 0; const prof = new Map();
for (let i = 0; i < pos.getCount(); i++) { const p = xf(W, pos.getElement(i, [])); const r = Math.hypot(p[0], p[2]); top = Math.max(top, p[1]); if (p[1] > 0.004 && p[1] < 0.102) rmax = Math.max(rmax, r); const k = (p[1] * 1000).toFixed(0); prof.set(k, Math.max(prof.get(k) || 0, r * 1000)); }
console.log('body top mm', (top * 1000).toFixed(1), 'max r in label zone', (rmax * 1000).toFixed(2), 'lid', getBounds(node(d, 't0_lid')).min.map((v) => +(v * 1000).toFixed(1)), [...prof.entries()].sort((a, b) => a[0] - b[0]).filter((e, i, A) => i % Math.ceil(A.length / 14) === 0).map((e) => e[0] + ':' + e[1].toFixed(1)).join(' '));
const r = 0.0100 + 0.00015, L = 0.0575, H = 0.097, y0 = 0.004, seg = 96, half = L / (2 * r); const P = [], N = [], UV = [], T = [];
for (let i = 0; i <= seg; i++) { const a = i / seg, th = -half + a * 2 * half, s = Math.sin(th), c = Math.cos(th);
  // artwork 97 x 57.5 turned a quarter: its left edge at the bottom of the tube, its top edge on the viewer's left (text reads upwards)
  P.push([r * s, y0 + H, r * c], [r * s, y0, r * c]); N.push([s, 0, c], [s, 0, c]); UV.push([1, a], [0, a]); }
for (let i = 0; i < seg; i++) { const a = i * 2; T.push([a, a + 1, a + 2], [a + 2, a + 1, a + 3]); }
const buf = d.getRoot().listBuffers()[0], acc = (type, arr) => d.createAccessor().setType(type).setArray(arr).setBuffer(buf);
const tex = d.createTexture('label_clear').setImage(fs.readFileSync('tex_clear.png')).setMimeType('image/png');
const mat = d.createMaterial('Label_gltf').setDoubleSided(true).setBaseColorTexture(tex).setMetallicFactor(0).setRoughnessFactor(0.4).setAlphaMode('BLEND');
const n = d.createNode('tube_label').setMesh(d.createMesh('tube_label').addPrimitive(d.createPrimitive().setAttribute('POSITION', acc('VEC3', new Float32Array(P.flat()))).setAttribute('NORMAL', acc('VEC3', new Float32Array(N.flat()))).setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(UV.flat()))).setIndices(acc('SCALAR', new Uint32Array(T.flat()))).setMaterial(mat)));
sc.addChild(n); n.setTranslation([0, 0.0006, 0]);
await save(d, out + '/anim-tube.glb');
