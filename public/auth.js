/* CineVerse Auth — OAuth (Google / VK) */

var currentUser = null;
var providers = { google: false, vk: false };

function fetchUser() {
  return fetch("/api/me")
    .then(function (r) { return r.json(); })
    .then(function (user) {
      currentUser = user;
      updateNavAuth();
      return user;
    })
    .catch(function () {
      currentUser = null;
      updateNavAuth();
    });
}

function fetchProviders() {
  return fetch("/api/providers")
    .then(function (r) { return r.json(); })
    .then(function (p) { providers = p; })
    .catch(function () {});
}

function getUser() {
  return currentUser;
}

function logout() {
  window.location.href = "/auth/logout";
}

function updateNavAuth() {
  var authContainer = document.getElementById("nav-auth");
  if (!authContainer) return;

  if (currentUser) {
    var avatarHtml = currentUser.avatar
      ? '<img src="' + currentUser.avatar + '" style="width:28px;height:28px;border-radius:50%;object-fit:cover">'
      : "";
    authContainer.innerHTML =
      '<span style="color:var(--muted);font-size:0.85rem;display:flex;align-items:center;gap:8px">' +
      avatarHtml +
      'Привет, <span style="color:var(--gold)">' + currentUser.name + "</span></span>" +
      '<button class="btn btn-outline" onclick="logout()">Выйти</button>';
  } else {
    authContainer.innerHTML =
      '<button class="btn btn-gold" onclick="openModal(\'login\')">Войти</button>';
  }
}

function openModal() {
  var overlay = document.getElementById("auth-modal");
  if (!overlay) return;
  overlay.classList.add("active");
  showOAuthForm();
}

function closeModal() {
  var overlay = document.getElementById("auth-modal");
  if (overlay) overlay.classList.remove("active");
}

function showOAuthForm() {
  var title = document.getElementById("modal-title");
  var sub = document.getElementById("modal-sub");
  var body = document.getElementById("modal-body");
  var footer = document.getElementById("modal-footer");

  title.textContent = "Вход";
  sub.textContent = "Выберите способ входа";

  var html = "";

  if (providers.google) {
    html +=
      '<a href="/auth/google" class="btn btn-oauth btn-google" style="width:100%;justify-content:center;margin-bottom:12px;padding:12px 22px;border-radius:10px;font-size:0.9rem;text-decoration:none;display:flex;align-items:center;gap:10px;background:#fff;color:#333;border:1px solid var(--border);font-weight:600;transition:all 0.25s">' +
      '<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.01 24.01 0 000 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>' +
      "Войти через Google</a>";
  }

  if (providers.vk) {
    html +=
      '<a href="/auth/vk" class="btn btn-oauth btn-vk" style="width:100%;justify-content:center;margin-bottom:12px;padding:12px 22px;border-radius:10px;font-size:0.9rem;text-decoration:none;display:flex;align-items:center;gap:10px;background:#0077FF;color:#fff;border:none;font-weight:600;transition:all 0.25s">' +
      '<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#fff" d="M25.54 34.58c-13.17 0-20.7-9.02-21-24h6.6c.2 10.98 5.05 15.64 8.88 16.6V10.58h6.22v9.48c3.78-.41 7.75-4.74 9.09-9.48h6.22c-1.03 5.83-5.35 10.16-8.42 11.94 3.07 1.42 7.94 5.27 9.81 12.06h-6.85c-1.46-4.56-5.11-8.09-9.85-8.57v8.57h-.7z"/></svg>' +
      "Войти через VK</a>";
  }

  if (!providers.google && !providers.vk) {
    html =
      '<div style="text-align:center;padding:20px;color:var(--muted)">' +
      '<p style="font-size:0.9rem;margin-bottom:12px">OAuth-провайдеры не настроены.</p>' +
      '<p style="font-size:0.8rem">Настройте переменные окружения<br>GOOGLE_CLIENT_ID / VK_APP_ID на сервере.</p>' +
      "</div>";
  }

  body.innerHTML = html;
  footer.innerHTML = '<span style="font-size:0.8rem;color:var(--muted)">Безопасный вход через OAuth 2.0</span>';
}

document.addEventListener("DOMContentLoaded", function () {
  fetchProviders().then(function () {
    fetchUser();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  var overlay = document.getElementById("auth-modal");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
  }
});
