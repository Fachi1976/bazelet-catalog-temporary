// =============================================================
// תמונות כרטיסי הקטגוריות
// base  = התמונה שמוצגת בכרטיס
// hover = התמונה שמתחלפת כשמרחפים עם העכבר
// כדי להחליף תמונה: שימי קובץ חדש בתיקייה images/cards ועדכני את השם כאן
// =============================================================
// studio: true = image comes from the 3D studio (has its own shadow)
const old3d = new Set([]);
const card = (id, opts = {}) => ({
  base: `./images/cards/${id}.webp`,
  hover: `./images/cards/${id}-hover.webp`,
  studio: !old3d.has(id),
  ...opts,
});
// dark: true = רקע מעט כהה יותר לכרטיס, לפריטים לבנים שנבלעים ברקע

export const cardImages = {
  // קטגוריות ראשיות
  // model = תלת מימד שמסתובב ונפתח במעבר עכבר (מחשב בלבד; בטלפון נשארות התמונות)
  flowers: card('flowers', { model: { src: './images/models/anim-doy-box.glb?v=c2', radius: '0.617m', target: '0.000m 0.119m -0.007m' } }),
  prerolls: card('prerolls', { model: { src: './images/models/anim-slims-std.glb?v=c2', radius: '0.456m', target: '0.000m 0.085m -0.007m' } }),
  oil: card('oil', { model: { src: './images/models/anim-oil-box.glb?v=c2', radius: '0.272m', target: '0m 0.057m 0m' } }),
  combo: card('combo', { model: { src: './images/models/anim-horizontal.glb?v=c2', radius: '0.52m', target: '0.025m 0.037m 0m' } }),

  // תפרחות
  'flowers-regular': card('flowers-regular'),
  'flowers-minis': card('flowers-minis'),
  jar: card('jar', { dark: true }),

  // מגולגלות
  'prerolls-025': card('prerolls-025'),
  'prerolls-05': card('prerolls-05'),
  'prerolls-15': card('prerolls-15'),
  'prerolls-2': card('prerolls-2'),

  // שמן
  'oil-products': card('oil'),

  // מוצרים משולבים
  'combo-preroll-flower': card('combo-preroll-flower'),
  'combo-preroll-oil': card('combo-preroll-oil'),
  'combo-flower-minis': card('combo-flower-minis'),
  'combo-sativa-indica': card('combo-sativa-indica'),
  'combo-flower-oil': card('combo-flower-oil'),
};
