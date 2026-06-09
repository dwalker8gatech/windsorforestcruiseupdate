// =============================================================
// CRUISE SITE CONFIG — single source of truth.
// At go-live, fill placeholders here (no markup edits needed).
// Anything wrapped in [SQUARE_BRACKETS] renders as a visible
// placeholder so missing content is easy to spot.
// =============================================================
window.cruiseConfig = {
  // ----- Group identity -----
  groupName: "[OFFICIAL_GROUP_NAME]",
  schoolName: "[SCHOOL_NAME]",
  groupIntroCopy: "[GROUP_INTRO_COPY — one or two lines from the leader's voice]",

  // ----- Cruise basics -----
  ship: "Utopia of the Seas",
  cruiseLine: "Royal Caribbean",
  sailDateStart: "June 19, 2027",
  sailDateStartISO: "2027-06-19T00:00:00",
  sailDateEnd: "[RETURN_DATE — confirm 3-night vs 4-night]",
  departurePort: "[Port Canaveral, FL — confirm]",
  destinations: "[Nassau & Perfect Day at CocoCay, Bahamas — confirm with RC]",

  // ----- Booking -----
  groupCode: "[GROUP_CODE]",
  pricingAsOfDate: "[DATE]",
  agent: {
    name:  "[AGENT_NAME]",
    phone: "[AGENT_PHONE]",
    email: "[AGENT_EMAIL]"
  },

  // ----- Pricing (per person, double occupancy) -----
  staterooms: [
    { tier: "Interior",        priceFrom: "[XXX]" },
    { tier: "Ocean View",      priceFrom: "[XXX]" },
    { tier: "Premium Balcony", priceFrom: "[XXX]" }
  ],

  // ----- Inclusions -----
  included: [
    "Stateroom for the sail dates",
    "Main dining and complimentary onboard eateries",
    "Onboard entertainment, pools, and activities"
  ],

  // ----- Exclusions -----
  notIncluded: [
    "Roundtrip airfare to [Orlando / departure city]",
    "Roundtrip transportation to [departure port]",
    "Drink package(s)",
    "Gratuities",
    "Internet packages (cheaper to pre-purchase)",
    "Shore excursions"
  ],

  // ----- Cancellation windows (recompute for sail date with RC) -----
  cancellation: [
    { window: "[XX to XX days prior]", penalty: "50% per passenger"  },
    { window: "[XX to XX days prior]", penalty: "75% per passenger"  },
    { window: "[XX to 0 days prior]",  penalty: "100% per passenger" }
  ],

  // ----- FAQ (edit or extend) -----
  faq: [
    {
      q: "Can I book directly with Royal Caribbean or another site and still join the group?",
      a: "Yes. To get the reserved group rate and have your booking credited to the group, book through our agent using the group code."
    },
    {
      q: "What if I want more than two people in a cabin?",
      a: "Triple and quad cabins may be available depending on ship inventory. Contact our agent for pricing."
    },
    {
      q: "Is there a deposit?",
      a: "[Confirm deposit amount and terms with RC.]"
    },
    {
      q: "Who do I contact with questions?",
      a: "Our Royal Caribbean agent handles all booking and trip questions. Their contact information is in the Booking section above."
    }
  ],

  // ----- Events / paid pass (decision gate) -----
  // Set true ONLY if the cruise includes private events that require a paid pass.
  // Flag back to owner before enabling — adds an external ticketing link.
  eventsEnabled: false,
  eventsCopy: "[EVENT_PASS_COPY]",

  // ----- Promo video (leave blank to show placeholder) -----
  promoVideoEmbedUrl: ""
};
