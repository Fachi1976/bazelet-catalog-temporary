import { io, node, save, strip, doyClosed, M } from './lib.mjs';
import { getBounds } from '@gltf-transform/functions';
const MD = '/home/claude/bazelet-catalog-temporary/images/models/', out = process.argv[2], PT = 72 / 25.4;
const lin = (v, a0, a1, b0, b1) => b0 + (v - a0) / (a1 - a0) * (b1 - b0);
const pw = (F, G) => (x) => { let i = 0; while (i < F.length - 2 && x > F[i + 1]) i++; return lin(x, F[i], F[i + 1], G[i], G[i + 1]); };
// ---------- 1. oil carton -> 42 x 42 x 85 (dieline-16 = KN1000 "Thelet")
{ const d = await io.read(MD + 'anim-oil-box.glb'); const S = [42 / 40, 85 / 90, 42 / 30];
  const part = { obx_body: S, obx_lid: [S[0], 1, S[2]], obx_tuck: [S[0], 14 / 15, 1], obx_dustp1: [20.5 / 16.5, 1, S[2]], 'obx_dustp-1': [20.5 / 16.5, 1, S[2]] };
  const OP = [703.71, 577.24], NP = [541.4, 521.7], mapX = pw([72.1, 185.4, 270.5, 383.9, 466.1], [16, 58, 100, 142, 183.1].map((v) => v * PT)), mm = (v) => v * PT;
  const mapY = { obx_body: (y) => y <= 416.2 ? lin(y, 161.1, 416.2, mm(55.3), mm(140.3)) : lin(y, 416.2, 501.2, mm(140.3), mm(181.1)), obx_lid: (y) => lin(y, 76.1, 161.1, mm(13.7), mm(55.3)),
    obx_tuck: (y) => lin(y, 33.5, 76.1, mm(0.5), mm(13.7)), obx_dustp1: (y) => lin(y, 114.3, 161.1, mm(34.8), mm(55.3)), 'obx_dustp-1': (y) => lin(y, 114.3, 161.1, mm(34.8), mm(55.3)) };
  const done = new Set(), box = new Set(); const walk = (n) => { box.add(n); n.listChildren().forEach(walk); }; walk(node(d, 'obx'));
  for (const n of box) { const nm = n.getName(); n.setTranslation(n.getTranslation().map((v, k) => v * S[k]));
    if (n.getMesh()) for (const pr of n.getMesh().listPrimitives()) { const a = pr.getAttribute('POSITION'); if (!done.has(a)) { done.add(a); for (let i = 0; i < a.getCount(); i++) a.setElement(i, a.getElement(i, []).map((v, k) => v * part[nm][k])); }
      const uv = pr.getAttribute('TEXCOORD_0'); if (pr.getMaterial().getName() === 'Print_gltf' && !done.has(uv)) { done.add(uv); for (let i = 0; i < uv.getCount(); i++) { const e = uv.getElement(i, []); uv.setElement(i, [mapX(e[0] * OP[0]) / NP[0], mapY[nm](e[1] * OP[1]) / NP[1]]); } } } }
  for (const an of d.getRoot().listAnimations()) for (const ch of an.listChannels()) if (ch.getTargetPath() === 'translation' && box.has(ch.getTargetNode())) { const o = ch.getSampler().getOutput(); if (done.has(o)) continue; done.add(o); for (let i = 0; i < o.getCount(); i++) o.setElement(i, o.getElement(i, []).map((v, k) => v * S[k])); }
  const b = getBounds(node(d, 'obx')); console.log('oil box mm', b.min.map((v) => +(v * 1000).toFixed(1)), b.max.map((v) => +(v * 1000).toFixed(1)), 'bottle', getBounds(node(d, 'bin')).max.map((v) => +(v * 1000).toFixed(1)));
  await save(d, out + '/anim-oil-box.glb'); }
// ---------- 2. DOY carton: print mapping moved onto the CD1316 ("Gary") die, 131 x 39 x 190
{ const d = await io.read(MD + 'anim-doy-box.glb'); const OP = [1025.87, 943.14], NP = [996.803, 862.441], mm = (v) => v * PT;
  const mapX = pw([15, 147, 187, 319, 358.5].map(mm), [12.1, 143.1, 182.1, 313.1, 351.5].map(mm));
  const mapY = { dbox_body: (y) => y <= mm(271.2) ? lin(y, mm(81.2), mm(271.2), mm(57.1), mm(247.1)) : lin(y, mm(271.2), mm(311.2), mm(247.1), mm(286.6)), dbox_lid: (y) => lin(y, mm(41.2), mm(81.2), mm(17.6), mm(57.1)),
    dbox_tuck: (y) => lin(y, mm(26.2), mm(41.2), mm(2.6), mm(17.6)), dbox_dustp1: (y) => lin(y, mm(59.2), mm(81.2), mm(35.1), mm(57.1)), 'dbox_dustp-1': (y) => lin(y, mm(59.2), mm(81.2), mm(35.1), mm(57.1)) };
  const done = new Set();
  for (const n of d.getRoot().listNodes()) if (n.getMesh() && mapY[n.getName()]) for (const pr of n.getMesh().listPrimitives()) { const uv = pr.getAttribute('TEXCOORD_0'); if (pr.getMaterial().getName() !== 'Print_gltf' || done.has(uv)) continue; done.add(uv);
    const arr = []; for (let i = 0; i < uv.getCount(); i++) { const e = uv.getElement(i, []); arr.push(mapX(e[0] * OP[0]) / NP[0], mapY[n.getName()](e[1] * OP[1]) / NP[1]); }
    pr.setAttribute('TEXCOORD_0', d.createAccessor().setType('VEC2').setArray(new Float32Array(arr)).setBuffer(d.getRoot().listBuffers()[0])); }
  // pouch: close the bottom
  const pm = node(d, 'doyin').listChildren()[0]; console.log('doy box: pouch bottom loop', doyClosed(d, pm, { local: true }));
  await save(d, out + '/anim-doy-box.glb'); }
{ const d = await io.read(MD + 'anim-doy-gift.glb'); console.log('doy gift: loop', doyClosed(d, node(d, 'dgp'))); await save(d, out + '/anim-doy-gift.glb'); }
{ const d = await io.read(MD + 'anim-pouch-doy.glb'); const n = d.getRoot().listNodes().find((x) => x.getMesh()); console.log('doy pouch: loop', doyClosed(d, n, { local: true })); await save(d, out + '/anim-pouch-doy.glb'); }
// ---------- 3. jar stickers (263.5 long): 45 high on the regular jar, 30 on the low jar
for (const [f, parentName, H, y0] of [['anim-jar.glb', null, 0.045, 0.0055], ['anim-jar-box.glb', 'jarin', 0.045, 0.0055], ['anim-jar-short.glb', null, 0.030, 0.0055], ['anim-jar-box-short.glb', 'jarsin', 0.030, 0.0055]]) {
  const d = await io.read(MD + f); const par = parentName ? node(d, parentName) : null;
  if (par) { const body = par.listChildren().find((c) => /_body$/.test(c.getName())); const bb = getBounds(body), pb = par.getWorldMatrix(); console.log(f, 'parent world y', (pb[13] * 1000).toFixed(1), 'body min y', (bb.min[1] * 1000).toFixed(1)); }
  strip(d, par, 'jar_label', { r: 0.0446, L: 0.2635, H, y0 }); await save(d, out + '/' + f); }
