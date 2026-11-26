// preroll + oil master box: open state shows the two inner cartons (closed, static)
import { io, M, node, save } from './lib.mjs';
import { mergeDocuments, prune, getBounds } from '@gltf-transform/functions';
const out = process.argv[2];
const doc = await io.read(M + 'anim-oilcombo.glb'); const root = doc.getRoot(), scene = root.listScenes()[0];
async function addBox(file, boxName, drop, S, matName, prefix, t, r) {
  const src = await io.read(M + file);
  for (const a of src.getRoot().listAnimations()) a.dispose();
  for (const n of src.getRoot().listNodes()) if (drop.includes(n.getName())) { for (const c of n.listChildren()) c.dispose(); src.getRoot().listScenes()[0].removeChild(n); n.dispose(); }
  // re-proportion: leaf mesh nodes take the per-axis scale, every translation is scaled (flaps are unrotated at rest)
  for (const n of src.getRoot().listNodes()) { n.setTranslation(n.getTranslation().map((v, k) => v * S[k])); if (n.getMesh()) n.setScale(n.getScale().map((v, k) => v * S[k])); }
  for (const m of src.getRoot().listMaterials()) if (m.getName() === 'Print_gltf') m.setName(matName + '_gltf');
  for (const n of src.getRoot().listNodes()) n.setName(prefix + n.getName());
  await src.transform(prune());
  const before = new Set(root.listScenes()); mergeDocuments(doc, src);
  for (const s of root.listScenes()) if (!before.has(s)) {
    for (const n of s.listChildren()) { s.removeChild(n); if (n.getName() === prefix + boxName) { n.setTranslation(t); n.setRotation(r); scene.addChild(n); } else n.dispose(); }
    s.dispose(); }
  const b = getBounds(node(doc, prefix + boxName)); console.log(prefix + boxName, b.min.map((v) => +(v * 1000).toFixed(1)), b.max.map((v) => +(v * 1000).toFixed(1)));
}
// master inside: 122.6 wide, 34 deep, 92 high. pre-roll carton 90 x 24 x 90 (two trays upright) + spritzer carton 32 x 32 x 90
await addBox('anim-flower5.glb', 'f5', ['c5f'], [90 / 96, 1, 24 / 40], 'PrintPreroll', 'in_', [-0.0161, 0.0006, 0], [0, 0, 0, 1]);
await addBox('anim-oil-box.glb', 'obx', ['bin'], [32 / 40, 1, 32 / 30], 'PrintOil', 'in_', [0.0451, 0.0006, 0], [0, 0, 0, 1]);
await save(doc, out + '/anim-oilcombo.glb');
