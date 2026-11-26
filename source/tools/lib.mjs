import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, unpartition, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
export const M = '/home/claude/work/orig/images/models/';
export const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
export const node = (doc, name) => doc.getRoot().listNodes().find((n) => n.getName() === name);
export const xf = (m, p) => [m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12], m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13], m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]];
export const xn = (m, p) => { const v = [m[0]*p[0]+m[4]*p[1]+m[8]*p[2], m[1]*p[0]+m[5]*p[1]+m[9]*p[2], m[2]*p[0]+m[6]*p[1]+m[10]*p[2]]; const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
export async function save(doc, file) {
  const had = doc.getRoot().listExtensionsUsed().some((e) => e.extensionName === 'EXT_meshopt_compression');
  for (const e of doc.getRoot().listExtensionsUsed()) if (['EXT_meshopt_compression'].includes(e.extensionName)) e.dispose();
  await doc.transform(unpartition(), dedup(), prune({ keepSolidTextures: true, keepAttributes: true }));
  if (had) await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(file, doc); console.log('wrote', file, fs.statSync(file).size);
}
function texMat(doc, name, png, opts) {
  const tex = doc.createTexture(name.toLowerCase() + '_base').setImage(fs.readFileSync(png)).setMimeType('image/png');
  const m = doc.createMaterial(name + '_gltf').setDoubleSided(true).setBaseColorTexture(tex).setMetallicFactor(opts.metal).setRoughnessFactor(opts.rough);
  return m;
}
// world-space vertices/triangles of a mesh node
function soup(n, local) {
  const W = local ? n.getMatrix() : n.getWorldMatrix(); const out = { P: [], N: [], T: [] };
  for (const pr of n.getMesh().listPrimitives()) {
    const pos = pr.getAttribute('POSITION'), nor = pr.getAttribute('NORMAL'), idx = pr.getIndices(), b = out.P.length;
    for (let i = 0; i < pos.getCount(); i++) { out.P.push(xf(W, pos.getElement(i, []))); out.N.push(xn(W, nor.getElement(i, []))); }
    const cnt = idx ? idx.getCount() : pos.getCount();
    for (let i = 0; i < cnt; i += 3) out.T.push([0, 1, 2].map((k) => b + (idx ? idx.getScalar(i + k) : i + k)));
  }
  const det = W[0]*(W[5]*W[10]-W[6]*W[9]) - W[4]*(W[1]*W[10]-W[2]*W[9]) + W[8]*(W[1]*W[6]-W[2]*W[5]);
  if (det < 0) out.T = out.T.map((t) => [t[0], t[2], t[1]]);
  return out;
}
function setMesh(doc, n, name, P, N, UV, T, mat) {
  const buf = doc.getRoot().listBuffers()[0];
  const acc = (type, arr) => doc.createAccessor().setType(type).setArray(arr).setBuffer(buf);
  const prim = doc.createPrimitive().setAttribute('POSITION', acc('VEC3', new Float32Array(P.flat()))).setAttribute('NORMAL', acc('VEC3', new Float32Array(N.flat())))
    .setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(UV.flat()))).setIndices(acc('SCALAR', new Uint32Array(T.flat()))).setMaterial(mat);
  n.setMesh(doc.createMesh(name).addPrimitive(prim));
}
/* Pouch (flat pillow, two printed faces) -> printable 'Pouch' material.
   The node is re-baked to identity. `frame(p)` maps a world point to [s, c, side]:
   s = 0 at the zipper end .. 1 at the far end, c = 0 at the reader's top edge .. 1 bottom, side>0 front.
   Texture = flat artboard 450 x 150 mm: front panel x 15..215, back panel x 235..435, art upside-down as in the supplier dieline. */
export function pouch(doc, n, { place, frame, local }) {
  const g = soup(n, local); const P = g.P.map((p) => place(p, false)), N = g.N.map((v) => place(v, true));
  const key = new Map(), oP = [], oN = [], oUV = [], oT = [];
  for (const t of g.T) {
    const [a, b, c] = t.map((i) => P[i]);
    const fn = [(b[1]-a[1])*(c[2]-a[2])-(b[2]-a[2])*(c[1]-a[1]), (b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]), (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])];
    const front = frame(a, fn)[2] >= 0;
    oT.push(t.map((i) => {
      const k = i * 2 + (front ? 1 : 0); if (key.has(k)) return key.get(k);
      const [s, cc] = frame(P[i]); const j = oP.length; key.set(k, j);
      oP.push(P[i]); oN.push(N[i]); oUV.push([(front ? 15 + s * 200 : 435 - s * 200) / 450, 1 - cc]); return j;
    }));
  }
  const mat = doc.getRoot().listMaterials().find((m) => m.getName() === 'Pouch_gltf') || texMat(doc, 'Pouch', 'tex_alu.png', { metal: 1, rough: 0.3 });
  n.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);
  setMesh(doc, n, n.getName(), oP, oN, oUV, oT, mat);
  return { P: oP };
}
/* Bottle label: rebuilt as an open strip 85 x 35 mm around the glass (r 14.3), centred on the front (+z), seam gap at the back. */
export function label(doc, n, { y0 = 0.00425, r = 0.0143, L = 0.085, H = 0.035, seg = 96 } = {}) {
  const P = [], N = [], UV = [], T = [], half = L / (2 * r);
  for (let i = 0; i <= seg; i++) { const u = i / seg, th = -half + u * 2 * half, s = Math.sin(th), c = Math.cos(th);
    P.push([r * s, y0 + H, r * c], [r * s, y0, r * c]); N.push([s, 0, c], [s, 0, c]); UV.push([u, 0], [u, 1]); }
  for (let i = 0; i < seg; i++) { const a = i * 2; T.push([a, a + 1, a + 2], [a + 2, a + 1, a + 3]); }
  const old = doc.getRoot().listMaterials().find((m) => m.getName() === 'Label');
  let mat = doc.getRoot().listMaterials().find((m) => m.getName() === 'Label_gltf');
  if (!mat) { mat = texMat(doc, 'Label', 'tex_label.png', { metal: 0, rough: 0.45 }); if (old) for (const e of old.listExtensions()) mat.setExtension(e.extensionName, e); }
  n.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);  // strip is defined in the bottle frame
  setMesh(doc, n, n.getName(), P, N, UV, T, mat);
}
/* General two/three-faced printable film part: `face(a, fn)` returns a face key for a triangle (first vertex, face normal),
   `uv(p, key)` the texture coordinate of a point on that face. The node is re-baked to identity in its parent (local) or in the world. */
export function retex(doc, n, { place = (p) => p, face, uv, local, matName = 'Pouch' }) {
  const g = soup(n, local); const P = g.P.map((p) => place(p, false)), N = g.N.map((v) => place(v, true));
  const key = new Map(), oP = [], oN = [], oUV = [], oT = [];
  for (const t of g.T) {
    const [a, b, c] = t.map((i) => P[i]);
    const fn = [(b[1]-a[1])*(c[2]-a[2])-(b[2]-a[2])*(c[1]-a[1]), (b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]), (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])];
    const l = Math.hypot(...fn) || 1; const k = face([(a[0]+b[0]+c[0])/3, (a[1]+b[1]+c[1])/3, (a[2]+b[2]+c[2])/3], fn.map((v) => v / l));
    oT.push(t.map((i) => { const kk = i + '|' + k; if (key.has(kk)) return key.get(kk); const j = oP.length; key.set(kk, j); oP.push(P[i]); oN.push(N[i]); oUV.push(uv(P[i], k)); return j; }));
  }
  const mat = doc.getRoot().listMaterials().find((m) => m.getName() === matName + '_gltf') || texMat(doc, matName, 'tex_alu.png', { metal: 1, rough: 0.3 });
  n.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);
  setMesh(doc, n, n.getName() || 'pouch', oP, oN, oUV, oT, mat);
  return oP;
}
/* Stand-up (DOY) pouch, upright, front towards +z. Artboard 133.33 x 520 mm (supplier layout):
   front panel y 10..200 (upright), bottom gusset 220..300, back panel 320..510 (drawn upside-down). */
export function doy(doc, n, opts = {}) {
  const g = soup(n, opts.local); let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (const p of g.P) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], p[k]); mx[k] = Math.max(mx[k], p[k]); }
  const W = mx[0] - mn[0], H = mx[1] - mn[1], D = mx[2] - mn[2];
  // the gusset is an inverted V under the pouch: near the bottom, facing down and towards the middle
  const zc = (mn[2] + mx[2]) / 2;
  const face = (c, fn) => (c[1] < mn[1] + 0.25 * H && fn[1] < -0.05 && fn[2] * (c[2] - zc) < 0) ? 'g' : (fn[2] >= 0 ? 'f' : 'b');
  const uv = (p, k) => { const u = (p[0] - mn[0]) / W, t = (mx[1] - p[1]) / H;
    const y = k === 'f' ? 10 + t * 190 : k === 'b' ? 510 - t * 190 : 220 + (mx[2] - p[2]) / D * 80; return [u, y / 520]; };
  retex(doc, n, { face, uv, local: opts.local }); return { mn, mx };
}
/* Wrap-around sticker on a round jar: an open strip L x H mm at radius r, centred on the front (+z). Invisible until a design is applied. */
export function strip(doc, parent, name, { r, L, H, y0, seg = 160 }) {
  const P = [], N = [], UV = [], T = [], half = L / (2 * r);
  for (let i = 0; i <= seg; i++) { const u = i / seg, th = -half + u * 2 * half, s = Math.sin(th), c = Math.cos(th);
    P.push([r * s, y0 + H, r * c], [r * s, y0, r * c]); N.push([s, 0, c], [s, 0, c]); UV.push([u, 0], [u, 1]); }
  for (let i = 0; i < seg; i++) { const a = i * 2; T.push([a, a + 1, a + 2], [a + 2, a + 1, a + 3]); }
  let mat = doc.getRoot().listMaterials().find((m) => m.getName() === 'Label_gltf');
  if (!mat) { const tex = doc.createTexture('label_clear').setImage(fs.readFileSync('tex_clear.png')).setMimeType('image/png');
    mat = doc.createMaterial('Label_gltf').setDoubleSided(true).setBaseColorTexture(tex).setMetallicFactor(0).setRoughnessFactor(0.4).setAlphaMode('BLEND'); }
  const n = doc.createNode(name); setMesh(doc, n, name, P, N, UV, T, mat);
  if (parent) parent.addChild(n); else doc.getRoot().listScenes()[0].addChild(n);
  return n;
}
/* Close an open bottom: find the lowest boundary loop and fan it to a point slightly inside (reads as the folded gusset). */
function capBottom(g) {
  let mnY = 1e9, mxY = -1e9; for (const p of g.P) { mnY = Math.min(mnY, p[1]); mxY = Math.max(mxY, p[1]); }
  const key = (p) => p.map((v) => Math.round(v * 2e5)).join(','); const id = new Map(), rep = []; const w = g.P.map((p) => { const k = key(p); if (!id.has(k)) { id.set(k, rep.length); rep.push(p); } return id.get(k); });
  const E = new Map(); for (const t of g.T) for (let k = 0; k < 3; k++) { const a = w[t[k]], b = w[t[(k + 1) % 3]]; if (a === b) continue; const kk = a < b ? a + '_' + b : b + '_' + a; E.set(kk, (E.get(kk) || 0) + 1); }
  const adj = new Map(); for (const [kk, c] of E) if (c === 1) { const [a, b] = kk.split('_').map(Number); if (rep[a][1] > mnY + 0.25 * (mxY - mnY) || rep[b][1] > mnY + 0.25 * (mxY - mnY)) continue; (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); }
  const seen = new Set(); let best = [];
  for (const s of adj.keys()) { if (seen.has(s)) continue; const loop = [s]; seen.add(s); let cur = s; for (;;) { const nx = (adj.get(cur) || []).find((v) => !seen.has(v)); if (nx === undefined) break; loop.push(nx); seen.add(nx); cur = nx; } if (loop.length > best.length) best = loop; }
  if (best.length < 8) return 0;
  const c = [0, 0, 0]; for (const i of best) for (let k = 0; k < 3; k++) c[k] += rep[i][k] / best.length; c[1] += 0.006;
  const ci = g.P.length; g.P.push(c); g.N.push([0, -1, 0]); const base = g.P.length;
  best.forEach((i) => { g.P.push(rep[i].slice()); g.N.push([0, -1, 0]); });
  for (let k = 0; k < best.length; k++) { const a = base + k, b = base + (k + 1) % best.length; const pa = g.P[a], pb = g.P[b];
    const ny = (pb[2] - pa[2]) * (c[0] - pa[0]) - (pb[0] - pa[0]) * (c[2] - pa[2]);   // y of (pb-pa) x (c-pa)
    g.T.push(ny < 0 ? [a, b, ci] : [b, a, ci]); }
  return best.length;
}
export function doyClosed(doc, n, opts = {}) {
  const g = soup(n, opts.local); const added = capBottom(g); let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (const p of g.P) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], p[k]); mx[k] = Math.max(mx[k], p[k]); }
  const W = mx[0] - mn[0], H = mx[1] - mn[1], D = mx[2] - mn[2], zc = (mn[2] + mx[2]) / 2;
  const face = (c, fn) => (c[1] < mn[1] + 0.25 * H && fn[1] < -0.05 && fn[2] * (c[2] - zc) < 0) || (fn[1] < -0.8 && c[1] < mn[1] + 0.1 * H) ? 'g' : (fn[2] >= 0 ? 'f' : 'b');
  const uv = (p, k) => { const u = (p[0] - mn[0]) / W, t = (mx[1] - p[1]) / H; const y = k === 'f' ? 10 + t * 190 : k === 'b' ? 510 - t * 190 : 220 + (mx[2] - p[2]) / D * 80; return [u, y / 520]; };
  // re-bake through retex using the capped soup
  const key = new Map(), oP = [], oN = [], oUV = [], oT = [];
  for (const t of g.T) { const [a, b, c] = t.map((i) => g.P[i]);
    const fn = [(b[1]-a[1])*(c[2]-a[2])-(b[2]-a[2])*(c[1]-a[1]), (b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]), (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])]; const l = Math.hypot(...fn) || 1;
    const k = face([(a[0]+b[0]+c[0])/3, (a[1]+b[1]+c[1])/3, (a[2]+b[2]+c[2])/3], fn.map((v) => v / l));
    oT.push(t.map((i) => { const kk = i + '|' + k; if (key.has(kk)) return key.get(kk); const j = oP.length; key.set(kk, j); oP.push(g.P[i]); oN.push(g.N[i]); oUV.push(uv(g.P[i], k)); return j; })); }
  const mat = doc.getRoot().listMaterials().find((m) => m.getName() === 'Pouch_gltf') || texMat(doc, 'Pouch', 'tex_alu.png', { metal: 1, rough: 0.3 });
  n.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]); setMesh(doc, n, n.getName() || 'pouch', oP, oN, oUV, oT, mat);
  return added;
}
