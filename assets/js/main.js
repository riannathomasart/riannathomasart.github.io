/* ---------------------------------------------------------------
   Renders the gallery from window.ARTWORKS, wires up the category
   filters and the lightbox. No build step, no dependencies.

   Loaded on every page, but only the home page has a gallery — the
   gallery half bails out early when its markup isn't present.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  // Runs everywhere.
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var works   = Array.isArray(window.ARTWORKS) ? window.ARTWORKS.slice() : [];
  var grid    = document.getElementById("grid");
  var filters = document.getElementById("filters");
  var empty   = document.getElementById("empty");

  if (!grid || !filters || !empty) return;   // not the gallery page

  var lb        = document.getElementById("lightbox");
  var lbImg     = document.getElementById("lb-img");
  var lbCaption = document.getElementById("lb-caption");

  var visible = works;   // current filtered list
  var index   = 0;       // position within `visible` while the lightbox is open
  var lastFocused = null;

  /* ---------- helpers ---------- */

  function categoryOf(work) {
    return work.category || "Other";
  }

  // "2025 · Oil on canvas · 60 × 80 cm"
  function metaOf(work) {
    return [work.year, work.medium, work.size].filter(Boolean).join(" · ");
  }

  function altOf(work) {
    return work.alt || work.title || "Artwork";
  }

  // Each artwork ships in two sizes: "name.jpg" and "name-800.jpg". Hand the
  // browser both so phones don't download the full-size file.
  function smallOf(src) {
    return src.replace(/\.jpg$/i, "-800.jpg");
  }

  /* ---------- gallery ---------- */

  function renderGrid(list) {
    grid.textContent = "";
    empty.hidden = list.length > 0;

    list.forEach(function (work, i) {
      var card = document.createElement("button");
      card.className = "card";
      card.type = "button";
      card.setAttribute("aria-label", "View " + (work.title || "artwork") + " larger");
      card.addEventListener("click", function () { openLightbox(i); });

      var frame = document.createElement("div");
      frame.className = "card-frame";

      var img = document.createElement("img");
      img.src = work.src;
      img.srcset = smallOf(work.src) + " 800w, " + work.src + " 1600w";
      img.sizes = "(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 320px";
      img.alt = altOf(work);
      img.loading = "lazy";
      img.decoding = "async";
      frame.appendChild(img);

      var title = document.createElement("p");
      title.className = "card-title";
      title.textContent = work.title || "Untitled";

      card.appendChild(frame);
      card.appendChild(title);

      var meta = metaOf(work);
      if (meta) {
        var metaEl = document.createElement("p");
        metaEl.className = "card-meta";
        metaEl.textContent = meta;
        card.appendChild(metaEl);
      }

      grid.appendChild(card);
    });
  }

  /* ---------- filters ---------- */

  function renderFilters() {
    var categories = [];
    works.forEach(function (work) {
      var c = categoryOf(work);
      if (categories.indexOf(c) === -1) categories.push(c);
    });

    // A single category isn't worth a filter bar.
    if (categories.length < 2) return;

    ["All"].concat(categories).forEach(function (label) {
      var btn = document.createElement("button");
      btn.className = "filter";
      btn.type = "button";
      btn.textContent = label;
      btn.setAttribute("aria-pressed", String(label === "All"));

      btn.addEventListener("click", function () {
        Array.prototype.forEach.call(filters.children, function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        visible = label === "All"
          ? works
          : works.filter(function (w) { return categoryOf(w) === label; });
        renderGrid(visible);
      });

      filters.appendChild(btn);
    });
  }

  /* ---------- lightbox ---------- */

  function show(i) {
    if (!visible.length) return;
    index = (i + visible.length) % visible.length;   // wrap both ways
    var work = visible[index];

    lbImg.src = work.src;
    lbImg.srcset = smallOf(work.src) + " 800w, " + work.src + " 1600w";
    lbImg.sizes = "(max-width: 700px) 96vw, 80vw";
    lbImg.alt = altOf(work);

    lbCaption.textContent = "";
    var strong = document.createElement("strong");
    strong.textContent = work.title || "Untitled";
    lbCaption.appendChild(strong);
    var meta = metaOf(work);
    if (meta) lbCaption.appendChild(document.createTextNode(meta));
  }

  function openLightbox(i) {
    lastFocused = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.classList.add("lb-open");
    document.getElementById("lb-close").focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    lbImg.removeAttribute("srcset");
    lbImg.src = "";
    document.body.classList.remove("lb-open");
    if (lastFocused) lastFocused.focus();
  }

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", function () { show(index - 1); });
  document.getElementById("lb-next").addEventListener("click", function () { show(index + 1); });

  // Clicking the backdrop (but not the image or buttons) closes.
  lb.addEventListener("click", function (e) {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  /* ---------- go ---------- */

  renderFilters();
  renderGrid(visible);

  // Arriving at index.html#contact from another page, the browser jumps to the
  // anchor before this script has built the gallery — which then pushes the
  // target hundreds of pixels further down. Re-aim once the cards are in.
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      // Instant, not smooth: a smooth scroll gets cancelled as lazy images
      // settle. Run it again on load, once everything has its final size.
      var jump = function () { target.scrollIntoView({ behavior: "auto" }); };
      requestAnimationFrame(jump);
      window.addEventListener("load", jump);
    }
  }
})();
