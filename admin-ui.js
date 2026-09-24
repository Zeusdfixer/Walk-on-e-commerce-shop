/**
 * Admin shell: sidebar nav + auth guard.
 * Every admin/*.html page (except login.html) calls
 * AdminUI.guard() first, then AdminUI.renderSidebar("key").
 */
const AdminUI = {
  guard() {
    if (!WalkonStore.isLoggedIn()) {
      window.location.href = "login.html";
    }
  },

  renderSidebar(activeKey) {
    const el = document.getElementById("admin-sidebar");
    if (!el) return;
    const items = [
      { key: "dashboard", href: "index.html", label: "Dashboard" },
      { key: "products", href: "products.html", label: "Products" },
      { key: "orders", href: "orders.html", label: "Orders" },
      { key: "messages", href: "messages.html", label: "Messages" },
      { key: "settings", href: "settings.html", label: "Site Settings" },
    ];
    el.innerHTML = `
      <a href="index.html" class="brand">WALKON<span>.</span></a>
      <span class="subtitle">Admin Panel</span>
      <nav class="admin-nav">
        ${items.map(i => `<a href="${i.href}" class="${i.key === activeKey ? "active" : ""}">${i.label}</a>`).join("")}
      </nav>
      <a href="../index.html" class="admin-nav" style="margin-top:20px; display:block;"><span style="opacity:0.7; font-size:13px;">View Live Site</span></a>
      <button class="logout-btn" id="logout-btn">Log Out</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", () => {
      WalkonStore.logout();
      window.location.href = "login.html";
    });
  },
};
