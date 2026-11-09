// Bazelet Catalog - Complete Products Data - UPDATED

const generateGallery = (folderName, count) => {
  return Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `./images/360/${folderName}/${folderName}-${num}.png`;
  });
};

export const mainCategories = [
  {
    id: 'flowers',
    name: 'תפרחות',
    description: 'פתרונות אריזה לתפרחות קנאביס',
    icon: './images/icons/flower-main-icon.png'
  },
  {
    id: 'prerolls',
    name: 'מגולגלות',
    description: 'פתרונות אריזה למגולגלות קנאביס',
    icon: './images/icons/preroll-main-icon.png'
  },
  {
    id: 'oil',
    name: 'שמן',
    description: 'פתרונות אריזה לשמני קנאביס',
    icon: './images/icons/oil-main-icon.png'
  },
  {
    id: 'combo',
    name: 'מוצרים משולבים',
    description: 'מארזים משולבים למגוון מוצרי קנאביס',
    icon: './images/icons/combo-main-icon.png'
  }
];

export const subcategories = [
  {
    id: 'flowers-regular',
    parentId: 'flowers',
    name: 'תפרחות',
    description: 'אריזות לתפרחות קנאביס 10 גרם',
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
    description: 'פתרונות אריזה לשמני קנאביס',
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
    sku: 'BZL-FL-001',
    subcategoryId: 'flowers-regular',
    name: 'אריזה סטנדרטית',
    description: 'קרטון לשקית תפרחות',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '150 × 210 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('flower-standard-closed', 6),
      open: generateGallery('flower-standard-open', 6)
    },
    images: { primary: './images/products/flower-box-standard-closed.png' }
  },

  // שקית סטנדרטית (שקית → שקית סטנדרטית, SKU BZL-FL-002→003)
  {
    id: 'flower-pouch',
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
    sku: 'BZL-FL-002',
    subcategoryId: 'flowers-regular',
    name: 'אריזת מתנה',
    description: 'קרטון לשקית תפרחת פרימיום',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחת מתנה' , dimensions: '210 × 38 מ"מ'},
    tags: ['IMC-GMP', 'premium'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('flower-gift-closed', 7),
      open: generateGallery('flower-gift-open', 6)
    },
    images: { primary: './images/products/flower-box-premium-closed.png' }
  },

  // שקית לאריזת מתנה - הדפסה אופקית (NEW - BZL-FL-007)
  {
    id: 'flower-gift-pouch',
    sku: 'BZL-FL-007',
    subcategoryId: 'flowers-regular',
    name: 'שקית לאריזת מתנה - הדפסה אופקית',
    description: 'שקית אלומיניום לאריזת מתנה',
    specs: { volume: '10 גרם', material: 'אלומיניום', closure: 'סגירה חוזרת' , dimensions: '210 × 150 מ"מ'},
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
    sku: 'BZL-FL-004',
    subcategoryId: 'flowers-regular',
    name: 'אריזה מוקטנת לשקית DOY',
    description: 'קרטון מוקטן לשקית DOY עם תחתית',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '132 × 190 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('minis-box-bag-closed', 8),
      open: generateGallery('minis-box-bag-open', 9)
    },
    images: { primary: './images/products/minis-pouch-box-closed.png' }
  },

  // שקית DOY עם תחתית (שקית מיניז → הועבר לתפרחות, SKU BZL-MN-003→BZL-FL-005)
  {
    id: 'flower-doy-pouch',
    sku: 'BZL-FL-005',
    subcategoryId: 'flowers-regular',
    name: 'שקית DOY עם תחתית',
    description: 'שקית אלומיניום לתפרחות מיניז',
    specs: { volume: '10 גרם', material: 'אלומיניום', closure: 'סגירה חוזרת' , dimensions: '130 × 190 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/minis-pouch.png' }
  },

  // אריזת מתנה מוקטנת לשקית DOY (BZL-FL-006)
  {
    id: 'flower-small-gift',
    sku: 'BZL-FL-006',
    subcategoryId: 'flowers-regular',
    name: 'אריזת מתנה מוקטנת לשקית DOY',
    description: 'קרטון מוקטן פתיחת מתנה לשקית DOY עם תחתית',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחת מתנה' , dimensions: '132 × 38 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('flower-box-downsized-premium-closed', 7),
      open: generateGallery('flower-box-downsized-premium-open', 6)
    },
    images: { primary: './images/products/flower-box-downsized-premium-closed.png' }
  },

  // =============================================================
  // תפרחות מיניז (נשארים: אריזה למיכל + מיכל)
  // =============================================================

  // אריזה (קופסא → אריזה, with מיכל inside)
  {
    id: 'minis-box-container',
    sku: 'BZL-MN-001',
    subcategoryId: 'flowers-minis',
    name: 'קופסא למיכל',
    description: 'קופסא פתיחה עליונה',
    specs: { volume: '10 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '87 × 98 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('minis-box-container-closed', 5),
      open: generateGallery('minis-box-container-open', 6)
    },
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

  // =============================================================
  // מגולגלות 0.5 גרם (סלים → מגולגלות)
  // =============================================================

  // אריזה סטנדרטית (קופסא סטנדרטית → אריזה סטנדרטית)
  {
    id: 'preroll-slims-standard',
    sku: 'BZL-PS-001',
    subcategoryId: 'prerolls-05',
    name: 'אריזה סטנדרטית',
    description: 'קרטון פתיחה עליונה',
    specs: { volume: '0.5 גרם × 20', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '103 × 121 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('preroll-slims-standard-closed', 8),
      open: generateGallery('preroll-slims-standard-open', 8)
    },
    images: { primary: './images/products/preroll-slims-closed.png' }
  },

  // אריזת מתנה (קופסת מתנה → אריזת מתנה)
  {
    id: 'preroll-slims-gift',
    sku: 'BZL-PS-002',
    subcategoryId: 'prerolls-05',
    name: 'אריזת מתנה',
    description: 'קרטון פתיחת מתנה',
    specs: { volume: '0.5 גרם × 20', material: 'קרטון', closure: 'פתיחת מתנה' , dimensions: '124.5 × 39 מ"מ'},
    tags: ['IMC-GMP', 'premium'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('preroll-slims-gift-closed', 6),
      open: generateGallery('preroll-slims-gift-open', 6)
    },
    images: { primary: './images/products/preroll-slims-gift-closed.png' }
  },

  // תרמיל בודד
  {
    id: 'preroll-slims-tube',
    sku: 'BZL-PS-003',
    subcategoryId: 'prerolls-05',
    name: 'תרמיל בודד',
    description: 'תרמיל ל-2 יחידות מגולגלות 0.5 גרם',
    specs: { volume: '0.5 גרם × 2', material: 'פלסטיק', closure: 'סגירה חוזרת, child-proof' , dimensions: '20 × 115 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-closed.png' }
  },

  // קונוס 0.5 גרם (NEW - BZL-PS-004)
  {
    id: 'preroll-slims-cone',
    sku: 'BZL-PS-004',
    subcategoryId: 'prerolls-05',
    name: 'קונוס 0.5 גרם',
    description: 'קונוס למגולגלת 0.5 גרם',
    specs: { volume: '0.5 גרם', material: 'נייר+פילטר', closure: 'סגירה לאחר מילוי' , dimensions: '5 × 110 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/0.5-preroll-cone.png' }
  },

  // =============================================================
  // מגולגלות 0.25 גרם (שורטס → מגולגלות)
  // =============================================================

  // אריזה (קופסא + מגירה → אריזה)
  {
    id: 'preroll-shorts-box',
    sku: 'BZL-PH-001',
    subcategoryId: 'prerolls-025',
    name: 'אריזה',
    description: 'אריזה ל-4 מגשים',
    specs: { volume: '0.25 גרם × 40', material: 'קרטון', closure: 'קרטון+מגירה נשלפת' , dimensions: '109.5 × 48 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('preroll-shorts-box-closed', 9),
      open: generateGallery('preroll-shorts-box-open', 8)
    },
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
    images: { primary: './images/products/0.25-preroll-cone.png' }
  },

  // =============================================================
  // מגולגלות 1.5 גרם
  // =============================================================

  // אריזה סטנדרטית - 7 מגולגלות 1.5 גרם
  {
    id: 'preroll-15-standard',
    sku: 'BZL-PR-001',
    subcategoryId: 'prerolls-15',
    name: 'אריזה סטנדרטית',
    description: 'אריזה ל-7 מגולגלות פתיחה עליונה',
    specs: { volume: '1.5 גרם × 7', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '118.5 × 125 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('preroll-(7)1.5gr-box-standart-closed', 6),
      open: generateGallery('preroll-(7)1.5gr-box-standart-open', 6)
    },
    images: { primary: './images/products/preroll-(7)1.5gr-box-standart-closed.png' }
  },

  // אריזה פתיחה צידית - 7 מגולגלות 1.5 גרם
  {
    id: 'preroll-15-side',
    sku: 'BZL-PR-002',
    subcategoryId: 'prerolls-15',
    name: 'אריזה פתיחה צידית',
    description: 'אריזה ל-7 מגולגלות פתיחה צידית',
    specs: { volume: '1.5 גרם × 7', material: 'קרטון', closure: 'פתיחה צידית' , dimensions: '211 × 32 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('preroll-(7)1.5gr-box-side-closed', 7),
      open: generateGallery('preroll-(7)1.5gr-box-side-open', 7)
    },
    images: { primary: './images/products/preroll-(7)1.5gr-box-side-closed.png' }
  },

  // תרמיל בודד - מגולגלת 1.5 גרם
  {
    id: 'preroll-15-tube',
    sku: 'BZL-PS-003',
    subcategoryId: 'prerolls-15',
    name: 'תרמיל בודד',
    description: 'תרמיל ליחידה מגולגלת 1.5 גרם',
    specs: { volume: '1.5 גרם', material: 'פלסטיק', closure: 'סגירה חוזרת, child-proof' , dimensions: '20 × 115 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-closed-legacy.png' }
  },

  // קופסא לתרמיל בודד - מגולגלת 1.5 גרם
  {
    id: 'preroll-15-tube-box',
    sku: 'BZL-PS-007',
    subcategoryId: 'prerolls-15',
    name: 'קופסא לתרמיל בודד',
    description: 'קרטון לתרמיל ליחידה מגולגלת 1.5 גרם',
    specs: { volume: '1.5 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '28 × 120 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-box.png' }
  },

  // קונוס 1.5 גרם
  {
    id: 'preroll-15-cone',
    sku: 'BZL-PS-005',
    subcategoryId: 'prerolls-15',
    name: 'קונוס 1.5 גרם',
    description: 'קונוס למגולגלת 1.5 גרם',
    specs: { volume: '1.5 גרם', material: 'נייר+פילטר', closure: 'סגירה לאחר מילוי' , dimensions: '8 × 110 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/1.5-2-preroll-cone.png' }
  },

  // =============================================================
  // מגולגלות 2 גרם
  // =============================================================

  // אריזה סטנדרטית - 5 מגולגלות 2 גרם
  {
    id: 'preroll-2-standard',
    sku: 'BZL-PR-003',
    subcategoryId: 'prerolls-2',
    name: 'אריזה סטנדרטית',
    description: 'אריזה ל-5 מגולגלות פתיחה עליונה',
    specs: { volume: '2 גרם × 5', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '148 × 125 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('preroll-(5)2gr-box-standart-closed', 6),
      open: generateGallery('preroll-(5)2gr-box-standart-open', 6)
    },
    images: { primary: './images/products/preroll-(5)2gr-box-standart-closed.png' }
  },

  // אריזה פתיחה צידית - 5 מגולגלות 2 גרם
  {
    id: 'preroll-2-side',
    sku: 'BZL-PR-004',
    subcategoryId: 'prerolls-2',
    name: 'אריזה פתיחה צידית',
    description: 'אריזה ל-5 מגולגלות פתיחה צידית',
    specs: { volume: '2 גרם × 5', material: 'קרטון', closure: 'פתיחה צידית' , dimensions: '154 × 32 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('preroll-(5)2gr-box-side-closed', 6),
      open: generateGallery('preroll-(5)2gr-box-side-open', 6)
    },
    images: { primary: './images/products/preroll-(5)2gr-box-side-closed.png' }
  },

  // תרמיל בודד - מגולגלת 2 גרם
  {
    id: 'preroll-2-tube',
    sku: 'BZL-PS-003',
    subcategoryId: 'prerolls-2',
    name: 'תרמיל בודד',
    description: 'תרמיל ליחידה מגולגלת 2 גרם',
    specs: { volume: '2 גרם', material: 'פלסטיק', closure: 'סגירה חוזרת, child-proof' , dimensions: '20 × 115 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-closed-legacy.png' }
  },

  // קופסא לתרמיל בודד - מגולגלת 2 גרם
  {
    id: 'preroll-2-tube-box',
    sku: 'BZL-PS-007',
    subcategoryId: 'prerolls-2',
    name: 'קופסא לתרמיל בודד',
    description: 'קרטון לתרמיל ליחידה מגולגלת 2 גרם',
    specs: { volume: '2 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '28 × 120 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/preroll-tube-box.png' }
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
    images: { primary: './images/products/1.5-2-preroll-cone.png' }
  },

  // =============================================================
  // שמן (ללא שינויים)
  // =============================================================

  {
    id: 'oil-dropper',
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
    sku: 'BZL-OL-001',
    subcategoryId: 'oil-products',
    name: 'קופסא',
    description: 'קופסא לבקבוק שמן',
    specs: { volume: '10 מ"ל', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '42 × 85 מ"מ'},
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
    sku: 'BZL-CB-001',
    subcategoryId: 'combo-preroll-flower',
    name: 'אריזה',
    description: 'קופסא למוצר משולב מגולגלות ותפרחת',
    specs: { volume: '10 גרם תפרחת + מגולגלות', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '174 × 40 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('combo-preroll-flower-box-closed', 6),
      open: generateGallery('combo-preroll-flower-box-open', 7)
    },
    images: { primary: './images/products/combo-preroll-flower-closed.png' }
  },

  // =============================================================
  // משולב: מגולגלות + שמן
  // =============================================================

  // אריזת מגולגלות פתוחה (קופסא → אריזה in description)
  {
    id: 'combo-preroll-oil-preroll-open',
    sku: 'BZL-CB-PO-002',
    subcategoryId: 'combo-preroll-oil',
    name: 'אריזת מגולגלות פתוחה',
    description: 'קופסא ל-20 מגולגלות 0.25 גרם',
    specs: { volume: '0.25 גרם × 20', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '90 × 90 מ"מ'},
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
    sku: 'BZL-CB-PO-001',
    subcategoryId: 'combo-preroll-oil',
    name: 'מארז',
    description: 'קופסת מגולגלות + קופסת שמן + מארז חיצוני',
    specs: { volume: 'שמן 5 מ"ל + 5 גרם מגולגלות', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '123.5 × 93 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('combo-preroll-oil-box-closed', 8),
      open: generateGallery('combo-preroll-oil-box-open', 8)
    },
    images: { primary: './images/products/combo-preroll-oil-open.png' }
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
    gallery: {
      closed: generateGallery('combo-flower-minis-horizontal-closed', 6),
      open: generateGallery('combo-flower-minis-horizontal-open', 5)
    },
    images: { primary: './images/products/combo-dual-flower-horizontal-closed.png' }
  },

  // קופסא אנכית → אריזה אנכית
  {
    id: 'combo-flower-minis-vertical',
    sku: 'BZL-CB-002',
    subcategoryId: 'combo-flower-minis',
    name: 'קופסא אנכית',
    description: 'קופסא לשני מיכלי תפרחת אחד על השני',
    specs: { volume: '5 גרם × 2', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '97 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('combo-flower-minis-vertical-closed', 5),
      open: generateGallery('combo-flower-minis-vertical-open', 6)
    },
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
    sku: 'BZL-CB-001',
    subcategoryId: 'combo-sativa-indica',
    name: 'קופסא אופקית',
    description: 'קופסא לשני מיכלי תפרחת אחד ליד השני',
    specs: { volume: '5 גרם × 2', material: 'קרטון', closure: 'פתיחה צידית' , dimensions: '174 × 40 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('combo-sativa-indica-horizontal-closed', 6),
      open: generateGallery('combo-sativa-indica-horizontal-open', 5)
    },
    images: { primary: './images/products/combo-sativa-indica-horizontal-closed.png' }
  },

  // קופסא אנכית → אריזה אנכית
  {
    id: 'combo-sativa-indica-vertical',
    sku: 'BZL-CB-002',
    subcategoryId: 'combo-sativa-indica',
    name: 'קופסא אנכית',
    description: 'קופסא לשני מיכלי תפרחת אחד על השני',
    specs: { volume: '5 גרם × 2', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '97 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('combo-sativa-indica-vertical-closed', 5),
      open: generateGallery('combo-sativa-indica-vertical-open', 6)
    },
    images: { primary: './images/products/combo-sativa-indica-vertical-closed.png' }
  },

  // =============================================================
  // משולב: תפרחת + שמן
  // =============================================================
  // הערה: אותה קופסא = אותו מק"ט ואותן תמונות (שימוש חוזר בנכסים קיימים)

  {
    id: 'combo-flower-oil-flower-open',
    sku: 'BZL-CB-PO-002',
    subcategoryId: 'combo-flower-oil',
    name: 'אריזת תפרחת פתוחה',
    description: 'קופסא למיכל תפרחת 5 גרם',
    specs: { volume: '5 גרם', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '90 × 90 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: false,
    isInternal: true,
    gallery: null,
    images: { primary: './images/products/combo-preroll-oil-preroll-open.png' }
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
    sku: 'BZL-CB-PO-001',
    subcategoryId: 'combo-flower-oil',
    name: 'מארז',
    description: 'קופסת תפרחת + קופסת שמן + מארז חיצוני',
    specs: { volume: 'שמן 5 מ"ל + 5 גרם תפרחת', material: 'קרטון', closure: 'פתיחה עליונה' , dimensions: '123.5 × 93 מ"מ'},
    tags: ['IMC-GMP'],
    hasToggle: true,
    isInternal: false,
    gallery: {
      closed: generateGallery('combo-preroll-oil-box-closed', 8),
      open: generateGallery('combo-preroll-oil-box-open', 8)
    },
    images: { primary: './images/products/combo-preroll-oil-open.png' }
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
