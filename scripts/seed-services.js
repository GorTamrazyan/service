/**
 * seed-services.js
 * Adds vinyl fence services and a consultation to Firestore.
 * Skips duplicates (checks by title).
 *
 * Run: node --env-file=.env scripts/seed-services.js
 */

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyDQh8gM-8gX4dbQ9MiBjN8WYO0dCJ6Gm1I',
  authDomain: 'mywebsiteauth-c45cd.firebaseapp.com',
  projectId: 'mywebsiteauth-c45cd',
  storageBucket: 'mywebsiteauth-c45cd.firebasestorage.app',
  messagingSenderId: '566415645776',
  appId: '1:566415645776:web:975d884b280b83bb32c555',
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ─────────────────────────────────────────────
// SERVICES  (6 услуг)
// icon — название из react-icons/fa (FaHammer, FaWrench, FaTools,
//   FaMoneyBillWave, FaShieldAlt, FaUsers, FaCalendarAlt, FaHeadset, FaVideo)
// ─────────────────────────────────────────────
const SERVICES = [
  {
    icon: 'FaHammer',
    title: 'Professional Fence Installation',
    description:
      'Full-service installation of any vinyl fence from our catalog. Our certified crew handles everything — site prep, post setting, panel assembly, and clean-up — so your fence is ready to enjoy the same week.',
    price: 'From $8 / linear ft',
    features: [
      'Free property walk-through before install',
      'Concrete-set galvanised steel posts',
      'All hardware and fasteners included',
      'Level and plumb guarantee on every panel',
      'Same-day job-site clean-up',
      '1-year labor warranty',
    ],
  },
  {
    icon: 'FaWrench',
    title: 'Fence Repair & Restoration',
    description:
      "Wind damage, impact cracks, or faded panels? Our repair team diagnoses the issue on-site and replaces only what's needed — matching your existing fence color and style perfectly.",
    price: 'From $120 / visit',
    features: [
      'Same-week scheduling available',
      'Exact color-match panel replacement',
      'Post re-setting with concrete reinforcement',
      'Gate hinge and latch adjustment or replacement',
      'UV-yellowing restoration treatment',
      'Photo report before and after',
    ],
  },
  {
    icon: 'FaTools',
    title: 'Gate Installation & Hardware Upgrade',
    description:
      'Standalone gate installation or full hardware upgrade for an existing fence. We install self-closing hinges, key-lockable latches, and heavy-duty frames suitable for vehicle-rated driveway gates.',
    price: 'From $350 / gate',
    features: [
      'Single and double swing gate installation',
      'Self-closing, self-latching mechanisms',
      'Key-lockable latch sets included',
      'Aluminium-reinforced gate frames',
      'Pool-code-compliant installation available',
      'Plumb and level adjustment warranty',
    ],
  },
  {
    icon: 'FaShieldAlt',
    title: 'Annual Maintenance Package',
    description:
      'Keep your fence looking showroom-new for years. Our annual plan includes two scheduled visits — spring and fall — covering deep cleaning, hardware inspection, UV sealing, and minor repairs at no extra charge.',
    price: '$199 / year',
    features: [
      'Spring + Fall scheduled service visits',
      'Pressure washing and UV treatment',
      'Full hardware inspection and lubrication',
      'Minor crack and scuff repair included',
      'Priority scheduling for emergency repairs',
      'Dedicated account manager',
    ],
  },
  {
    icon: 'FaHammer',
    title: 'Fence Removal & Disposal',
    description:
      'Replacing an old fence or clearing land? We remove any existing fence — wood, chain-link, or old vinyl — haul it away, and leave the site level and ready for your new installation.',
    price: 'From $3 / linear ft',
    features: [
      'All fence types accepted',
      'Post extraction with concrete base',
      'Complete debris hauling and disposal',
      'Eco-friendly recycling where possible',
      'Same-day removal available',
      'Combined discount with new fence install',
    ],
  },
  {
    icon: 'FaUsers',
    title: 'HOA & Commercial Project Management',
    description:
      'Large subdivision, apartment complex, or commercial campus? We manage multi-phase fence projects from permitting through final inspection, with dedicated project coordinators and volume pricing.',
    price: 'Custom quote',
    features: [
      'Free site survey and CAD layout',
      'Permit application assistance',
      'Phased installation scheduling',
      'Volume pricing from 500+ linear ft',
      'Weekly progress reporting',
      'Final inspection documentation',
    ],
  },
];

// ─────────────────────────────────────────────
// CONSULTATIONS  (1 консультация)
// duration в минутах · price в долларах (число)
// ─────────────────────────────────────────────
const CONSULTATIONS = [
  {
    title: 'Free On-Site Estimate',
    duration: 45,
    description:
      'A no-obligation 45-minute visit from one of our fence specialists. We measure your property, discuss styles and colors, walk you through pricing options, and answer every question — completely free of charge.',
    price: 0,
    features: [
      'Accurate linear footage measurement',
      'Side-by-side style and color comparison',
      'Instant ballpark pricing on-site',
      'HOA compliance review if needed',
      'Written estimate delivered same day',
      'No pressure, no commitment required',
    ],
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
async function exists(collectionName, field, value) {
  const snap = await getDocs(
    query(collection(db, collectionName), where(field, '==', value))
  );
  return !snap.empty;
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('══════════════════════════════════════════════');
  console.log('  Services & Consultations — Seed Script');
  console.log('══════════════════════════════════════════════\n');

  const now = new Date();
  const ts  = Timestamp.fromDate(now);

  // ── Services ──────────────────────────────────────────────────────
  console.log(`🔧  Adding ${SERVICES.length} services…\n`);
  let addedServices = 0;

  for (const s of SERVICES) {
    if (await exists('services', 'title', s.title)) {
      console.log(`    ⚠️  Skip (already exists): ${s.title}`);
      continue;
    }
    const ref = await addDoc(collection(db, 'services'), {
      icon:        s.icon,
      title:       s.title,
      description: s.description,
      price:       s.price,
      features:    s.features,
      createdAt:   ts,
      updatedAt:   ts,
    });
    console.log(`    ✅ ${s.title}`);
    console.log(`       id: ${ref.id}  |  icon: ${s.icon}  |  price: ${s.price}`);
    addedServices++;
  }

  // ── Consultations ─────────────────────────────────────────────────
  console.log(`\n📅  Adding ${CONSULTATIONS.length} consultation…\n`);
  let addedConsultations = 0;

  for (const c of CONSULTATIONS) {
    if (await exists('consultations', 'title', c.title)) {
      console.log(`    ⚠️  Skip (already exists): ${c.title}`);
      continue;
    }
    const ref = await addDoc(collection(db, 'consultations'), {
      title:       c.title,
      duration:    c.duration,
      description: c.description,
      price:       c.price,
      features:    c.features,
      createdAt:   ts,
      updatedAt:   ts,
    });
    console.log(`    ✅ ${c.title}`);
    console.log(`       id: ${ref.id}  |  ${c.duration} min  |  $${c.price}`);
    addedConsultations++;
  }

  // ── Summary ───────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════');
  console.log(`  ✅  Services added:      ${addedServices}/${SERVICES.length}`);
  console.log(`  ✅  Consultations added: ${addedConsultations}/${CONSULTATIONS.length}`);
  console.log('══════════════════════════════════════════════');

  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Script failed:', err);
  process.exit(1);
});
