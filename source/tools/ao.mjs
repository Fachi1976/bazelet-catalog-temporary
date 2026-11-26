// The cartons carry baked ambient occlusion in vertex colours. On the printed outer skin it interpolates across long triangles
// and shows as dark bands and dashes: clear it there (the inner kraft skin keeps its shading).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, unpartition, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [srcDir, dstDir, ...only] = process.argv.slice(2);
for (const f of fs.readdirSync(srcDir).filter((f) => f.endsWith('.glb') && (!only.length || only.includes(f)))) {
  const d = await io.read(srcDir + '/' + f); let n = 0; const seen = new Set();
  for (const mesh of d.getRoot().listMeshes()) for (const pr of mesh.listPrimitives()) { const c = pr.getAttribute('COLOR_0');
    if (!c || !/^Print/.test(pr.getMaterial()?.getName() || '') || seen.has(c)) continue; seen.add(c);
    let dark = false; for (let i = 0; i < c.getCount(); i++) { const e = c.getElement(i, []); if (e[0] < 0.995) dark = true; c.setElement(i, e.length === 4 ? [1, 1, 1, 1] : [1, 1, 1]); } if (dark) n++; }
  if (!n) { console.log(f.padEnd(28), '-'); continue; }
  const had = d.getRoot().listExtensionsUsed().some((e) => e.extensionName === 'EXT_meshopt_compression');
  for (const e of d.getRoot().listExtensionsUsed()) if (e.extensionName === 'EXT_meshopt_compression') e.dispose();
  await d.transform(unpartition(), dedup(), prune({ keepSolidTextures: true, keepAttributes: true })); if (had) await d.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(dstDir + '/' + f, d); console.log(f.padEnd(28), 'cleared on', n, 'parts', fs.statSync(srcDir + '/' + f).size, '->', fs.statSync(dstDir + '/' + f).size);
}
