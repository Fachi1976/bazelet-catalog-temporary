// category-card scenes: the carton with its inner item standing in front of it
import { io, node } from '../lib.mjs';
import { mergeDocuments, prune, unpartition } from '@gltf-transform/functions';
const MD = '/home/claude/bazelet-catalog-temporary/images/models/';
const kill = (n) => { for (const c of n.listChildren()) kill(c); n.dispose(); };
async function make(boxFile, itemFile, keep, pos, out) {
  const d = await io.read(MD + boxFile); for (const e of d.getRoot().listExtensionsUsed()) if (e.extensionName === 'EXT_meshopt_compression') e.dispose();
  const src = await io.read(MD + itemFile); for (const e of src.getRoot().listExtensionsUsed()) if (e.extensionName === 'EXT_meshopt_compression') e.dispose();
  for (const a of src.getRoot().listAnimations()) a.dispose();
  const sc = src.getRoot().listScenes()[0]; for (const c of sc.listChildren()) if (!keep(c.getName())) { sc.removeChild(c); kill(c); }
  await src.transform(prune({ keepSolidTextures: true, keepAttributes: true }));
  const before = new Set(d.getRoot().listScenes()); mergeDocuments(d, src); const scene = [...before][0]; const hold = d.createNode('card_item').setTranslation(pos); scene.addChild(hold);
  for (const s of d.getRoot().listScenes()) if (!before.has(s)) { for (const c of s.listChildren()) { s.removeChild(c); if (keep(c.getName()) === 'center') { const t = c.getTranslation(); c.setTranslation([0, t[1], 0]); } hold.addChild(c); } s.dispose(); }
  await d.transform(unpartition()); await io.write(out, d); console.log('wrote', out);
}
await make('anim-slims-std.glb', 'anim-slims-std.glb', (n) => n === 't0' ? 'center' : false, [0.050, 0, 0.052], 'bl/card-slims.glb');
await make('anim-oil-box.glb', 'anim-dropper.glb', (n) => true, [0.040, 0, 0.050], 'bl/card-oil.glb');
