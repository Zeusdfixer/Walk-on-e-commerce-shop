/**
 * WALKON — Data Store
 * ---------------------------------------------------------
 * This file is the entire "database" layer for the site.
 * It persists everything to localStorage under one namespace
 * so the storefront and the admin panel always read/write the
 * same source of truth in the browser.
 *
 * WHY localStorage: this project ships as static files with
 * zero build step and zero server, so it can be opened straight
 * from a code editor / any static host with no setup. When you're
 * ready to go live for real, swap the functions in this file for
 * fetch() calls to a real backend (Node/Express, PHP, Firebase,
 * Supabase — whatever you choose) — every page in the site calls
 * only the functions below, never localStorage directly, so the
 * swap is contained to this one file.
 * ---------------------------------------------------------
 */

const WALKON_DB_KEY = "walkon_db_v1";

const DEFAULT_SETTINGS = {
  siteName: "WALKON",
  tagline: "Walk in Style, Walk in Confidence",
  phone: "0706 787 7417",
  whatsapp: "2347067877417",
  email: "hello@walkon.ng",
  address: "Lagos, Nigeria — Nationwide delivery",
  currency: "₦",
  heroHeadline: "Comfort Meets Class",
  heroSubline: "Premium. Stylish. Durable. Designed for comfort, made for you.",
  heroImage: "images/product-loafers-slides-set.jpg",
  deliveryNote: "Nationwide delivery — fast & reliable.",
  paystackPublicKey: "",
  flutterwavePublicKey: "",
  aboutText:
    "WALKON is a premium footwear brand built on one idea: shoes should feel as good as they look. Every pair is made from carefully chosen materials, finished by hand, and tested for comfort before it ever reaches you. From half-covered mules to everyday slides, WALKON is footwear for people who notice detail.",
};

const SEED_PRODUCTS = [
  {
    id: "wk-001",
    sku: "WK-MHC-BLK-42",
    name: "Men's Half Covered Shoe — Woven Tassel",
    category: "men",
    type: "Half Covered Shoe",
    price: 35000,
    compareAtPrice: null,
    colors: ["Black"],
    sizes: [40, 41, 42, 43, 44, 45],
    stock: 24,
    description:
      "A hand-finished half-covered mule in woven leather with a tasseled buckle trim and croc-embossed vamp. Cushioned footbed, stacked leather-look heel. Slip on, walk out.",
    images: ["images/product-mens-half-covered-shoe.jpg"],
    featured: true,
    status: "active",
    createdAt: "2026-08-20T09:00:00.000Z",
  },
  {
    id: "wk-002",
    sku: "WK-LSL-TAN-38",
    name: "Ladies' Slippers — Cut-Out Strap",
    category: "women",
    type: "Slippers",
    price: 15000,
    compareAtPrice: null,
    colors: ["Tan/Cream"],
    sizes: [36, 37, 38, 39, 40],
    stock: 30,
    description:
      "Two-tone tan and cream slip-on slippers with a geometric cut-out strap. Lightweight sole built for all-day wear, indoors or out.",
    images: ["images/product-ladies-slippers.jpg"],
    featured: true,
    status: "active",
    createdAt: "2026-08-20T09:05:00.000Z",
  },
  {
    id: "wk-003",
    sku: "WK-MSL-BLK-42",
    name: "Men's Leather Slide",
    category: "men",
    type: "Slides",
    price: 22000,
    compareAtPrice: 26000,
    colors: ["Black"],
    sizes: [40, 41, 42, 43, 44, 45],
    stock: 18,
    description:
      "A clean cross-strap leather slide finished in matte black. Contoured footbed for arch support, non-slip tread — an everyday staple.",
    images: ["images/product-loafers-slides-set.jpg"],
    featured: true,
    status: "active",
    createdAt: "2026-08-21T09:00:00.000Z",
  },
  {
    id: "wk-004",
    sku: "WK-MLF-GRY-43",
    name: "Men's Suede Penny Loafer",
    category: "men",
    type: "Loafers",
    price: 32000,
    compareAtPrice: null,
    colors: ["Grey"],
    sizes: [40, 41, 42, 43, 44, 45],
    stock: 15,
    description:
      "Soft grey suede penny loafer with a low block heel and reinforced toe. Structured enough for the office, relaxed enough for everywhere else.",
    images: ["images/product-loafers-slides-set.jpg"],
    featured: false,
    status: "active",
    createdAt: "2026-08-22T09:00:00.000Z",
  },
];

function nowISO() {
  return new Date().toISOString();
}

function readDB() {
  const raw = localStorage.getItem(WALKON_DB_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("WALKON DB parse error, resetting.", e);
    return null;
  }
}

function writeDB(db) {
  localStorage.setItem(WALKON_DB_KEY, JSON.stringify(db));
}

function ensureDB() {
  let db = readDB();
  if (!db) {
    db = {
      products: SEED_PRODUCTS,
      orders: [],
      settings: DEFAULT_SETTINGS,
      admin: { username: "admin", password: "walkon2026" },
      messages: [],
    };
    writeDB(db);
  }
  // migrate: fill any missing top-level keys for users upgrading from older seed
  let changed = false;
  if (!db.settings) { db.settings = DEFAULT_SETTINGS; changed = true; }
  if (!db.admin) { db.admin = { username: "admin", password: "walkon2026" }; changed = true; }
  if (!db.messages) { db.messages = []; changed = true; }
  if (!db.orders) { db.orders = []; changed = true; }
  if (!db.products) { db.products = SEED_PRODUCTS; changed = true; }
  if (changed) writeDB(db);
  return db;
}

const WalkonStore = {
  // ---------- PRODUCTS ----------
  getProducts({ category, search, status } = {}) {
    const db = ensureDB();
    let list = [...db.products];
    if (status) list = list.filter((p) => p.status === status);
    if (category && category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getProduct(id) {
    const db = ensureDB();
    return db.products.find((p) => p.id === id) || null;
  },

  getFeatured() {
    const db = ensureDB();
    return db.products.filter((p) => p.featured && p.status === "active");
  },

  saveProduct(product) {
    const db = ensureDB();
    if (product.id) {
      const idx = db.products.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        db.products[idx] = { ...db.products[idx], ...product };
      } else {
        db.products.push(product);
      }
    } else {
      product.id = "wk-" + Math.random().toString(36).slice(2, 9);
      product.createdAt = nowISO();
      if (!product.status) product.status = "active";
      db.products.push(product);
    }
    writeDB(db);
    return product;
  },

  deleteProduct(id) {
    const db = ensureDB();
    db.products = db.products.filter((p) => p.id !== id);
    writeDB(db);
  },

  skuExists(sku, excludeId) {
    const db = ensureDB();
    return db.products.some(
      (p) => p.sku.toLowerCase() === sku.toLowerCase() && p.id !== excludeId
    );
  },

  // ---------- SETTINGS ----------
  getSettings() {
    return ensureDB().settings;
  },

  saveSettings(settings) {
    const db = ensureDB();
    db.settings = { ...db.settings, ...settings };
    writeDB(db);
    return db.settings;
  },

  // ---------- ORDERS ----------
  getOrders() {
    const db = ensureDB();
    return [...db.orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  getOrder(id) {
    const db = ensureDB();
    return db.orders.find((o) => o.id === id) || null;
  },

  createOrder(order) {
    const db = ensureDB();
    order.id = "ORD-" + Date.now().toString(36).toUpperCase();
    order.createdAt = nowISO();
    order.status = "pending";
    db.orders.push(order);
    // decrement stock
    order.items.forEach((item) => {
      const p = db.products.find((pr) => pr.id === item.productId);
      if (p) p.stock = Math.max(0, p.stock - item.qty);
    });
    writeDB(db);
    return order;
  },

  updateOrderStatus(id, status) {
    const db = ensureDB();
    const order = db.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      writeDB(db);
    }
    return order;
  },

  // ---------- CONTACT MESSAGES ----------
  getMessages() {
    const db = ensureDB();
    return [...db.messages].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  addMessage(msg) {
    const db = ensureDB();
    msg.id = "MSG-" + Date.now().toString(36).toUpperCase();
    msg.createdAt = nowISO();
    msg.read = false;
    db.messages.push(msg);
    writeDB(db);
    return msg;
  },

  markMessageRead(id) {
    const db = ensureDB();
    const m = db.messages.find((m) => m.id === id);
    if (m) {
      m.read = true;
      writeDB(db);
    }
  },

  // ---------- ADMIN AUTH ----------
  checkLogin(username, password) {
    const db = ensureDB();
    return (
      db.admin.username === username && db.admin.password === password
    );
  },

  changeAdminPassword(currentPassword, newPassword) {
    const db = ensureDB();
    if (db.admin.password !== currentPassword) return false;
    db.admin.password = newPassword;
    writeDB(db);
    return true;
  },

  isLoggedIn() {
    return sessionStorage.getItem("walkon_admin_session") === "true";
  },

  login(username, password) {
    if (this.checkLogin(username, password)) {
      sessionStorage.setItem("walkon_admin_session", "true");
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem("walkon_admin_session");
  },

  // ---------- CART (per-browser, localStorage) ----------
  getCart() {
    const raw = localStorage.getItem("walkon_cart");
    return raw ? JSON.parse(raw) : [];
  },

  saveCart(cart) {
    localStorage.setItem("walkon_cart", JSON.stringify(cart));
  },

  addToCart(productId, size, color, qty) {
    const cart = this.getCart();
    const key = `${productId}__${size}__${color}`;
    const existing = cart.find((c) => c.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ key, productId, size, color, qty });
    }
    this.saveCart(cart);
    return cart;
  },

  updateCartQty(key, qty) {
    const cart = this.getCart();
    const item = cart.find((c) => c.key === key);
    if (item) {
      item.qty = qty;
      if (item.qty <= 0) {
        return this.removeFromCart(key);
      }
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(key) {
    let cart = this.getCart();
    cart = cart.filter((c) => c.key !== key);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    this.saveCart([]);
  },

  cartCount() {
    return this.getCart().reduce((sum, c) => sum + c.qty, 0);
  },

  // ---------- UTIL ----------
  formatMoney(amount) {
    const currency = this.getSettings().currency || "₦";
    return currency + Number(amount).toLocaleString("en-NG");
  },

  // ---------- DANGER ZONE ----------
  resetAllData() {
    localStorage.removeItem(WALKON_DB_KEY);
    localStorage.removeItem("walkon_cart");
    sessionStorage.removeItem("walkon_admin_session");
    ensureDB();
  },

  exportData() {
    return JSON.stringify(ensureDB(), null, 2);
  },

  importData(json) {
    const parsed = JSON.parse(json);
    writeDB(parsed);
  },
};

// initialize on load
ensureDB();
