// slim tube (0.5 g, two units) on its own - same proportions as inside the slims pack; no sticker (no dieline for it yet)
import { io, node, save } from './lib.mjs';
const MD = '/home/claude/bazelet-catalog-temporary/images/models/';
const kill = (n) => { for (const c of n.listChildren()) kill(c); n.dispose(); };
const d = await io.read(MD + 'anim-slims-std.glb'); for (const a of d.getRoot().listAnimations()) a.dispose();
const sc = d.getRoot().listScenes()[0]; for (const c of sc.listChildren()) if (c.getName() !== 't0') { sc.removeChild(c); kill(c); }
node(d, 't0').setTranslation([0, 0.0006, 0]);
await save(d, process.argv[2] + '/anim-tube-slim.glb');
