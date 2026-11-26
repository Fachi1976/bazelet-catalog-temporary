// Tuck flap fix: while the lid lifts, the flap used to swing as a rigid part and pass through the front wall.
// Now it drags up along the inside of the wall (bending at the crease) until its tip clears the top edge, then relaxes to its open pose.
import { NodeIO } from '@gltf-transform/core'; import { ALL_EXTENSIONS } from '@gltf-transform/extensions'; import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'; import fs from 'fs';
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [src, dst, dry] = process.argv.slice(2);
const sm = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
for (const f of fs.readdirSync(src).filter((f) => f.startsWith('anim-') && f.endsWith('.glb'))) {
  const d = await io.read(src + '/' + f); let done = 0;
  for (const a of d.getRoot().listAnimations()) { const chs = a.listChannels(), rot = (n) => chs.find((c) => c.getTargetNode() === n && c.getTargetPath() === 'rotation');
    for (const ch of chs) { const n = ch.getTargetNode(); if (ch.getTargetPath() !== 'rotation' || !/tuckpivot$/.test(n.getName())) continue;
      const lid = n.getParentNode(), lc = rot(lid); if (!lc) continue;
      const L = n.getTranslation()[2];
      // flap length: lowest point of the flap mesh below the crease, in the crease frame
      let T = 0; n.traverse((c) => { const m = c.getMesh(); if (!m || c === n && false) return; const ty = c === n ? 0 : c.getTranslation()[1], sy = c === n ? 1 : c.getScale()[1]; for (const p of m.listPrimitives()) { const P = p.getAttribute('POSITION'); for (let i = 0; i < P.getCount(); i++) T = Math.max(T, -(P.getElement(i, [])[1] * sy + ty)); } });
      const li = lc.getSampler().getInput(), lo = lc.getSampler().getOutput(), ti = ch.getSampler().getInput(), to = ch.getSampler().getOutput(), K = ti.getCount();
      const lidAt = (t) => { let k = 0; while (k < li.getCount() - 2 && li.getScalar(k + 1) < t) k++; const t0 = li.getScalar(k), t1 = li.getScalar(k + 1), u = t1 > t0 ? Math.max(0, Math.min(1, (t - t0) / (t1 - t0))) : 0; const a0 = lo.getElement(k, []), a1 = lo.getElement(k + 1, []); const g = (q) => 2 * Math.atan2(-q[0], q[3]); return g(a0) + (g(a1) - g(a0)) * u; };
      const fin = to.getElement(K - 1, []), psiEnd = 2 * Math.atan2(fin[0], fin[3]);   // signed, + = folded in under the lid
      const drag = (th) => th - Math.asin(Math.min(1, L * (1 - Math.cos(th)) / T)), tipY = (th) => L * Math.sin(th) - T * Math.cos(th - drag(th));
      let thc = 0; while (thc < 1.5 && tipY(thc) < T * 0.04) thc += 0.002;          // lid angle at which the flap tip is out
      const span = 40 * Math.PI / 180, out = new Float32Array(K * 4); let worst = 0;
      for (let k = 0; k < K; k++) { const th = Math.max(0, lidAt(ti.getScalar(k))); const psi = th <= thc ? drag(th) : drag(thc) + (psiEnd - drag(thc)) * sm((th - thc) / span);
        out.set([Math.sin(psi / 2), 0, 0, Math.cos(psi / 2)], k * 4);
        const z = L * Math.cos(th) + T * Math.sin(th - psi), y = L * Math.sin(th) - T * Math.cos(th - psi); if (y < 0) worst = Math.max(worst, z - L); }
      // how far the old animation pushed the tip through the wall
      let old = 0; for (let k = 0; k < K; k++) { const th = Math.max(0, lidAt(ti.getScalar(k))), q = to.getElement(k, []), psi = 2 * Math.atan2(q[0], q[3]); for (const s of [0.25, 0.5, 0.75, 1]) { const z = L * Math.cos(th) + s * T * Math.sin(th - psi), y = L * Math.sin(th) - s * T * Math.cos(th - psi); if (y < 0) old = Math.max(old, z - L); } }
      console.log(f.padEnd(26), 'L', (L * 1000).toFixed(0), 'T', (T * 1000).toFixed(0), 'clears at', (thc * 180 / Math.PI).toFixed(0) + '°', 'old poke-through', (old * 1000).toFixed(1), 'mm → new', (worst * 1000).toFixed(2), 'mm');
      to.setArray(out); done++; } }
  // side-opening gift box: the door's tab is a rigid child of the door, with no crease of its own. Give it the same drag-along-the-wall motion about its crease (vertical axis)
  for (const a of d.getRoot().listAnimations()) { const chs = a.listChannels();
    for (const n of d.getRoot().listNodes()) { if (!/_tab$/.test(n.getName()) || !n.getMesh() || !/lidpiv/.test(n.getParentNode()?.getName() || '')) continue;
      const lc = chs.find((c) => c.getTargetNode() === n.getParentNode() && c.getTargetPath() === 'rotation'); if (!lc || chs.some((c) => c.getTargetNode() === n)) continue;
      let hz = 0; for (const p of n.getMesh().listPrimitives()) { const P = p.getAttribute('POSITION'); for (let i = 0; i < P.getCount(); i++) hz = Math.max(hz, Math.abs(P.getElement(i, [])[2]) * n.getScale()[2]); }
      const p0 = n.getTranslation(), W = p0[0], T = 2 * hz, C = [p0[0], p0[1], p0[2] + hz], li = lc.getSampler().getInput(), lo = lc.getSampler().getOutput(), K = li.getCount();
      const drag = (th) => th - Math.asin(Math.min(1, W * (1 - Math.cos(th)) / T)), tipF = (th) => W * Math.sin(th) - T * Math.cos(th - drag(th));
      let thc = 0; while (thc < 1.5 && tipF(thc) < T * 0.04) thc += 0.002;
      const span = 40 * Math.PI / 180, R = new Float32Array(K * 4), TR = new Float32Array(K * 3); let old = 0;
      for (let k = 0; k < K; k++) { const q = lo.getElement(k, []), th = Math.max(0, 2 * Math.atan2(-q[1], q[3])); const psi = th <= thc ? drag(th) : drag(thc) * (1 - sm((th - thc) / span));
        R.set([0, Math.sin(psi / 2), 0, Math.cos(psi / 2)], k * 4); TR.set([C[0] - hz * Math.sin(psi) * -1 * -1, C[1], C[2] - hz * Math.cos(psi)], k * 3);
        const x = W * Math.cos(th) + T * Math.sin(th), fw = W * Math.sin(th) - T * Math.cos(th); if (fw < 0) old = Math.max(old, x - W); }
      const buf = li.getBuffer(), mk = (arr, type) => d.createAccessor().setArray(arr).setType(type).setBuffer(buf);
      a.addSampler(d.createAnimationSampler().setInput(li).setOutput(mk(R, 'VEC4')).setInterpolation('LINEAR')); a.addChannel(d.createAnimationChannel().setTargetNode(n).setTargetPath('rotation').setSampler(a.listSamplers().at(-1)));
      a.addSampler(d.createAnimationSampler().setInput(li).setOutput(mk(TR, 'VEC3')).setInterpolation('LINEAR')); a.addChannel(d.createAnimationChannel().setTargetNode(n).setTargetPath('translation').setSampler(a.listSamplers().at(-1)));
      console.log(f.padEnd(26), 'tab W', (W * 1000).toFixed(0), 'T', (T * 1000).toFixed(0), 'clears at', (thc * 180 / Math.PI).toFixed(0) + '°', 'old poke-through', (old * 1000).toFixed(1), 'mm'); done++; } }
  if (done && !dry) await io.write(dst + '/' + f, d); }
