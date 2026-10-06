/* ---------------------------------------------------------------
   Renders the gallery from window.ARTWORKS, wires up the category
   filters and the lightbox. No build step, no dependencies.

   Loaded on every page. The home page has the artwork gallery; the
   project pages have photo grids (ul.photos) that open the same
   lightbox. Each half does nothing when its markup isn't present.
   --------------------------------------------------------------- */

(function () {
  "use strict";

  // Runs everywhere.
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- discourage saving images ---------- */

  // No right-click menu and no dragging the file out, on the gallery, the
  // photo grids and the lightbox. The CSS adds the rest: no long-press
  // "Save Image" on phones. This only removes the one-click routes - a
  // screenshot or the browser's developer tools still get the picture.
  var GUARDED = ".grid, .photos, .lightbox";

  function guarded(target) {
    return target && target.closest && target.closest(GUARDED);
  }
  document.addEventListener("contextmenu", function (e) {
    if (guarded(e.target)) e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) {
    if (guarded(e.target)) e.preventDefault();
  });

  /* ---------- lightbox ---------- */

  // One viewer for both the artworks and the project photos. It shows a
  // list of items - { src, srcset, alt, title, meta } - and steps through
  // them. index.html carries its markup; other pages get it built on first use.

  var lb, lbImg, lbCaption, lbClose;
  var items = [];
  var index = 0;
  var lastFocused = null;

  function setUpLightbox(noun) {
    if (lb) return;   // already wired
    lb = document.getElementById("lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lightbox";
      lb.id = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.setAttribute("aria-label", noun.charAt(0).toUpperCase() + noun.slice(1) + " viewer");
      lb.hidden = true;
      lb.innerHTML =
        '<button class="lb-btn lb-close" id="lb-close" aria-label="Close">&times;</button>' +
        '<button class="lb-btn lb-prev" id="lb-prev" aria-label="Previous ' + noun + '">&#8249;</button>' +
        '<button class="lb-btn lb-next" id="lb-next" aria-label="Next ' + noun + '">&#8250;</button>' +
        '<figure class="lb-figure"><img id="lb-img" src="" alt=""><figcaption id="lb-caption"></figcaption></figure>';
      document.body.appendChild(lb);
    }

    lbImg     = document.getElementById("lb-img");
    lbCaption = document.getElementById("lb-caption");
    lbClose   = document.getElementById("lb-close");

    lbClose.addEventListener("click", closeLightbox);
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
  }

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;   // wrap both ways
    var item = items[index];

    lbImg.src = item.src;
    if (item.srcset) {
      lbImg.srcset = item.srcset;
      lbImg.sizes = "(max-width: 700px) 96vw, 80vw";
    } else {
      lbImg.removeAttribute("srcset");
    }
    lbImg.alt = item.alt;

    lbCaption.textContent = "";
    if (item.title) {
      var strong = document.createElement("strong");
      strong.textContent = item.title;
      lbCaption.appendChild(strong);
    }
    if (item.meta) lbCaption.appendChild(document.createTextNode(item.meta));
  }

  function openLightbox(list, i) {
    items = list;
    lastFocused = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.classList.add("lb-open");
    lbClose.focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    lbImg.removeAttribute("srcset");
    lbImg.src = "";
    document.body.classList.remove("lb-open");
    if (lastFocused) lastFocused.focus();
  }

  /* ---------- photo grids (project pages) ---------- */

  var photoGrids = document.querySelectorAll(".photos");
  if (photoGrids.length) {
    setUpLightbox("photo");

    Array.prototype.forEach.call(photoGrids, function (gridEl) {
      var imgs = gridEl.querySelectorAll("img");
      var list = Array.prototype.map.call(imgs, function (img) {
        var credit = img.getAttribute("data-credit");
        return {
          src:    img.getAttribute("src"),
          srcset: img.getAttribute("srcset"),
          alt:    img.alt,
          meta:   credit ? "Photo: " + credit : ""
        };
      });

      // Wrap each photo in a button so it opens by click or keyboard. The
      // button's name comes from the image's alt text.
      Array.prototype.forEach.call(imgs, function (img, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "photo-open";
        btn.addEventListener("click", function () { openLightbox(list, i); });
        img.parentNode.insertBefore(btn, img);
        btn.appendChild(img);
      });
    });
  }

  /* ---------- artwork gallery (home page) ---------- */

  var works   = Array.isArray(window.ARTWORKS) ? window.ARTWORKS.slice() : [];
  var grid    = document.getElementById("grid");
  var filters = document.getElementById("filters");
  var empty   = document.getElementById("empty");

  if (!grid || !filters || !empty) return;   // not the gallery page

  setUpLightbox("artwork");

  var visible = works;   // current filtered list

  /* ---------- helpers ---------- */

  function categoryOf(work) {
    return work.category || "Other";
  }

  // "Oil on canvas · 60 × 80 cm"
  // Years are kept in artworks.js but hidden for now. To show them again,
  // put work.year back at the start of this list.
  function metaOf(work) {
    return [work.medium, work.size].filter(Boolean).join(" · ");
  }

  function altOf(work) {
    return work.alt || work.title || "Artwork";
  }

  // Each artwork ships in two sizes: "name.jpg" and "name-800.jpg". Hand the
  // browser both so phones don't download the full-size file.
  function smallOf(src) {
    return src.replace(/\.jpg$/i, "-800.jpg");
  }

  function itemOf(work) {
    return {
      src:    work.src,
      srcset: smallOf(work.src) + " 800w, " + work.src + " 1600w",
      alt:    altOf(work),
      title:  work.title || "Untitled",
      meta:   metaOf(work)
    };
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
      card.addEventListener("click", function () { openLightbox(list.map(itemOf), i); });

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

  /* ---------- go ---------- */

  renderFilters();
  renderGrid(visible);

  // Arriving at index.html#contact from another page, the browser jumps to the
  // anchor before this script has built the gallery - which then pushes the
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
