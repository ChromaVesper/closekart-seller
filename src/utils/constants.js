export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  UNDER_REVIEW: 'Under Review',
};

export const STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    border: 'border-yellow-300',
    dot: 'bg-yellow-500',
  },
  Approved: {
    label: 'Approved',
    color: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-300',
    dot: 'bg-green-500',
  },
  Rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-300',
    dot: 'bg-red-500',
  },
  'Under Review': {
    label: 'Under Review',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
  },
};

export const SHOP_CATEGORIES = [
  'Grocery & Supermarket',
  'Fruits & Vegetables',
  'Bakery & Sweets',
  'Restaurant & Food',
  'Pharmacy & Medical',
  'Electronics & Gadgets',
  'Clothing & Fashion',
  'Footwear',
  'Books & Stationery',
  'Home & Kitchen',
  'Furniture & Decor',
  'Beauty & Personal Care',
  'Hardware & Tools',
  'Pet Supplies',
  'Sports & Fitness',
  'Toys & Baby Products',
  'Jewelry & Accessories',
  'Mobile & Repairs',
  'Automobile Accessories',
  'Other',
];

export const DELIVERY_RADII = [
  { value: '1', label: '1 km' },
  { value: '2', label: '2 km' },
  { value: '5', label: '5 km' },
  { value: '10', label: '10 km' },
  { value: '20', label: '20 km' },
];

// ─── Admin Configuration ────────────────────────────────────────────────────────
//
// Admin UIDs are stored in Firestore at:  config/adminConfig → { adminUids: [...] }
//
// To promote yourself to admin on first login, set this env variable:
//   VITE_ADMIN_UID=<your-firebase-uid>
//
// The AuthContext will auto-seed config/adminConfig on your next login.
// After that you can remove VITE_ADMIN_UID (admin status persists in Firestore).
//
// NEVER hardcode UIDs here — use Firestore for runtime-configurable access.
