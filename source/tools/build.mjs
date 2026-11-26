import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { mergeDocuments, dedup, prune, unpartition } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
const M = '/home/claude/bazelet-catalog-temporary/images/models/';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(M + 'anim-flower-oil.glb');
const root = doc.getRoot(), scene = root.listScenes()[0];
// 1. remove the loose jar + bottle
for (const n of root.listNodes()) if (['fobin', 'fotub'].includes(n.getName())) { scene.removeChild(n); n.dispose(); }
// 2. bring in the two inner boxes (closed, static)
async function addBox(file, boxName, drop, matName, prefix, t, r) {
  const src = await io.read(M + file);
  for (const a of src.getRoot().listAnimations()) a.dispose();
  for (const n of src.getRoot().listNodes()) if (drop.includes(n.getName())) { n.getParentNode()?.removeChild(n); src.getRoot().listScenes()[0].removeChild(n); n.dispose(); }
  for (const m of src.getRoot().listMaterials()) if (m.getName() === 'Print_gltf') m.setName(matName + '_gltf');
  for (const n of src.getRoot().listNodes()) n.setName(prefix + n.getName());
  await src.transform(prune());
  const before = new Set(root.listScenes());
  mergeDocuments(doc, src);
  for (const s of root.listScenes()) if (!before.has(s)) {
    for (const n of s.listChildren()) { s.removeChild(n); if (n.getName() === prefix + boxName) { n.setTranslation(t); n.setRotation(r); scene.addChild(n); } else n.dispose(); }
    s.dispose();
  }
}
const H = Math.SQRT1_2;
// master inside: x -64.5..64.5, z -23.5..23.5 (mm). flower box 96 wide, oil box 40x30 turned so its 30 mm side faces front
await addBox('anim-flower5.glb', 'f5', ['c5f'], 'PrintFlower', 'in_', [-0.0155, 0.0006, 0], [0, 0, 0, 1]);
await addBox('anim-oil-box.glb', 'obx', ['bin'], 'PrintOil', 'in_', [0.0485, 0.0006, 0], [0, H, 0, H]);
for (const e of root.listExtensionsUsed()) if (e.extensionName === 'EXT_meshopt_compression') e.dispose();
await doc.transform(unpartition(), dedup(), prune());
await io.write(process.argv[2], doc);
