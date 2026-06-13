# Assets folder

Drop image files here, then point the matching key in `../config.js` to the file path. Until a key has a non-empty value, the feature stays off and the default styling applies.

## Hero background (Utopia of the Seas)

Behind the hero title with a dark green overlay so text stays readable.

- **Filename:** `hero-utopia.jpg` (or `.png`)
- **Recommended:** 1920 × 1080 or larger, JPEG, under 400 KB
- **Activate:** in `config.js`, set
  ```js
  images: { hero: "assets/hero-utopia.jpg", ... }
  ```

## Amenity card backgrounds (3 photos)

Each photo sits behind one of the three amenity cards (Dining, Pools & Decks, Entertainment) with a translucent strip behind the text.

| Card | Filename | Config key |
|---|---|---|
| Dining | `amenity-dining.jpg` | `images.amenityDining` |
| Pools & Decks | `amenity-pools.jpg` | `images.amenityPools` |
| Entertainment | `amenity-entertainment.jpg` | `images.amenityEntertainment` |

- **Recommended:** 800 × 600 or wider, JPEG, under 200 KB each
- **Activate:** in `config.js`, set each key to its path:
  ```js
  images: {
    amenityDining:        "assets/amenity-dining.jpg",
    amenityPools:         "assets/amenity-pools.jpg",
    amenityEntertainment: "assets/amenity-entertainment.jpg"
  }
  ```

## Sourcing

Per Doug's June 13 call: stock photos from Royal Caribbean's website are fine — they don't have to be Utopia of the Seas specifically.

## After adding images

Commit and push. Vercel redeploys on the next push to `main`.
