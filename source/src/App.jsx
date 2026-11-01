import React, { useState, useEffect } from 'react';
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
// CARDS
// =====================================================
function CategoryCard({ index, item, count, onClick }) {
  const img = cardImages[item.id];
  return (
    <button className="card" onClick={onClick}>
      <div className={`card-photo ${img?.dark ? 'dark' : ''}`}>
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
  const { size, base, hover, dark } = productDisplay(product);
  return (
    <button className="card product" onClick={onClick}>
      <div className={`card-photo ${dark ? 'dark' : ''}`} style={{ '--s': size }}>
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
function Hero({ crumbs, title, text, eyebrow, big, children }) {
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
        <Hero big eyebrow="WHITE-LABEL PACKAGING SOLUTIONS" title="קטלוג אריזות קנאביס"
          text="בזלת מחויבת ללקוחותיה ומרחיבה את מגוון פתרונות האריזה, מתפרחות ועד שמנים, כדי לאפשר לכם לבנות פורטפוליו מוצרים מדויק בהתאם לאסטרטגיה המסחרית שלכם. האריזות מוצגות ללא מיתוג, לבחירה והתאמה מלאה לצרכי המותג.">
          <div className="strip"><div className="wrap strip-in">
            <span>IMC-GMP</span><i>·</i><span>{total} פתרונות אריזה</span><i>·</i>
            <span>{mainCategories.length} קטגוריות</span><i>·</i><span>ללא מיתוג – התאמה מלאה למותג</span>
          </div></div>
        </Hero>
        <main className="wrap page">
          <div className="sec-head"><h2>בחרו קטגוריה</h2><span>{pad(mainCategories.length)} CATEGORIES</span></div>
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
    const prods = getProductsBySubcategory(sub.id);
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
              {p.gallery ? (
                <>
                  {p.hasToggle && (
                    <div className="toggle">
                      <button className={viewState === 'closed' ? 'on' : ''} onClick={() => setViewState('closed')}>סגור</button>
                      <button className={viewState === 'open' ? 'on' : ''} onClick={() => setViewState('open')}>פתוח</button>
                    </div>
                  )}
                  <ImageGallery images={images} alt={p.name} />
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
        </div>
      </footer>
    </div>
  );
}

