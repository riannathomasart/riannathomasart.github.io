# riannathomasart.github.io

Portfolio site for Rianna Thomas. Plain HTML/CSS/JS — no build step, no
dependencies. GitHub Pages serves it straight from the repo root.

## Layout

```
index.html            home — hero, gallery, contact
about.html            about page
cv.html               cv page
projects.html         projects index (the "Projects" nav item)
artxv.html            ARTXV detail page, linked from projects.html
explainer-hacks.html  Explainer Hacks detail page, linked from projects.html
actually-autistic.html Actually Autistic exhibition page, linked from projects.html
assets/css/styles.css all styling (design tokens live at the top)
assets/js/artworks.js the gallery contents  <- edit this to add work
assets/js/main.js     rendering, filters, lightbox
images/               artwork files, each at two sizes: name.jpg (1600px) and
                      name-800.jpg, served via srcset. Plus paper.jpg and
                      paper-1000.jpg for the background.
.nojekyll             tells GitHub Pages to serve the files as-is
```

## Adding a piece of work

1. Drop the image in `images/`.
2. Add an entry to the list in `assets/js/artworks.js`:

```js
{
  src: "images/harbour-at-dusk.jpg",
  title: "Harbour at Dusk",
  year: 2025,
  medium: "Oil on canvas",
  size: "60 × 80 cm",
  category: "Paintings",
  alt: "A harbour under a low orange sky, boats in silhouette."
}
```

Only `src` and `title` are required. `category` drives the filter buttons —
the bar hides itself if everything shares one category. Order in the file is
the order on the page.

Photos are loaded at full size, so resize them before committing — roughly
1600px on the long edge is plenty, and keeps the page quick.

## Adding a piece — the two sizes

Every artwork needs both `name.jpg` (1600px long edge) and `name-800.jpg`;
`main.js` builds the `srcset` from that naming convention, so a missing -800
file means phones download the full-size image. From the images folder:

```bash
sips -Z 800 -s format jpeg -s formatOptions 62 name.jpg --out name-800.jpg
```

## Cache busting

The stylesheet is linked as `styles.css?v=2`. Bump that number in every HTML
file whenever you change the CSS, otherwise returning visitors (and GitHub
Pages' own cache) can keep serving the old file. Locally, Cmd+Shift+R forces
a reload.

## Previewing locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Notes

- `.nojekyll` disables Jekyll processing, so the leftover `_config.yml`
  (minimal theme) is inert and can be deleted.
- Colours, fonts and spacing are CSS custom properties at the top of
  `styles.css`. The site is light-only. The background is `images/paper.jpg`,
  a scanned sheet of watercolour paper (from Pexels), referenced by the
  `--paper` token and painted as one fixed, viewport-covering layer via
  `body::before` — so it never tiles and never shows a repeat seam. `--bg` is
  the flat colour behind it.
- All type is `#000`, including secondary text, so hierarchy rests on size
  and weight rather than colour.
- Page titles and the wordmark use Amarante (art nouveau display) via
  `--font-title`; body text stays in Inter so it remains readable. Change the
  one token in `styles.css` to re-style every title at once.
- The header and footer are duplicated across the seven pages — there's no
  templating. Edit a nav link in one place, edit it in all seven.
- Thumbnails use `object-fit: contain` inside a padded white mount, so
  landscape and portrait pieces both show whole rather than being cropped to
  a common shape.
- Placeholder content still to replace: the "What we did" section on
  `artxv.html`, and the portrait photo and city on `about.html`.
- The stylesheet and the two JS files carry `?v=` version parameters. Bump
  them whenever you change those files, or returning visitors keep the old
  ones.
  In `artworks.js`, the titles and media are inferred — check them, and add
  sizes.
