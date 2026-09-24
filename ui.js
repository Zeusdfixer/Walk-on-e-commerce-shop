/**
 * WALKON — shared UI chrome (header + footer) and small helpers.
 * Every storefront page calls WalkonUI.renderHeader()/renderFooter()
 * on load so nav, cart count, and footer links stay in sync
 * everywhere from one place.
 */

const WalkonUI = {
  renderHeader(activePage) {
    const settings = WalkonStore.getSettings();
    const count = WalkonStore.cartCount();
    const el = document.getElementById("site-header");
    if (!el) return;

    const nav = [
      { href: "index.html", label: "Home", key: "home" },
      { href: "shop.html", label: "Shop", key: "shop" },
      { href: "about.html", label: "About", key: "about" },
      { href: "delivery.html", label: "Delivery & Returns", key: "delivery" },
      { href: "contact.html", label: "Contact", key: "contact" },
    ];

    el.innerHTML = `
      <div class="inner">
        <a href="index.html" class="brand">${settings.siteName}<span>.</span></a>
        <nav class="nav-links" id="nav-links">
          ${nav
            .map(
              (n) =>
                `<a href="${n.href}" class="${n.key === activePage ? "active" : ""}">${n.label}</a>`
            )
            .join("")}
        </nav>
        <div class="header-actions">
          <a href="cart.html" class="cart-btn" aria-label="View cart">
            Cart ${count > 0 ? `<span class="cart-count">${count}</span>` : ""}
          </a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">☰</button>
        </div>
      </div>
    `;

    const toggle = document.getElementById("menu-toggle");
    const links = document.getElementById("nav-links");
    if (toggle) {
      toggle.addEventListener("click", () => links.classList.toggle("open"));
    }
  },

  renderFooter() {
    const settings = WalkonStore.getSettings();
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <div class="brand" style="color:var(--bone); margin-bottom:12px;">${settings.siteName}<span style="color:var(--brass)">.</span></div>
            <p>${settings.tagline}</p>
          </div>
          <div>
            <h4>Shop</h4>
            <div class="footer-links">
              <a href="shop.html?category=men">Men</a>
              <a href="shop.html?category=women">Women</a>
              <a href="shop.html">All products</a>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <div class="footer-links">
              <a href="about.html">About Us</a>
              <a href="delivery.html">Delivery & Returns</a>
              <a href="contact.html">Contact</a>
            </div>
          </div>
          <div>
            <h4>Get in touch</h4>
            <div class="footer-links">
              <a href="tel:${settings.phone.replace(/\s/g, "")}">${settings.phone}</a>
              <a href="mailto:${settings.email}">${settings.email}</a>
              <a href="https://wa.me/${settings.whatsapp}" target="_blank" rel="noopener">WhatsApp Us</a>
              <span>${settings.address}</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.</span>
          <a href="admin/login.html" style="color:#857e6b;">Admin</a>
        </div>
      </div>
    `;
  },

  toast(message) {
    let el = document.getElementById("walkon-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "walkon-toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  },

  qs(param) {
    return new URLSearchParams(window.location.search).get(param);
  },

  productCard(p) {
    const settings = WalkonStore.getSettings();
    const img = (p.images && p.images[0]) || "https://via.placeholder.com/500x500?text=WALKON";
    const outOfStock = p.stock <= 0;
    return `
      <a href="product.html?id=${p.id}" class="product-card">
        <div class="thumb">
          ${p.compareAtPrice ? `<span class="badge sale">Sale</span>` : ""}
          ${outOfStock ? `<span class="badge out">Sold Out</span>` : ""}
          <img src="${img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="info">
          <div class="type">${p.type}</div>
          <h3>${p.name}</h3>
          <div class="price-row">
            <span class="price">${settings.currency}${p.price.toLocaleString("en-NG")}</span>
            ${p.compareAtPrice ? `<span class="price-strike">${settings.currency}${p.compareAtPrice.toLocaleString("en-NG")}</span>` : ""}
          </div>
        </div>
      </a>
    `;
  },
};
