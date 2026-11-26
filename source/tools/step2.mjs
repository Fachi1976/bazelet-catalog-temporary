import { io, M, node, save, pouch } from './lib.mjs';
import { getBounds, prune } from '@gltf-transform/functions';
const out = process.argv[2];
const id = (p) => p;
const kill = (n) => { for (const c of n.listChildren()) kill(c); const m = n.getMesh(); n.dispose(); if (m && m.listParents().filter((p) => p.propertyType === 'Node').length === 0) { for (const pr of m.listPrimitives()) pr.dispose(); m.dispose(); } };
// ---- standard flower box: the pouch stands in the box, zipper on top, front towards the box front (+z). Work in the animated parent's frame.
async function standard(standalone) {
  const d = await io.read(M + 'anim-flower-standard.glb'); const par = node(d, 'fsp'), n = par.listChildren()[0]; n.setName('fsp_mesh');
  const m = n.getMatrix(); // bounds in the parent's frame
  const pos = n.getMesh().listPrimitives()[0].getAttribute('POSITION'); let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (let i = 0; i < pos.getCount(); i++) { const p = pos.getElement(i, []); const w = [m[0]*p[0]+m[12], m[5]*p[1]+m[13], m[10]*p[2]+m[14]]; for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], w[k]); mx[k] = Math.max(mx[k], w[k]); } }
  console.log('standard pouch local', mn.map((v) => +(v * 1000).toFixed(1)), mx.map((v) => +(v * 1000).toFixed(1)));
  const frame = (p, fn) => [(mx[1] - p[1]) / (mx[1] - mn[1]), (p[0] - mn[0]) / (mx[0] - mn[0]), fn ? fn[2] : 0];
  pouch(d, n, { place: id, frame, local: true });
  if (standalone) {
    for (const a of d.getRoot().listAnimations()) a.dispose();
    const box = node(d, 'fstd'); d.getRoot().listScenes()[0].removeChild(box); kill(box);
    par.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 0.75]);
    await save(d, out + '/anim-pouch-v.glb');
  } else await save(d, out + '/anim-flower-standard.glb');
}
await standard(false); await standard(true);
// ---- gift pouch on its own: 200 x 150, standing, zipper on the right
{ const d = await io.read(M + 'anim-flower-gift.glb'); const n = node(d, 'fgp'); const b = getBounds(n);
  const cx = (b.min[0] + b.max[0]) / 2, cz = (b.min[2] + b.max[2]) / 2, cy = (b.min[1] + b.max[1]) / 2, sx = 0.200 / (b.max[0] - b.min[0]), sz = 0.150 / (b.max[2] - b.min[2]);
  const place = (p, isN) => isN ? [-p[0], p[2], p[1]] : [-(p[0] - cx) * sx, (p[2] - cz) * sz + 0.075, p[1] - cy];
  const frame = (p, fn) => [(0.1 - p[0]) / 0.2, (0.15 - p[1]) / 0.15, fn ? fn[2] : 0];
  pouch(d, n, { place, frame });
  for (const a of d.getRoot().listAnimations()) a.dispose();
  const box = node(d, 'fgift'); d.getRoot().listScenes()[0].removeChild(box); kill(box);
  await save(d, out + '/anim-pouch-h.glb'); }
// ---- single-tube carton 28 x 28 x 120: the tuck-end oil carton (40 x 30 x 90) re-proportioned, with one tube inside
{ const d = await io.read(M + 'anim-oil-box.glb'); const S = [28 / 40, 120 / 90, 28 / 30];
  const bin = node(d, 'bin'); d.getRoot().listScenes()[0].removeChild(bin); for (const c of bin.listChildren()) c.dispose(); bin.dispose();
  const done = new Set();
  for (const n of d.getRoot().listNodes()) {
    n.setTranslation(n.getTranslation().map((v, k) => v * S[k])); n.setName(n.getName().replace('obx', 'tbx'));
    if (n.getMesh()) for (const pr of n.getMesh().listPrimitives()) { const a = pr.getAttribute('POSITION'); if (done.has(a)) continue; done.add(a);
      for (let i = 0; i < a.getCount(); i++) a.setElement(i, a.getElement(i, []).map((v, k) => v * S[k])); }
  }
  for (const an of d.getRoot().listAnimations()) for (const ch of an.listChannels()) if (ch.getTargetPath() === 'translation') { const o = ch.getSampler().getOutput(); if (done.has(o)) continue; done.add(o);
    for (let i = 0; i < o.getCount(); i++) o.setElement(i, o.getElement(i, []).map((v, k) => v * S[k])); }
  // tube from the 1.5 g pack
  const src = await io.read(M + 'anim-pr15-std.glb'); const t0 = node(src, 't0'); const tb = getBounds(t0);
  console.log('tube bounds', tb.min.map((v) => +(v * 1000).toFixed(1)), tb.max.map((v) => +(v * 1000).toFixed(1)), 'children', t0.listChildren().map((c) => c.getName()), 'TRS', t0.getTranslation(), t0.getRotation(), t0.getScale());
  for (const a of src.getRoot().listAnimations()) a.dispose();
  const sc = src.getRoot().listScenes()[0]; for (const c of sc.listChildren()) if (c !== t0) { sc.removeChild(c); c.dispose(); }
  for (const n of src.getRoot().listNodes()) if (n !== t0 && !n.getParentNode() ) n.dispose();
  await src.transform(prune());
  const { mergeDocuments } = await import('@gltf-transform/functions');
  const before = new Set(d.getRoot().listScenes()); mergeDocuments(d, src); const scene = [...before][0];
  for (const s of d.getRoot().listScenes()) if (!before.has(s)) { for (const c of s.listChildren()) { s.removeChild(c);
      const t = c.getTranslation(); c.setTranslation([t[0] - (tb.min[0] + tb.max[0]) / 2, t[1] - tb.min[1] + 0.0008, t[2] - (tb.min[2] + tb.max[2]) / 2]); c.setName('tube'); scene.addChild(c); } s.dispose(); }
  console.log('tube box', getBounds(node(d, 'tbx')), getBounds(node(d, 'tube')));
  await save(d, out + '/anim-tube-box.glb'); }
