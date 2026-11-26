// Bazelet Catalog - Complete Products Data - UPDATED


export const mainCategories = [
  {
    id: 'flowers',
    name: 'תפרחות',
    description: 'פתרונות אריזה לתפרחות קנביס',
    icon: './images/icons/flower-main-icon.png'
  },
  {
    id: 'prerolls',
    name: 'מגולגלות',
    description: 'פתרונות אריזה למגולגלות קנביס',
    icon: './images/icons/preroll-main-icon.png'
  },
  {
    id: 'oil',
    name: 'שמן',
    description: 'פתרונות אריזה לשמני קנביס',
    icon: './images/icons/oil-main-icon.png'
  },
  {
    id: 'combo',
    name: 'מוצרים משולבים',
    description: 'מארזים משולבים למגוון מוצרי קנביס',
    icon: './images/icons/combo-main-icon.png'
  }
];

export const subcategories = [
  {
    id: 'flowers-regular',
    parentId: 'flowers',
    name: 'תפרחות',
    description: 'אריזות לתפרחות קנביס 10 גרם',
    icon: './images/icons/icon-flower.png'
  },
  {
    id: 'flowers-minis',
    parentId: 'flowers',
    name: 'תפרחות מיניז',
    description: 'אריזות לתפרחות מיניז 10 גרם',
    icon: './images/icons/icon-minis.png'
  },
  {
    id: 'jar',
    parentId: 'flowers',
    name: 'צנצנת',
    description: 'צנצנת לתפרחות',
    icon: './images/icons/icon-jar.png'
  },
  {
    id: 'prerolls-05',
    parentId: 'prerolls',
    name: 'מגולגלות 0.5 גרם',
    description: 'אריזות למגולגלות 0.5 גרם',
    icon: './images/icons/icon-preroll-05.png'
  },
  {
    id: 'prerolls-025',
    parentId: 'prerolls',
    name: 'מגולגלות 0.25 גרם',
    description: 'אריזות למגולגלות 0.25 גרם',
    icon: './images/icons/icon-preroll-025.png'
  },
  {
    id: 'prerolls-15',
    parentId: 'prerolls',
    name: 'מגולגלות 1.5 גרם',
    description: 'אריזות למגולגלות 1.5 גרם',
    icon: './images/icons/icon-preroll-15.png'
  },
  {
    id: 'prerolls-2',
    parentId: 'prerolls',
    name: 'מגולגלות 2 גרם',
    description: 'אריזות למגולגלות 2 גרם',
    icon: './images/icons/icon-preroll-2.png'
  },
  {
    id: 'oil-products',
    parentId: 'oil',
    name: 'שמן',
    description: 'פתרונות אריזה לשמני קנביס',
    icon: './images/icons/icon-oil.png'
  },
  {
    id: 'combo-preroll-flower',
    parentId: 'combo',
    name: 'מגולגלות + תפרחת',
    description: 'מארז משולב למגולגלות ותפרחת',
    icon: './images/icons/icon-combo.png'
  },
  {
    id: 'combo-preroll-oil',
    parentId: 'combo',
    name: 'מגולגלות + שמן',
    description: 'מארז משולב למגולגלות ושמן',
    icon: './images/icons/icon-combo.png'
  },
  {
    id: 'combo-flower-minis',
    parentId: 'combo',
    name: 'תפרחת + מיניז',
    description: 'מארז משולב לתפרחת רגילה ומיניז',
    icon: './images/icons/icon-combo.png'
  },
  {
    id: 'combo-sativa-indica',
    parentId: 'combo',
    name: 'סאטיבה + אינדיקה',
    description: 'מארז משולב לשני זנים שונים',
    icon: './images/icons/icon-combo.png'
  },
  {
    id: 'combo-flower-oil',
    parentId: 'combo',
    name: 'תפרחת + שמן',
    description: 'מארז משולב לתפרחת ושמן',
    icon: './images/icons/icon-combo.png'
  }
];

export const products = [

  // =============================================================
  // תפרחות רגילות - אריזה סטנדרטית
  // =============================================================

  // אריזה סטנדרטית (קופסא סטנדרטית → אריזה סטנדרטית)
  {
    id: 'flower-standard',
    model3d: {
      anim: './images/models/anim-flower-standard.glb?v=e1', targetOpen: '0.000m 0.138m -0.006m', radius: '0.702m',
      // brand it: customer artwork wraps the box by the supplier dieline (artboard 1079.29 x 886.535 pt)
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 1079.29 / 886.535,
          dieline: { page: [1079.29, 886.535], folds: [51.0, 476.2, 561.3, 986.4, 1070.3], foldTop: 146.0, foldLen: 595.2 }, sample: './images/templates/flower-standard-sample.jpg' },
        // same 200 x 150 pouch as the gift box (zipper on the 150 mm side), printed upright
        { label: 'השקית', material: 'Pouch', mode: 'lid', lid: [450, 150], aspect: 3, finish: [0.15, 0.42], sample: './images/templates/sample-pouch-v.jpg' },
      ] },
    },
    sku: 'BZL-FL-001',
    subcategoryId: 'flowers-regular',
    name: 'אריזה סטנדרטית',
    description: 'קרטון לשקית תפרחות',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '150 × 210 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/flower-box-standard-closed.png' }
  },

  // שקית סטנדרטית (שקית → שקית סטנדרטית, SKU BZL-FL-002→003)
  {
    id: 'flower-pouch',
    model3d: { static: './images/models/anim-pouch-v.glb?v=a2n', radius: '0.62m',
      print: { noOpen: true, material: 'Pouch', mode: 'lid', lid: [450, 150], aspect: 3, finish: [0.15, 0.42], sample: './images/templates/sample-pouch-v.jpg' } },
    sku: 'BZL-FL-003',
    subcategoryId: 'flowers-regular',
    name: 'שקית',
    description: 'שקית אלומיניום לתפרחות',
    specs: { volume: '10 גרם', material: 'אלומיניום', closure: 'סגירה חוזרת' , dimensions: '150 × 200 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/flower-pouch.png' }
  },

  // =============================================================
  // תפרחות רגילות - אריזת מתנה
  // =============================================================

  // אריזת מתנה (קופסת מתנה → אריזת מתנה, SKU BZL-FL-003→002)
  {
    id: 'flower-gift',
    model3d: { anim: './images/models/anim-flower-gift.glb?v=r3n', targetOpen: '0.000m 0.09m -0.023m', radius: '0.76m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 963.78 / 1133.86, sample: './images/templates/sample-clario.jpg' },
        { label: 'השקית', material: 'Pouch', mode: 'lid', lid: [450, 150], aspect: 3, finish: [0.15, 0.42], sample: './images/templates/sample-pouch-h.jpg' },
      ] } },
    sku: 'BZL-FL-002',
    subcategoryId: 'flowers-regular',
    name: 'אריזת מתנה',
    description: 'קרטון לשקית תפרחת פרימיום',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחת מתנה' , dimensions: '210 × 150 × 30 מ"מ'},
    tags: ['IMC-GMP', 'premium'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/flower-box-premium-closed.png' }
  },

  // שקית לאריזת מתנה - הדפסה אופקית (NEW - BZL-FL-007)
  {
    id: 'flower-gift-pouch',
    model3d: { static: './images/models/anim-pouch-h.glb?v=a2n', radius: '0.62m',
      print: { noOpen: true, material: 'Pouch', mode: 'lid', lid: [450, 150], aspect: 3, finish: [0.15, 0.42], sample: './images/templates/sample-pouch-h.jpg' } },
    sku: 'BZL-FL-007',
    subcategoryId: 'flowers-regular',
    name: 'שקית לאריזת מתנה - הדפסה אופקית',
    description: 'שקית אלומיניום לאריזת מתנה',
    specs: { volume: '10 גרם', material: 'אלומיניום', closure: 'סגירה חוזרת' , dimensions: '200 × 150 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/flower-pouch-present.png' }
  },

  // =============================================================
  // תפרחות רגילות - אריזה מוקטנת (מועבר ממיניז)
  // =============================================================

  // אריזה מוקטנת לשקית DOY (קופסא ממיניז → הועבר לתפרחות, SKU BZL-MN-001→BZL-FL-004)
  {
    id: 'flower-small-box',
    model3d: { anim: './images/models/anim-doy-box.glb?v=e1', targetOpen: '0.000m 0.119m -0.007m', radius: '0.617m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 996.8 / 862.44, dieline: { page: [996.8, 862.44], folds: [34.3, 405.6, 516.2, 887.5, 996.4], foldTop: 161.9, foldLen: 538.6 }, sample: './images/templates/sample-doy-box.jpg' },
        { label: 'השקית', material: 'Pouch', mode: 'lid', lid: [133.33, 520], aspect: 133.33 / 520, finish: [0.15, 0.42], sample: './images/templates/sample-pouch-doy.jpg' },
      ] } },
    sku: 'BZL-FL-004',
    subcategoryId: 'flowers-regular',
    name: 'אריזה מוקטנת לשקית DOY',
    description: 'קרטון מוקטן לשקית DOY עם תחתית',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '131 × 39 × 190 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/minis-pouch-box-closed.png' }
  },

  // שקית DOY עם תחתית (שקית מיניז → הועבר לתפרחות, SKU BZL-MN-003→BZL-FL-005)
  {
    id: 'flower-doy-pouch',
    model3d: { static: './images/models/anim-pouch-doy.glb?v=a1n', radius: '0.6m',
      print: { noOpen: true, material: 'Pouch', mode: 'lid', lid: [133.33, 520], aspect: 133.33 / 520, finish: [0.15, 0.42], sample: './images/templates/sample-pouch-doy.jpg' } },
    sku: 'BZL-FL-005',
    subcategoryId: 'flowers-regular',
    name: 'שקית DOY עם תחתית',
    description: 'שקית אלומיניום לתפרחות מיניז',
    specs: { volume: '10 גרם', material: 'אלומיניום', closure: 'סגירה חוזרת' , dimensions: '133 × 190 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/minis-pouch.png' }
  },

  // אריזת מתנה מוקטנת לשקית DOY (BZL-FL-006)
  {
    id: 'flower-small-gift',
    model3d: { anim: './images/models/anim-doy-gift.glb?v=e1', targetOpen: '-0.030m 0.095m -0.030m', radius: '0.68m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 1102.68 / 1020.47, dieline: { page: [1102.68, 1020.47], folds: [121.9, 496.1, 609.4, 982.2], foldTop: 242.4, foldLen: 535.7 }, sample: './images/templates/sample-book.jpg' },
        { label: 'השקית', material: 'Pouch', mode: 'lid', lid: [133.33, 520], aspect: 133.33 / 520, finish: [0.15, 0.42], sample: './images/templates/sample-pouch-doy.jpg' },
      ] } },
    sku: 'BZL-FL-006',
    subcategoryId: 'flowers-regular',
    name: 'אריזת מתנה מוקטנת לשקית DOY',
    description: 'קרטון מתנה לשקית DOY עם תחתית, נפתח כמו ספר, עם חלונות בגב ובכריכה',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחת ספר' , dimensions: '132 × 40 × 190 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/flower-box-downsized-premium-closed.png' }
  },

  // =============================================================
  // תפרחות מיניז (נשארים: אריזה למיכל + מיכל)
  // =============================================================

  // אריזה (קופסא → אריזה, with מיכל inside)
  {
    id: 'minis-box-container',
    model3d: { anim: './images/models/anim-minis-box.glb?v=e1', targetOpen: '0.000m 0.075m -0.008m', radius: '0.410m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 805.04 / 628.15, dieline: { page: [805.04, 628.15], folds: [51.0, 297.6, 425.1, 671.8, 796.5], foldTop: 175.2, foldLen: 277.8 }, sample: './images/templates/sample-01.jpg' },
        { label: 'רדיד המכלים', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    sku: 'BZL-MN-001',
    subcategoryId: 'flowers-minis',
    name: 'קופסא למיכל',
    description: 'קופסא פתיחה עליונה',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '87 × 98 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/minis-container-box-closed.png' }
  },

  // מיכל תפרחת מיניז (SKU BZL-MN-002)
  {
    id: 'minis-container',
    sku: 'BZL-GL-002',
    subcategoryId: 'flowers-minis',
    name: 'מיכל תפרחת מיניז',
    description: 'מיכל לתפרחות מיניז',
    specs: { volume: '10 גרם', material: 'פלסטיק + כיסוי אלומיניום', closure: 'פתיחה עליונה' , dimensions: '87 × 35 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/minis-container.png' }
  },

  // =============================================================
  // צנצנת (ללא שינויים)
  // =============================================================

  {
    id: 'jar-container',
    model3d: { static: './images/models/anim-jar.glb?v=c2n', radius: '0.261m',
      print: { noOpen: true, material: 'Label', mode: 'lid', lid: [263.5, 45], aspect: 263.5 / 45, sample: './images/templates/sample-jar-label.jpg' } },
    sku: 'BZL-JR-001',
    subcategoryId: 'jar',
    name: 'צנצנת',
    description: 'צנצנת לתפרחות',
    specs: { volume: '10 גרם', material: 'פלסטיק', closure: 'מכסה בהברגה' , dimensions: '95.5 × 69.6 מ"מ'},
    tags: ['child-resistant', 'IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/jar-container.png' }
  },
  {
    id: 'jar-box',
    model3d: { anim: './images/models/anim-jar-box.glb?v=e1', targetOpen: '0m 0.054m 0m', radius: '0.428m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 1185.17 / 884.41, dieline: { page: [1185.17, 884.41], folds: [48.2, 331.7, 615.1, 898.6, 1179.5], foldTop: 328.8, foldLen: 226.8 }, sample: './images/templates/sample-17.jpg' },
        { label: 'מדבקת הצנצנת', material: 'Label', mode: 'lid', lid: [263.5, 45], aspect: 263.5 / 45, sample: './images/templates/sample-jar-label.jpg' },
      ] } },
    sku: 'BZL-JR-002',
    subcategoryId: 'jar',
    name: 'קופסא לצנצנת',
    description: 'קופסא לצנצנת',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '100 × 80 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: false,
    gallery: null,
    images: { primary: './images/products/jar-box.png' }
  },
  {
    id: 'jar-container-short',
    model3d: { static: './images/models/anim-jar-short.glb?v=c2n', radius: '0.242m',
      print: { noOpen: true, material: 'Label', mode: 'lid', lid: [263.5, 30], aspect: 263.5 / 30, sample: './images/templates/sample-jar-label-short.jpg' } },
    sku: 'BZL-JR-003',
    subcategoryId: 'jar',
    name: 'צנצנת נמוכה',
    description: 'צנצנת נמוכה לתפרחות',
    specs: { volume: '10 גרם', material: 'פלסטיק', closure: 'מכסה בהברגה' , dimensions: '95.5 × 64 מ"מ'},
    tags: ['child-resistant', 'IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/jar-container-short.png' }
  },
  {
    id: 'jar-box-short',
    model3d: { anim: './images/models/anim-jar-box-short.glb?v=e1', targetOpen: '0m 0.044m 0m', radius: '0.410m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 1179.5 / 761.39, dieline: { page: [1179.5, 761.39], folds: [39.7, 323.1, 606.6, 890.1, 1171.0], foldTop: 288.6, foldLen: 184.2 }, sample: './images/templates/sample-jarshort.jpg' },
        { label: 'מדבקת הצנצנת', material: 'Label', mode: 'lid', lid: [263.5, 30], aspect: 263.5 / 30, sample: './images/templates/sample-jar-label-short.jpg' },
      ] } },
    sku: 'BZL-JR-004',
    subcategoryId: 'jar',
    name: 'קופסא לצנצנת נמוכה',
    description: 'קופסא לצנצנת נמוכה',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '100 × 65 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: false,
    gallery: null,
    images: { primary: './images/products/jar-box-short.png' }
  },

  // =============================================================
  // מגולגלות 0.5 גרם (סלים → מגולגלות)
  // =============================================================

  // אריזה סטנדרטית (קופסא סטנדרטית → אריזה סטנדרטית)
  {
    id: 'preroll-slims-standard',
    model3d: { anim: './images/models/anim-slims-std.glb?v=e1', targetOpen: '0.000m 0.085m -0.007m', radius: '0.44m',
      print: { material: 'Print', aspect: 1172.65 / 979.65, dieline: { page: [1172.65, 979.65], folds: [71.4, 292.5, 462.6, 683.7, 851.2], foldTop: 322.6, foldLen: 334.5 }, sample: './images/templates/sample-rolls_slim.jpg' } },
    sku: 'BZL-PS-001',
    subcategoryId: 'prerolls-05',
    name: 'אריזה סטנדרטית',
    description: 'קרטון פתיחה עליונה',
    specs: { volume: '0.5 גרם × 20', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '78 × 60 × 118 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/preroll-slims-closed.png' }
  },

  // אריזת מתנה (קופסת מתנה → אריזת מתנה)
  {
    id: 'preroll-slims-gift',
    model3d: { anim: './images/models/anim-slims-gift.glb?v=p1n', targetOpen: '0.000m 0.074m -0.001m', radius: '0.515m',
      print: { material: 'Print', aspect: 959.53 / 860.32, sample: './images/templates/sample-wal.jpg' } },
    sku: 'BZL-PS-002',
    subcategoryId: 'prerolls-05',
    name: 'אריזת מתנה',
    description: 'קרטון פתיחת מתנה',
    specs: { volume: '0.5 גרם × 20', material: 'קרטון', closure: 'פתיחת מתנה' , dimensions: '124.5 × 39 מ"מ'},
    tags: ['IMC-GMP', 'premium'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/preroll-slims-gift-closed.png' }
  },

  // תרמיל בודד
  {
    id: 'preroll-slims-tube',
    model3d: { anim: './images/models/anim-tube-slim.glb?v=d3', targetOpen: '0m 0.066m 0m', radius: '0.4m',
      print: { material: 'Label', mode: 'lid', lid: [97, 57.5], aspect: 97 / 57.5, sample: './images/templates/sample-tube-label.jpg' } },
    sku: 'BZL-PS-003',
    subcategoryId: 'prerolls-05',
    name: 'תרמיל בודד',
    description: 'תרמיל ל-2 יחידות מגולגלות 0.5 גרם',
    specs: { volume: '0.5 גרם × 2', material: 'פלסטיק', closure: 'סגירה חוזרת, child-proof' , dimensions: '17 × 117 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-closed.png?v=d3' }
  },

  // קונוס 0.5 גרם (NEW - BZL-PS-004)
  {
    id: 'preroll-slims-cone',
    sku: 'BZL-PS-004',
    subcategoryId: 'prerolls-05',
    name: 'קונוס 0.5 גרם',
    description: 'קונוס למגולגלת 0.5 גרם',
    specs: { volume: '0.5 גרם', material: 'נייר+פילטר', closure: 'סגירה לאחר מילוי' , dimensions: '7 × 107 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    model3d: { static: './images/models/cone-05.glb?v=d3', radius: '0.4m' },
    images: { primary: './images/products/0.5-preroll-cone.png?v=d3' }
  },

  // =============================================================
  // מגולגלות 0.25 גרם (שורטס → מגולגלות)
  // =============================================================

  // אריזה (קופסא + מגירה → אריזה)
  {
    id: 'preroll-shorts-box',
    model3d: { anim: './images/models/anim-shorts.glb?v=p2n', targetOpen: '0.026m 0.024m 0m', radius: '0.427m',
      print: { slots: [
        { label: 'השרוול החיצוני', material: 'Print', aspect: 885.82 / 724.25, dieline: { page: [885.82, 724.25], folds: [65.2, 328.8, 464.9, 728.5, 863.2], foldTop: 206.9, foldLen: 310.4 }, sample: './images/templates/sample-shb.jpg' },
        { label: 'המגירה הפנימית', material: 'PrintB', aspect: 1207.71 / 1954.49, sample: './images/templates/sample-shd.jpg' },
        { label: 'רדיד המגשים', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    sku: 'BZL-PH-001',
    subcategoryId: 'prerolls-025',
    name: 'אריזה',
    description: 'אריזה ל-4 מגשים',
    specs: { volume: '0.25 גרם × 40', material: 'קרטון', closure: 'קרטון+מגירה נשלפת' , dimensions: '109.5 × 48 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/preroll-shorts-closed.png' }
  },

  // מגש
  {
    id: 'preroll-shorts-tray',
    sku: 'BZL-GL-001',
    subcategoryId: 'prerolls-025',
    name: 'מגש',
    description: 'מגש ל-10 יחידות 0.25 גרם',
    specs: { volume: '0.25 גרם × 10', material: 'פלסטיק + כיסוי אלומיניום', closure: 'פתיחה עליונה' , dimensions: '81 × 10 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-shorts-tray.png' }
  },

  // קונוס 0.25 גרם (NEW - BZL-PH-003)
  {
    id: 'preroll-shorts-cone',
    sku: 'BZL-PH-003',
    subcategoryId: 'prerolls-025',
    name: 'קונוס 0.25 גרם',
    description: 'קונוס למגולגלת 0.25 גרם',
    specs: { volume: '0.25 גרם', material: 'נייר+פילטר', closure: 'סגירה לאחר מילוי' , dimensions: '5 × 75 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    model3d: { static: './images/models/cone-025.glb?v=d3', radius: '0.4m' },
    images: { primary: './images/products/0.25-preroll-cone.png?v=d3' }
  },

  // =============================================================
  // מגולגלות 1.5 גרם
  // =============================================================

  // אריזה סטנדרטית - 7 מגולגלות 1.5 גרם
  {
    id: 'preroll-15-standard',
    model3d: { anim: './images/models/anim-pr15-std.glb?v=p1n', targetOpen: '0.000m 0.073m -0.018m', radius: '0.454m',
      print: { material: 'Print', aspect: 987.35 / 1081.5, dieline: { page: [987.35, 1081.5], folds: [51.0, 386.9, 511.7, 847.6, 969.7], foldTop: 520.2, foldLen: 354.3 }, sample: './images/templates/sample-tb15.jpg' } },
    sku: 'BZL-PR-001',
    subcategoryId: 'prerolls-15',
    name: 'אריזה סטנדרטית',
    description: 'אריזה ל-7 מגולגלות פתיחה עליונה',
    specs: { volume: '1.5 גרם × 7', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '118.5 × 125 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/preroll-(7)1.5gr-box-standart-closed.png' }
  },

  // אריזה פתיחה צידית - 7 מגולגלות 1.5 גרם
  {
    id: 'preroll-15-side',
    model3d: { anim: './images/models/anim-pr15-side.glb?v=p2n', targetOpen: '0.025m 0.016m 0.000m', radius: '0.652m',
      print: { slots: [
        { label: 'השרוול', material: 'Print', aspect: 979.37 / 909.92, dieline: { page: [979.37, 909.92], folds: [51.1, 421.0, 511.7, 881.7, 971.0], foldTop: 155.9, foldLen: 598.1 }, sample: './images/templates/sample-sl15.jpg' },
        { label: 'המגירה', material: 'PrintB', aspect: 2163.57 / 1498.5, dieline: { page: [2163.57, 1498.5], folds: [1139.3, 1720.4], foldTop: 696.7, foldLen: 358.6 }, sample: './images/templates/sample-d15.jpg' },
      ] } },
    sku: 'BZL-PR-002',
    subcategoryId: 'prerolls-15',
    name: 'אריזה פתיחה צידית',
    description: 'אריזה ל-7 מגולגלות פתיחה צידית',
    specs: { volume: '1.5 גרם × 7', material: 'קרטון', closure: 'פתיחה צידית' , dimensions: '211 × 32 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/preroll-(7)1.5gr-box-side-closed.png' }
  },

  // תרמיל בודד - מגולגלת 1.5 גרם
  {
    id: 'preroll-15-tube',
    model3d: { anim: './images/models/anim-tube.glb?v=d3', targetOpen: '0m 0.066m 0m', radius: '0.4m',
      print: { material: 'Label', mode: 'lid', lid: [97, 57.5], aspect: 97 / 57.5, sample: './images/templates/sample-tube-label.jpg' } },
    sku: 'BZL-PS-003',
    subcategoryId: 'prerolls-15',
    name: 'תרמיל בודד',
    description: 'תרמיל ליחידה מגולגלת 1.5 גרם',
    specs: { volume: '1.5 גרם', material: 'פלסטיק', closure: 'סגירה חוזרת, child-proof' , dimensions: '17 × 117 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-15.png?v=d3' }
  },

  // קופסא לתרמיל בודד - מגולגלת 1.5 גרם
  {
    id: 'preroll-15-tube-box',
    // supplier dieline IF3095509: 28 x 20 x 120 mm
    model3d: { anim: './images/models/anim-tube-box.glb?v=e1', targetOpen: '0m 0.08m 0m', radius: '0.36m',
      print: { material: 'Print', aspect: 436.54 / 583.94, dieline: { page: [436.54, 583.94], folds: [125.6, 204.9, 261.6, 341.0, 394.9], foldTop: 118.8, foldLen: 340.2 }, sample: './images/templates/sample-tube.jpg' } },
    sku: 'BZL-PS-007',
    subcategoryId: 'prerolls-15',
    name: 'קופסא לתרמיל בודד',
    description: 'קרטון לתרמיל ליחידה מגולגלת 1.5 גרם',
    specs: { volume: '1.5 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '28 × 20 × 120 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-box-15.png' }
  },

  // קונוס 1.5 גרם
  {
    id: 'preroll-15-cone',
    sku: 'BZL-PS-005',
    subcategoryId: 'prerolls-15',
    name: 'קונוס 1.5 גרם',
    description: 'קונוס למגולגלת 1.5 גרם',
    specs: { volume: '1.5 גרם', material: 'נייר+פילטר', closure: 'סגירה לאחר מילוי' , dimensions: '15 × 140 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    model3d: { static: './images/models/cone-15.glb?v=d3', radius: '0.4m' },
    images: { primary: './images/products/1.5-preroll-cone.png?v=d3' }
  },

  // =============================================================
  // מגולגלות 2 גרם
  // =============================================================

  // אריזה סטנדרטית - 5 מגולגלות 2 גרם
  {
    id: 'preroll-2-standard',
    model3d: { anim: './images/models/anim-pr2-std.glb?v=p1n', targetOpen: '0.000m 0.066m -0.015m', radius: '0.458m',
      print: { material: 'Print', aspect: 1063.89 / 1037.73, dieline: { page: [1063.89, 1037.73], folds: [51.0, 470.6, 549.9, 969.4, 1046.3], foldTop: 520.2, foldLen: 354.3 }, sample: './images/templates/sample-tb2.jpg' } },
    sku: 'BZL-PR-003',
    subcategoryId: 'prerolls-2',
    name: 'אריזה סטנדרטית',
    description: 'אריזה ל-5 מגולגלות פתיחה עליונה',
    specs: { volume: '2 גרם × 5', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '148 × 125 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/preroll-(5)2gr-box-standart-closed.png' }
  },

  // אריזה פתיחה צידית - 5 מגולגלות 2 גרם
  {
    id: 'preroll-2-side',
    model3d: { anim: './images/models/anim-pr2-side.glb?v=p2n', targetOpen: '0.036m 0.016m 0.000m', radius: '0.582m',
      print: { slots: [
        { label: 'השרוול', material: 'Print', aspect: 970.86 / 748.34, dieline: { page: [970.86, 748.34], folds: [51.0, 416.7, 507.4, 873.1, 962.4], foldTop: 155.9, foldLen: 436.5 }, sample: './images/templates/sample-sl2.jpg' },
        { label: 'המגירה', material: 'PrintB', aspect: 1811.75 / 1474.18, dieline: { page: [1811.75, 1474.18], folds: [949.0, 1368.6], foldTop: 676.7, foldLen: 354.3 }, sample: './images/templates/sample-d2.jpg' },
      ] } },
    sku: 'BZL-PR-004',
    subcategoryId: 'prerolls-2',
    name: 'אריזה פתיחה צידית',
    description: 'אריזה ל-5 מגולגלות פתיחה צידית',
    specs: { volume: '2 גרם × 5', material: 'קרטון', closure: 'פתיחה צידית' , dimensions: '154 × 32 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/preroll-(5)2gr-box-side-closed.png' }
  },

  // תרמיל בודד - מגולגלת 2 גרם
  {
    id: 'preroll-2-tube',
    model3d: { anim: './images/models/anim-tube-2.glb?v=d3', targetOpen: '0m 0.066m 0m', radius: '0.4m',
      print: { material: 'Label', mode: 'lid', lid: [97, 57.5], aspect: 97 / 57.5, sample: './images/templates/sample-tube-label.jpg' } },
    sku: 'BZL-PS-003',
    subcategoryId: 'prerolls-2',
    name: 'תרמיל בודד',
    description: 'תרמיל ליחידה מגולגלת 2 גרם',
    specs: { volume: '2 גרם', material: 'פלסטיק', closure: 'סגירה חוזרת, child-proof' , dimensions: '20 × 115 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-2.png?v=d3' }
  },

  // קופסא לתרמיל בודד - מגולגלת 2 גרם
  {
    id: 'preroll-2-tube-box',
    // supplier dieline IF3095509: 28 x 20 x 120 mm
    model3d: { anim: './images/models/anim-tube-box.glb?v=e1', targetOpen: '0m 0.08m 0m', radius: '0.36m',
      print: { material: 'Print', aspect: 436.54 / 583.94, dieline: { page: [436.54, 583.94], folds: [125.6, 204.9, 261.6, 341.0, 394.9], foldTop: 118.8, foldLen: 340.2 }, sample: './images/templates/sample-tube.jpg' } },
    sku: 'BZL-PS-007',
    subcategoryId: 'prerolls-2',
    name: 'קופסא לתרמיל בודד',
    description: 'קרטון לתרמיל ליחידה מגולגלת 2 גרם',
    specs: { volume: '2 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '28 × 20 × 120 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-box-2.png' }
  },

  // קונוס 2 גרם
  {
    id: 'preroll-2-cone',
    sku: 'BZL-PS-006',
    subcategoryId: 'prerolls-2',
    name: 'קונוס 2 גרם',
    description: 'קונוס למגולגלת 2 גרם',
    specs: { volume: '2 גרם', material: 'נייר+פילטר', closure: 'סגירה לאחר מילוי' , dimensions: '8 × 110 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    model3d: { static: './images/models/cone-2.glb?v=d3', radius: '0.4m' },
    images: { primary: './images/products/2-preroll-cone.png?v=d3' }
  },

  // =============================================================
  // שמן (ללא שינויים)
  // =============================================================

  {
    id: 'oil-dropper',
    model3d: { static: './images/models/anim-dropper.glb?v=c3n', radius: '0.158m',
      print: { noOpen: true, material: 'Label', mode: 'lid', lid: [85, 35], aspect: 85 / 35, sample: './images/templates/sample-label.jpg' } },
    sku: 'BZL-OL-002',
    subcategoryId: 'oil-products',
    name: 'בקבוק דרופר',
    description: 'בקבוק זכוכית כהה עם דרופר',
    specs: { volume: '10 מ"ל', material: 'זכוכית אמבר', closure: 'דרופר' , dimensions: '25 × 70 מ"מ'},
    tags: ['child-resistant', 'UV protection', 'IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/oil-dropper-bottle.png' }
  },
  {
    id: 'oil-box',
    model3d: { anim: './images/models/anim-oil-box.glb?v=e1', targetOpen: '0m 0.06m 0m', radius: '0.27m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 541.4 / 521.7, dieline: { page: [541.4, 521.7], folds: [45.4, 164.4, 283.5, 402.5, 519.0], foldTop: 156.8, foldLen: 240.9 }, sample: './images/templates/sample-16.jpg' },
        { label: 'תווית הבקבוק', material: 'Label', mode: 'lid', lid: [85, 35], aspect: 85 / 35, sample: './images/templates/sample-label.jpg' },
      ] } },
    sku: 'BZL-OL-001',
    subcategoryId: 'oil-products',
    name: 'קופסא',
    description: 'קופסא לבקבוק שמן',
    specs: { volume: '10 מ"ל', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '42 × 42 × 85 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: false,
    gallery: null,
    images: { primary: './images/products/oil-bottle-box.png' }
  },

  // =============================================================
  // משולב: מגולגלות + תפרחת (ללא שינויים במוצרים אלו)
  // =============================================================

  {
    id: 'combo-preroll-flower-container',
    sku: 'BZL-GL-002',
    subcategoryId: 'combo-preroll-flower',
    name: 'מיכל תפרחת',
    description: 'מיכל לתפרחות',
    specs: { volume: '5 גרם', material: 'פלסטיק + כיסוי אלומיניום', closure: 'פתיחה עליונה' , dimensions: '87 × 35 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-flower-container.png' }
  },
  {
    id: 'combo-preroll-flower-tray',
    sku: 'BZL-GL-001',
    subcategoryId: 'combo-preroll-flower',
    name: 'מגשית מגולגלות',
    description: 'מגשית ל-20 מגולגלות 0.25 גרם',
    specs: { volume: '0.25 גרם × 10', material: 'פלסטיק + כיסוי אלומיניום', closure: 'פתיחה עליונה' , dimensions: '81 × 10 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-preroll-tray.png' }
  },
  {
    id: 'combo-preroll-flower-box',
    model3d: { anim: './images/models/anim-horizontal-mix.glb?v=e1', targetOpen: '0.025m 0.037m 0.000m', radius: '0.568m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 833.38 / 815.24, dieline: { page: [833.38, 815.24], folds: [51.0, 326.0, 439.4, 714.3, 824.9], foldTop: 161.0, foldLen: 493.2 }, sample: './images/templates/sample-04.jpg' },
        { label: 'רדיד המכלים', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    sku: 'BZL-CB-001',
    subcategoryId: 'combo-preroll-flower',
    name: 'אריזה',
    description: 'קופסא למוצר משולב מגולגלות ותפרחת',
    specs: { volume: '10 גרם תפרחת + מגולגלות', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '174 × 40 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/combo-preroll-flower-closed.png' }
  },

  // =============================================================
  // משולב: מגולגלות + שמן
  // =============================================================

  // אריזת מגולגלות פתוחה (קופסא → אריזה in description)
  {
    id: 'combo-preroll-oil-preroll-open',
    model3d: { anim: './images/models/anim-preroll5.glb?v=e1', targetOpen: '0.000m 0.06m -0.005m', radius: '0.33m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 1110.16 / 708.9, dieline: { page: [1110.16, 708.9], folds: [71.4, 343.5, 456.9, 729.0, 839.6], foldTop: 226.9, foldLen: 255.1 }, sample: './images/templates/sample-linq_f5.jpg' },
        { label: 'רדיד המגשים', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    sku: 'BZL-CB-PO-002',
    subcategoryId: 'combo-preroll-oil',
    name: 'אריזת מגולגלות פתוחה',
    description: 'קופסא ל-20 מגולגלות 0.25 גרם',
    specs: { volume: '0.25 גרם × 20', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '96 × 40 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-preroll-oil-preroll-open.png' }
  },

  // שפריצר 5 מ"ל (שמן → בקבוק in description)
  {
    id: 'combo-preroll-oil-spritzer',
    sku: 'BZL-CB-PO-003',
    subcategoryId: 'combo-preroll-oil',
    name: 'שפריצר 5 מ"ל',
    description: 'בקבוק עם שפריצר מדוד',
    specs: { volume: '5 מ"ל', material: 'זכוכית + פלסטיק', closure: 'שפריצר' , dimensions: '30 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/oil-spritzer-5ml.png' }
  },

  {
    id: 'combo-preroll-oil-tray',
    sku: 'BZL-GL-001',
    subcategoryId: 'combo-preroll-oil',
    name: 'מגשית מגולגלות',
    description: 'מגשית ל-10 מגולגלות 0.25 גרם',
    specs: { volume: '0.25 גרם × 10', material: 'פלסטיק + כיסוי אלומיניום', closure: 'פתיחה עליונה' , dimensions: '81 × 10 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-preroll-tray.png' }
  },

  {
    id: 'combo-preroll-oil-box',
    // same master and inner cartons as the flower + oil set (129 x 47 x 94)
    model3d: { anim: './images/models/anim-flower-oil.glb?v=e1', targetOpen: '0.000m 0.07m -0.007m', radius: '0.45m',
      print: { slots: [
        { label: 'המארז החיצוני', material: 'Print', aspect: 1314.93 / 1010.54, dieline: { page: [1314.93, 1010.54], folds: [71.4, 437.0, 570.3, 935.9, 1066.3], foldTop: 372.0, foldLen: 266.5 }, sample: './images/templates/sample-linq_fo.jpg' },
        { label: 'קופסת המגולגלות', material: 'PrintFlower', aspect: 1110.16 / 708.9, dieline: { page: [1110.16, 708.9], folds: [71.4, 343.5, 456.9, 729.0, 839.6], foldTop: 226.9, foldLen: 255.1 }, sample: './images/templates/sample-linq_f5.jpg' },
        { label: 'קופסת השמן', material: 'PrintOil', aspect: 703.71 / 577.24, dieline: { page: [703.71, 577.24], folds: [72.1, 185.4, 270.5, 383.9, 466.1], foldTop: 161.1, foldLen: 255.1 }, sample: './images/templates/sample-bc_oil.jpg' },
      ] } },
    sku: 'BZL-CB-PO-001',
    subcategoryId: 'combo-preroll-oil',
    name: 'מארז',
    description: 'קופסת מגולגלות + קופסת שמן + מארז חיצוני',
    specs: { volume: 'שמן 5 מ"ל + 5 גרם מגולגלות', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '129 × 47 × 94 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/combo-flower-oil-closed.png' }
  },

  // =============================================================
  // משולב: תפרחת + מיניז (קופסא → אריזה)
  // =============================================================

  {
    id: 'combo-flower-minis-container',
    sku: 'BZL-GL-002',
    subcategoryId: 'combo-flower-minis',
    name: 'מיכל תפרחת',
    description: 'מיכל לתפרחת',
    specs: { volume: '5 גרם', material: 'פלסטיק + כיסוי אלומיניום', closure: 'פתיחה עליונה' , dimensions: '35 × 87 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-flower-container.png' }
  },

  // קופסא אופקית → אריזה אופקית
  {
    id: 'combo-flower-minis-horizontal',
    sku: 'BZL-CB-001',
    subcategoryId: 'combo-flower-minis',
    name: 'קופסא אופקית',
    description: 'קופסא לשני מיכלי תפרחת אחד ליד השני',
    specs: { volume: '5 גרם × 2', material: 'קרטון', closure: 'פתיחה צידית' , dimensions: '174 × 40 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    model3d: { anim: './images/models/anim-horizontal.glb?v=e1', targetOpen: '0.025m 0.037m 0m', radius: '0.52m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 833.38 / 815.24, dieline: { page: [833.38, 815.24], folds: [51.0, 326.0, 439.4, 714.3, 824.9], foldTop: 161.0, foldLen: 493.2 }, sample: './images/templates/sample-04.jpg' },
        { label: 'רדיד המכלים', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    images: { primary: './images/products/combo-dual-flower-horizontal-closed.png', open: './images/products/combo-dual-flower-horizontal-open.png' }
  },

  // קופסא אנכית → אריזה אנכית
  {
    id: 'combo-flower-minis-vertical',
    model3d: { anim: './images/models/anim-vertical.glb?v=e1', targetOpen: '0.000m 0.091m -0.016m', radius: '0.532m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 1106.36 / 756.85, dieline: { page: [1106.36, 756.85], folds: [51.0, 326.0, 575.4, 850.4, 1097.9], foldTop: 311.8, foldLen: 255.1 }, sample: './images/templates/sample-10.jpg' },
        { label: 'רדיד המכלים', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    sku: 'BZL-CB-002',
    subcategoryId: 'combo-flower-minis',
    name: 'קופסא אנכית',
    description: 'קופסא לשני מיכלי תפרחת אחד על השני',
    specs: { volume: '5 גרם × 2', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '97 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/combo-dual-flower-vertical-closed.png' }
  },

  // =============================================================
  // משולב: סאטיבה + אינדיקה (קופסא → אריזה)
  // =============================================================

  {
    id: 'combo-sativa-indica-container',
    sku: 'BZL-GL-002',
    subcategoryId: 'combo-sativa-indica',
    name: 'מיכל תפרחת',
    description: 'מיכל לתפרחת',
    specs: { volume: '5 גרם', material: 'פלסטיק + כיסוי אלומיניום', closure: 'פתיחה עליונה' , dimensions: '35 × 87 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-flower-container.png' }
  },

  // קופסא אופקית → אריזה אופקית
  {
    id: 'combo-sativa-indica-horizontal',
    model3d: { anim: './images/models/anim-horizontal.glb?v=e1', targetOpen: '0.025m 0.037m 0m', radius: '0.52m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 833.38 / 815.24, dieline: { page: [833.38, 815.24], folds: [51.0, 326.0, 439.4, 714.3, 824.9], foldTop: 161.0, foldLen: 493.2 }, sample: './images/templates/sample-04.jpg' },
        { label: 'רדיד המכלים', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    sku: 'BZL-CB-001',
    subcategoryId: 'combo-sativa-indica',
    name: 'קופסא אופקית',
    description: 'קופסא לשני מיכלי תפרחת אחד ליד השני',
    specs: { volume: '5 גרם × 2', material: 'קרטון', closure: 'פתיחה צידית' , dimensions: '174 × 40 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/combo-sativa-indica-horizontal-closed.png' }
  },

  // קופסא אנכית → אריזה אנכית
  {
    id: 'combo-sativa-indica-vertical',
    model3d: { anim: './images/models/anim-vertical.glb?v=e1', targetOpen: '0.000m 0.091m -0.016m', radius: '0.532m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 1106.36 / 756.85, dieline: { page: [1106.36, 756.85], folds: [51.0, 326.0, 575.4, 850.4, 1097.9], foldTop: 311.8, foldLen: 255.1 }, sample: './images/templates/sample-10.jpg' },
        { label: 'רדיד המכלים', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    sku: 'BZL-CB-002',
    subcategoryId: 'combo-sativa-indica',
    name: 'קופסא אנכית',
    description: 'קופסא לשני מיכלי תפרחת אחד על השני',
    specs: { volume: '5 גרם × 2', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '97 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/combo-sativa-indica-vertical-closed.png' }
  },

  // =============================================================
  // משולב: תפרחת + שמן
  // =============================================================
  // הערה: אותה קופסא = אותו מק"ט ואותן תמונות (שימוש חוזר בנכסים קיימים)

  {
    id: 'combo-flower-oil-flower-open',
    model3d: { anim: './images/models/anim-flower5.glb?v=e1', targetOpen: '0.000m 0.06m -0.005m', radius: '0.33m',
      print: { slots: [
        { label: 'הקופסה', material: 'Print', aspect: 1110.16 / 708.9, dieline: { page: [1110.16, 708.9], folds: [71.4, 343.5, 456.9, 729.0, 839.6], foldTop: 226.9, foldLen: 255.1 }, sample: './images/templates/sample-linq_f5.jpg' },
        { label: 'רדיד המכל', material: 'Foil', mode: 'lid', lid: [81, 87], flipX: true, sample: './images/templates/sample-foil.jpg' },
      ] } },
    sku: 'BZL-CB-PO-002',
    subcategoryId: 'combo-flower-oil',
    name: 'אריזת תפרחת פתוחה',
    description: 'קופסא למיכל תפרחת 5 גרם',
    specs: { volume: '5 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '96 × 40 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-flower-oil-flower-open.png' }
  },

  {
    id: 'combo-flower-oil-spritzer',
    sku: 'BZL-CB-PO-003',
    subcategoryId: 'combo-flower-oil',
    name: 'שפריצר 5 מ"ל',
    description: 'בקבוק עם שפריצר מדוד',
    specs: { volume: '5 מ"ל', material: 'זכוכית + פלסטיק', closure: 'שפריצר' , dimensions: '30 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/oil-spritzer-5ml.png' }
  },

  {
    id: 'combo-flower-oil-container',
    sku: 'BZL-GL-002',
    subcategoryId: 'combo-flower-oil',
    name: 'מיכל תפרחת',
    description: 'מיכל ל-5 גרם תפרחת',
    specs: { volume: '5 גרם', material: 'פלסטיק + כיסוי אלומיניום', closure: 'פתיחה עליונה' , dimensions: '87 × 35 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-flower-container.png' }
  },

  {
    id: 'combo-flower-oil-box',
    // open state shows the two inner cartons: 5 g flower box (96 wide) + oil box turned sideways (30 wide) = 126 of 129 mm
    model3d: { anim: './images/models/anim-flower-oil.glb?v=e1', targetOpen: '0.000m 0.07m -0.007m', radius: '0.45m',
      print: { slots: [
        { label: 'המארז החיצוני', material: 'Print', aspect: 1314.93 / 1010.54, dieline: { page: [1314.93, 1010.54], folds: [71.4, 437.0, 570.3, 935.9, 1066.3], foldTop: 372.0, foldLen: 266.5 }, sample: './images/templates/sample-linq_fo.jpg' },
        { label: 'קופסת התפרחת', material: 'PrintFlower', aspect: 1110.16 / 708.9, dieline: { page: [1110.16, 708.9], folds: [71.4, 343.5, 456.9, 729.0, 839.6], foldTop: 226.9, foldLen: 255.1 }, sample: './images/templates/sample-linq_f5.jpg' },
        { label: 'קופסת השמן', material: 'PrintOil', aspect: 703.71 / 577.24, dieline: { page: [703.71, 577.24], folds: [72.1, 185.4, 270.5, 383.9, 466.1], foldTop: 161.1, foldLen: 255.1 }, sample: './images/templates/sample-bc_oil.jpg' },
      ] } },
    sku: 'BZL-CB-PO-001',
    subcategoryId: 'combo-flower-oil',
    name: 'מארז',
    description: 'קופסת תפרחת + קופסת שמן + מארז חיצוני',
    specs: { volume: 'שמן 5 מ"ל + 5 גרם תפרחת', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '129 × 47 × 94 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    images: { primary: './images/products/combo-flower-oil-closed.png' }
  }
];

// =============================================================
// Helpers
// =============================================================
export const getMainCategory = (id) => mainCategories.find((c) => c.id === id);
export const getSubcategory = (id) => subcategories.find((s) => s.id === id);
export const getSubcategoriesByParent = (parentId) => subcategories.filter((s) => s.parentId === parentId);
export const getProductsBySubcategory = (subId) => products.filter((p) => p.subcategoryId === subId);
export const getProduct = (id) => products.find((p) => p.id === id);
export const countByMain = (mainId) =>
  getSubcategoriesByParent(mainId).reduce((n, s) => n + getProductsBySubcategory(s.id).length, 0);
