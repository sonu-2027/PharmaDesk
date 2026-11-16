// Mock data. Replace each of these with a fetch() to your FastAPI endpoints later.
export const seedMedicines = [
  {
    id: 1,
    code: "8901030865278",
    name: "Paracetamol 650mg",
    brand: "Dolo",
    qty: 140,
    mfg: "2026-01-12",
    exp: "2028-01-11",
    price: 32,
  },
  {
    id: 2,
    code: "8901725131234",
    name: "Amoxicillin 500mg",
    brand: "Mox",
    qty: 12,
    mfg: "2025-11-03",
    exp: "2027-10-02",
    price: 96,
  },
  {
    id: 3,
    code: "8904109461234",
    name: "Cetirizine 10mg",
    brand: "Okacet",
    qty: 0,
    mfg: "2025-08-20",
    exp: "2027-08-19",
    price: 24,
  },
  {
    id: 4,
    code: "8906002451122",
    name: "Azithromycin 500mg",
    brand: "Azee",
    qty: 58,
    mfg: "2024-09-15",
    exp: "2026-09-14",
    price: 118,
  },
  {
    id: 5,
    code: "8901148201234",
    name: "Pantoprazole 40mg",
    brand: "Pan",
    qty: 8,
    mfg: "2025-12-01",
    exp: "2027-11-30",
    price: 155,
  },
  {
    id: 6,
    code: "8901570345678",
    name: "Metformin 500mg",
    brand: "Glycomet",
    qty: 220,
    mfg: "2026-03-09",
    exp: "2028-03-08",
    price: 41,
  },
  {
    id: 7,
    code: "8902200112345",
    name: "Cough Syrup 100ml",
    brand: "Benadryl",
    qty: 34,
    mfg: "2024-10-30",
    exp: "2026-10-29",
    price: 112,
  },
  {
    id: 8,
    code: "8901234500019",
    name: "ORS Sachet",
    brand: "Electral",
    qty: 75,
    mfg: "2026-02-14",
    exp: "2027-02-13",
    price: 21,
  },
];

export const seedOrders = [
  {
    id: "ORD-1042",
    supplier: "MedLine Distributors",
    items: 14,
    total: 18450,
    date: "2026-11-12",
    status: "Pending",
  },
  {
    id: "ORD-1041",
    supplier: "Sri Ganesh Pharma",
    items: 9,
    total: 9200,
    date: "2026-11-08",
    status: "Shipped",
  },
  {
    id: "ORD-1039",
    supplier: "MedLine Distributors",
    items: 21,
    total: 27100,
    date: "2026-11-01",
    status: "Delivered",
  },
];

export const weekSales = [
  { d: "Mon", v: 8200 },
  { d: "Tue", v: 6400 },
  { d: "Wed", v: 9100 },
  { d: "Thu", v: 7300 },
  { d: "Fri", v: 11200 },
  { d: "Sat", v: 13800 },
  { d: "Sun", v: 5600 },
];

export const LOW_STOCK_LIMIT = 20;
export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export function statusOf(m) {
  if (new Date(m.exp) < new Date()) return "expired";
  if (m.qty === 0) return "out";
  if (m.qty <= LOW_STOCK_LIMIT) return "low";
  return "ok";
}
