# SYSTEM_CONTEXT.md — Windsor Forest Takeover Cruise Site

> Handoff doc for the next operator (human or LLM). Read this end-to-end before changing anything. The decisions below are load-bearing — undoing one will likely break the design intent.

---

## 1. What this is

A static marketing site for **Douglas Walker's** alumni cruise: the **Windsor Forest Takeover Cruise**, sailing aboard **Royal Caribbean's Utopia of the Seas**, **June 18-21, 2027** — a **3-night** itinerary to Perfect Day at CocoCay and the Bahamas, departing from **Port Canaveral, FL**. Royal Caribbean group reservation no. **5452193**.

Repo: **[github.com/a-adomako/Windsor-forest-cruise-2](https://github.com/a-adomako/Windsor-forest-cruise-2)** (Vercel-ready static build, branch `main`).

It is **not** a booking site. It exists for two reasons and two only:

1. **Inform** visitors who clicked through from Doug's Facebook video so they feel confident.
2. **Route** them to Royal Caribbean's Group Vacation Specialists, who handle all bookings, deposits, payment plans, and the group code.

If a future change does not serve (1) or (2), it doesn't belong on this site.

---

## 2. The client (Douglas Walker)

- Group leader / cruise organizer. Wants **zero involvement in money, bookings, or customer questions**.
- Traffic source: a Facebook video that drove ~8,000 views and ~120 teaser signups. Visitors are overwhelmingly on phones.
- Doug supplies real content **late and in fragments**: group code lands the day he books with RC; tier prices come from Doug once he pulls them from RC's site.

---

## 3. The two hard constraints driving the build

1. **No booking actions on-site.** No checkout, cart, payment, or "buy pass" link. Every CTA on the page routes to the Royal Caribbean group line. The only permitted exception is a paid event-pass link, gated behind `cruiseConfig.eventsEnabled` — never enable without explicit owner sign-off.
2. **Content arrives late and changes.** Hence the config-driven architecture (see §6). The site is built to be swappable in one file, not rebuilt.

Soft constraint: **mobile-first.** Traffic is overwhelmingly Facebook-on-phone. The CSS reflows tables to stacked label/value rows under 900px, hides desktop nav links into a second row, and shows a sticky bottom CTA bar.

---

## 4. File structure

Local repo path (Box-synced, lowercase since the June 13 Box reorg):

```
/Users/adomako/Library/CloudStorage/Box-Box/Pantheon_Workspace/
└── business-context/clients/douglas-walker/cruise-info-website/
    ├── index.html         # Page structure: nav, three tab panels, footer
    ├── styles.css         # Forest-green dark theme, all components, animations, responsive
    ├── script.js          # Tabs, countdown, config injection, list/table rendering, FAQ smooth-collapse, scroll reveal, click tracking, image wiring
    ├── config.js          # Single source of truth for all variable content
    ├── assets/            # Image files (hero + 3 amenity backgrounds) + credits.txt + asset README
    ├── README.md          # Short deploy/update note
    ├── SYSTEM_CONTEXT.md  # This file
    └── .gitignore
```

> **Box quirk:** Box client sync may also expose this path with capital-B "Business Context" and a `(aarontabi@gmail.com)` suffix. The **lowercase path above** is the canonical git repo. Always work there.

No build step. No bundler. No dependencies. Vercel auto-detects as static; output dir is the repo root.

---

## 5. Page architecture — three tabs

Top nav has a pill-shaped tab switcher: **Home** | **Cruise Details** | **Itinerary**. Switching is JS-based (CSS class toggle), hash-synced via `#tab=<name>`. Tabs were chosen over a single long scroll because the PRD designates the dense info as its own component, and because it keeps the Home view emotional/lean while the Details view is the "everything you need to know" reference.

### 5.1 Home tab (`#tab-home`)

Vibe-and-emotion layer. Order:

1. **Hero** — title, sail date line, video placeholder (replace via `cruiseConfig.promoVideoEmbedUrl`), countdown (Days/Hrs/Mins/Secs), primary "Book Now" CTA, "All bookings handled directly through Royal Caribbean" footnote.
2. **Trust block** — "Organized by [groupName]" + one-line intro in the leader's voice. Strangers from Facebook need this before they trust the RC route.
3. **Experience cards** (3-up, SVG icons) — The Community, The Destination, The Ship.
4. **Ship/amenities** (3-up, SVG icons) — Dining, Pools & Decks, Entertainment. Includes a "See Full Cruise Details →" button that switches tabs.
5. **Closing** — italic invitation line.

### 5.2 Cruise Details tab (`#tab-details`)

Reference document. Sections must stay in this exact order (PRD-mandated):

1. **Overview** — `[groupName]` is sailing aboard Utopia of the Seas on `[sailDateStart]`, optional group intro line, plus the "this page is for information…" disclaimer.
2. **Cruise Snapshot** — key/value table: Ship, Sail dates, Departs from, Destinations, Group, Group booking code, **Deposit**, **Final payment due**.
3. **What's Included** — checkmark list from `cruiseConfig.included`.
4. **What's Not Included** — × list from `cruiseConfig.notIncluded`.
5. **Pricing** — "From $X" table built from `cruiseConfig.staterooms`, plus a callout that surfaces `pricingAsOfDate`, **taxes & fees**, and **gratuities**, plus the single-occupancy (200%) and triple/quad lines.
6. **How to Book** — phone, email, group code in a block, then the big primary CTA. This is the conversion event.
7. **Cancellation Policy** — note + window/penalty table from `cruiseConfig.cancellation` (sourced from RC group agreement).
8. **FAQs** — accordion rendered from `cruiseConfig.faq`. Conditional events FAQ appears only when `cruiseConfig.eventsEnabled === true`.

### 5.3 Itinerary tab (`#tab-itinerary`)

Currently a **"Coming Soon"** placeholder with the broad strokes: depart Port Canaveral June 18, 3 nights at sea to CocoCay/Bahamas, return June 21. When Doug delivers the JPEG flyer (à la the FAMU/Rattler 2026 cruise), it drops into the `.coming-soon` section as the only content.

---

## 6. Config-driven content model (`config.js`)

The single most important architectural decision. Every value that could change between today and go-live lives in `window.cruiseConfig`. The HTML is dumb; the script injects values at load.

### Injection mechanisms

- **Scalar fields** in HTML use `data-cfg="path.to.key"`. `script.js` reads the path (dot-notation), sets `textContent`, and adds the `.placeholder` class if the value matches `/\[[^\]]+\]/`.
- **Arrays** (included, notIncluded, staterooms, cancellation, faq) render via dedicated functions in `script.js` into elements with specific IDs (`cd-included`, `cd-pricing-rows`, etc.).
- **Phone/email** are wired into `tel:` and `mailto:` hrefs only when they look real (have digits / contain `@`). Placeholders don't get linked.

### Placeholder convention

Anything wrapped in `[SQUARE_BRACKETS]` in `config.js` renders as a visible **amber-highlighted pill** on the page (`.placeholder` / `.inline-placeholder`). The amber is intentional — it pops against the forest-green palette so missing content is impossible to miss before go-live. **Do not remove the brackets convention** or recolor the amber pill into the green scheme.

### What lives in config (current keys)

- Identity: `groupName`, `schoolName`, `groupIntroCopy`
- Cruise basics: `ship`, `cruiseLine`, `sailDateStart`, `sailDateStartISO` (drives countdown), `sailDateEnd`, `departurePort`, `destinations`
- Booking contact: `agent.phone`, `agent.email`, `groupCode` (no `agent.name` — the group line is not a named agent)
- Deposit/payment: `depositPerStateroom`, `depositDueDate`, `finalPaymentDueDate`
- Pricing: `staterooms` array of `{tier, priceFrom}`, `pricingAsOfDate`, `taxesAndFees`, `gratuities`
- Lists: `included`, `notIncluded`
- Policy: `cancellation` array of `{window, penalty}`
- FAQ: `faq` array of `{q, a}`
- Toggles: `eventsEnabled`, `eventsCopy`, `promoVideoEmbedUrl`
- Images: `images.{hero, amenityDining, amenityPools, amenityEntertainment}` — paths into `assets/`. Empty string = feature off, default styling applies. Populated string = JS applies the image as a background with overlay treatment.
- Photo credits: `photoCredits` array of strings, rendered as a small italic footer line. Hidden when empty.

### What does NOT live in config

Marketing copy on the Home tab (hero subtitle, experience card descriptions, closing quote, "Coming Soon" copy on Itinerary) is hard-coded in `index.html` because it's structural framing, not variable content. If Doug requests copy changes there, edit the HTML.

---

## 7. Design system

### Palette (forest green — Windsor Forest school colors, per Doug's spec on 2026-06-13)

The user picked the dark forest green for the background and pale cream-green for text. **Placeholders intentionally remain amber/gold** to pop against the green field. Do not flip to light mode or revert to the prior olive/gold theme without explicit re-approval.

```
--bg            #0C401E   deep forest — page background
--bg-soft       #0F4D24   card surfaces, section alternation
--bg-deep       #082815   hero alt, video placeholder, footer
--border        #1f5b32   subtle dividers
--text          #ECF2BD   pale cream-green — primary copy
--text-soft     #DAE3A4   slightly muted body
--text-muted    #89A65D   sage — secondary copy
--text-dim      #6b8442   tertiary / disabled
--gold          #ECF2BD   accent (eyebrows, dividers, prices, CTAs use this as the "highlight")
--gold-bright   #f5f9d4   button gradient start
--gold-deep     #c5d09a   button gradient end
--btn-text      #0C401E   dark forest — text color on pale-cream buttons
```

The five Windsor Forest hex values supplied by Doug were `#077336 #0C401E #0B8C2B #89A65D #ECF2BD`. The first and last became bg/text; the others are derivable via the sage muted-text and the brighter green hover treatments.

### Type

- Headings/title: **Cormorant Garamond** (serif, 500-700)
- Body/UI: **Inter** (sans, 300-700)

### Components

Cards (`.card`), amenity tiles (`.amenity`), CD-tab sections (`.cd-section`), Coming Soon panel (`.coming-soon`), tables (`.kv-table`, `.price-table`, `.cancel-table`), agent block (`.agent-block`), callouts (`.callout`, `.callout.subtle`), FAQ accordion (`.faq-item` + native `<details>`), sticky CTA (`.sticky-cta`), tab pills (`.tab-link`).

### Iconography

- **No emojis anywhere on the page** (removed 2026-06-13). All icons are inline SVG with `stroke="currentColor"` so they inherit the accent.
- Experience cards: lucide-style 3-card icons (people, globe, ship)
- Amenity cards: inline SVG fork/knife (Dining), waves (Pools), music note (Entertainment)

### Photography (hero + amenity backgrounds)

- Images live in `assets/` and are activated through `config.js`'s `images` block.
- **Hero** (`hero-utopia.jpg`) — applied via `--hero-bg-url` CSS variable + `.hero-has-bg` class. Dark green gradient overlay (70-92% opacity) keeps the title legible.
- **Amenity cards** (`amenity-dining.avif`, `amenity-pools.jpg`, `amenity-entertainment.jpg`) — each card's `[data-amenity="..."]` attribute maps to a config key. When set, the image becomes the full-bleed card background with the icon absolutely positioned top-left and a translucent dark-green strip flush at the **bottom edge** containing the title + description. (The text strip uses `margin: auto 0 0` to anchor to the bottom — `margin: 0` would clobber the base `margin-top: auto` and stick it to the top.)
- **Credits** — `photoCredits` array in config renders as an italic line at the very bottom of the footer. `assets/credits.txt` is the running attribution log; new photos that need credit get a line there *and* an entry in the config array.

### Animations (subtle by design — user request: "nothing over the top")

- **Hero entrance** — eyebrow → title → subtitle → video → countdown → CTA stagger-rise on page load (0.7s ease-out each)
- **Scroll-reveal** — cards, amenities, price tiles, section titles fade up 18px as they enter the viewport via `IntersectionObserver`. Stagger inside `.grid-3` containers.
- **FAQ collapse** — native `<details>` is intercepted in `script.js` to animate `max-height` and `opacity` over 320ms; the +/− icon rotates.
- **Countdown digit flash** — when a digit changes, it briefly brightens to `--gold-bright` for ~380ms.
- **Tab switch** — content fades up 0.35s.
- **`prefers-reduced-motion`** — full override that disables all of the above.

### Responsive breakpoints

One breakpoint: **900px**. Below it: grids collapse to single column, nav tab pills move to a second row, the full Windsor Forest logo shrinks, sticky CTA appears, tables reflow to stacked label/value cards using `td[data-label]`.

---

## 8. Booking & policy data (from RC group agreement, doc 5452193)

These values are baked into `config.js` and reflect Royal Caribbean's confirmed terms for this group:

- **Group reservation no.** 5452193
- **Sail date** June 18, 2027 (3-night, return June 21)
- **Ship** Utopia of the Seas
- **Itinerary** 3 Night Perfect Day at CocoCay & Bahamas
- **Departure** Port Canaveral, FL
- **Deposit** $200 per stateroom, due **July 10, 2026**
- **Final payment** due **April 4, 2027**
- **Taxes & fees** $107.98 per person
- **Gratuities** $55.50 per person ($63 for suites). Auto-added to SeaPass onboard if not pre-paid.
- **Single occupancy** 200% of per-person rate (pre-tax and fees)
- **Cancellation schedule** 90+ days: no charge / 89-75: 25% / 74-61: 50% / 60-31: 75% / 30 or less: 100%
- **Booking phone** 1-800-465-3595 (Group Vacation Specialists)
  - Hours: Mon-Fri 9 AM-8 PM ET, Sat 9 AM-6 PM ET
- **Group inbox** cogroupsupport@rccl.com (no dedicated agent name — calls route through the group line)
- **Quoted reference price** $1,279 / double-occupancy Ocean View Balcony (per RC quote). Other tiers pending from Doug.

If the RC group agreement is reissued, replace these values in `config.js`.

---

## 9. Decisions log

Use this section to understand what was tried, what was kept, and *why* — so you don't reverse a deliberate call.

1. **Cloned visual structure from a reference site Doug favored** (Norfolk Takeover Cruise) but rewrote all copy to be original/placeholder for this client. Don't reintroduce the reference site's marketing copy.
2. **Dark forest green theme** — Windsor Forest school colors per Doug. The early dark-olive build was the first iteration; light mode was tried once and rejected. Stay on forest green.
3. **Three tabs (Home / Cruise Details / Itinerary)** — Home stays emotional and lean; Cruise Details is the reference; Itinerary is a Coming Soon placeholder that will receive a JPEG flyer.
4. **Config-driven everything** — content arrives late; the HTML must not block updates. Adding new variable content? Put it in `config.js` and wire `data-cfg` in HTML, never hard-code.
5. **One CTA wording: "Book Now"** — replaces the earlier "Talk to Our Cruise Agent" everywhere (nav, hero, booking block, sticky bar, FAQ foot, footer, itinerary footer). Per Doug, "Book Now" converts better even though the action is to call RC. Do not introduce competing CTAs.
6. **No on-page booking, sponsorship, or fixed prices** — site routes to RC for everything money-related.
7. **"From $X" pricing only, never fixed prices** — Royal Caribbean controls rates and they move. The pricing callout warns rates may rise.
8. **No dedicated agent name** — the RC group line is shared; there isn't one named specialist. Don't reintroduce an `agent.name` row in the booking block.
9. **Promo video kept as a placeholder slot** — Doug confirmed on call he wanted to keep it. If `cruiseConfig.promoVideoEmbedUrl` is blank, the "Promo video coming soon" placeholder shows.
10. **No emojis** — replaced amenity emoji icons with inline SVG. Cleaner / more professional per Doug's spec on the June 13 call.
11. **Placeholders stay amber, not green** — they're meant to look like missing content against the green palette. Recoloring them into the green scheme would defeat the safety net.
12. **Click tracking wired but no analytics provider** — every CTA has `data-cta="…"` and `class="cta-track"`. The handler in `script.js` currently logs to console. Replace with `gtag(…)` or `plausible(…)` when chosen.
13. **Sticky mobile CTA hides when the booking section is in view** — IntersectionObserver on `#booking` toggles opacity. Prevents the bar covering the CTA it's pointing to.
14. **Events decision gate** — `cruiseConfig.eventsEnabled` defaults to `false`. Flipping to `true` adds an events FAQ and (per PRD) would introduce the only allowed external ticketing link. Get explicit sign-off before enabling.
15. **Countdown target** — `cruiseConfig.sailDateStartISO` is `2027-06-18T00:00:00` (per RC quote).
16. **No CTA pulse, no autoplay video, no marquee** — earlier iterations had these and were cut as too noisy for an info page.
17. **Promo video uses `youtube-nocookie.com`** — switched from `youtube.com/embed` because the original threw YouTube Error 153 ("embedding disabled by uploader"). Nocookie sometimes routes around it. If a future video also errors out, the owner needs to enable embedding in YouTube Studio — there's no client-side fix.
18. **Images are config-activated, never hard-coded** — paths live in `cruiseConfig.images`. An empty string keeps the feature off so the page works with or without the photos. Adding a new image-driven slot requires (a) a key in `images`, (b) a JS branch that applies it, and (c) CSS for the "with image" variant. Same pattern as the existing hero/amenity wiring.
19. **Amenity background images use a bottom-flush strip** — when `data-has-bg="true"`, the card removes its padding, the icon is absolute top-left, the body uses `margin: auto 0 0` to push to the bottom (do NOT use `margin: 0` — it kills the base `margin-top: auto`), and a 0.85-opacity dark-green strip with a 3px backdrop blur sits at the bottom edge. Min-height 240px so the photo has room to read.

---

## 10. Open inputs (what's still outstanding)

Everything in this list currently renders as an amber placeholder pill on the page. None blocks ship, but they all block "feels real."

| Field | Config key | Status / Source |
|---|---|---|
| Group intro line (Doug's voice) | `groupIntroCopy` | **Doug owes** — copy for Overview / Trust block |
| Interior tier "from" price | `staterooms[0].priceFrom` | **Doug owes** — pulling from RC website |
| Premium Balcony "from" price | `staterooms[2].priceFrom` | **Doug owes** — pulling from RC website |
| Group booking code | `groupCode` | **Day of release** — RC issues when Doug formally books |
| Promo video embed permission | `promoVideoEmbedUrl` | **Doug owes** — current video (`y0_nhqUXLYU`) returns YouTube Error 153. Owner must enable embedding in YouTube Studio, or Doug picks a different video |
| Itinerary JPEG flyer | n/a | **Separate task** — drops into Itinerary tab when finalized |
| Stylized "Windsor Forest Takeover Cruise" logo art | n/a | **Punted** (PRD item 5) — type-only treatment used for now |
| Knight / castle artwork | n/a | **Tabled by Doug** — relying on green palette to carry brand |
| Analytics provider hookup | `script.js` `cta-track` handler | Choose GA or Plausible, swap the console.log body |

**Recently completed:**
- Hero background image (`assets/hero-utopia.jpg`) — wired and live
- Amenity card backgrounds (Dining, Pools & Decks, Entertainment) — wired and live, with bottom-flush text strip
- Photo credits for Chris Gray Faust (Coastal Kitchen) — rendered in footer

---

## 11. Deployment

- **Repo:** [github.com/a-adomako/Windsor-forest-cruise-2](https://github.com/a-adomako/Windsor-forest-cruise-2), `main` branch
- **Host:** Vercel (static, no build step). Connect the repo at vercel.com/new → Framework: Other → no build command → output dir: `./`
- **Local preview:** `python3 -m http.server 8000` from the repo root, then open `localhost:8000`
- **Updates:** edit `config.js` → commit → push to `main` → Vercel redeploys automatically

---

## 12. How to update content at go-live

Walk through this in order on launch day:

1. Open `config.js`
2. Replace every `[BRACKETED_PLACEHOLDER]` with the real value (scan with: `grep -n "\[" config.js`)
3. Confirm `sailDateStartISO` is correct (drives the countdown)
4. Fill the two pending tier prices in `staterooms`
5. Fill `groupCode` with the code RC issues
6. Verify `promoVideoEmbedUrl` plays without Error 153. If Doug switched videos, swap the URL here.
7. Decide `eventsEnabled` (default `false`)
8. Drop any new images into `assets/`, add matching paths in `images`, and append any required credits to `photoCredits` + `assets/credits.txt`
9. When the Itinerary JPEG arrives, drop it into the `.coming-soon` section of `#tab-itinerary` in `index.html`
10. Open `index.html` in a browser — scan for any remaining amber placeholder pills
11. `git commit -m "Go-live content"` and `git push`
12. Vercel deploys; verify on the live URL

---

## 13. Things future-you should NOT do without re-approval

- Flip to light mode (rejected once)
- Revert the green palette to olive/gold (the prior theme — rejected in favor of school colors)
- Add a second CTA wording or destination (dilutes "Book Now")
- Add a checkout, cart, payment, or pricing-with-tax breakdown (Doug doesn't handle money)
- Hard-code agent name, group code, or prices into HTML (defeats the swap mechanism)
- Reintroduce an `agent.name` field — RC group line is not a named specialist
- Recolor placeholder pills into the green palette (they're amber for a reason)
- Bring back emojis or use auto-playing video / marquee scrolling text
- Switch the typography pair without checking — Cormorant + Inter is the intentional pairing

---

## 14. Quick orientation for the next LLM

If you've just been handed this repo:

1. Skim §1-§3 for what this serves
2. Read §6 (config model) before touching content
3. Read §7 (palette) and §8 (RC policy data) before touching CSS or copy
4. Read §9 (decisions) before "improving" anything
5. Open the site locally and click all three tabs to feel the structure
6. When in doubt, ask: "Does this change help visitors get informed or routed to RC?" If no, don't ship it.
