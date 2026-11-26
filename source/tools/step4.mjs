// single-tube carton 28 x 20 x 120 (supplier dieline IF3095509): the reverse-tuck oil carton re-proportioned part by part,
// with its print UVs moved onto the new dieline page, and one tube inside
import { io, M, node, save } from './lib.mjs';
import { getBounds, prune, mergeDocuments } from '@gltf-transform/functions';
import fs from 'fs';
const out = process.argv[2]; const g = JSON.parse(fs.readFileSync('tube/geo.json'));
const d = await io.read(M + 'anim-oil-box.glb');
const bin = node(d, 'bin'); d.getRoot().listScenes()[0].removeChild(bin); for (const c of bin.listChildren()) c.dispose(); bin.dispose();
const S = [28 / 40, 120 / 90, 20 / 30];
// per-part vertex scale (flaps keep their real lengths from the dieline)
const part = { obx_body: S, obx_lid: [S[0], 1, S[2]], obx_tuck: [S[0], 10.5 / 15, 1], obx_dustp1: [13.3 / 16.5, 1, S[2]], 'obx_dustp-1': [13.3 / 16.5, 1, S[2]] };
// old page (pt) -> new page (pt)
const OP = [703.71, 577.24], F = [72.1, 185.4, 270.5, 383.9, 466.1], G = g.folds;
const lin = (v, a0, a1, b0, b1) => b0 + (v - a0) / (a1 - a0) * (b1 - b0);
const mapX = (x) => { let i = 0; while (i < 3 && x > F[i + 1]) i++; return lin(x, F[i], F[i + 1], G[i], G[i + 1]); };
const top = g.foldTop, bot = g.foldTop + g.foldLen;
const mapY = { obx_body: (y) => y <= 416.2 ? lin(y, 161.1, 416.2, top, bot) : lin(y, 416.2, 501.2, g.bottom[0], g.bottom[1]),
  obx_lid: (y) => lin(y, 76.1, 161.1, g.lid[0], g.lid[1]), obx_tuck: (y) => lin(y, 33.5, 76.1, g.tuck[0], g.tuck[1]),
  obx_dustp1: (y) => lin(y, 114.3, 161.1, g.dust[0], g.dust[1]), 'obx_dustp-1': (y) => lin(y, 114.3, 161.1, g.dust[0], g.dust[1]) };
const done = new Set();
for (const n of d.getRoot().listNodes()) {
  const nm = n.getName(); n.setTranslation(n.getTranslation().map((v, k) => v * S[k]));
  if (n.getMesh()) for (const pr of n.getMesh().listPrimitives()) {
    const a = pr.getAttribute('POSITION'); if (!done.has(a)) { done.add(a); for (let i = 0; i < a.getCount(); i++) a.setElement(i, a.getElement(i, []).map((v, k) => v * part[nm][k])); }
    const uv = pr.getAttribute('TEXCOORD_0');
    if (pr.getMaterial().getName() === 'Print_gltf' && !done.has(uv)) { done.add(uv);
      for (let i = 0; i < uv.getCount(); i++) { const e = uv.getElement(i, []); uv.setElement(i, [mapX(e[0] * OP[0]) / g.page[0], mapY[nm](e[1] * OP[1]) / g.page[1]]); } }
  }
  n.setName(nm.replace('obx', 'tbx'));
}
for (const an of d.getRoot().listAnimations()) for (const ch of an.listChannels()) if (ch.getTargetPath() === 'translation') { const o = ch.getSampler().getOutput(); if (done.has(o)) continue; done.add(o);
  for (let i = 0; i < o.getCount(); i++) o.setElement(i, o.getElement(i, []).map((v, k) => v * S[k])); }
// tube (19 mm) from the 1.5 g pack
const src = await io.read(M + 'anim-pr15-std.glb'); const t0 = node(src, 't0'); const tb = getBounds(t0);
for (const a of src.getRoot().listAnimations()) a.dispose();
const sc = src.getRoot().listScenes()[0]; for (const c of sc.listChildren()) if (c !== t0) { sc.removeChild(c); c.dispose(); }
await src.transform(prune());
const before = new Set(d.getRoot().listScenes()); mergeDocuments(d, src); const scene = [...before][0];
for (const s of d.getRoot().listScenes()) if (!before.has(s)) { for (const c of s.listChildren()) { s.removeChild(c);
  const holder = d.createNode('tube').setScale([19 / 21, 1, 19 / 21]).setTranslation([0, 0.0008 - tb.min[1], 0]);
  const t = c.getTranslation(); c.setTranslation([t[0] - (tb.min[0] + tb.max[0]) / 2, t[1], t[2] - (tb.min[2] + tb.max[2]) / 2]); holder.addChild(c); scene.addChild(holder); } s.dispose(); }
const b = getBounds(node(d, 'tbx')), t = getBounds(node(d, 'tube'));
console.log('box mm', b.min.map((v) => +(v * 1000).toFixed(1)), b.max.map((v) => +(v * 1000).toFixed(1)), 'tube', t.min.map((v) => +(v * 1000).toFixed(1)), t.max.map((v) => +(v * 1000).toFixed(1)));
await save(d, out + '/anim-tube-box.glb');
