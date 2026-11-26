# קטלוג אריזות בזלת – גרסה 2

## העלאה ל־GitHub Pages (פרויקט נפרד לבדיקה)
1. יוצרים ריפו חדש ב־GitHub (למשל `bazelet-catalog-v2`).
2. מעלים את **כל התוכן של התיקייה הזו** לשורש הריפו: `index.html`, `assets`, `images`, `.nojekyll`, `source`, `README.md`.
   - העלאה דרך הדפדפן מוגבלת ל־100 קבצים בכל פעם. את `images/360` כדאי להעלות בכמה סבבים, או להשתמש ב־GitHub Desktop.
3. ב־Settings ← Pages בוחרים: Branch `main`, תיקייה `/ (root)` ← Save.
4. אחרי דקה־שתיים הקטלוג זמין בכתובת `https://<שם-המשתמש>.github.io/bazelet-catalog-v2/`.

## מה יש איפה
| קובץ / תיקייה | מה זה |
|---|---|
| `index.html` + `assets/` | הקטלוג הבנוי – זה מה שהאתר מריץ |
| `images/cards/` | תמונות כרטיסי הקטגוריות (רגילה + `-hover` לריחוף) |
| `images/products/`, `images/360/`, `images/icons/` | תמונות המוצרים (דחוסות לטעינה מהירה) |
| `source/src/data/products.js` | כל המוצרים, המק"טים והמפרטים |
| `source/src/data/cardImages.js` | איזו תמונה מוצגת בכל כרטיס קטגוריה |
| `source/src/App.jsx`, `App.css` | המבנה והעיצוב |

## לינקים ישירים
כל מסך מקבל כתובת משלו, כך שאפשר לשלוח ללקוח לינק ישר למוצר, למשל:
`.../#flowers/flowers-regular/flower-standard`

## בנייה מחדש מהקוד (רק אם משנים קוד)
```
cd source
mkdir -p public && cp -r ../images public/
npm install
npm run build
```
התוצאה נוצרת ב־`source/dist` ומעתיקים אותה לשורש הריפו.
