/**
 * UNIVERSAL TRAVEL AFFILIATE API
 * CravTravel - CR AudioViz AI
 * 
 * Powers affiliate links for ANY destination
 * Cross-sells to real estate, insurance, and all ecosystem apps
 * Centralized tracking for all travel revenue
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ============================================================
// AFFILIATE NETWORK CONFIGURATIONS
// ============================================================

const AFFILIATES = {
  // TOURS & ACTIVITIES
  viator: {
    name: "Viator",
    baseUrl: "https://www.viator.com",
    param: "pid",
    id: process.env.VIATOR_PARTNER_ID || "P00280339",
    commission: 0.08,
    category: "tours"
  },
  getyourguide: {
    name: "GetYourGuide", 
    baseUrl: "https://www.getyourguide.com",
    param: "partner_id",
    id: process.env.GETYOURGUIDE_PARTNER_ID || "VZYKZYE",
    commission: 0.08,
    category: "tours"
  },
  klook: {
    name: "Klook",
    baseUrl: "https://www.klook.com",
    param: "aid",
    id: process.env.KLOOK_AFFILIATE_ID || "106921",
    commission: 0.05,
    category: "tours"
  },
  
  // CAR RENTALS
  discovercars: {
    name: "Discover Cars",
    baseUrl: "https://www.discovercars.com",
    param: "a_aid",
    id: process.env.DISCOVER_CARS_AFFILIATE || "royhenders",
    commission: 0.03,
    category: "car-rental"
  },
  
  // TRAVEL INSURANCE
  squaremouth: {
    name: "Squaremouth",
    baseUrl: "https://www.squaremouth.com",
    param: "affid",
    id: process.env.SQUAREMOUTH_AFFILIATE_ID || "23859",
    commission: 0.15,
    category: "insurance"
  },
  
  // HOTELS (via Awin network)
  booking: {
    name: "Booking.com",
    baseUrl: "https://www.booking.com",
    param: "aid",
    id: process.env.BOOKING_AFFILIATE_ID || "2692370",
    commission: 0.04,
    category: "hotels"
  },
  
  // FLIGHTS (via Awin network)
  skyscanner: {
    name: "Skyscanner",
    baseUrl: "https://www.skyscanner.com",
    param: "associateId",
    id: process.env.SKYSCANNER_AFFILIATE_ID || "crav",
    commission: 0.01,
    category: "flights"
  }
};

// ============================================================
// DESTINATION DATABASE
// ============================================================

const DESTINATIONS = {
  orlando: {
    name: "Orlando, FL",
    region: "florida",
    attractions: ["disney-world", "universal-studios", "seaworld", "kennedy-space-center"],
    realEstateLink: "https://zoyzy.com/search?location=orlando",
    climate: "subtropical"
  },
  miami: {
    name: "Miami, FL",
    region: "florida", 
    attractions: ["south-beach", "art-deco", "everglades", "key-biscayne"],
    realEstateLink: "https://zoyzy.com/search?location=miami",
    climate: "tropical"
  },
  tampa: {
    name: "Tampa, FL",
    region: "florida",
    attractions: ["busch-gardens", "clearwater-beach", "ybor-city"],
    realEstateLink: "https://zoyzy.com/search?location=tampa",
    climate: "subtropical"
  },
  "new-york": {
    name: "New York City",
    region: "northeast",
    attractions: ["statue-of-liberty", "times-square", "central-park", "broadway"],
    realEstateLink: "https://zoyzy.com/search?location=nyc",
    climate: "continental"
  },
  "los-angeles": {
    name: "Los Angeles, CA",
    region: "california",
    attractions: ["hollywood", "disneyland", "santa-monica", "beverly-hills"],
    realEstateLink: "https://zoyzy.com/search?location=los-angeles",
    climate: "mediterranean"
  },
  "las-vegas": {
    name: "Las Vegas, NV",
    region: "southwest",
    attractions: ["strip", "grand-canyon", "hoover-dam", "fremont-street"],
    realEstateLink: "https://zoyzy.com/search?location=las-vegas",
    climate: "desert"
  },
  london: {
    name: "London, UK",
    region: "europe",
    attractions: ["big-ben", "tower-of-london", "buckingham-palace", "london-eye"],
    realEstateLink: null,
    climate: "oceanic"
  },
  paris: {
    name: "Paris, France",
    region: "europe",
    attractions: ["eiffel-tower", "louvre", "notre-dame", "champs-elysees"],
    realEstateLink: null,
    climate: "oceanic"
  },
  tokyo: {
    name: "Tokyo, Japan",
    region: "asia",
    attractions: ["shibuya", "senso-ji", "tokyo-tower", "akihabara"],
    realEstateLink: null,
    climate: "humid-subtropical"
  }
};

// ============================================================
// CROSS-SELL ECOSYSTEM APPS
// ============================================================

const ECOSYSTEM_APPS = {
  realEstate: {
    name: "Zoyzy Real Estate",
    url: "https://zoyzy.com",
    description: "Find your dream home in your vacation destination",
    trigger: "domestic-travel",
    cta: "Thinking of relocating? Search homes here!"
  },
  realtorCRM: {
    name: "CravKey",
    url: "https://cravkey.com", 
    description: "Realtor CRM for relocation specialists",
    trigger: "realtor-lead",
    cta: "Partner with local agents"
  },
  insurance: {
    name: "RateUnlock",
    url: "https://rateunlock.com",
    description: "Compare home & travel insurance rates",
    trigger: "any-travel",
    cta: "Protect your trip & future home"
  },
  barrels: {
    name: "CravBarrels",
    url: "https://cravbarrels.com",
    description: "Discover local distilleries and craft spirits",
    trigger: "destination-visit",
    cta: "Find local distillery tours"
  },
  games: {
    name: "CravGamesHub",
    url: "https://cravgameshub.com",
    description: "Gaming and entertainment",
    trigger: "entertainment",
    cta: "Play while you wait"
  }
};

// ============================================================
// API HANDLERS
// ============================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "destinations": {
      return NextResponse.json({
        destinations: Object.entries(DESTINATIONS).map(([slug, data]) => ({
          slug,
          ...data
        })),
        count: Object.keys(DESTINATIONS).length
      });
    }

    case "destination": {
      const slug = searchParams.get("slug");
      if (!slug || !DESTINATIONS[slug as keyof typeof DESTINATIONS]) {
        return NextResponse.json({ error: "Destination not found" }, { status: 404 });
      }
      
      const dest = DESTINATIONS[slug as keyof typeof DESTINATIONS];
      
      // Generate affiliate links for this destination
      const affiliateLinks = Object.entries(AFFILIATES).map(([key, config]) => ({
        provider: config.name,
        category: config.category,
        url: `${config.baseUrl}/${slug}?${config.param}=${config.id}`,
        commission: `${config.commission * 100}%`
      }));
      
      // Get cross-sell recommendations
      const crossSell = [];
      if (dest.realEstateLink) {
        crossSell.push({
          ...ECOSYSTEM_APPS.realEstate,
          url: dest.realEstateLink
        });
      }
      crossSell.push(ECOSYSTEM_APPS.insurance);
      crossSell.push(ECOSYSTEM_APPS.barrels);
      
      return NextResponse.json({
        destination: { slug, ...dest },
        affiliates: affiliateLinks,
        crossSell
      });
    }

    case "link": {
      const affiliate = searchParams.get("affiliate");
      const destination = searchParams.get("destination") || "";
      const product = searchParams.get("product") || "";
      
      if (!affiliate || !AFFILIATES[affiliate as keyof typeof AFFILIATES]) {
        return NextResponse.json({ error: "Invalid affiliate" }, { status: 400 });
      }
      
      const config = AFFILIATES[affiliate as keyof typeof AFFILIATES];
      let path = destination || product || "";
      const url = `${config.baseUrl}${path ? "/" + path : ""}?${config.param}=${config.id}`;
      
      return NextResponse.json({
        affiliate: config.name,
        url,
        commission: `${config.commission * 100}%`,
        category: config.category
      });
    }

    case "cross-sell": {
      const source = searchParams.get("source") || "travel";
      const destination = searchParams.get("destination");
      
      const recommendations = [];
      
      // Always recommend insurance for travel
      recommendations.push({
        priority: 1,
        ...ECOSYSTEM_APPS.insurance,
        reason: "Protect your trip"
      });
      
      // Recommend real estate for domestic destinations
      if (destination) {
        const dest = DESTINATIONS[destination as keyof typeof DESTINATIONS];
        if (dest?.realEstateLink) {
          recommendations.push({
            priority: 2,
            ...ECOSYSTEM_APPS.realEstate,
            url: dest.realEstateLink,
            reason: `Love ${dest.name}? Consider making it home!`
          });
        }
      }
      
      // Add barrels for entertainment
      recommendations.push({
        priority: 3,
        ...ECOSYSTEM_APPS.barrels,
        reason: "Discover local craft spirits"
      });
      
      return NextResponse.json({ recommendations });
    }

    case "stats": {
      return NextResponse.json({
        affiliates: Object.keys(AFFILIATES).length,
        destinations: Object.keys(DESTINATIONS).length,
        ecosystemApps: Object.keys(ECOSYSTEM_APPS).length,
        categories: Array.from(new Set(Object.values(AFFILIATES).map(a => a.category))),
        providers: Object.entries(AFFILIATES).map(([k, v]) => ({
          id: k,
          name: v.name,
          category: v.category,
          commission: `${v.commission * 100}%`
        }))
      });
    }

    default:
      return NextResponse.json({
        name: "CravTravel Universal Affiliate API",
        version: "1.0.0",
        actions: {
          destinations: "List all destinations",
          destination: "Get destination details with affiliate links",
          link: "Generate affiliate link",
          "cross-sell": "Get cross-sell recommendations",
          stats: "API statistics"
        },
        ecosystem: Object.keys(ECOSYSTEM_APPS)
      });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case "track-click": {
        const { affiliate, destination, product, user_id, session_id, source_app } = data;
        
        // Log to analytics (would go to Supabase)
        const clickData = {
          affiliate,
          destination,
          product,
          user_id,
          session_id,
          source_app: source_app || "crav-travel",
          timestamp: new Date().toISOString()
        };
        
        console.log("Affiliate click:", clickData);
        
        return NextResponse.json({ success: true, tracked: clickData });
      }

      case "track-cross-sell": {
        const { target_app, destination, user_id, source_app } = data;
        
        const crossSellData = {
          target_app,
          destination,
          user_id,
          source_app: source_app || "crav-travel",
          timestamp: new Date().toISOString()
        };
        
        console.log("Cross-sell click:", crossSellData);
        
        return NextResponse.json({ success: true, tracked: crossSellData });
      }

      case "realtor-lead": {
        const { destination, user_email, user_name, interest_type } = data;
        
        // This would create a lead in CravKey for local realtors
        const lead = {
          destination,
          user_email,
          user_name,
          interest_type: interest_type || "relocation",
          source: "crav-travel",
          timestamp: new Date().toISOString()
        };
        
        console.log("Realtor lead:", lead);
        
        return NextResponse.json({ 
          success: true, 
          message: "Lead submitted to local agents",
          lead_id: `lead_${Date.now()}`
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

