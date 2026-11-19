/* ============================================================
   SNAKES CONCRETE LLC — SITE SETTINGS
   Everything an owner is likely to change lives in this file.
   ============================================================ */
window.SNAKES = {
  business: "Snakes Concrete LLC",
  phone: "762-887-5610",
  phone2: "706-847-9194",
  email: "Fernandoenriquez1510@gmail.com", // the owner's copy of every quote/booking is sent here
  whatsapp: "17628875610", // country code + number, digits only

  /* Social links. Replace the search links with your real page URLs. */
  social: {
    facebook:
      "https://www.facebook.com/search/top?q=Snakes%20Concrete%20LLC",
    tiktok:
      "https://www.tiktok.com/search?q=Snakes%20Concrete%20LLC",
  },

  /* Email delivery (free at emailjs.com — setup steps are in README.md).
     Leave the four values empty and the site falls back to opening the visitor's email app. */
  emailjs: {
    publicKey: "",
    serviceId: "",
    customerTemplateId: "", // sends the quote to the customer
    ownerTemplateId: "", // sends the copy to the owner
  },

  /* ---------- QUOTE CALCULATOR PRICING (USD) ----------
     These are placeholder numbers. Set your own real rates before launch.
     rate = price per square foot (retaining wall = per square foot of wall face). */
  pricing: {
    minimumJob: 1500,
    rangeLow: 0.92, // estimate shown as total x 0.92 ...
    rangeHigh: 1.12, // ... to total x 1.12
    services: {
      driveway: {
        label: "Driveway",
        sub: "New or replacement",
        rate: 8.5,
      },
      walkway: {
        label: "Walkway or sidewalk",
        sub: "Residential or commercial",
        rate: 8.0,
      },
      patio: {
        label: "Patio or porch",
        sub: "Slab on grade, covered or open",
        rate: 9.0,
      },
      slab: {
        label: "Slab or pad",
        sub: "Garage, shed, equipment pad",
        rate: 7.5,
      },
      foundation: {
        label: "Foundation or basement floor",
        sub: "Slab foundations, crawl space, basement",
        rate: 10.5,
      },
      stamped: {
        label: "Stamped or decorative",
        sub: "Pattern and texture included",
        rate: 15.0,
        fixedFinish: true,
      },
      retaining: {
        label: "Retaining wall",
        sub: "Priced by wall face area",
        rate: 38.0,
        fixedFinish: true,
        wall: true,
      },
    },
    thickness: { 4: 1.0, 5: 1.12, 6: 1.25 }, // multiplier on base rate
    finish: {
      broom: {
        label: "Broom finish",
        sub: "Non-slip, standard",
        add: 0,
      },
      smooth: {
        label: "Smooth trowel",
        sub: "Clean, interior-style",
        add: 0.75,
      },
      colored: {
        label: "Integral color",
        sub: "Color mixed through",
        add: 1.5,
      },
      exposed: {
        label: "Exposed aggregate",
        sub: "Textured stone surface",
        add: 3.0,
      },
    },
    extras: {
      mesh: { label: "Wire mesh reinforcement", rate: 0.9 },
      rebar: { label: "Rebar reinforcement", rate: 1.9 },
      demo: { label: "Remove old concrete", rate: 3.5 },
      base: { label: "Grade and gravel base", rate: 1.6 },
      sealer: { label: "Sealer", rate: 1.25 },
    },
    stepRate: 190, // per concrete step
    zones: {
      core: {
        label:
          "Chattanooga, Rossville, Ringgold, Fort Oglethorpe",
        mult: 1.0,
      },
      ring: {
        label:
          "Cleveland, Dayton, Jasper, Dalton, Signal Mountain",
        mult: 1.03,
      },
      far: {
        label: "Elsewhere in Georgia or Tennessee",
        mult: 1.06,
      },
      alabama: { label: "Alabama", mult: 1.06 },
    },
  },
};
