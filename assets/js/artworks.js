/* ---------------------------------------------------------------
   The gallery content lives here - this is the only file that
   needs editing to add, remove or reorder work.

   Each entry:
     src      (required) path to the image, relative to the site root
     title    (required) shown under the thumbnail and in the lightbox
     year     optional
     medium   optional - e.g. "Watercolour on paper"
     size     optional - e.g. "60 × 80 cm"
     category optional - drives the filter buttons; omit for "Other"
     alt      optional - described for screen readers; falls back to title

   NOTE: titles and media below were inferred from the images. Years are
   taken from signatures/dates visible in the work itself. Correct anything
   that's wrong, and add sizes - those can't be read off a scan.
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
    src: "images/vines.jpg",
    title: "Vines",
    year: 2019,
    medium: "Watercolour and gouache on paper",
    category: "Paintings",
    alt: "A face in warm oranges and pinks, half hidden behind large green heart-shaped leaves on trailing vines."
  },
  {
    src: "images/many-faces.jpg",
    title: "Faces",
    year: 2019,
    medium: "Watercolour and ink on paper",
    category: "Paintings",
    alt: "Twelve small bald faces floating on a pale yellow ground, each washed in different warm colours - pinks, oranges, greens - with soft, open expressions."
  },
  {
    src: "images/hands-over-face.jpg",
    title: "Hands",
    year: 2019,
    medium: "Watercolour and gouache on paper",
    category: "Paintings",
    alt: "A pink and blue face against a near-black ground, two long hands covering the cheeks, with red paint running down between the fingers like tears."
  },
  {
    src: "images/line-drawing.jpg",
    title: "Continuous Line",
    medium: "Ink on paper",
    category: "Drawings",
    alt: "A face and trailing leaves drawn in a single unbroken ink line on white paper."
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
    src: "images/luna-moth.jpg",
    title: "Luna Moth",
    medium: "Watercolour on paper",
    category: "Paintings",
    alt: "A pale green luna moth with long tails and dusty pink leading edges, wings spread against white paper."
  },
  {
    src: "images/strawberries.jpg",
    title: "Strawberries",
    medium: "Mixed media",
    category: "Paintings",
    alt: "A serene face with closed eyes painted in yellow, green and red, framed above and below by a wreath of strawberry plants."
  },
  {
    src: "images/bee-linocut.jpg",
    title: "Bee",
    medium: "Linocut",
    category: "Prints",
    alt: "A bold black and white linocut of a bumblebee seen from above, its wings outstretched, surrounded by carved rays radiating outwards."
  },

  // The "Untitled" works were added from the "gallery images" folder. Their
  // titles are placeholders until Rianna names them; media are left out
  // rather than guessed.
  {
    src: "images/eyes-and-flowers.jpg",
    title: "Untitled",
    category: "Paintings",
    alt: "Two blue eyes on white paper with bright flowers - orange, red, yellow, a blue pansy, a pink tulip and purple lavender - growing up from the lids, and green vines trailing down from the lashes like tears."
  },
  {
    src: "images/drips.jpg",
    title: "Untitled",
    category: "Paintings",
    alt: "An abstract wash of pink, violet and ochre, the colours bleeding into each other and running down the paper in long drips."
  },
  {
    src: "images/gold-tears.jpg",
    title: "Untitled",
    year: 2019,
    category: "Drawings",
    alt: "A round bald face sketched in green, yellow and blue pencil with gold tears running from both eyes, the words 'You know we aren't safe here? We never were' curving around the head."
  },
  {
    src: "images/figure-study.jpg",
    title: "Figure Study",
    year: 2021,
    medium: "Charcoal and crayon on paper",
    category: "Drawings",
    alt: "A loose charcoal drawing of a standing figure, with red crayon scored down the throat and chest."
  },
  {
    src: "images/orange-bands.jpg",
    title: "Untitled",
    category: "Paintings",
    alt: "A face with green eyes and smudged blue and violet shadows, framed above and below by curved orange bands, thin red lines running down across it."
  },
  {
    src: "images/axolotl.jpg",
    title: "Untitled",
    category: "Paintings",
    alt: "An axolotl seen from above, its yellow-orange body speckled with black and its feathery gills red, on a green ground dappled with the shadows of leaves."
  }
];
