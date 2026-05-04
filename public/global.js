(function() {
  var theme = localStorage.getItem("cineverse_theme") || "dark";
  if (theme === "light") document.documentElement.setAttribute("data-theme", "light");

  document.addEventListener("DOMContentLoaded", function() {
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.textContent = theme === "light" ? "\u2600\uFE0F" : "\uD83C\uDF19";
      btn.addEventListener("click", function() {
        theme = theme === "dark" ? "light" : "dark";
        if (theme === "light") {
          document.documentElement.setAttribute("data-theme", "light");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
        btn.textContent = theme === "light" ? "\u2600\uFE0F" : "\uD83C\uDF19";
        localStorage.setItem("cineverse_theme", theme);
      });
    }

    var scrollBtn = document.getElementById("scroll-top");
    if (scrollBtn) {
      window.addEventListener("scroll", function() {
        if (window.scrollY > 400) {
          scrollBtn.classList.add("show");
        } else {
          scrollBtn.classList.remove("show");
        }
      });
      scrollBtn.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    var reveals = document.querySelectorAll(".scroll-reveal");
    if (reveals.length) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      reveals.forEach(function(el) { observer.observe(el); });
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(function() {});
    }
  });
})();
