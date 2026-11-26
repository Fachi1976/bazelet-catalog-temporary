// Pop-top (hinged, child-proof) pre-roll tubes that open: cap swings back on its hinge, the pre-roll(s) rise out of the tube.
import { Document } from '@gltf-transform/core';
import { io, save } from './lib.mjs';
import fs from 'fs';
const out = process.argv[2];
function build(file, { R, cones, label, Hb = 112.6, capR, capH = 3.1, rim = 0, angle = 118, y0 = 4.6 }) {
  const d = new Document(); const buf = d.createBuffer(); const scene = d.createScene('Scene'); d.getRoot().setDefaultScene(scene);
  const acc = (type, arr) => d.createAccessor().setType(type).setArray(arr).setBuffer(buf);
  const mesh = (name, g, mat) => d.createMesh(name).addPrimitive(d.createPrimitive().setAttribute('POSITION', acc('VEC3', new Float32Array(g.P.flat()))).setAttribute('NORMAL', acc('VEC3', new Float32Array(g.N.flat()))).setIndices(acc('SCALAR', new Uint32Array(g.T.flat()))).setMaterial(mat));
  const G = () => ({ P: [], N: [], T: [] });
  // lathe a profile [[r, y], ...] around the y axis; every profile segment gets its own (flat along the profile, smooth around) band
  const lathe = (g, prof, seg = 64, off = [0, 0, 0]) => { for (let s = 0; s < prof.length - 1; s++) { const [r0, y0] = prof[s], [r1, y1] = prof[s + 1]; const l = Math.hypot(r1 - r0, y1 - y0) || 1, nr = (y1 - y0) / l, ny = -(r1 - r0) / l; const b = g.P.length;
      for (let i = 0; i <= seg; i++) { const a = i / seg * 2 * Math.PI, c = Math.cos(a), sn = Math.sin(a); g.P.push([r0 * sn + off[0], y0 + off[1], r0 * c + off[2]], [r1 * sn + off[0], y1 + off[1], r1 * c + off[2]]); g.N.push([nr * sn, ny, nr * c], [nr * sn, ny, nr * c]); }
      for (let i = 0; i < seg; i++) { const a = b + i * 2; g.T.push([a, a + 2, a + 1], [a + 1, a + 2, a + 3]); } } return g; };
  const box = (g, mn, mx) => { const F = [[[0, 0, 1], [mn[0], mn[1], mx[2]], [mx[0], mn[1], mx[2]], [mx[0], mx[1], mx[2]], [mn[0], mx[1], mx[2]]], [[0, 0, -1], [mx[0], mn[1], mn[2]], [mn[0], mn[1], mn[2]], [mn[0], mx[1], mn[2]], [mx[0], mx[1], mn[2]]],
      [[1, 0, 0], [mx[0], mn[1], mx[2]], [mx[0], mn[1], mn[2]], [mx[0], mx[1], mn[2]], [mx[0], mx[1], mx[2]]], [[-1, 0, 0], [mn[0], mn[1], mn[2]], [mn[0], mn[1], mx[2]], [mn[0], mx[1], mx[2]], [mn[0], mx[1], mn[2]]],
      [[0, 1, 0], [mn[0], mx[1], mx[2]], [mx[0], mx[1], mx[2]], [mx[0], mx[1], mn[2]], [mn[0], mx[1], mn[2]]], [[0, -1, 0], [mn[0], mn[1], mn[2]], [mx[0], mn[1], mn[2]], [mx[0], mn[1], mx[2]], [mn[0], mn[1], mx[2]]]];
    for (const [n, a, b_, c, e] of F) { const b = g.P.length; g.P.push(a, b_, c, e); g.N.push(n, n, n, n); g.T.push([b, b + 1, b + 2], [b, b + 2, b + 3]); } return g; };
  const mm = (v) => v / 1000, M = (g) => { g.P = g.P.map((p) => p.map(mm)); return g; };
  const PP = d.createMaterial('PP').setBaseColorFactor([0.92, 0.92, 0.91, 1]).setRoughnessFactor(0.55).setMetallicFactor(0).setDoubleSided(true);
  // filled, closed pre-roll: plain paper over the filter, ground flower showing through the thin paper above it, flower visible at the open end
  const paper = d.createMaterial('ConePaper').setBaseColorTexture(d.createTexture('fill').setImage(fs.readFileSync('tex_fill.png')).setMimeType('image/png')).setRoughnessFactor(0.92).setMetallicFactor(0).setDoubleSided(true);
  const tip = d.createMaterial('ConeFilter').setBaseColorFactor([0.60, 0.50, 0.30, 1]).setRoughnessFactor(0.9).setMetallicFactor(0).setDoubleSided(true);
  const coneMesh = (name, c) => { const lf = c.lf, rf = c.rf, seg = 40, gp = G(), UV = [];
    for (let i = 0; i <= seg; i++) { const a = i / seg * 2 * Math.PI, cs = Math.cos(a), sn = Math.sin(a), sl = (c.r1 - rf) / (c.len - lf); gp.P.push([rf * sn, lf, rf * cs], [c.r1 * sn, c.len, c.r1 * cs]); gp.N.push([sn, -sl, cs], [sn, -sl, cs]); const u = (1 - Math.abs(2 * i / seg - 1)) * 0.45; UV.push([u, 0], [u, (c.len - lf) / 40]); }
    for (let i = 0; i < seg; i++) { const a = i * 2; gp.T.push([a, a + 2, a + 1], [a + 1, a + 2, a + 3]); }
    const mp = mesh('p', M(gp), paper); mp.listPrimitives()[0].setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(UV.flat())));
    const gf = lathe(G(), [[0, 0], [rf, 0], [rf, lf]], seg);
    // closed end: the paper is folded in over the whole end in small pleats that meet at a dimple in the middle (no flower showing)
    const rin = 0.02, dip = Math.min(1.0, c.r1 * 0.24), pl = 9, RG = 6, S2 = 72, b0 = gf.P.length;
    const f = (a, t) => { const r = c.r1 - (c.r1 - rin) * t, w = 0.16 * c.r1 / 3 * Math.sin(pl * a + t * 1.6) * Math.sin(Math.PI * Math.min(1, t * 1.05)) * (1 - 0.5 * t); return [r * Math.sin(a), c.len - dip * Math.pow(t, 0.8) + w, r * Math.cos(a)]; };
    for (let j = 0; j <= RG; j++) for (let i = 0; i <= S2; i++) { const a = i / S2 * 2 * Math.PI, t = j / RG, e = 1e-3, p0 = f(a, t), pa = f(a + e, t), pt = f(a, Math.min(1, t + e)), u = pa.map((v, k) => v - p0[k]), v = pt.map((x, k) => x - p0[k]);
      let n = [u[2] * v[1] - u[1] * v[2], u[0] * v[2] - u[2] * v[0], u[1] * v[0] - u[0] * v[1]]; const l = Math.hypot(...n) || 1; n = n.map((x) => x / l); if (n[1] < 0) n = n.map((x) => -x); gf.P.push(p0); gf.N.push(t >= 1 ? [0, 1, 0] : n); }
    for (let j = 0; j < RG; j++) for (let i = 0; i < S2; i++) { const q = b0 + j * (S2 + 1) + i; gf.T.push([q, q + 1, q + S2 + 1], [q + 1, q + S2 + 2, q + S2 + 1]); }
    return d.createMesh(name).addPrimitive(mp.listPrimitives()[0]).addPrimitive(mesh('f', M(gf), tip).listPrimitives()[0]); };
  if (!R) { for (const [i, c] of cones.entries()) scene.addChild(d.createNode('cone' + i).setMesh(coneMesh('cone' + i, c))); return d; }  // a pre-roll on its own
  const w = 0.8, tube = d.createNode('tube'); scene.addChild(tube);
  // body: hollow, open top, with the hinge strap at the back
  const gb = lathe(G(), [[0, 0.6], [R - 0.4, 0.6], [R, 2.2], ...(rim ? [[R, Hb - 1.6], [R + rim, Hb - 0.9], [R + rim, Hb]] : [[R, Hb]]), [R - w, Hb], [R - w, 3], [0, 3]]); box(gb, [-3, Hb - 6, -(R + 1.1)], [3, Hb + 0.2, -(R - 0.2)]);
  tube.addChild(d.createNode('tube_body').setMesh(mesh('tube_body', M(gb), PP)));
  // cap on a hinge pivot at the back rim
  const k = capR || R + 0.6, gc = lathe(G(), [[0, -2.2], [R - w - 0.15, -2.2], [R - w - 0.15, 0], [k, 0], [k, capH - 0.5], [k - 0.5, capH], [0, capH]]); box(gc, [-3.6, 0, k - 0.3], [3.6, 1.2, k + 2.0]); box(gc, [-3, 0, -(k + 0.5)], [3, 2.2, -(k - 0.4)]);
  const pivot = d.createNode('tube_cap_pivot').setTranslation([0, mm(Hb), mm(-(k + 0.3))]); pivot.addChild(d.createNode('tube_cap').setMesh(mesh('tube_cap', M(gc), PP)).setTranslation([0, 0, mm(k + 0.3)])); tube.addChild(pivot);
  // pre-rolls: filter at the bottom, wide end up
  const coneNodes = [];
  for (const [i, c] of cones.entries()) { const n = d.createNode('cone' + i).setTranslation([mm(c.x), mm(3.2), mm(c.z || 0)]).setMesh(coneMesh('cone' + i, c)); tube.addChild(n); coneNodes.push([n, c]); }
  // sticker: 97 mm along the tube, 57.5 mm around it (left edge of the artwork at the bottom of the tube)
  if (label) { const r0 = mm(R + 0.15), L = 0.0575, H = 0.097, yb = mm(y0), seg = 128, half = L / (2 * r0), g = G(), UV = [];
    for (let i = 0; i <= seg; i++) { const a = i / seg, th = -half + a * 2 * half, s = Math.sin(th), c = Math.cos(th), r = r0 + mm(0.25) * a; g.P.push([r * s, yb + H, r * c], [r * s, yb, r * c]); g.N.push([s, 0, c], [s, 0, c]); UV.push([1, a], [0, a]); }
    for (let i = 0; i < seg; i++) { const a = i * 2; g.T.push([a, a + 1, a + 2], [a + 2, a + 1, a + 3]); }
    const tex = d.createTexture('label_clear').setImage(fs.readFileSync('tex_clear.png')).setMimeType('image/png');
    const mat = d.createMaterial('Label_gltf').setDoubleSided(true).setBaseColorTexture(tex).setMetallicFactor(0).setRoughnessFactor(0.4).setAlphaMode('BLEND');
    const m = mesh('tube_label', g, mat); m.listPrimitives()[0].setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(UV.flat()))); tube.addChild(d.createNode('tube_label').setMesh(m)); }
  // animation: 0..2 s. cap swings back 118 deg (0 - 1.3 s), pre-rolls rise (0.7 - 2 s)
  const N = 49, times = Array.from({ length: N }, (_, i) => i / (N - 1) * 2), ease = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
  const anim = d.createAnimation('Animation'), tin = acc('SCALAR', new Float32Array(times));
  const add = (node, path, type, vals) => { const s = d.createAnimationSampler().setInput(tin).setOutput(acc(type, new Float32Array(vals.flat()))).setInterpolation('LINEAR'); anim.addSampler(s).addChannel(d.createAnimationChannel().setTargetNode(node).setTargetPath(path).setSampler(s)); };
  add(pivot, 'rotation', 'VEC4', times.map((t) => { const th = -angle * Math.PI / 180 * ease(t / 1.3); return [Math.sin(th / 2), 0, 0, Math.cos(th / 2)]; }));
  for (const [n, c] of coneNodes) { const t0 = n.getTranslation(); add(n, 'translation', 'VEC3', times.map((t) => [t0[0], t0[1] + mm(c.rise) * ease((t - 0.7 - (c.delay || 0)) / 1.2), t0[2]])); }
  return d;
}
// pre-rolls as measured 25.11 (filled and closed): 0.25 g = the 0.5 g cone cut to 75; 0.5 g 107 long, 5 -> 7; 1.5 g cone is 140 x 5 -> 15 empty, ~110 once filled and closed
const C = { c025: { rf: 2.5, lf: 40, r1: 3.0, len: 73 }, c05: { rf: 2.5, lf: 40, r1: 3.5, len: 105 }, c15: { rf: 2.5, lf: 30, r1: 6.1, len: 108 } };
// 2 g tube: unchanged (20 mm body) until a customer runs it
await io.write(out + '/anim-tube-2.glb', build('', { R: 10, label: true, cones: [{ rf: 3.2, lf: 24, r1: 4.6, len: 106, x: 0, rise: 26 }] }));
// measured tube (24.11): 117 closed, body 17, cap 18 x 3, flared rim, cap swings to ~105 deg. Same tube for 0.5 g (two pre-rolls) and 1.5 g (one)
const T = { R: 8.5, Hb: 114, capR: 9, capH: 3, rim: 0.9, angle: 105, y0: 3, label: true };
await io.write(out + '/anim-tube.glb', build('', { ...T, cones: [{ ...C.c15, x: 0, rise: 26 }] }));
await io.write(out + '/anim-tube-slim.glb', build('', { ...T, cones: [{ ...C.c05, x: -3.6, rise: 26 }, { ...C.c05, x: 3.6, rise: 18, delay: 0.1 }] }));
C.c2 = { rf: 3.2, lf: 24, r1: 4.6, len: 106 };  // 2 g: same size as before, new look only
for (const [k, c] of Object.entries(C)) await io.write(out + '/cone-' + k.slice(1) + '.glb', build('', { cones: [c] }));
for (const f of ['anim-tube-2.glb', 'anim-tube.glb', 'anim-tube-slim.glb', 'cone-025.glb', 'cone-05.glb', 'cone-15.glb', 'cone-2.glb']) console.log(f, fs.statSync(out + '/' + f).size);
