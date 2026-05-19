/**
 * seed-products.js
 * Fills Firestore with vinyl fence + gate products.
 * Images are fetched from LoremFlickr (keyword-matched real photos),
 * uploaded to Cloudinary, and stored in Firestore.
 *
 * Run: node --env-file=.env scripts/seed-products.js
 */

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  Timestamp,
} = require('firebase/firestore');
const cloudinaryLib = require('cloudinary');
const cloudinary = cloudinaryLib.v2;

// ─────────────────────────────────────────────
// FIREBASE CONFIG
// ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyDQh8gM-8gX4dbQ9MiBjN8WYO0dCJ6Gm1I',
  authDomain: 'mywebsiteauth-c45cd.firebaseapp.com',
  projectId: 'mywebsiteauth-c45cd',
  storageBucket: 'mywebsiteauth-c45cd.firebasestorage.app',
  messagingSenderId: '566415645776',
  appId: '1:566415645776:web:975d884b280b83bb32c555',
};

// ─────────────────────────────────────────────
// CLOUDINARY CONFIG
// ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddvt81ezy',
  api_key: process.env.CLOUDINARY_API_KEY || '595781138757748',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'O5SrObW5GczloZVgniE2MTvAYRE',
});

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ─────────────────────────────────────────────
// IMAGE URLS  (LoremFlickr — keyword-based real photos, no API key needed)
// Format: https://loremflickr.com/{w}/{h}/{tag1,tag2}?lock={seed}
// Each unique lock value → different photo matching the tags
// ─────────────────────────────────────────────
const lf = (tags, seed) =>
  `https://loremflickr.com/1200/800/${encodeURIComponent(tags)}?lock=${seed}`;

const IMGS = {
  // Privacy fence — tall solid white vinyl panels
  privacy: [
    lf('vinyl,fence,privacy,white', 101),
    lf('vinyl,fence,privacy,white', 102),
    lf('privacy,fence,backyard',    103),
    lf('vinyl,fence,privacy,white', 104),
    lf('privacy,fence,backyard',    105),
    lf('vinyl,fence,privacy',       106),
  ],
  // Picket fence — classic white pointed/flat tops
  picket: [
    lf('white,picket,fence',  201),
    lf('white,picket,fence',  202),
    lf('picket,fence,garden', 203),
    lf('white,picket,fence',  204),
    lf('picket,fence',        205),
  ],
  // Semi-privacy — boards with gaps / shadowbox
  semi: [
    lf('fence,shadowbox,vinyl', 301),
    lf('fence,semi,privacy',    302),
    lf('fence,lattice,garden',  303),
    lf('fence,vinyl,yard',      304),
  ],
  // Pool fence — spindle / glass-look vinyl around pools
  pool: [
    lf('pool,fence,safety,white', 401),
    lf('pool,fence,safety',       402),
    lf('pool,enclosure,fence',    403),
  ],
  // Ranch fence — open 3-4 rail, farm / horse property
  ranch: [
    lf('ranch,fence,white,farm',    501),
    lf('horse,fence,ranch,field',   502),
    lf('farm,fence,post,rail',      503),
    lf('ranch,fence,equestrian',    504),
  ],
  // Decorative fence — ornamental spindles / Victorian
  decorative: [
    lf('decorative,fence,garden,white',   601),
    lf('ornamental,fence,vinyl,white',    602),
    lf('garden,fence,decorative',         603),
    lf('ornamental,vinyl,fence',          604),
  ],
  // Gates — driveway, swing, sliding
  gate: [
    lf('driveway,gate,white,vinyl', 701),
    lf('gate,fence,swing,white',    702),
    lf('fence,gate,garden,white',   703),
    lf('gate,entry,vinyl,white',    704),
    lf('gate,fence,white',          705),
  ],
};

// ─────────────────────────────────────────────
// REFERENCE DATA
// ─────────────────────────────────────────────
const COLORS_SEED = [
  { name: 'White',  hexCode: '#FFFFFF' }, // 0
  { name: 'Tan',    hexCode: '#D2B48C' }, // 1
  { name: 'Grey',   hexCode: '#9E9E9E' }, // 2
  { name: 'Brown',  hexCode: '#795548' }, // 3
  { name: 'Almond', hexCode: '#EFDECD' }, // 4
];

// ─────────────────────────────────────────────
// PRODUCT DEFINITIONS  (18 fences + 5 gates = 23)
// ─────────────────────────────────────────────
const PRODUCTS_SEED = [
  // ── PRIVACY FENCE (5) ──────────────────────────────────────────────
  {
    name: '4ft Classic Vinyl Privacy Fence Panel',
    description:
      'A durable 4-foot vinyl privacy fence panel that neatly defines property lines. High-grade PVC resists rot, fading, and impact — and never needs painting or staining.',
    colorIndices: [0, 1, 2], basePrices: [155, 165, 170],
    typeKey: 'privacy', featured: false,
    dimensions: { height: 4, width: 8, length: 8, unit: 'ft' },
    tags: ['privacy', 'vinyl', '4ft', 'classic'],
    imageUrls: [IMGS.privacy[0], IMGS.privacy[1], IMGS.privacy[2]],
  },
  {
    name: '5ft Standard Vinyl Privacy Fence',
    description:
      'The ideal height for a private yard without completely blocking sunlight. Our 5-foot vinyl privacy fence balances seclusion and aesthetics for any suburban property.',
    colorIndices: [0, 1, 4], basePrices: [175, 185, 180],
    typeKey: 'privacy', featured: false,
    dimensions: { height: 5, width: 8, length: 8, unit: 'ft' },
    tags: ['privacy', 'vinyl', '5ft', 'standard'],
    imageUrls: [IMGS.privacy[1], IMGS.privacy[3], IMGS.privacy[4]],
  },
  {
    name: '6ft Premium Vinyl Privacy Fence',
    description:
      'Our best-selling privacy fence. A full 6 feet of solid vinyl provides complete backyard seclusion. UV-stabilised panels resist fading, cracking, and warping in all seasons.',
    colorIndices: [0, 1, 2, 4], basePrices: [210, 225, 220, 215],
    typeKey: 'privacy', featured: true,
    dimensions: { height: 6, width: 8, length: 8, unit: 'ft' },
    tags: ['privacy', 'vinyl', '6ft', 'premium', 'bestseller'],
    imageUrls: [IMGS.privacy[2], IMGS.privacy[0], IMGS.privacy[5]],
  },
  {
    name: '7ft Deluxe Vinyl Privacy Fence',
    description:
      'Ideal for noise reduction and complete privacy near busy streets or commercial areas. The 7-foot height commands serious visual presence while remaining 100% maintenance-free.',
    colorIndices: [0, 1, 3], basePrices: [250, 265, 270],
    typeKey: 'privacy', featured: false,
    dimensions: { height: 7, width: 8, length: 8, unit: 'ft' },
    tags: ['privacy', 'vinyl', '7ft', 'deluxe', 'noise-reduction'],
    imageUrls: [IMGS.privacy[3], IMGS.privacy[1], IMGS.privacy[2]],
  },
  {
    name: '8ft Grand Vinyl Privacy Fence',
    description:
      'Maximum privacy and security for commercial properties, pool enclosures, or homeowners who demand absolute seclusion. Wind-resistant posts included.',
    colorIndices: [0, 1, 2, 3, 4], basePrices: [310, 330, 320, 335, 315],
    typeKey: 'privacy', featured: false,
    dimensions: { height: 8, width: 8, length: 8, unit: 'ft' },
    tags: ['privacy', 'vinyl', '8ft', 'grand', 'commercial'],
    imageUrls: [IMGS.privacy[4], IMGS.privacy[0], IMGS.privacy[3]],
  },

  // ── PICKET FENCE (4) ───────────────────────────────────────────────
  {
    name: 'Traditional Flat-Top Picket Fence',
    description:
      'A timeless American classic that lifts curb appeal instantly. Solid vinyl construction holds its brilliant finish year after year — no painting, staining, or sealing ever needed.',
    colorIndices: [0, 4], basePrices: [150, 155],
    typeKey: 'picket', featured: true,
    dimensions: { height: 3, width: 8, length: 8, unit: 'ft' },
    tags: ['picket', 'vinyl', 'flat-top', 'traditional', 'curb-appeal'],
    imageUrls: [IMGS.picket[0], IMGS.picket[1], IMGS.picket[2]],
  },
  {
    name: 'Classic Dog-Ear Picket Fence',
    description:
      'The classic diagonal-cut dog-ear adds a warm, welcoming character to any front yard. Easy to install, zero maintenance — one of our most popular residential styles.',
    colorIndices: [0, 1, 4], basePrices: [160, 170, 165],
    typeKey: 'picket', featured: false,
    dimensions: { height: 4, width: 8, length: 8, unit: 'ft' },
    tags: ['picket', 'vinyl', 'dog-ear', 'classic'],
    imageUrls: [IMGS.picket[1], IMGS.picket[3], IMGS.picket[0]],
  },
  {
    name: 'Gothic-Top Picket Fence',
    description:
      'Elegant pointed tops create a sophisticated look that complements both traditional colonial homes and modern Craftsman-style builds. Available in three trending colors.',
    colorIndices: [0, 2, 4], basePrices: [175, 185, 178],
    typeKey: 'picket', featured: false,
    dimensions: { height: 4, width: 8, length: 8, unit: 'ft' },
    tags: ['picket', 'vinyl', 'gothic', 'decorative'],
    imageUrls: [IMGS.picket[2], IMGS.picket[0], IMGS.picket[4]],
  },
  {
    name: 'French Gothic Picket Fence',
    description:
      'Inspired by classic French country architecture, gracefully curved tops add an air of refinement to any property. A statement piece that requires zero upkeep.',
    colorIndices: [0, 1, 4], basePrices: [185, 195, 190],
    typeKey: 'picket', featured: false,
    dimensions: { height: 4, width: 8, length: 8, unit: 'ft' },
    tags: ['picket', 'vinyl', 'french-gothic', 'elegant'],
    imageUrls: [IMGS.picket[4], IMGS.picket[1], IMGS.picket[3]],
  },

  // ── SEMI-PRIVACY FENCE (3) ─────────────────────────────────────────
  {
    name: 'Shadowbox Semi-Privacy Fence',
    description:
      'Boards alternate on both sides of the rail — finished from every angle. Air and light pass through freely, reducing wind load and keeping your plants happy.',
    colorIndices: [0, 1, 2], basePrices: [195, 205, 200],
    typeKey: 'semi', featured: false,
    dimensions: { height: 6, width: 8, length: 8, unit: 'ft' },
    tags: ['semi-privacy', 'vinyl', 'shadowbox', 'airflow'],
    imageUrls: [IMGS.semi[0], IMGS.semi[1], IMGS.semi[2]],
  },
  {
    name: 'Lattice-Top Semi-Privacy Fence',
    description:
      'A decorative lattice panel crowns a solid privacy base — perfect for climbing roses or jasmine. Two looks in one fence that only improves over the seasons.',
    colorIndices: [0, 4, 2], basePrices: [215, 220, 210],
    typeKey: 'semi', featured: false,
    dimensions: { height: 6, width: 8, length: 8, unit: 'ft' },
    tags: ['semi-privacy', 'vinyl', 'lattice', 'garden'],
    imageUrls: [IMGS.semi[3], IMGS.semi[0], IMGS.semi[2]],
  },
  {
    name: 'Board-on-Board Semi-Privacy Fence',
    description:
      'Overlapping boards give privacy from all angles while channelling wind through the gaps — dramatically reducing structural stress in high-wind coastal areas.',
    colorIndices: [0, 1, 3], basePrices: [205, 215, 220],
    typeKey: 'semi', featured: false,
    dimensions: { height: 6, width: 8, length: 8, unit: 'ft' },
    tags: ['semi-privacy', 'vinyl', 'board-on-board', 'wind-resistant'],
    imageUrls: [IMGS.semi[1], IMGS.semi[3], IMGS.semi[0]],
  },

  // ── POOL FENCE (2) ─────────────────────────────────────────────────
  {
    name: 'Premium Pool Safety Vinyl Fence',
    description:
      'Pool-certified and code-compliant in all 50 states. Features a self-closing, self-latching gate system and no-climb smooth surface for maximum child safety.',
    colorIndices: [0, 2, 4], basePrices: [280, 295, 285],
    typeKey: 'pool', featured: true,
    dimensions: { height: 4, width: 8, length: 8, unit: 'ft' },
    tags: ['pool', 'safety', 'vinyl', 'code-compliant', 'child-safe'],
    imageUrls: [IMGS.pool[0], IMGS.pool[1], IMGS.pool[2]],
  },
  {
    name: 'Decorative Pool Enclosure Fence',
    description:
      'Safety meets sophistication. Elegant spindle profiles frame your pool area beautifully while meeting all local code requirements. Custom color matching available.',
    colorIndices: [0, 1, 4], basePrices: [300, 315, 308],
    typeKey: 'pool', featured: false,
    dimensions: { height: 5, width: 8, length: 8, unit: 'ft' },
    tags: ['pool', 'decorative', 'vinyl', 'spindle', 'elegant'],
    imageUrls: [IMGS.pool[1], IMGS.pool[0], IMGS.pool[2]],
  },

  // ── RANCH FENCE (2) ────────────────────────────────────────────────
  {
    name: '3-Rail Vinyl Ranch Fence',
    description:
      'Classic open-rail design for large properties, horse paddocks, and rural estates. Splinter-free, rot-free, and safe for horses and livestock.',
    colorIndices: [0, 1, 3], basePrices: [170, 180, 185],
    typeKey: 'ranch', featured: false,
    dimensions: { height: 4, width: 8, length: 8, unit: 'ft' },
    tags: ['ranch', 'vinyl', '3-rail', 'farm', 'equestrian'],
    imageUrls: [IMGS.ranch[0], IMGS.ranch[1], IMGS.ranch[2]],
  },
  {
    name: '4-Rail Vinyl Ranch Fence',
    description:
      'The extra fourth rail keeps smaller livestock contained and prevents young foals from slipping through — without sacrificing the clean, open ranch aesthetic.',
    colorIndices: [0, 1, 4], basePrices: [195, 210, 200],
    typeKey: 'ranch', featured: false,
    dimensions: { height: 5, width: 8, length: 8, unit: 'ft' },
    tags: ['ranch', 'vinyl', '4-rail', 'farm', 'livestock'],
    imageUrls: [IMGS.ranch[1], IMGS.ranch[3], IMGS.ranch[0]],
  },

  // ── DECORATIVE FENCE (2) ───────────────────────────────────────────
  {
    name: 'Victorian Ornamental Vinyl Fence',
    description:
      'Intricate spindle designs and finial posts inspired by 19th-century ironwork — without the rust, weight, or maintenance. The ultimate curb-appeal upgrade.',
    colorIndices: [0, 2, 4], basePrices: [340, 355, 345],
    typeKey: 'decorative', featured: true,
    dimensions: { height: 4, width: 6, length: 6, unit: 'ft' },
    tags: ['decorative', 'vinyl', 'victorian', 'ornamental', 'premium'],
    imageUrls: [IMGS.decorative[0], IMGS.decorative[1], IMGS.decorative[2]],
  },
  {
    name: 'Contemporary Decorative Vinyl Fence',
    description:
      "Clean horizontal lines and modern geometry for today's architectural styles. A striking streetside statement that pairs with midcentury, farmhouse, or minimalist homes.",
    colorIndices: [0, 2, 3], basePrices: [320, 335, 328],
    typeKey: 'decorative', featured: false,
    dimensions: { height: 4, width: 6, length: 6, unit: 'ft' },
    tags: ['decorative', 'vinyl', 'contemporary', 'modern', 'commercial'],
    imageUrls: [IMGS.decorative[1], IMGS.decorative[3], IMGS.decorative[0]],
  },

  // ── GATES (5) ──────────────────────────────────────────────────────
  {
    name: 'Single Swing Vinyl Gate',
    description:
      'A sturdy, maintenance-free single-panel swing gate perfectly matched to our privacy fence line. Heavy-duty stainless steel hinges and a self-latching mechanism are included.',
    colorIndices: [0, 1, 2], basePrices: [220, 235, 230],
    typeKey: 'gate', featured: false,
    dimensions: { height: 6, width: 4, length: 4, unit: 'ft' },
    tags: ['gate', 'swing', 'single', 'vinyl', 'privacy'],
    imageUrls: [IMGS.gate[0], IMGS.gate[2], IMGS.gate[4]],
  },
  {
    name: 'Double Swing Driveway Gate',
    description:
      'Two matching 5-foot panels swing open to create a 10-foot driveway clearance. Built for daily vehicle use with reinforced internal aluminium framing and weather-sealed hinges.',
    colorIndices: [0, 1, 4], basePrices: [480, 510, 495],
    typeKey: 'gate', featured: true,
    dimensions: { height: 6, width: 10, length: 10, unit: 'ft' },
    tags: ['gate', 'swing', 'double', 'driveway', 'vinyl'],
    imageUrls: [IMGS.gate[1], IMGS.gate[0], IMGS.gate[3]],
  },
  {
    name: 'Estate Double Driveway Gate',
    description:
      'A grand entrance for upscale properties. Ornamental spindles and an arched top profile make a stunning first impression while standing up to years of daily use.',
    colorIndices: [0, 2, 4], basePrices: [620, 650, 635],
    typeKey: 'gate', featured: false,
    dimensions: { height: 7, width: 12, length: 12, unit: 'ft' },
    tags: ['gate', 'estate', 'driveway', 'ornamental', 'arch'],
    imageUrls: [IMGS.gate[3], IMGS.gate[1], IMGS.gate[0]],
  },
  {
    name: 'Garden Walk-Through Gate',
    description:
      'A charming pedestrian gate sized for pathways and garden entrances. Matching picket design coordinates seamlessly with our flat-top and dog-ear picket fence panels.',
    colorIndices: [0, 4], basePrices: [165, 170],
    typeKey: 'gate', featured: false,
    dimensions: { height: 4, width: 3, length: 3, unit: 'ft' },
    tags: ['gate', 'garden', 'pedestrian', 'picket', 'walk-through'],
    imageUrls: [IMGS.gate[2], IMGS.gate[4], IMGS.gate[0]],
  },
  {
    name: 'Pool Safety Gate',
    description:
      'ASTM-certified pool safety gate with a key-lockable, self-latching latch set at adult height. Smooth interior surface provides no foothold for young climbers — required by code in most states.',
    colorIndices: [0, 2, 4], basePrices: [260, 275, 268],
    typeKey: 'gate', featured: false,
    dimensions: { height: 4, width: 4, length: 4, unit: 'ft' },
    tags: ['gate', 'pool', 'safety', 'code-compliant', 'child-safe', 'ASTM'],
    imageUrls: [IMGS.gate[4], IMGS.gate[2], IMGS.gate[1]],
  },
];

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

/** Download a URL → Buffer (follow redirects, 20 s timeout) */
async function downloadBuffer(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SeedScript/1.0)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Download `url` and upload to Cloudinary as `publicId`.
 * Returns secure_url on success, null on failure.
 */
async function uploadImage(url, publicId) {
  try {
    const buf = await downloadBuffer(url);
    const mime = buf[0] === 0xff ? 'image/jpeg' : 'image/png'; // basic sniff
    const b64 = `data:${mime};base64,${buf.toString('base64')}`;
    const result = await cloudinary.uploader.upload(b64, {
      folder: 'products/seed',
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (err) {
    return null;
  }
}

/**
 * Try each url in sequence; return first that succeeds.
 * Falls back to a generic fence image from LoremFlickr.
 */
async function uploadWithFallback(urls, publicId) {
  const fallbacks = [
    `https://loremflickr.com/1200/800/fence,vinyl,white?lock=${Math.abs(publicId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 9999}`,
    `https://loremflickr.com/1200/800/fence?lock=${publicId.length * 17}`,
  ];
  const all = [...urls, ...fallbacks];

  for (const url of all) {
    const secureUrl = await uploadImage(url, publicId);
    if (secureUrl) {
      console.log(`    ✓ ${url.slice(0, 72)}`);
      return secureUrl;
    }
    console.log(`    ✗ ${url.slice(0, 72)}`);
  }
  console.warn(`    ⚠️  All sources failed for ${publicId}`);
  return null;
}

/** Get or create a Firestore document by field value. Returns doc ID. */
async function getOrCreate(collectionName, field, value, extraData = {}) {
  const q = query(collection(db, collectionName), where(field, '==', value));
  const snap = await getDocs(q);
  if (!snap.empty) return snap.docs[0].id;
  const now = Timestamp.fromDate(new Date());
  const ref = await addDoc(collection(db, collectionName), {
    [field]: value,
    ...extraData,
    createdAt: now,
    updatedAt: now,
  });
  return ref.id;
}

/** Delete all documents from a collection */
async function clearCollection(collectionName) {
  const snap = await getDocs(collection(db, collectionName));
  let count = 0;
  for (const docSnap of snap.docs) {
    await deleteDoc(docSnap.ref);
    count++;
  }
  return count;
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('══════════════════════════════════════════════════════════');
  console.log('  Vinyl Fence + Gate Catalog — Firestore Seed Script');
  console.log('══════════════════════════════════════════════════════════\n');

  // ── 0. Clean up previous seed ────────────────────────────────────────
  console.log('🧹  Cleaning previous seed data…');
  const deletedProducts = await clearCollection('products');
  const deletedImages   = await clearCollection('images');
  console.log(`    Deleted: ${deletedProducts} products, ${deletedImages} images\n`);

  // ── 1. Colors ─────────────────────────────────────────────────────────
  console.log('🎨  Setting up colors…');
  const colorIds = [];
  for (const c of COLORS_SEED) {
    const id = await getOrCreate('colors', 'name', c.name, { hexCode: c.hexCode });
    colorIds.push(id);
    console.log(`    ${c.name.padEnd(8)} → ${id}`);
  }

  // ── 2. Material ───────────────────────────────────────────────────────
  console.log('\n🔩  Setting up material…');
  const materialId = await getOrCreate('materials', 'name', 'Vinyl', {
    description: 'High-grade PVC vinyl — weatherproof, maintenance-free, UV-stabilised.',
  });
  console.log(`    Vinyl → ${materialId}`);

  // ── 3. Category ───────────────────────────────────────────────────────
  console.log('\n📂  Setting up category…');
  const categoryId = await getOrCreate('categories', 'name', 'Vinyl Fencing', {
    description: 'Full range of vinyl fence panels, posts, gates, and accessories.',
  });
  console.log(`    Vinyl Fencing → ${categoryId}`);

  // ── 4. Types of product ───────────────────────────────────────────────
  console.log('\n🏷️   Setting up product types…');
  const typeLabels = {
    privacy:    'Privacy Fence',
    picket:     'Picket Fence',
    semi:       'Semi-Privacy Fence',
    pool:       'Pool Fence',
    ranch:      'Ranch Fence',
    decorative: 'Decorative Fence',
    gate:       'Gate',
  };
  const typeIds = {};
  for (const [key, label] of Object.entries(typeLabels)) {
    typeIds[key] = await getOrCreate('typesOfProducts', 'name', label);
    console.log(`    ${label.padEnd(22)} → ${typeIds[key]}`);
  }

  // ── 5. Seed products ──────────────────────────────────────────────────
  const total = PRODUCTS_SEED.length;
  console.log(`\n📦  Seeding ${total} products (18 fences + 5 gates)…\n`);

  let totalCloudinaryUploads = 0;

  for (let i = 0; i < total; i++) {
    const p = PRODUCTS_SEED[i];
    const num = String(i + 1).padStart(2, '0');
    console.log(`─── ${i + 1}/${total}: ${p.name}`);

    // Build colorPrices
    const colorPrices = {};
    p.colorIndices.forEach((ci, idx) => {
      colorPrices[colorIds[ci]] = p.basePrices[idx];
    });

    // Upload images to Cloudinary
    const cloudinaryUrls = [];
    for (let j = 0; j < p.imageUrls.length; j++) {
      const publicId = `product_${num}_img_${j + 1}`;
      const url = await uploadWithFallback([p.imageUrls[j]], publicId);
      if (url) {
        cloudinaryUrls.push(url);
        totalCloudinaryUploads++;
      }
    }

    // Save product to Firestore
    const now = new Date();
    const productRef = await addDoc(collection(db, 'products'), {
      name: p.name,
      description: p.description,
      colorPrices,
      categoryId,
      typeOfProductId: typeIds[p.typeKey],
      materialId,
      colorIds: p.colorIndices.map((ci) => colorIds[ci]),
      dimensions: p.dimensions || null,
      tags: p.tags || [],
      featured: p.featured || false,
      discount: null,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    // Save images to Firestore
    for (let j = 0; j < cloudinaryUrls.length; j++) {
      await addDoc(collection(db, 'images'), {
        url: cloudinaryUrls[j],
        alt: p.name,
        productId: productRef.id,
        isPrimary: j === 0,
        order: j,
        createdAt: Timestamp.fromDate(now),
      });
    }

    console.log(`    ✅ Продукт ${i + 1}/${total} загружен ✓  (id: ${productRef.id}, фото: ${cloudinaryUrls.length})\n`);
  }

  // ── 6. Summary ────────────────────────────────────────────────────────
  const featured = PRODUCTS_SEED.filter((p) => p.featured).map((p) => p.name);
  console.log('══════════════════════════════════════════════════════════');
  console.log(`  ✅  Done! ${total} products saved to Firestore.`);
  console.log(`  ☁️   ${totalCloudinaryUploads} images uploaded to Cloudinary (folder: products/seed/)`);
  console.log(`  ⭐  Featured (${featured.length}): ${featured.join(' · ')}`);
  console.log('══════════════════════════════════════════════════════════');

  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Seed script failed:', err);
  process.exit(1);
});
