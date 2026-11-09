// =============================================================
// How each product looks on its card in the products list
// - size: computed from the real dimensions in specs (longest side, mm),
//         relative to the largest item in the same sub-category,
//         so boxes and inner components keep true proportions.
// - sizeOverrides: manual fixes (1 = full size of the card)
// - hover: the "open" image shown when hovering a card
// =============================================================
import { products } from './products.js';

const sizeOverrides = {
  // אריזה מוקטנת ל-DOY, שקית DOY ואריזת מתנה מוקטנת – מותאמות זו לזו
  'flower-small-box': 0.7,
  'flower-doy-pouch': 0.7,
  'flower-small-gift': 0.7,
};

const MIN_SIZE = 0.4;

// Products whose images come from the 3D studio: already rendered at one fixed
// scale per category (true proportions), so the card must NOT shrink them again.
const trueScale = new Set([
  'combo-flower-minis-horizontal', 'combo-flower-minis-vertical', 'combo-flower-minis-container',
  'combo-sativa-indica-horizontal', 'combo-sativa-indica-vertical', 'combo-sativa-indica-container',
  'combo-preroll-flower-box', 'combo-preroll-flower-container', 'combo-preroll-flower-tray',
  'combo-preroll-oil-box', 'combo-preroll-oil-tray',
  'combo-flower-oil-box', 'combo-flower-oil-container',
]);

// white items get a slightly darker card background so they don't disappear
const darkTile = new Set([
  'jar-container', 'jar-box',
  'preroll-slims-tube', 'preroll-15-tube', 'preroll-2-tube',
]);

const baseOverrides = {
  'combo-preroll-oil-box': './images/products/combo-preroll-oil-closed.png',
  'combo-flower-oil-box': './images/products/combo-preroll-oil-closed.png',
};

const hover = {
  'flower-standard': './images/products/flower-box-standard-open.png',
  'flower-gift': './images/products/flower-box-premium-open.png',
  'flower-small-box': './images/products/minis-pouch-box-open.png',
  'flower-small-gift': './images/products/flower-box-downsized-premium-open.png',
  'minis-box-container': './images/products/minis-container-box-open.png',
  'preroll-slims-standard': './images/products/preroll-slims-open.png',
  'preroll-slims-gift': './images/products/preroll-slims-gift-open.png',
  'preroll-shorts-box': './images/products/preroll-shorts-Open.png',
  'preroll-15-standard': './images/products/preroll-(7)1.5gr-box-standart-open.png',
  'preroll-15-side': './images/products/preroll-(7)1.5gr-box-side-open.png',
  'preroll-2-standard': './images/products/preroll-(5)2gr-box-standart-open.png',
  'preroll-2-side': './images/products/preroll-(5)2gr-box-side-open.png',
  'combo-preroll-flower-box': './images/products/combo-preroll-flower-open.png',
  'combo-preroll-oil-box': './images/products/combo-preroll-oil-open.png',
  'combo-flower-oil-box': './images/products/combo-preroll-oil-open.png',
  'combo-flower-minis-horizontal': './images/products/combo-dual-flower-horizontal-open.png',
  'combo-flower-minis-vertical': './images/products/combo-dual-flower-vertical-open.png',
  'combo-sativa-indica-horizontal': './images/products/combo-sativa-indica-horizontal-open.png',
  'combo-sativa-indica-vertical': './images/products/combo-sativa-indica-vertical-open.png',
};

const longest = (p) => {
  const nums = (p.specs?.dimensions || '').match(/\d+(\.\d+)?/g);
  return nums ? Math.max(...nums.map(Number)) : null;
};

const maxBySub = {};
for (const p of products) {
  const l = longest(p);
  if (l) maxBySub[p.subcategoryId] = Math.max(maxBySub[p.subcategoryId] || 0, l);
}

export function productDisplay(p) {
  const l = longest(p);
  let size = trueScale.has(p.id) ? 1 : (sizeOverrides[p.id] ?? (l ? l / maxBySub[p.subcategoryId] : 1));
  size = Math.max(MIN_SIZE, Math.min(1, size));
  return {
    size,
    base: baseOverrides[p.id] || p.images?.primary || p.gallery?.closed?.[0],
    hover: hover[p.id] || null,
    dark: darkTile.has(p.id),
  };
}
