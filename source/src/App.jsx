import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  mainCategories, getMainCategory, getSubcategory, getSubcategoriesByParent,
  getProductsBySubcategory, getProduct, countByMain,
} from './data/products.js';
import { cardImages } from './data/cardImages.js';
import { productDisplay } from './data/productDisplay.js';
import './App.css';

const PLACEHOLDER = './images/placeholder.png';
const CONTACT = {
  email: 'PACK.COORDINATOR@b-group.co.il',
  phone: '054-8259082',
  site: 'https://www.bazelet-pharma.co.il/',
};

// In these sub-categories the outer packaging is shown first, inner components after it
const outerFirst = (subId) => subId === 'oil-products' || subId.startsWith('combo-');
const sortProducts = (subId, list) =>
  outerFirst(subId) ? [...list.filter((p) => !p.isInternal), ...list.filter((p) => p.isInternal)] : list;

const pad = (n) => String(n).padStart(2, '0');
const packWord = (n) => (n === 1 ? 'אריזה' : 'אריזות');

// =====================================================
// ROUTING (hash): #main / #main/sub / #main/sub/product
// =====================================================
function parseHash() {
  const [m, s, p] = decodeURIComponent(window.location.hash.replace(/^#\/?/, '')).split('/');
  const main = m ? getMainCategory(m) : null;
  if (!main) return { main: null, sub: null, product: null };
  const subs = getSubcategoriesByParent(main.id);
  let sub = s ? getSubcategory(s) : null;
  if (sub && sub.parentId !== main.id) sub = null;
  if (!sub && subs.length === 1) sub = subs[0]; // single sub → straight to products
  let product = p ? getProduct(p) : null;
  if (product && (!sub || product.subcategoryId !== sub.id)) product = null;
  return { main, sub, product };
}
let demoNext = false;  // home 'try a sample design' → apply the sample once the model loads
const go = (...parts) => {
  const h = parts.filter(Boolean).join('/');
  window.location.hash = h ? h : '';
  if (!h) history.replaceState(null, '', window.location.pathname + window.location.search);
};

// =====================================================
// IMAGE GALLERY
// =====================================================
function ImageGallery({ images, alt }) {
  const [i, setI] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  useEffect(() => setI(0), [images]);
  if (!images || images.length === 0) return null;

  const next = (e) => { e?.stopPropagation(); setI((v) => (v + 1) % images.length); };
  const prev = (e) => { e?.stopPropagation(); setI((v) => (v - 1 + images.length) % images.length); };
  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const d = touchStart - touchEnd;
    if (Math.abs(d) > 50) (d > 0 ? prev() : next());
    setTouchStart(null); setTouchEnd(null);
  };

  return (
    <div className="gallery">
      <div
        className="gallery-stage"
        onTouchStart={(e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); }}
        onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <img src={images[i]} alt={`${alt} - זווית ${i + 1}`} draggable={false}
          onError={(e) => { e.target.src = PLACEHOLDER; }} />
      </div>
      {images.length > 1 && (
        <>
          <button className="gallery-arrow right" onClick={prev} aria-label="הקודם">‹</button>
          <button className="gallery-arrow left" onClick={next} aria-label="הבא">›</button>
          <div className="gallery-counter">{pad(i + 1)} / {pad(images.length)}</div>
          <div className="gallery-thumbs">
            {images.map((src, idx) => (
              <button key={src} className={`thumb ${idx === i ? 'on' : ''}`}
                onClick={(e) => { e.stopPropagation(); setI(idx); }} aria-label={`זווית ${idx + 1}`}>
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// =====================================================
// 3D MODEL VIEWER (drag to rotate, scroll/pinch to zoom)
// =====================================================
let mvLoad = null;
const ENV_HDR = './images/models/studio-env-3.hdr';
const MESHOPT = './images/models/meshopt_decoder.js';
function loadMV() {
  mvLoad = mvLoad || import('@google/model-viewer').then((m) => {
    const MV = customElements.get('model-viewer');
    if (MV) MV.meshoptDecoderLocation = MESHOPT;
    return m;
  });
  return mvLoad;
}
// Warm up the 3D engine + studio lighting in the background, so the first product opens fast
if (typeof window !== 'undefined') {
  const warm = () => { loadMV(); fetch(ENV_HDR).catch(() => {}); };
  (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(warm);
}
// Animated box: click/tap the box (or the button) to open/close it while rotating
function AnimatedModel({ src, alt, poster, radius, targetOpen, noOpen, print }) {
  const [ready, setReady] = useState(!!(typeof customElements !== 'undefined' && customElements.get('model-viewer')));
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const brandApi = useRef({});
  const [progress, setProgress] = useState(0);
  const pending = useRef(false);
  const ref = useRef(null);
  const anim = useRef({ raf: 0, t: 0 });
  const down = useRef(null);
  useEffect(() => {
    if (ready) return;
    loadMV().then(() => setReady(true));
  }, [ready]);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    setLoaded(!!v.loaded); setProgress(0);
    const onLoad = () => {
      v.play(); v.pause(); v.currentTime = 0; anim.current.t = 0; anim.current.dir = false; setLoaded(true);
      if (pending.current) { pending.current = false; setTimeout(() => toggleRef.current(), 300); }
    };
    const onProg = (e) => setProgress(e.detail?.totalProgress || 0);
    v.addEventListener('load', onLoad);
    v.addEventListener('progress', onProg);
    return () => { v.removeEventListener('load', onLoad); v.removeEventListener('progress', onProg); cancelAnimationFrame(anim.current.raf); };
  }, [ready, src]);
  const toggle = () => {
    const v = ref.current;
    if (!v || !v.loaded) { pending.current = !pending.current; setOpen(pending.current); return; }
    const next = !anim.current.dir; anim.current.dir = next; setOpen(next);
    const dur = Math.max(0.01, (v.duration || 2) - 0.001);
    const from = anim.current.t, to = next ? dur : 0;
    v.cameraTarget = next && targetOpen ? targetOpen : 'auto auto auto';
    cancelAnimationFrame(anim.current.raf);
    const t0 = performance.now(), len = Math.abs(to - from) * 1000;
    const step = (now) => {
      const k = len ? Math.min(1, (now - t0) / len) : 1;
      const t = from + (to - from) * k;
      v.play(); v.pause(); v.currentTime = t; anim.current.t = t;
      if (k < 1) anim.current.raf = requestAnimationFrame(step);
    };
    anim.current.raf = requestAnimationFrame(step);
  };
  const toggleRef = useRef(toggle); toggleRef.current = toggle;
  const onDown = (e) => { down.current = { x: e.clientX, y: e.clientY, t: Date.now() }; };
  const onUp = (e) => {
    const d = down.current; down.current = null;
    if (!noOpen && d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6 && Date.now() - d.t < 500) toggle();
  };
  if (!ready) return (
    <div className="gallery model"><div className="gallery-stage"><img src={poster || PLACEHOLDER} alt={alt} /></div>
      <div className="model-loading"><span>טוען תלת מימד…</span><div className="model-bar"><i style={{ width: '8%' }} /></div></div>
    </div>
  );
  return (
    <>
    <div className="gallery model">
      {!noOpen && <button className="open-btn" onClick={toggle}>{open ? 'סגירה' : 'פתיחה'}</button>}
      {print && loaded && <button className="sample-chip" onClick={() => brandApi.current.sample?.()}>✨ עיצוב לדוגמה</button>}
      <model-viewer
        ref={ref}
        key={src}
        src={src}
        alt={alt}
        poster={poster}
        animation-name="Animation"
        camera-controls=""
        touch-action="pan-y"
        auto-rotate=""
        auto-rotate-delay="2500"
        rotation-per-second="18deg"
        interaction-prompt="none"
        interpolation-decay="120"
        camera-orbit={`35deg 65deg ${radius || "115%"}`}
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="auto auto 160%"
        shadow-intensity="0"
        shadow-softness="0.6"
        exposure="1.0"
        tone-mapping="neutral"
        environment-image={ENV_HDR}
        loading="eager"
        reveal="auto"
        onPointerDown={onDown}
        onPointerUp={onUp}
        style={{ width: '100%', height: '100%', background: 'transparent', '--poster-color': 'transparent', cursor: noOpen ? 'grab' : 'pointer' }}
      >
        <div slot="progress-bar" />
      </model-viewer>
      {!loaded && (
        <div className="model-loading"><span>טוען תלת מימד…</span>
          <div className="model-bar"><i style={{ width: `${Math.round(progress * 100)}%` }} /></div>
        </div>
      )}
      <div className="model-hint">{noOpen ? 'גררו כדי לסובב · גלגלו להגדלה' : open ? 'לחצו על האריזה כדי לסגור · גררו כדי לסובב' : 'לחצו על האריזה כדי לפתוח · גררו כדי לסובב'}</div>
    </div>
    {print && <BrandSlot><BrandPanel mv={ref} print={print} loaded={loaded} open={open} api={brandApi} /></BrandSlot>}
    </>
  );
}

// =====================================================
// BRAND IT: wrap the customer's flat artwork (exported at the dieline artboard size) onto the 3D box.
// Everything happens in the browser - the file is never uploaded anywhere.
// =====================================================
const MAX_TEX = 2048;
// Find the supplier dieline inside any PDF layout (e.g. a print proof with the box at 60% on an A4 sheet):
// look for the vertical fold lines whose spacing matches the template, then crop + rescale to the artboard.
// Collect every straight line segment of the page (viewport coords, y down), through transforms and form XObjects.
function pdfSegments(ol, O, vt) {
  const mul = (m, n) => [m[0]*n[0]+m[2]*n[1], m[1]*n[0]+m[3]*n[1], m[0]*n[2]+m[2]*n[3], m[1]*n[2]+m[3]*n[3], m[0]*n[4]+m[2]*n[5]+m[4], m[1]*n[4]+m[3]*n[5]+m[5]];
  const ap = (m, x, y) => { const p = [m[0]*x + m[2]*y + m[4], m[1]*x + m[3]*y + m[5]]; return [vt[0]*p[0] + vt[2]*p[1] + vt[4], vt[1]*p[0] + vt[3]*p[1] + vt[5]]; };
  let ctm = [1, 0, 0, 1, 0, 0]; const st = []; const S = [];
  const seg = (p, q) => { if (Math.hypot(p[0] - q[0], p[1] - q[1]) > 20) S.push([p[0], p[1], q[0], q[1]]); };
  for (let i = 0; i < ol.fnArray.length; i++) {
    const fn = ol.fnArray[i], a = ol.argsArray[i];
    if (fn === O.save) st.push(ctm);
    else if (fn === O.restore) ctm = st.pop() || ctm;
    else if (fn === O.transform) ctm = mul(ctm, a);
    else if (fn === O.paintFormXObjectBegin) { st.push(ctm); if (a[0]) ctm = mul(ctm, a[0]); }
    else if (fn === O.paintFormXObjectEnd) ctm = st.pop() || ctm;
    else if (fn === O.constructPath) {
      const [ops, co] = a; let k = 0, cur = null, start = null;
      for (const op of ops) {
        if (op === O.moveTo) { cur = start = ap(ctm, co[k], co[k + 1]); k += 2; }
        else if (op === O.lineTo) { const q = ap(ctm, co[k], co[k + 1]); k += 2; if (cur) seg(cur, q); cur = q; }
        else if (op === O.curveTo) { cur = ap(ctm, co[k + 4], co[k + 5]); k += 6; }
        else if (op === O.curveTo2 || op === O.curveTo3) { cur = ap(ctm, co[k + 2], co[k + 3]); k += 4; }
        else if (op === O.rectangle) {
          const [x, y, w, h] = co.slice(k, k + 4); k += 4;
          const c = [ap(ctm, x, y), ap(ctm, x + w, y), ap(ctm, x + w, y + h), ap(ctm, x, y + h)];
          for (let j = 0; j < 4; j++) seg(c[j], c[(j + 1) % 4]);
        } else if (op === O.closePath) { if (cur && start) seg(cur, start); cur = start; }
      }
    }
  }
  return S;
}
function detectInFrame(V, t) {
  const td = t.folds.slice(1).map((x, i) => x - t.folds[i]);
  for (const a of V) {
    const s = a[1] / t.foldLen; if (s < 0.4 || s > 1.6) continue;  // print files are 1:1, proofs ~0.6
    const xs = [...new Set(V.filter((b) => Math.abs(b[1] - a[1]) < a[1] * 0.02 && Math.abs(b[2] - a[2]) < 2 * s + 1).map((b) => b[0]))].sort((p, q) => p - q);
    for (const x0 of xs) {
      let miss = 0, x = x0;  // tolerate one missing intermediate fold line (some dielines draw it dashed)
      td.forEach((d, i) => { x += d * s; const tol = Math.max(2.5, d * s * 0.03); const hit = xs.filter((v) => Math.abs(v - x) < tol).sort((p, q) => Math.abs(p - x) - Math.abs(q - x))[0]; if (hit === undefined) miss += (i === td.length - 1 ? 9 : 1); else x = hit; });
      if (miss <= 1) return { s, left: x0 - t.folds[0] * s, top: a[2] - t.foldTop * s, w: t.page[0] * s, h: t.page[1] * s };
    }
  }
  return null;
}
// Try the four page orientations (designers often place the dieline rotated). Frame (u,v) = M*(x,y) + t.
function detectDieline(S, t, PW, PH) {
  const R = [
    { M: [1, 0, 0, 1], t: [0, 0] }, { M: [0, 1, -1, 0], t: [0, PW] },
    { M: [0, -1, 1, 0], t: [PH, 0] }, { M: [-1, 0, 0, -1], t: [PW, PH] }];
  for (const r of R) {
    const f = (x, y) => [r.M[0] * x + r.M[1] * y + r.t[0], r.M[2] * x + r.M[3] * y + r.t[1]];
    const V = [];
    for (const [x1, y1, x2, y2] of S) {
      const p = f(x1, y1), q = f(x2, y2);
      if (Math.abs(p[0] - q[0]) < 0.3 && Math.abs(p[1] - q[1]) > 20) V.push([p[0], Math.abs(p[1] - q[1]), Math.min(p[1], q[1])]);
    }
    const d = detectInFrame(V, t);
    if (d) return { ...d, r };
  }
  return null;
}

async function fileToCanvas(file, print) {
  if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const page = await doc.getPage(1);
    const v0 = page.getViewport({ scale: 1 });
    let det = null;
    if (print?.dieline) {
      try { det = detectDieline(pdfSegments(await page.getOperatorList(), pdfjs.OPS, v0.transform), print.dieline, v0.width, v0.height); }
      catch (e) { console.warn('dieline detection failed', e); }
    }
    let c;
    if (!det) {
      const z = MAX_TEX / Math.max(v0.width, v0.height);
      c = document.createElement('canvas'); c.width = Math.round(v0.width * z); c.height = Math.round(v0.height * z);
      const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: ctx, viewport: page.getViewport({ scale: z }) }).promise;
    } else {
      // page-space bbox of the detected artboard (inverse of the frame transform)
      const { r } = det, M = r.M, det2 = M[0] * M[3] - M[1] * M[2];
      const inv = (u, v) => { const a = u - r.t[0], b = v - r.t[1]; return [(M[3] * a - M[1] * b) / det2, (-M[2] * a + M[0] * b) / det2]; };
      const cs = [inv(det.left, det.top), inv(det.left + det.w, det.top), inv(det.left, det.top + det.h), inv(det.left + det.w, det.top + det.h)];
      const x0 = Math.min(...cs.map((p) => p[0])), y0 = Math.min(...cs.map((p) => p[1]));
      const pw = Math.max(...cs.map((p) => p[0])) - x0, ph = Math.max(...cs.map((p) => p[1])) - y0;
      const z = MAX_TEX / Math.max(det.w, det.h);
      const src = document.createElement('canvas'); src.width = Math.round(pw * z); src.height = Math.round(ph * z);
      const sctx = src.getContext('2d'); sctx.fillStyle = '#fff'; sctx.fillRect(0, 0, src.width, src.height);
      await page.render({ canvasContext: sctx, viewport: page.getViewport({ scale: z, offsetX: -x0 * z, offsetY: -y0 * z }) }).promise;
      c = document.createElement('canvas'); c.width = Math.round(det.w * z); c.height = Math.round(det.h * z);
      const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      // output = M * src + z * (M*p0 + t - (left, top))
      const e = z * (M[0] * x0 + M[1] * y0 + r.t[0] - det.left), f = z * (M[2] * x0 + M[3] * y0 + r.t[1] - det.top);
      ctx.setTransform(M[0], M[2], M[1], M[3], e, f); ctx.drawImage(src, 0, 0);
    }
    const found = !!det;
    c.dieline = found;
    return c;
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const k = Math.min(1, MAX_TEX / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c;
  } finally { URL.revokeObjectURL(url); }
}

// renders into the product info column when it exists (next to the specs), else in place
function BrandSlot({ children }) {
  const [el, setEl] = useState(null);
  useEffect(() => { setEl(document.getElementById('brand-slot')); }, []);
  return el ? createPortal(children, el) : null;
}

// Lid mode (e.g. tray foil printed as a sheet with several lids): crop one lid outline from the PDF, else use the whole image.
async function lidCanvas(file, slot) {
  if (!(file.type === 'application/pdf' || /\.pdf$/i.test(file.name))) return fileToCanvas(file, null);
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const page = await doc.getPage(1); const v0 = page.getViewport({ scale: 1 });
  const PT = 72 / 25.4, [lw, lh] = slot.lid;
  // bounding boxes of whole paths: a lid outline is a path of the lid's size (either orientation)
  const ol = await page.getOperatorList(), O = pdfjs.OPS; const boxes = [];
  const mul = (m, n) => [m[0]*n[0]+m[2]*n[1], m[1]*n[0]+m[3]*n[1], m[0]*n[2]+m[2]*n[3], m[1]*n[2]+m[3]*n[3], m[0]*n[4]+m[2]*n[5]+m[4], m[1]*n[4]+m[3]*n[5]+m[5]];
  let ctm = [1, 0, 0, 1, 0, 0]; const st = [];
  for (let i = 0; i < ol.fnArray.length; i++) {
    const fn = ol.fnArray[i], a = ol.argsArray[i];
    if (fn === O.save) st.push(ctm); else if (fn === O.restore) ctm = st.pop() || ctm;
    else if (fn === O.transform) ctm = mul(ctm, a);
    else if (fn === O.paintFormXObjectBegin) { st.push(ctm); if (a[0]) ctm = mul(ctm, a[0]); }
    else if (fn === O.paintFormXObjectEnd) ctm = st.pop() || ctm;
    else if (fn === O.constructPath) {
      const co = a[1]; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      const pt = (px, py) => {
        const ux = ctm[0]*px + ctm[2]*py + ctm[4], uy = ctm[1]*px + ctm[3]*py + ctm[5], vt = v0.transform;
        const x = vt[0]*ux + vt[2]*uy + vt[4], y = vt[1]*ux + vt[3]*uy + vt[5];
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      };
      // walk the path operators: a rectangle is stored as x, y, width, height (not as points)
      let k = 0;
      for (const op of (Array.isArray(a[0]) || ArrayBuffer.isView(a[0]) ? a[0] : [])) {
        if (op === O.rectangle) { pt(co[k], co[k+1]); pt(co[k] + co[k+2], co[k+1] + co[k+3]); k += 4; }
        else if (op === O.moveTo || op === O.lineTo) { pt(co[k], co[k+1]); k += 2; }
        else if (op === O.curveTo) { pt(co[k], co[k+1]); pt(co[k+2], co[k+3]); pt(co[k+4], co[k+5]); k += 6; }
        else if (op === O.curveTo2 || op === O.curveTo3) { pt(co[k], co[k+1]); pt(co[k+2], co[k+3]); k += 4; }
      }
      if (k === 0) for (; k + 1 < co.length; k += 2) pt(co[k], co[k+1]);
      const w = (x1 - x0) / PT, h = (y1 - y0) / PT;
      const ok = (A, B) => Math.abs(w / A - 1) < 0.08 && Math.abs(h / B - 1) < 0.08;
      if (ok(lw, lh) || ok(lh, lw)) boxes.push({ x0, y0, x1, y1, rot: !ok(lw, lh) });
    }
  }
  boxes.sort((p, q) => (p.y0 - q.y0) || (p.x0 - q.x0));
  let bx = boxes[0] || { x0: 0, y0: 0, x1: v0.width, y1: v0.height, rot: false };
  if (boxes[0]) { const m = 1.5 * PT; bx = { ...bx, x0: bx.x0 + m, y0: bx.y0 + m, x1: bx.x1 - m, y1: bx.y1 - m }; }  // hide the cut line
  const bw = bx.x1 - bx.x0, bh = bx.y1 - bx.y0, z = 1024 / Math.max(bw, bh);
  const src = document.createElement('canvas'); src.width = Math.round(bw * z); src.height = Math.round(bh * z);
  const sctx = src.getContext('2d'); sctx.fillStyle = '#fff'; sctx.fillRect(0, 0, src.width, src.height);
  await page.render({ canvasContext: sctx, viewport: page.getViewport({ scale: z, offsetX: -bx.x0 * z, offsetY: -bx.y0 * z }) }).promise;
  if (!bx.rot) { src.dieline = !!boxes[0]; return src; }
  const c = document.createElement('canvas'); c.width = src.height; c.height = src.width;
  const ctx = c.getContext('2d'); ctx.setTransform(0, 1, -1, 0, c.width, 0); ctx.drawImage(src, 0, 0); c.dieline = true;
  return c;
}

function BrandSlotRow({ mv, slot, loaded, multi, register, open, onOwn }) {
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');
  const [warn, setWarn] = useState('');
  const [busy, setBusy] = useState(false);
  const orig = useRef(null);
  const finish = useRef(null);
  const input = useRef(null);
  const material = () => mv.current?.model?.materials.find((m) => m.name === slot.material || m.name === slot.material + '_gltf');
  const apply = async (url) => {
    const m = material(); if (!m) throw new Error('no material ' + slot.material);
    const tslot = m.pbrMetallicRoughness.baseColorTexture;
    const pbr = m.pbrMetallicRoughness;
    if (!finish.current) { orig.current = tslot.texture; finish.current = [pbr.metallicFactor, pbr.roughnessFactor]; }  // the part may have no texture of its own
    tslot.setTexture(await mv.current.createTexture(url));
    if (slot.finish) { pbr.setMetallicFactor(slot.finish[0]); pbr.setRoughnessFactor(slot.finish[1]); }
  };
  const reset = () => {
    const m = material();
    if (m && finish.current) {
      m.pbrMetallicRoughness.baseColorTexture.setTexture(orig.current);
      if (slot.finish) { m.pbrMetallicRoughness.setMetallicFactor(finish.current[0]); m.pbrMetallicRoughness.setRoughnessFactor(finish.current[1]); }
    }
    setStatus(''); setWarn(''); setFileName('');
  };
  const clear = () => { setStatus(''); setWarn(''); setFileName(''); };
  useEffect(() => register(slot.material, { apply, reset, clear, sample: slot.sample }), []);
  const onFile = async (e) => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    setBusy(true); setWarn(''); setFileName(''); setStatus('טוען את העיצוב…');
    try {
      let c = slot.mode === 'lid' ? await lidCanvas(file, slot) : await fileToCanvas(file, slot);
      if (slot.flipX) {  // texture space mirrored vs. the artwork (e.g. tray foil UVs)
        const m = document.createElement('canvas'); m.width = c.width; m.height = c.height;
        const mx = m.getContext('2d'); mx.setTransform(-1, 0, 0, 1, c.width, 0); mx.drawImage(c, 0, 0); m.dieline = c.dieline; c = m;
      }
      if (slot.aspect && !c.dieline && Math.abs(c.width / c.height / slot.aspect - 1) > 0.03) {
        setWarn('שימו לב: גודל הקובץ לא תואם לתבנית, ולכן העיצוב עלול לא לשבת במקום. ייצאו אותו בגודל משטח העבודה של התבנית.');
      }
      const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.92));
      await apply(URL.createObjectURL(blob));
      setStatus(''); setFileName(file.name); onOwn();
      const r = mv.current?.getBoundingClientRect();  // bring the model back into view if the controls scrolled it away
      if (r && (r.top < 60 || r.top > window.innerHeight * 0.55)) window.scrollTo({ top: window.scrollY + r.top - 80, behavior: 'smooth' });
    } catch (err) {
      console.error(err); setStatus(''); setWarn('לא הצלחנו לקרוא את הקובץ. נסו PNG, JPG או PDF.');
    } finally { setBusy(false); }
  };
  return (
    <div className={multi ? 'brand-slot' : ''}>
      {multi && <div className="brand-slot-head"><b>{slot.label}</b></div>}
      <div className="brand-actions">
        <button className="brand-btn primary" disabled={!loaded || busy} onClick={() => input.current?.click()}>
          {busy ? 'רגע…' : (multi ? 'העלאה' : 'העלאת עיצוב')}
        </button>
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,application/pdf,.pdf" hidden onChange={onFile} />
        {multi && status && <span className="brand-status inline">{status}</span>}
        {multi && fileName && <span className="brand-status inline">עלה ✓ <bdi className="brand-file">{fileName}</bdi></span>}
      </div>
      {!multi && status && <p className="brand-status">{status}</p>}
      {!multi && fileName && <p className="brand-status">עלה ✓ <bdi className="brand-file">{fileName}</bdi><br />
        {slot.noOpen ? 'העיצוב שלכם על המוצר. גררו כדי לסובב 👆' : open ? 'העיצוב שלכם על האריזה. סובבו, ולחצו כדי לסגור 👆' : 'העיצוב שלכם על האריזה. סובבו ולחצו כדי לפתוח 👆'}</p>}
      {warn && <p className="brand-warn">{warn}</p>}
    </div>
  );
}

function BrandPanel({ mv, print, loaded, open, api }) {
  const slots = print.slots || [print];
  const multi = slots.length > 1;
  const rows = useRef({});
  const [branded, setBranded] = useState(false);
  const [note, setNote] = useState('');
  const register = (k, api) => { rows.current[k] = api; };
  const sample = async () => {
    for (const r of Object.values(rows.current)) if (r.sample) { await r.apply(r.sample); r.clear(); }
    setBranded(true); setNote('זה עיצוב לדוגמה של מותג דמיוני. עכשיו נסו עם שלכם!');
  };
  api.current.sample = sample;
  useEffect(() => { if (loaded && demoNext) { demoNext = false; sample(); } }, [loaded]);
  const reset = () => { Object.values(rows.current).forEach((r) => r.reset()); setBranded(false); setNote(''); };
  const lead = slots.find((s) => s.dieline) || slots[0];
  return (
    <div className="brand-panel">
      <div className="brand-head">
        <b>ראו את המותג שלכם על האריזה</b>
        <span>{multi ? 'לאריזה הזו כמה חלקים מודפסים. העלו עיצוב לכל חלק, או רק לחלק מהם.' : 'העלו את הפריסה הממותגת שלכם וראו אותה בתלת מימד'}</span>
      </div>
      <ol className="brand-steps">
        <li>{multi ? 'עצבו על תבניות הפריסה שקיבלתם מצוות בזלת' : 'עצבו על תבנית הפריסה שקיבלתם מצוות בזלת'}</li>
        <li>{lead.dieline
          ? 'ייצאו את העיצוב כ-PDF, PNG או JPG. ב-PDF נזהה את הפריסה לבד, גם בקובץ אישור לדפוס'
          : 'ייצאו את העיצוב בגודל משטח העבודה של התבנית (PDF, PNG או JPG), בלי שכבת קווי הפריסה'}</li>
        <li>העלו את הקובץ כאן</li>
      </ol>
      {slots.map((s) => <BrandSlotRow key={s.material} mv={mv} slot={s} loaded={loaded} multi={multi} register={register} open={open} onOwn={() => { setBranded(true); setNote(''); }} />)}
      <div className="brand-actions" style={{ marginTop: 8 }}>
        <button className="brand-btn" disabled={!loaded} onClick={sample}>עיצוב לדוגמה</button>
        {branded && <button className="brand-btn ghost" onClick={reset}>הסרת העיצוב</button>}
      </div>
      {note && <p className="brand-status">{note}</p>}
      <p className="brand-note brand-rights">מבנה האריזות, ההדמיות ותבניות הפריסה הם קניינה של קבוצת בזלת ומיועדים לעיצוב אריזות של בזלת ושל לקוחותיה בלבד. העיצוב שתעלו נשאר שלכם.</p>
      <p className="brand-note">🔒 הקבצים שתעלו אינם נשמרים באתר הקטלוג.</p>
    </div>
  );
}


// Desktop-only: on hover the card photo turns into the rotating 3D model, which opens
const canHover3D = typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;
function HoverModel({ model, active }) {
  const [mount, setMount] = useState(false);
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  const st = useRef({ raf: 0, t: 0, loaded: false });
  useEffect(() => { if (active && !mount) loadMV().then(() => setMount(true)); }, [active, mount]);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    const onLoad = () => { v.play(); v.pause(); v.currentTime = 0; st.current.loaded = true; setShown(activeRef.current); run(activeRef.current); };
    v.addEventListener('load', onLoad);
    return () => { v.removeEventListener('load', onLoad); cancelAnimationFrame(st.current.raf); };
  }, [mount]);
  const activeRef = useRef(active); activeRef.current = active;
  const run = (open) => {
    const v = ref.current; if (!v || !st.current.loaded) return;
    cancelAnimationFrame(st.current.raf);
    const dur = Math.max(0.01, (v.duration || 2) - 0.001);
    const from = st.current.t, to = open ? dur : 0;
    v.cameraTarget = open && model.target ? model.target : 'auto auto auto';
    const delay = open ? 450 : 0, t0 = performance.now() + delay, len = Math.abs(to - from) * 900;
    const step = (now) => {
      const k = now < t0 ? 0 : (len ? Math.min(1, (now - t0) / len) : 1);
      const t = from + (to - from) * k;
      v.play(); v.pause(); v.currentTime = t; st.current.t = t;
      if (k < 1) st.current.raf = requestAnimationFrame(step);
    };
    st.current.raf = requestAnimationFrame(step);
  };
  useEffect(() => {
    if (!st.current.loaded) return;
    setShown(active); run(active);
    const v = ref.current;
    if (v && !active) { const id = setTimeout(() => { v.resetTurntableRotation?.(0); }, 500); return () => clearTimeout(id); }
  }, [active]);
  if (!mount) return null;
  return (
    <model-viewer
      ref={ref}
      class={`card-3d ${shown ? 'on' : ''}`}
      src={model.src}
      animation-name="Animation"
      auto-rotate=""
      auto-rotate-delay="0"
      rotation-per-second="40deg"
      interaction-prompt="none"
      disable-zoom=""
      camera-orbit={`35deg 65deg ${model.radius}`}
      interpolation-decay="160"
      shadow-intensity="0"
      shadow-softness="0.6"
      tone-mapping="neutral"
      environment-image={ENV_HDR}
      loading="eager"
      reveal="auto"
      style={{ '--poster-color': 'transparent', background: 'transparent' }}
    ></model-viewer>
  );
}
// Warm up the home-page models on desktop so the first hover is instant
if (canHover3D) {
  (window.requestIdleCallback || ((f) => setTimeout(f, 2500)))(() => {
    loadMV();
    Object.values(cardImages).forEach((c) => c.model && fetch(c.model.src).catch(() => {}));
  });
}

// =====================================================
// CARDS
// =====================================================
function CategoryCard({ index, item, count, onClick }) {
  const img = cardImages[item.id];
  const has3d = canHover3D && img?.model;
  const [hov, setHov] = useState(false);
  return (
    <button className={`card ${has3d ? 'has-3d' : ''} ${hov ? 'hov' : ''}`} onClick={onClick}
      onMouseEnter={has3d ? () => setHov(true) : undefined} onMouseLeave={has3d ? () => setHov(false) : undefined}>
      <div className={`card-photo ${img?.dark ? 'dark' : ''} ${img?.studio ? 'studio' : ''}`}>
        {has3d && <HoverModel model={img.model} active={hov} />}
        <span className="card-idx">{pad(index + 1)}</span>
        <span className="card-count">{count} {packWord(count)}</span>
        {img ? (
          <>
            <img className="img-base" src={img.base} alt={item.name} />
            <img className="img-hover" src={img.hover} alt="" aria-hidden="true" />
          </>
        ) : (
          <img className="img-base icon" src={item.icon} alt={item.name} />
        )}
      </div>
      <div className="card-body">
        <h2 className="card-name">{item.name}</h2>
        <p className="card-desc">{item.description}</p>
        <span className="card-cta">לצפייה באריזות <b>←</b></span>
      </div>
    </button>
  );
}

function ProductCard({ index, product, onClick }) {
  const { size, base, hover, dark, studio } = productDisplay(product);
  return (
    <button className="card product" onClick={onClick}>
      <div className={`card-photo ${dark ? 'dark' : ''} ${studio ? 'studio' : ''}`} style={{ '--s': size }}>
        <span className="card-idx">{pad(index + 1)}</span>
        {product.isInternal && <span className="card-count internal">רכיב פנימי</span>}
        <img className="img-base sized" src={base || PLACEHOLDER} alt={product.name} loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER; }} />
        {hover && <img className="img-hover sized" src={hover} alt="" aria-hidden="true" loading="lazy" />}
      </div>
      <div className="card-body">
        {product.sku && <span className="card-sku">{product.sku}</span>}
        <h3 className="card-name">{product.name}</h3>
        <p className="card-desc">{product.description}</p>
        <span className="card-cta">לפרטי האריזה <b>←</b></span>
      </div>
    </button>
  );
}

// =====================================================
// PAGE HERO
// =====================================================
function Hero({ crumbs, title, text, eyebrow, big, extra, children }) {
  return (
    <section className={`hero ${big ? 'big' : ''}`}>
      <div className="wrap hero-in">
        {crumbs && (
          <nav className="crumbs">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep">/</span>}
                {c.onClick ? <a onClick={c.onClick}>{c.label}</a> : <span>{c.label}</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <div className="rule" />
        {text && <p>{text}</p>}
        {extra}
      </div>
      {children}
    </section>
  );
}

// =====================================================
// APP
// =====================================================
export default function App() {
  const [route, setRoute] = useState(parseHash);
  const [viewState, setViewState] = useState('closed');
  const { main, sub, product } = route;

  useEffect(() => {
    const onHash = () => { setRoute(parseHash()); window.scrollTo({ top: 0 }); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => setViewState('closed'), [product]);

  const singleSub = main && getSubcategoriesByParent(main.id).length === 1;
  const back = () => {
    if (product) go(main.id, singleSub ? null : sub.id);
    else if (sub && !singleSub) go(main.id);
    else go();
  };
  const crumbsFor = () => {
    const c = [{ label: 'קטלוג', onClick: () => go() }];
    if (main) c.push({ label: main.name, onClick: (sub || product) && !(singleSub && !product) ? () => go(main.id) : null });
    if (sub && !singleSub) c.push({ label: sub.name, onClick: product ? () => go(main.id, sub.id) : null });
    if (product) c.push({ label: product.name });
    return c;
  };

  // ---------- Level 1 ----------
  const renderHome = () => {
    const total = mainCategories.reduce((n, c) => n + countByMain(c.id), 0);
    return (
      <>
        <Hero big eyebrow="WHITE-LABEL PACKAGING SOLUTIONS" title="קטלוג אריזות קנביס"
          text="בזלת מרחיבה את מגוון פתרונות האריזה שלה לתפרחות, מגולגלות, שמנים ומוצרים משולבים, כדי שתוכלו לבנות פורטפוליו מוצרים שמתאים לאסטרטגיה המסחרית שלכם. האריזות מוצגות ללא מיתוג, כך שתוכלו לבחור את האריזה המתאימה ולהתאים אותה למותג שלכם."
          extra={<>
            <button className="hero-cta" onClick={() => document.getElementById('cats')?.scrollIntoView({ behavior: 'smooth' })}>בחרו קטגוריה</button>
            <div className="hero-new"><b>ראו את המותג שלכם על האריזה</b>
              <span>בחרו אריזה, העלו את העיצוב שלכם וראו איך הוא נראה על האריזה בתלת־ממד. אפשר להעלות גרסאות נוספות ולבחון כל אחת על המודל עד שתגיעו לעיצוב הסופי.</span>
              <button className="hero-try" onClick={() => { const d = getProduct('flower-standard'); const sb = getSubcategory(d.subcategoryId); demoNext = true; go(sb.parentId, sb.id, d.id); }}>נסו עיצוב לדוגמה</button>
            </div></>}>
          <div className="strip"><div className="wrap strip-in">
            <span>IMC-GMP</span><i>·</i><span>{total} פתרונות אריזה</span><i>·</i>
            <span>{mainCategories.length} קטגוריות</span><i>·</i><span>ללא מיתוג – התאמה מלאה למותג</span>
          </div></div>
        </Hero>
        <main className="wrap page">
          <div className="sec-head" id="cats"><h2>בחרו קטגוריה</h2><span>{pad(mainCategories.length)} CATEGORIES</span></div>
          <div className="grid four">
            {mainCategories.map((c, i) => (
              <CategoryCard key={c.id} index={i} item={c} count={countByMain(c.id)} onClick={() => go(c.id)} />
            ))}
          </div>
        </main>
      </>
    );
  };

  // ---------- Level 2 ----------
  const renderSubs = () => {
    const subs = getSubcategoriesByParent(main.id);
    const total = countByMain(main.id);
    return (
      <>
        <Hero crumbs={crumbsFor()} title={main.name} text={main.description} />
        <main className="wrap page">
          <div className="sec-head"><h2>בחרו סוג אריזה</h2><span>{pad(subs.length)} · {total} {packWord(total)}</span></div>
          <div className="grid">
            {subs.map((s, i) => (
              <CategoryCard key={s.id} index={i} item={s} count={getProductsBySubcategory(s.id).length}
                onClick={() => go(main.id, s.id)} />
            ))}
          </div>
          <button className="back" onClick={back}>→ חזרה</button>
        </main>
      </>
    );
  };

  // ---------- Level 3 ----------
  const renderProducts = () => {
    const prods = sortProducts(sub.id, getProductsBySubcategory(sub.id));
    return (
      <>
        <Hero crumbs={crumbsFor()} title={singleSub ? main.name : sub.name} text={sub.description} />
        <main className="wrap page">
          <div className="sec-head"><h2>אריזות ורכיבים</h2><span>{pad(prods.length)} ITEMS</span></div>
          <div className="grid">
            {prods.map((p, i) => (
              <ProductCard key={p.id} index={i} product={p} onClick={() => go(main.id, sub.id, p.id)} />
            ))}
          </div>
          <button className="back" onClick={back}>→ חזרה</button>
        </main>
      </>
    );
  };

  // ---------- Level 4 ----------
  const renderProduct = () => {
    const p = product;
    const darkBg = productDisplay(p).dark;
    const images = p.gallery ? (p.gallery[viewState] || p.gallery.closed || []) : [];
    const labels = { volume: 'מכיל', dimensions: 'מידות', material: 'חומר', closure: 'סגירה' };
    return (
      <>
        <Hero crumbs={crumbsFor()} title={p.name} text={p.description} />
        <main className="wrap page">
          <div className="detail">
            <div className={`detail-media ${darkBg ? 'dark' : ''}`}>
              {(p.gallery || p.model3d) ? (
                <>
                  {p.hasToggle && !p.model3d?.anim && (
                    <div className="toggle">
                      <button className={viewState === 'closed' ? 'on' : ''} onClick={() => setViewState('closed')}>סגור</button>
                      <button className={viewState === 'open' ? 'on' : ''} onClick={() => setViewState('open')}>פתוח</button>
                    </div>
                  )}
                  {p.model3d?.anim ? (
                    <AnimatedModel key={p.id} radius={p.model3d.radius} src={p.model3d.anim} targetOpen={p.model3d.targetOpen}
                      alt={p.name} poster={p.images?.primary} print={p.model3d.print} />
                  ) : p.model3d?.static ? (
                    <AnimatedModel key={p.id} noOpen radius={p.model3d.radius} src={p.model3d.static} alt={p.name} poster={p.images?.primary} print={p.model3d.print} />
                  ) : (
                    <ImageGallery images={images} alt={p.name} />
                  )}
                </>
              ) : (
                <div className="gallery"><div className="gallery-stage">
                  <img src={p.images?.primary || PLACEHOLDER} alt={p.name} onError={(e) => { e.target.src = PLACEHOLDER; }} />
                </div></div>
              )}
            </div>

            <div className="detail-info">
              {p.sku && <div className="sku">מק״ט <b>{p.sku}</b></div>}
              {p.isInternal && <div className="internal-note">רכיב פנימי – אריזה ראשונית</div>}
              {p.tags?.length > 0 && (
                <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              )}
              {p.specs && (
                <div className="specs">
                  <h3>מפרט טכני</h3>
                  <table><tbody>
                    {Object.keys(labels).map((k) => p.specs[k] ? (
                      <tr key={k}><td>{labels[k]}</td><td>{p.specs[k]}</td></tr>
                    ) : null)}
                  </tbody></table>
                </div>
              )}
              {p.model3d?.print && <div id="brand-slot" key={p.id} />}
            </div>
          </div>
          <button className="back" onClick={back}>→ חזרה</button>
        </main>
      </>
    );
  };

  return (
    <div className="app" dir="rtl">
      <header className="head">
        <div className="wrap head-in">
          <a className="logo" onClick={() => go()}>
            <img src="./images/bazelet-logo.png" alt="Bazelet" />
            <span>PACKAGING CATALOG</span>
          </a>
          <nav className="nav">
            {mainCategories.map((c) => (
              <a key={c.id} className={main?.id === c.id ? 'on' : ''} onClick={() => go(c.id)}>{c.name}</a>
            ))}
            <span className="badge">IMC-GMP</span>
          </nav>
        </div>
      </header>

      <div className="content">
        {!main ? renderHome() : product ? renderProduct() : sub ? renderProducts() : renderSubs()}
      </div>

      <footer className="foot">
        <div className="wrap foot-in">
          <div className="foot-contact">
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <i>·</i>
            <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a>
            <i>·</i>
            <a href={CONTACT.site} target="_blank" rel="noopener noreferrer">www.bazelet-pharma.co.il</a>
          </div>
          <div className="foot-copy">© 2026 BAZELET GROUP · IMC-GMP CERTIFIED CANNABIS MANUFACTURER</div>
          <div className="foot-rights">כל הזכויות שמורות לקבוצת בזלת. אין להעתיק, לשכפל, להפיץ או לעשות שימוש מסחרי בתכני הקטלוג, לרבות תמונות, הדמיות תלת־ממד ותבניות פריסה, ללא אישור מראש ובכתב.</div>
        </div>
      </footer>
    </div>
  );
}

