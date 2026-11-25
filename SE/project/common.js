// public/js/common.js
// Small shared helper used by every page: talks to the API and renders the navbar.

async function api(path, options = {}) {
  const res = await fetch("/api" + path, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

function el(html) {
  const div = document.createElement("div");
  div.innerHTML = html.trim();
  return div.firstChild;
}

function escapeHtml(str) {
  return (str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function badgeForStatus(status) {
  return `<span class="badge ${status.toLowerCase()}">${status}</span>`;
}
function badgeForType(type) {
  return `<span class="badge ${type}">${type === "lost" ? "Lost" : "Found"}</span>`;
}

let CURRENT_USER = null;

async function renderNavbar() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  try {
    const { user } = await api("/auth/me");
    CURRENT_USER = user;
    const links = [
      `<a href="/index.html">Browse Items</a>`,
    ];
    if (user) {
      links.push(`<a href="/report.html">Report Item</a>`);
      links.push(`<a href="/my-items.html">My Items</a>`);
      if (user.role === "admin") links.push(`<a href="/admin.html">Admin Panel</a>`);
      links.push(`<span class="pill">${escapeHtml(user.name)}</span>`);
      links.push(`<button class="linklike" id="logoutBtn">Logout</button>`);
    } else {
      links.push(`<a href="/login.html">Login</a>`);
      links.push(`<a href="/register.html">Register</a>`);
    }
    nav.innerHTML = `
      <a class="brand" href="/index.html">🎒 Campus Lost &amp; Found</a>
      <nav>${links.join("")}</nav>
    `;
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await api("/auth/logout", { method: "POST" });
        window.location.href = "/index.html";
      });
    }
  } catch (e) {
    console.error(e);
  }
}

function requireLoginOrRedirect() {
  if (!CURRENT_USER) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", renderNavbar);
