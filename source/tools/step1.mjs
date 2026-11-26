import { io, M, node, save, pouch, label } from './lib.mjs';
import { getBounds } from '@gltf-transform/functions';
const out = process.argv[2];
// ---- gift box pouch: 200 x 150 by the Clario dieline (shown 200 x 148 so it sits inside the tray), zipper on the right short side
{ const d = await io.read(M + 'anim-flower-gift.glb'); const n = node(d, 'fgp'); const b = getBounds(n);
  console.log('pouch before', b.min, b.max, 'tray', getBounds(node(d, 'fgift_tray')));
  const cx = (b.min[0] + b.max[0]) / 2, cz = (b.min[2] + b.max[2]) / 2, sx = 0.200 / (b.max[0] - b.min[0]), sz = 0.148 / (b.max[2] - b.min[2]);
  const flip = -1;   // zipper must end up at +x
  const place = (p, isN) => isN ? [flip * p[0], p[1], flip * p[2]] : [flip * (p[0] - cx) * sx + cx, p[1], flip * (p[2] - cz) * sz + cz];
  const frame = (p, fn) => [(cx + 0.1 - p[0]) / 0.2, (p[2] - (cz - 0.074)) / 0.148, fn ? fn[1] : 0];
  pouch(d, n, { place, frame }); await save(d, out + '/anim-flower-gift.glb'); }
// ---- bottle labels
for (const [f, nm] of [['anim-dropper.glb', 'bottle_label'], ['anim-oil-box.glb', 'bin_label'], ['anim-spritzer.glb', 'sp_label'], ['anim-spritzer-box.glb', 'spin_label']]) {
  const d = await io.read(M + f); const n = node(d, nm); console.log(f, 'label node T', n.getTranslation(), n.getRotation(), n.getScale(), 'parent', n.getParentNode()?.getName());
  label(d, n); await save(d, out + '/' + f); }
