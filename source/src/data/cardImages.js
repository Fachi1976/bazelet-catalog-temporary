// =============================================================
// תמונות כרטיסי הקטגוריות
// base  = התמונה שמוצגת בכרטיס
// hover = התמונה שמתחלפת כשמרחפים עם העכבר
// כדי להחליף תמונה: שימי קובץ חדש בתיקייה images/cards ועדכני את השם כאן
// =============================================================
const card = (id, opts = {}) => ({
  base: `./images/cards/${id}.webp`,
  hover: `./images/cards/${id}-hover.webp`,
  ...opts,
});
// dark: true = רקע מעט כהה יותר לכרטיס, לפריטים לבנים שנבלעים ברקע

export const cardImages = {
  // קטגוריות ראשיות
  flowers: card('flowers'),
  prerolls: card('prerolls'),
  oil: card('oil'),
  combo: card('combo'),

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
