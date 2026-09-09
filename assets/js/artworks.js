/* ---------------------------------------------------------------
   The gallery content lives here — this is the only file that
   needs editing to add, remove or reorder work.

   Each entry:
     src      (required) path to the image, relative to the site root
     title    (required) shown under the thumbnail and in the lightbox
     year     optional
     medium   optional — e.g. "Watercolour on paper"
     size     optional — e.g. "60 × 80 cm"
     category optional — drives the filter buttons; omit for "Other"
     alt      optional — described for screen readers; falls back to title

   NOTE: titles and media below were inferred from the images. Years are
   taken from signatures/dates visible in the work itself. Correct anything
   that's wrong, and add sizes — those can't be read off a scan.
   --------------------------------------------------------------- */

window.ARTWORKS = [
  {
    src: "images/she-keeps-me-warm.jpg",
    title: "She Keeps Me Warm",
    medium: "Watercolour and colour pencil on paper",
    category: "Paintings",
    alt: "Two figures in warm reds, oranges and yellows holding each other closely, one resting against the other's shoulder."
  },
  {
    src: "images/abstract.jpg",
    title: "Untitled (Abstract)",
    medium: "Mixed media on paper",
    category: "Paintings",
    alt: "A dense abstract composition of interlocking shapes in orange, pink, teal and olive, outlined in heavy black and overlaid with looping white marks."
  },
  {
    src: "images/vines.jpg",
    title: "Vines",
    year: 2019,
    medium: "Watercolour and gouache on paper",
    category: "Paintings",
    alt: "A face in warm oranges and pinks, half hidden behind large green heart-shaped leaves on trailing vines."
  },
  {
    src: "images/face-watercolour.jpg",
    title: "Pink",
    year: 2020,
    medium: "Watercolour on paper",
    category: "Paintings",
    alt: "A face washed in soft pink with violet brows and closed eyes, green shadows at the cheeks, the paint running in drips below the chin."
  },
  {
    src: "images/strawberries.jpg",
    title: "Strawberries",
    medium: "Mixed media",
    category: "Paintings",
    alt: "A serene face with closed eyes painted in yellow, green and red, framed above and below by a wreath of strawberry plants."
  },
  {
    src: "images/luna-moth.jpg",
    title: "Luna Moth",
    medium: "Watercolour on paper",
    category: "Paintings",
    alt: "A pale green luna moth with long tails and dusty pink leading edges, wings spread against white paper."
  },
  {
    src: "images/bee-linocut.jpg",
    title: "Bee",
    medium: "Linocut",
    category: "Prints",
    alt: "A bold black and white linocut of a bumblebee seen from above, its wings outstretched, surrounded by carved rays radiating outwards."
  },
  {
    src: "images/figure-study.jpg",
    title: "Figure Study",
    year: 2021,
    medium: "Charcoal and crayon on paper",
    category: "Drawings",
    alt: "A loose charcoal drawing of a standing figure, with red crayon scored down the throat and chest."
  }
];
