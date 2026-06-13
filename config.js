// =============================================================
// CRUISE SITE CONFIG — single source of truth.
// Anything wrapped in [SQUARE_BRACKETS] renders as a visible
// placeholder so missing content is easy to spot.
// =============================================================
window.cruiseConfig = {
  // ----- Group identity -----
  groupName: "Windsor Forest Takeover Cruise",
  schoolName: "Windsor Forest",
  groupIntroCopy: "[GROUP_INTRO_COPY — one or two lines from Doug's voice]",

  // ----- Cruise basics (per RC group agreement, doc 5452193) -----
  ship: "Utopia of the Seas",
  cruiseLine: "Royal Caribbean",
  sailDateStart: "June 18, 2027",
  sailDateStartISO: "2027-06-18T00:00:00",
  sailDateEnd: "June 21, 2027",
  departurePort: "Port Canaveral, FL",
  destinations: "3 Night Perfect Day at CocoCay & Bahamas",

  // ----- Booking contact (Royal Caribbean Group Vacation Specialists) -----
  // No dedicated agent name. Calls route through the group line.
  agent: {
    phone: "1-800-465-3595",
    email: "cogroupsupport@rccl.com"
  },
  groupCode: "[GROUP_CODE — provided day of release]",

  // ----- Deposit & payment -----
  depositPerStateroom: "$200",
  depositDueDate: "July 10, 2026",
  finalPaymentDueDate: "April 4, 2027",

  // ----- Pricing (per person, double occupancy) -----
  pricingAsOfDate: "June 13, 2026",
  staterooms: [
    { tier: "Interior",        priceFrom: "[XXX — pending from Doug]" },
    { tier: "Ocean View",      priceFrom: "$1,279" },
    { tier: "Premium Balcony", priceFrom: "[XXX — pending from Doug]" }
  ],
  taxesAndFees: "$107.98 per person",
  gratuities: "$55.50 per person ($63 for suites)",

  // ----- Inclusions (per RC group agreement) -----
  included: [
    "Ship accommodations",
    "Ocean transportation (tendering)",
    "Most meals",
    "Some non-alcoholic beverages",
    "Most onboard entertainment"
  ],

  // ----- Exclusions (per RC group agreement) -----
  notIncluded: [
    "Air transportation",
    "Ground transportation",
    "Shore excursions",
    "Meals and accommodations ashore (exceptions may apply)",
    "Select beverages and beverage packages",
    "Photographs",
    "Gratuities",
    "Telephone calls",
    "Specialty restaurants"
  ],

  // ----- Cancellation windows (per RC group agreement) -----
  cancellation: [
    { window: "90+ days prior",       penalty: "No charges" },
    { window: "89 to 75 days prior",  penalty: "25% of total fare" },
    { window: "74 to 61 days prior",  penalty: "50% of total fare" },
    { window: "60 to 31 days prior",  penalty: "75% of total fare" },
    { window: "30 days or less",      penalty: "100% of total fare" }
  ],

  // ----- FAQ -----
  faq: [
    {
      q: "How do I book?",
      a: "Call Royal Caribbean Group Vacation Specialists at 1-800-465-3595 (Mon-Fri 9 AM to 8 PM ET, Sat 9 AM to 6 PM ET) or email cogroupsupport@rccl.com. Reference the group code so your booking is credited to the Windsor Forest Takeover Cruise group."
    },
    {
      q: "How much is the deposit?",
      a: "$200 per stateroom. Deposits and full legal names are due by July 10, 2026 to lock in group pricing. Deposit amounts for suites may vary — refer to your individual booking invoice."
    },
    {
      q: "When is final payment due?",
      a: "Final payment is due no later than April 4, 2027. Any balance unpaid after this date may result in cancellation of all or part of the booking."
    },
    {
      q: "What is the cancellation policy?",
      a: "Cancellation fees increase as the sail date approaches: 90+ days prior — no charges; 89 to 75 days — 25% of total fare; 74 to 61 days — 50%; 60 to 31 days — 75%; 30 days or less — 100%. Taxes and fees are excluded from penalties. Travel insurance is strongly recommended."
    },
    {
      q: "What are taxes, fees, and gratuities?",
      a: "Taxes and fees are $107.98 per person. Gratuities are $55.50 per person for the full cruise ($63 for suites) and cover dining, culinary services, stateroom attendants, and behind-the-scenes hotel teams. If not pre-paid, gratuities auto-add to your SeaPass account onboard."
    },
    {
      q: "What if I want more than two people in a cabin?",
      a: "Triple and quad cabins may be available depending on ship inventory. Single occupancy is 200% of the per-person rate (pre-tax and fees). Call Royal Caribbean for current rates."
    },
    {
      q: "Are prices final?",
      a: "Prices shown are 'from' rates current as of June 13, 2026 and may increase. They reflect the group's reserved rate. Final pricing is confirmed at time of booking with Royal Caribbean."
    },
    {
      q: "Do I need a passport?",
      a: "Recommended for international travel. Confirm exact ID requirements with Royal Caribbean based on the itinerary and port of embarkation."
    }
  ],

  // ----- Events / paid pass (decision gate) -----
  eventsEnabled: false,
  eventsCopy: "[EVENT_PASS_COPY]",

  // ----- Promo video (embed URL — leave blank to keep placeholder) -----
  promoVideoEmbedUrl: "https://www.youtube.com/embed/y0_nhqUXLYU",

  // ----- Images (drop files in /assets and point keys here) -----
  // Blank string = feature OFF (default styling applies). See assets/README.md.
  images: {
    hero:                 "",  // e.g. "assets/hero-utopia.jpg" — Utopia of the Seas hero background
    amenityDining:        "",  // e.g. "assets/amenity-dining.jpg"
    amenityPools:         "",  // e.g. "assets/amenity-pools.jpg"
    amenityEntertainment: ""   // e.g. "assets/amenity-entertainment.jpg"
  }
};
