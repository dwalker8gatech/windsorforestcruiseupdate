# SYSTEM_CONTEXT.md — Windsor Forest Takeover Cruise Site

> Handoff doc for the next operator (human or LLM). Read this end-to-end before changing anything. The decisions below are load-bearing — undoing one will likely break the design intent.

---

## 1. What this is

A static marketing site for **Douglas Walker's** alumni cruise: the **Windsor Forest Takeover Cruise**, sailing aboard **Royal Caribbean's Utopia of the Seas**, **June 19, 2027** (4 nights to Bermuda, departure port TBD with Royal Caribbean).

Currently lives at: **[github.com/a-adomako/Windsor-forest-cruise-2](https://github.com/a-adomako/Windsor-forest-cruise-2)** (Vercel-ready static build).

It is **not** a booking site. It exists for two reasons and two only:
1. **Inform** visitors who clicked through from Doug's Facebook video so they feel confident.
2. **Route** them to the assigned Royal Caribbean group agent, who handles all bookings, payment plans, and the group code.

If a future change does not serve (1) or (2), it doesn't belong on this site.

---

## 2. The client (Douglas Walker)

- Group leader / cruise organizer. Wants **zero involvement in money, bookings, or customer questions**.
- Traffic source: a Facebook video that drove ~8,000 views and ~120 teaser signups. Visitors are almost all on phones.
- Doug supplies real content **late and in fragments**: final agent name, group code, and copy land at go-live; pricing and itinerary follow Royal Caribbean confirmation.

Active context: see `[[project_jerry_brunson_active]]`-style entries in `~/.claude/projects/.../memory/` for related client work. Doug is a separate engagement.

---

## 3. The two hard constraints driving the build

1. **No booking actions.** No checkout, no cart, no payment, no "buy pass" link. Every CTA on the page routes to the Royal Caribbean group agent. The only permitted exception is a paid event-pass link, gated behind `cruiseConfig.eventsEnabled` and only enabled with explicit owner sign-off.
2. **Content arrives late and changes.** Hence the config-driven architecture (see §6). The site is built to be swappable in one file, not rebuilt.

A third soft constraint: **mobile-first.** Traffic is overwhelmingly Facebook-on-phone. The CSS reflows tables to stacked label/value rows under 900px, hides desktop nav links, and shows a sticky bottom CTA bar.

---

## 4. File structure

```
cruise-info-website/
├── index.html      # Page structure: nav, Home tab, Cruise Details tab, footer
├── styles.css      # Dark-olive theme, all components, animations, responsive
├── script.js       # Tabs, countdown, config injection, list/table rendering, FAQ smooth-collapse, scroll reveal, click tracking
├── config.js       # Single source of truth for all variable content
├── README.md       # Short deploy/update note
├── SYSTEM_CONTEXT.md  # This file
└── .gitignore
```

No build step. No bundler. No dependencies. Vercel auto-detects as static; output dir is the repo root.

---

## 5. Page architecture — two tabs

Top nav has a pill-shaped tab switcher: **Home** | **Cruise Details**. Switching is JS-based (CSS class toggle), hash-synced via `#tab=details`. Tabs were chosen over a single long scroll because the PRD designates the dense info as its own component, and because it keeps the Home view emotional/lean while the Details view is the "everything you need to know" reference.

### 5.1 Home tab (`#tab-home`)

Vibe-and-emotion layer. Order:

1. **Hero** — title, sailing date line, video placeholder (replace via `cruiseConfig.promoVideoEmbedUrl`), countdown (Days/Hrs/Mins/Secs), primary "Talk to Our Cruise Agent" CTA.
2. **Trust block** — "Organized by [groupName]" plus a one-line intro in the leader's voice. Strangers from Facebook need this before they trust the agent route.
3. **Experience cards** (3-up) — Community, Destination, Ship. Generic alumni-cruise framing.
4. **Ship/amenities** (3-up, condensed) — Dining, Pools & Decks, Entertainment. Includes a "See Full Cruise Details →" button that switches tabs.
5. **Closing** — italic invitation line.

### 5.2 Cruise Details tab (`#tab-details`)

Reference document. Sections must stay in this exact order (the PRD specifies it):

1. **Overview** — `[groupName]` is sailing aboard Utopia of the Seas on `[sailDateStart]`, optional group intro line, plus the boilerplate "this page is for information…" disclaimer.
2. **Cruise Snapshot** — key/value table: Ship, Sail dates, Departs from, Destinations, Group, Group booking code.
3. **What's Included** — checkmark list from `cruiseConfig.included`.
4. **What's Not Included** — × list from `cruiseConfig.notIncluded`.
5. **Pricing** — "From $X" table built from `cruiseConfig.staterooms`, plus a yellow callout about rates current as of `pricingAsOfDate` and subject to change, plus the single-occupancy and triple/quad lines.
6. **How to Book** — agent name/phone/email/group code in a block, then the big primary CTA. This is the conversion event.
7. **Cancellation Policy** — note about non-refundable deposits + window/penalty table from `cruiseConfig.cancellation`.
8. **FAQs** — accordion rendered from `cruiseConfig.faq`. Conditional events FAQ appears only when `cruiseConfig.eventsEnabled === true`.

---

## 6. Config-driven content model (`config.js`)

The single most important architectural decision. Every value that could change between today and go-live lives in `window.cruiseConfig`. The HTML is dumb; the script injects values at load.

### Injection mechanisms

- **Scalar fields** in HTML use `data-cfg="path.to.key"`. `script.js` reads the path (dot-notation), sets `textContent`, and adds the `.placeholder` class if the value matches `/\[[^\]]+\]/`.
- **Arrays** (included, notIncluded, staterooms, cancellation, faq) render via dedicated functions in `script.js` into elements with specific IDs (`cd-included`, `cd-pricing-rows`, etc.).
- **Phone/email** are wired into `tel:` and `mailto:` hrefs only when they look real (have digits / contain `@`). Placeholders don't get linked.

### Placeholder convention

Anything wrapped in `[SQUARE_BRACKETS]` in `config.js` renders as a visible yellow-highlighted pill on the page (`.placeholder` or `.inline-placeholder` class). This makes missing content impossible to miss before go-live. **Do not remove the brackets convention** — Doug's content arrives in pieces and the visible-placeholder system is how we prevent shipping with blanks.

### What lives in config

- Identity: `groupName`, `schoolName`, `groupIntroCopy`
- Cruise basics: `ship`, `cruiseLine`, `sailDateStart`, `sailDateStartISO` (drives countdown), `sailDateEnd`, `departurePort`, `destinations`
- Booking: `groupCode`, `pricingAsOfDate`, `agent.{name,phone,email}`
- Pricing: `staterooms` array of `{tier, priceFrom}`
- Lists: `included`, `notIncluded`
- Policy: `cancellation` array of `{window, penalty}`
- FAQ: `faq` array of `{q, a}`
- Toggles: `eventsEnabled`, `eventsCopy`, `promoVideoEmbedUrl`

### What does NOT live in config

Marketing copy on the Home tab (hero subtitle, experience card descriptions, closing quote) is hard-coded in `index.html` because it's structural framing, not variable content. If Doug requests copy changes there, edit the HTML.

---

## 7. Design system

### Palette (dark olive)

The user explicitly chose `#1e2411` over the original blue reference; light mode was tried once and rejected. **Do not flip to light mode without explicit re-approval.**

```
--bg          #1e2411   page background
--bg-soft     #262d17   card surfaces, section alternation
--bg-deep     #161a0c   hero alt, video placeholder
--border      #3a4225   subtle dividers
--text        #f3f1e6   primary cream text
--text-muted  #a7a791   secondary copy
--gold        #f5c842   accent — eyebrows, dividers, prices, CTAs
--gold-bright #ffd86b   hover / brighter accent
--gold-deep   #d4a727   gradient base for buttons
```

### Type

- Headings/title: **Cormorant Garamond** (serif, 500–700)
- Body/UI: **Inter** (sans, 300–700)

### Components

Cards (`.card`), price tiles (`.price-card`), CD-tab sections (`.cd-section`), tables (`.kv-table`, `.price-table`, `.cancel-table`), agent block (`.agent-block`), callouts (`.callout`, `.callout.subtle`), FAQ accordion (`.faq-item` + native `<details>`), sticky CTA (`.sticky-cta`).

### Animations (subtle by design — user request: "nothing over the top")

- **Hero entrance** — eyebrow → title → subtitle → video → countdown → CTA stagger-rise on page load (0.7s ease-out each)
- **Scroll-reveal** — cards, amenities, price tiles, section titles fade up 18px as they enter the viewport via `IntersectionObserver`. Stagger inside `.grid-3` containers.
- **FAQ collapse** — native `<details>` is intercepted in `script.js` to animate `max-height` and `opacity` over 320ms; the +/− icon rotates.
- **Countdown digit flash** — when a digit changes, it briefly brightens to `--gold-bright` for ~380ms.
- **Tab switch** — content fades up 0.35s.
- **`prefers-reduced-motion`** — full override that disables all of the above.

### Responsive breakpoints

One breakpoint: 900px. Below it: grids collapse to single column, nav links hide and tab pills move to a second row, sticky CTA appears, tables reflow to stacked label/value cards using `td[data-label]`.

---

## 8. Decisions log

Use this section to understand what was tried, what was kept, and *why* — so you don't reverse a deliberate call.

1. **Cloned visual structure from the Norfolk Takeover Cruise site** (per Doug's reference) but rewrote all copy to be original/placeholder for this client. Don't reintroduce the source site's marketing copy.
2. **Dark olive theme, not blue** — Doug's school color is olive. The original swap was `#1e2411`. A light-mode build was attempted (per a PRD revision) and explicitly rejected by the user. Stay dark.
3. **Two tabs, not one long page** — Home stays emotional and lean; Cruise Details is the reference. Switch via JS, hash-synced.
4. **Config-driven everything** — content arrives late; the HTML must not block updates. Adding new variable content? Put it in `config.js` and wire `data-cfg` in HTML, never hard-code.
5. **One CTA wording: "Talk to Our Cruise Agent"** — repeated at hero, after each pricing tier, in the booking block, and as the sticky mobile bar. Do not introduce competing CTAs (no "Buy Now", no "Reserve"). The PRD calls this out specifically.
6. **No sponsorship section, no booking-policies section** — removed in the rebuild. These existed in earlier drafts and were cut because they didn't serve inform-or-route.
7. **"From $X" pricing only, never fixed prices** — Royal Caribbean controls rates and they move. The yellow callout under the pricing table states this. Don't add fixed totals.
8. **Promo video kept as a placeholder slot** — Doug confirmed on call he wanted to keep it. If `cruiseConfig.promoVideoEmbedUrl` is blank, a "Promo video coming soon" placeholder shows.
9. **Click tracking wired but no analytics provider** — every CTA has `data-cta="…"` and `class="cta-track"`. The handler in `script.js` currently logs to console. Replace the body with `gtag(…)` or `plausible(…)` when an analytics tool is chosen.
10. **Sticky mobile CTA hides when the booking section is in view** — IntersectionObserver on `#booking` toggles opacity. Prevents the bar covering the CTA it's pointing to.
11. **Events decision gate** — `cruiseConfig.eventsEnabled` defaults to `false`. Flipping to `true` adds an events FAQ and (per PRD) would introduce the only allowed external ticketing link. Get explicit sign-off before enabling.
12. **Countdown target** — driven by `cruiseConfig.sailDateStartISO`. Currently `2027-06-19T00:00:00`. An earlier 2026 test value was overwritten when the spec confirmed 2027.
13. **No CTA pulse / no autoplay video / no marquee** — earlier iterations had a scrolling marquee and considered an attention-grabbing pulse. Both were cut as too noisy for an info page.

---

## 9. Open inputs (Doug still owes us)

Everything in this list currently renders as a yellow placeholder pill on the page. None blocks ship, but they all block "feels real."

| Field | Config key | When expected |
|---|---|---|
| Official group name | `groupName` | From Doug |
| School name | `schoolName` | From Doug |
| Group intro line | `groupIntroCopy` | From Doug |
| Return date (3 vs 4 night) | `sailDateEnd` | From Royal Caribbean test group |
| Departure port | `departurePort` | From RC |
| Destinations / ports | `destinations` | From RC |
| Per-tier "from" prices | `staterooms[].priceFrom` | From RC test group |
| Pricing-as-of date | `pricingAsOfDate` | At publish |
| Single-occupancy rule | (inline placeholder in HTML pricing section) | Confirm with RC |
| Cancellation windows | `cancellation[]` | From RC |
| Deposit terms | FAQ #3 | From RC |
| Agent name, phone, email | `agent.{name,phone,email}` | Day of go-live |
| Group booking code | `groupCode` | Day of go-live |
| Promo video embed URL | `promoVideoEmbedUrl` | If Doug provides |

---

## 10. Deployment

- **Repo:** [github.com/a-adomako/Windsor-forest-cruise-2](https://github.com/a-adomako/Windsor-forest-cruise-2), `main` branch
- **Host:** Vercel (static, no build step). Connect the repo at vercel.com/new → Framework: Other → no build command → output dir: `./`
- **Local preview:** `python3 -m http.server 8000` from this folder, then open `localhost:8000`
- **Updates:** edit `config.js` → commit → push to `main` → Vercel redeploys automatically

---

## 11. How to update content at go-live

Walk through this in order on launch day:

1. Open `config.js`
2. Replace every `[BRACKETED_PLACEHOLDER]` with the real value
3. Set `pricingAsOfDate` to today's date
4. Fill `agent.name`, `agent.phone`, `agent.email`, `groupCode`
5. Confirm `sailDateStartISO` is correct (drives the countdown)
6. Add `promoVideoEmbedUrl` if Doug delivered a video (otherwise leave blank to keep placeholder)
7. Decide `eventsEnabled` (default `false`)
8. Open `index.html` in a browser — scan for any remaining yellow placeholder pills
9. `git commit -m "Go-live content"` and `git push`
10. Vercel deploys; verify on the live URL

---

## 12. Things future-you should NOT do without re-approval

- Flip to light mode (rejected once)
- Add a second CTA wording or destination (dilutes the one routing action)
- Add a checkout, cart, payment, or pricing-with-tax breakdown (Doug doesn't handle money)
- Hard-code agent name, group code, or prices into HTML (defeats the swap-mechanism)
- Remove the placeholder-pill highlighting (it's the safety net before go-live)
- Reintroduce booking-policies, sponsorship, marquee, or autoplaying media
- Switch the typography pair without checking — Cormorant + Inter is intentional pairing for premium-but-accessible

---

## 13. Quick orientation for the next LLM

If you've just been handed this repo:

1. Skim §1–§3 for what this serves
2. Read §6 (config model) before touching content
3. Read §7 (palette + animations) before touching CSS
4. Read §8 (decisions) before "improving" anything
5. Open the site locally and click both tabs to feel the structure
6. When in doubt, ask: "Does this change help visitors get informed or routed to the agent?" If no, don't ship it.
