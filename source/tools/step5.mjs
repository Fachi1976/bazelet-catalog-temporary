import { io, M, node, save, doy } from './lib.mjs';
import { getBounds, prune, mergeDocuments } from '@gltf-transform/functions';
const out = process.argv[2];
const kill = (n) => { for (const c of n.listChildren()) kill(c); const m = n.getMesh(); n.dispose(); if (m && m.listParents().filter((p) => p.propertyType === 'Node').length === 0) { for (const pr of m.listPrimitives()) pr.dispose(); m.dispose(); } };
// ---- DOY pouch inside the small box (animated parent) and inside the small gift box
{ const d = await io.read(M + 'anim-doy-box.glb'); const n = node(d, 'doyin').listChildren()[0]; n.setName('doyin_mesh'); const b = doy(d, n, { local: true }); console.log('doy in box (parent frame) mm', b.mn.map((v) => +(v * 1000).toFixed(1)), b.mx.map((v) => +(v * 1000).toFixed(1))); await save(d, out + '/anim-doy-box.glb'); }
{ const d = await io.read(M + 'anim-doy-gift.glb'); doy(d, node(d, 'dgp')); await save(d, out + '/anim-doy-gift.glb'); }
// ---- DOY pouch on its own
{ const d = await io.read(M + 'anim-doy-box.glb'); const par = node(d, 'doyin'), n = par.listChildren()[0]; n.setName('doy_mesh'); doy(d, n, { local: true });
  for (const a of d.getRoot().listAnimations()) a.dispose(); const box = node(d, 'dbox'); d.getRoot().listScenes()[0].removeChild(box); kill(box);
  par.setTranslation([0, 0, 0]).setRotation([0, 0, 0, 1]).setScale([1, 1, 0.8]); await save(d, out + '/anim-pouch-doy.glb'); }
// ---- 5 g carton of the pre-roll + oil set: the LinQ 96 x 40 x 90 carton with two pre-roll trays standing inside
{ const d = await io.read(M + 'anim-flower5.glb'); const jar = node(d, 'c5f');
  for (const an of d.getRoot().listAnimations()) for (const ch of an.listChannels()) if (ch.getTargetNode() === jar) { ch.getSampler().dispose(); ch.dispose(); }
  d.getRoot().listScenes()[0].removeChild(jar); kill(jar);
  const src = await io.read(M + 'anim-horizontal-mix.glb'); for (const a of src.getRoot().listAnimations()) a.dispose();
  const sc = src.getRoot().listScenes()[0]; for (const c of sc.listChildren()) if (!['tray0', 'tray1'].includes(c.getName())) { sc.removeChild(c); kill(c); }
  const tb = getBounds(node(src, 'tray0')); console.log('tray mm', tb.min.map((v) => +(v * 1000).toFixed(1)), tb.max.map((v) => +(v * 1000).toFixed(1)));
  await src.transform(prune());
  const before = new Set(d.getRoot().listScenes()); mergeDocuments(d, src); const scene = [...before][0]; let i = 0;
  for (const s of d.getRoot().listScenes()) if (!before.has(s)) { for (const c of s.listChildren()) { s.removeChild(c);
    // tray lies flat (x 87, y 11, z 81): stand it up (rotate -90 deg about x: top/foil faces the front), two trays one behind the other
    const cx = (tb.min[0] + tb.max[0]) / 2, cz = (tb.min[2] + tb.max[2]) / 2, th = tb.max[1] - tb.min[1];
    const t = c.getTranslation(); c.setTranslation([t[0] - cx, 0, t[2] - cz]);     // centre, base at y = 0 of the holder
    const hold = d.createNode('ptray' + i).setRotation([Math.SQRT1_2, 0, 0, Math.SQRT1_2]).setTranslation([0, 0.0008 + (tb.max[2] - tb.min[2]) / 2, i === 0 ? 0.01065 : -0.00055]);
    hold.addChild(c); scene.addChild(hold); i++; } s.dispose(); }
  for (const nm of ['ptray0', 'ptray1']) { const b = getBounds(node(d, nm)); console.log(nm, b.min.map((v) => +(v * 1000).toFixed(1)), b.max.map((v) => +(v * 1000).toFixed(1))); }
  console.log('box', getBounds(node(d, 'f5')).min.map((v) => +(v * 1000).toFixed(1)), getBounds(node(d, 'f5')).max.map((v) => +(v * 1000).toFixed(1)), d.getRoot().listMaterials().map((m) => m.getName()));
  await save(d, out + '/anim-preroll5.glb'); }
