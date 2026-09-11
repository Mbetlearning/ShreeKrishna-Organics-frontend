/**
 * CENTRAL PRODUCT CATALOG (DEMO DATA) - SHREEKRISHNA ORGANICS
 * 
 * Sourced directly from certified organic farmer collectives across Bharat.
 * Categories match the wireframe: Oils, Jaggery, Health Supplements, Other Products & Combos.
 */

export const products = [
  {
    id: 1,
    slug: "wood-pressed-yellow-mustard-oil",
    name: "Wood-Pressed Yellow Mustard Oil",
    category: "wood-pressed",
    categoryName: "Oils",
    tagline: "Pungent, aromatic & traditionally crushed in Vaagai wooden ghani",
    shortDescription: "Naturally extracted from premium single-origin yellow mustard seeds. Mildly pungent with a rich golden hue and high smoke point.",
    description: "Our Wood-Pressed Yellow Mustard Oil is traditionally extracted in Vaagai (Albizia lebbeck) wooden expellers at room temperature (< 40°C). Unlike industrial black mustard oils that use chemical hexane solvents and harsh refining, our slow-crushing process preserves all natural antioxidants, allyl isothiocyanate, and authentic Indian culinary aroma.",
    price: 389,
    originalPrice: 460,
    discountPercentage: 15,
    rating: 4.9,
    reviewCount: 324,
    badge: "Bestseller",
    isFeatured: true,
    inStock: true,
    stockCount: 45,
    smokePoint: "250°C (Ideal for Indian deep frying & tadka)",
    seedSource: "Single-origin non-GMO seeds from Rajasthan farms",
    extractionMethod: "Traditional slow Vaagai Wood Churning (Kolhu/Ghani)",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "500 ml", price: 219, mrp: 260 },
      { size: "1 Litre", price: 389, mrp: 460, isDefault: true },
      { size: "5 Litres (Food Grade Can)", price: 1849, mrp: 2200 }
    ],
    ingredients: "100% Pure Yellow Mustard Seeds (Brassica campestris). No preservatives, no added color, zero mineral oil.",
    nutritionalInfo: [
      { label: "Energy", value: "884 kcal / 100g" },
      { label: "Monounsaturated Fat (MUFA)", value: "62g" },
      { label: "Polyunsaturated Fat (PUFA)", value: "21g" },
      { label: "Saturated Fat", value: "9g" },
      { label: "Omega-3 Fatty Acids", value: "8.5g" },
      { label: "Trans Fat & Cholesterol", value: "0g (100% Free)" }
    ],
    storageInstructions: "Store in a cool, dry place away from direct sunlight. Tightly seal bottle cap after every use. Best before 12 months from packing date.",
    culinaryUses: [
      "Authentic Bengali and North Indian curries & gravies",
      "Traditional home pickle preservation (Achar)",
      "High heat sautéing and deep frying",
      "Daily aromatic dal tadka"
    ],
    faqs: [
      {
        q: "Why choose Yellow Mustard over regular Black Mustard?",
        a: "Yellow mustard oil provides the same authentic pungency and health profile as black mustard oil, but with a gentler, sweeter finishing aroma that does not overpower subtle spices."
      },
      {
        q: "Is this oil filtered or refined?",
        a: "It is 100% unrefined and single-cloth filtered. We never use chemicals, bleaches, or heat filtration."
      }
    ]
  },
  {
    id: 2,
    slug: "cold-pressed-virgin-coconut-oil",
    name: "Cold-Pressed Raw Coconut Oil",
    category: "wood-pressed",
    categoryName: "Oils",
    tagline: "100% Pure raw copra extracted without heat or sulfur",
    shortDescription: "Freshly cold-pressed from sun-dried coconut copras of Kerala. Naturally rich in Lauric acid, medium-chain triglycerides (MCTs), and sweet tropical aroma.",
    description: "Crafted from carefully selected, sulfur-free whole mature coconuts harvested in coastal groves. Our Cold-Pressed Coconut Oil undergoes zero chemical refining, bleaching, or deodorizing. The result is crystal clear oil that retains its natural soothing scent, delicate taste, and wholesome medium-chain fatty acids.",
    price: 449,
    originalPrice: 520,
    discountPercentage: 14,
    rating: 4.9,
    reviewCount: 489,
    badge: "Customer Favorite",
    isFeatured: true,
    inStock: true,
    stockCount: 60,
    smokePoint: "177°C (Ideal for South Indian tempering, raw dressing & baking)",
    seedSource: "Naturally sun-dried copras from Pollachi & Kerala groves",
    extractionMethod: "Traditional low-friction cold expeller (< 38°C)",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "500 ml", price: 249, mrp: 290 },
      { size: "1 Litre", price: 449, mrp: 520, isDefault: true },
      { size: "5 Litres (Food Grade Can)", price: 2149, mrp: 2500 }
    ],
    ingredients: "100% Pure Cold-Pressed Coconut Oil (Cocos nucifera). Zero artificial essence or preservatives.",
    nutritionalInfo: [
      { label: "Energy", value: "899 kcal / 100g" },
      { label: "Lauric Acid (MCT)", value: "49.5g" },
      { label: "Saturated Fat", value: "86g (Plant MCTs)" },
      { label: "Monounsaturated Fat", value: "6g" },
      { label: "Trans Fat & Cholesterol", value: "0g" }
    ],
    storageInstructions: "Store at ambient room temperature. Coconut oil naturally solidifies below 24°C; simply immerse the bottle in warm water to liquefy.",
    culinaryUses: [
      "Authentic Kerala style Avial, Thoran & fish curries",
      "Tempering for Sambhar, Rasam, and Chutneys",
      "Healthy morning bulletproof coffee and smoothies",
      "Holistic hair and skin nourishment"
    ],
    faqs: [
      {
        q: "Why does the coconut oil turn white and solid in winter?",
        a: "Solidification at temperatures below 24°C is the hallmark of genuine, pure unadulterated coconut oil rich in natural medium-chain fatty acids."
      }
    ]
  },
  {
    id: 3,
    slug: "vedic-a2-bilona-cow-ghee",
    name: "Vedic A2 Cultured Bilona Cow Ghee",
    category: "supplements",
    categoryName: "Health Supplements",
    tagline: "Hand-churned from curd of grass-fed Gir cows using wooden bilona",
    shortDescription: "Golden, granular, and aromatic traditional A2 ghee prepared strictly via ancient Vedic 5-step sanskar. Rich in butyric acid, Vitamin A, D, E & K2.",
    description: "ShreeKrishna Organics Vedic A2 Ghee is prepared from whole curd of pure-bred indigenous Gir cows roaming freely in natural pastures. The curd is hand-churned in two-way wooden bilonas to extract pure makkhan, then slow-simmered over low firewood to yield divine golden granular ghee with unforgettable aroma.",
    price: 980,
    originalPrice: 1150,
    discountPercentage: 15,
    rating: 5.0,
    reviewCount: 610,
    badge: "Vedic Gold",
    isFeatured: true,
    inStock: true,
    stockCount: 40,
    smokePoint: "250°C (Highest thermal stability for Ayurvedic cooking)",
    seedSource: "Free-grazing indigenous Gir cows from organic Gujarat gaushala",
    extractionMethod: "Traditional Hand Bilona Curd Churning",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "500 ml Glass Jar", price: 980, mrp: 1150, isDefault: true },
      { size: "1 Litre Glass Jar", price: 1890, mrp: 2250 }
    ],
    ingredients: "100% Pure A2 Cultured Gir Cow Milk Fat. No artificial hormones, no preservatives.",
    nutritionalInfo: [
      { label: "Energy", value: "900 kcal / 100g" },
      { label: "Butyric Acid", value: "3.8g" },
      { label: "Omega-3 & CLA", value: "Rich" },
      { label: "A2 Beta-Casein", value: "100% Native Protein" }
    ],
    storageInstructions: "Store in a cool dry place. Do not use a wet spoon.",
    culinaryUses: [
      "Daily breakfast spread on warm rotis, dosas, and parathas",
      "Ayurvedic morning ritual with warm water or milk",
      "Traditional festive sweets and satvik cuisine"
    ],
    faqs: [
      {
        q: "How is Bilona ghee different from regular cream-separated ghee?",
        a: "Industrial ghee is made by separating fat cream from milk directly. Authentic Vedic ghee is made by turning milk into whole curd and slow churning with wooden pestles, preserving gut-friendly butyrate and delicate aromas."
      }
    ]
  },
  {
    id: 4,
    slug: "organic-palm-jaggery-karupatti",
    name: "Pure Organic Palm Jaggery (Karupatti)",
    category: "jaggery",
    categoryName: "Jaggery",
    tagline: "Unrefined mineral-rich sweetener tapped from wild palmyra trees",
    shortDescription: "Traditional Karupatti handcrafted from fresh wild palm sap. Rich in natural iron, potassium, and magnesium with a deep caramel note.",
    description: "Our Organic Palm Jaggery is slow-boiled in iron pans directly by artisan tappers. Free from sulfur, calcium carbonate, or chemical bleaches, this dark golden-brown solid jaggery provides sustained energy, aids digestion, and naturally balances body heat.",
    price: 260,
    originalPrice: 310,
    discountPercentage: 16,
    rating: 4.9,
    reviewCount: 342,
    badge: "Iron Rich",
    isFeatured: true,
    inStock: true,
    stockCount: 75,
    smokePoint: "Natural Sweetener",
    seedSource: "Wild Palmyra groves of Tuticorin & Tirunelveli, Tamil Nadu",
    extractionMethod: "Traditional wood-fired slow evaporation & sun settling",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "500g Block", price: 260, mrp: 310, isDefault: true },
      { size: "1kg Block", price: 490, mrp: 590 }
    ],
    ingredients: "100% Unrefined Wild Palmyra Palm Sap (Borassus flabellifer). Zero chemicals or sulfur.",
    nutritionalInfo: [
      { label: "Iron", value: "11mg / 100g (High)" },
      { label: "Potassium", value: "1050mg" },
      { label: "Magnesium", value: "90mg" },
      { label: "Glycemic Index", value: "Low (approx 35-40)" }
    ],
    storageInstructions: "Store in an airtight container in a cool and dry place.",
    culinaryUses: [
      "Authentic filter coffee and Sukku Kaapi (herbal ginger tea)",
      "Traditional South Indian sweets, Payasam, and Pongal",
      "Natural wholesome replacement for refined white sugar"
    ],
    faqs: [
      {
        q: "Why is Palm Jaggery darker in color?",
        a: "Natural unbleached palm jaggery is rich in plant minerals and polyphenols which give it a signature deep dark brown hue."
      }
    ]
  },
  {
    id: 5,
    slug: "wood-pressed-sesame-gingelly-oil",
    name: "Wood-Pressed Black Sesame (Gingelly) Oil",
    category: "wood-pressed",
    categoryName: "Oils",
    tagline: "Crushed with palm jaggery for authentic South Indian flavor",
    shortDescription: "Extracted from black sesame seeds with natural palm jaggery to balance bitterness. Deep aroma, rich in Sesamol antioxidants and Calcium.",
    description: "Crafted following the centuries-old Tamil Chekku tradition: high grade black sesame seeds are gently crushed in a Vaagai wooden mortar with a touch of organic Palm Jaggery (Karupatti). The jaggery binds seed moisture and balances the natural bitterness of sesame, producing the quintessential 'Nallennai' prized across South India.",
    price: 499,
    originalPrice: 580,
    discountPercentage: 14,
    rating: 4.9,
    reviewCount: 215,
    badge: "Heritage Blend",
    isFeatured: true,
    inStock: true,
    stockCount: 38,
    smokePoint: "210°C (Ideal for Idli Podi, tempering & gravies)",
    seedSource: "Premium black sesame seeds from Erode & Villupuram",
    extractionMethod: "Vaagai Wood-Pressed with Natural Palm Jaggery",
    image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "500 ml", price: 279, mrp: 320 },
      { size: "1 Litre", price: 499, mrp: 580, isDefault: true },
      { size: "5 Litres (Food Grade Can)", price: 2399, mrp: 2800 }
    ],
    ingredients: "Black Sesame Seeds (95%), Organic Palm Jaggery (5%).",
    nutritionalInfo: [
      { label: "Energy", value: "884 kcal / 100g" },
      { label: "Monounsaturated Fat", value: "40g" },
      { label: "Polyunsaturated Fat", value: "43g" },
      { label: "Sesamol & Sesamin", value: "1.2g" },
      { label: "Trans Fat", value: "0g" }
    ],
    storageInstructions: "Store in a cool pantry away from moisture.",
    culinaryUses: [
      "Mixed generously with gunpowder (Idli/Dosa Podi)",
      "Essential for authentic Vatha Kuzhambu and Puliyodharai",
      "Ayurvedic oil pulling and warm body massage"
    ],
    faqs: [
      {
        q: "Why is palm jaggery added to sesame oil?",
        a: "In traditional Chekku extraction, palm jaggery acts as a natural binder that enables seed crushing without heat while rounding off sesame's sharp raw astringency."
      }
    ]
  },
  {
    id: 6,
    slug: "wood-pressed-groundnut-oil",
    name: "Wood-Pressed Groundnut (Peanut) Oil",
    category: "wood-pressed",
    categoryName: "Oils",
    tagline: "Sweet nutty fragrance, golden clarity & versatile everyday cooking",
    shortDescription: "Slowly pressed from native Saurashtra farm peanuts using traditional wooden pestles. High smoke point with a delightfully nutty flavor.",
    description: "An Indian kitchen staple made right. We source hand-shelled native groundnuts and crush them at low rpm in teakwood expellers. Without high heat or chemical bleaching, the oil retains its deep nutty aroma, plant sterols, natural Vitamin E (tocopherol), and heart-friendly monounsaturated fats.",
    price: 369,
    originalPrice: 420,
    discountPercentage: 12,
    rating: 4.8,
    reviewCount: 290,
    badge: "Daily Essential",
    isFeatured: true,
    inStock: true,
    stockCount: 80,
    smokePoint: "230°C (Perfect for everyday cooking, puris & deep frying)",
    seedSource: "Handpicked whole groundnuts from Saurashtra, Gujarat",
    extractionMethod: "Traditional Wood-Pestle Kolhu (Cold-Extracted)",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "1 Litre", price: 369, mrp: 420, isDefault: true },
      { size: "2 Litres", price: 719, mrp: 820 },
      { size: "5 Litres (Food Grade Can)", price: 1749, mrp: 2000 }
    ],
    ingredients: "100% Pure Native Groundnut Seeds (Arachis hypogaea). Unrefined and chemical free.",
    nutritionalInfo: [
      { label: "Energy", value: "884 kcal / 100g" },
      { label: "Monounsaturated Fat (MUFA)", value: "50g" },
      { label: "Polyunsaturated Fat (PUFA)", value: "32g" },
      { label: "Vitamin E", value: "15.7mg" },
      { label: "Trans Fat & Cholesterol", value: "0g" }
    ],
    storageInstructions: "Store in a cool dry place. Keep bottle lid closed.",
    culinaryUses: [
      "Daily sabzi, stir-fries, and flatbread roasting",
      "Crispy puris, pakodas, and traditional snacks",
      "Maharashtrian poha & South Indian tadka"
    ],
    faqs: [
      {
        q: "Can I reuse this oil for frying?",
        a: "Due to its high thermal stability and unrefined structure, it can be filtered and reused 1-2 times without breaking down into toxic polymers unlike refined vegetable oils."
      }
    ]
  },
  {
    id: 7,
    slug: "organic-sugarcane-jaggery-powder",
    name: "Pure Organic Sugarcane Jaggery Powder (Shakkar)",
    category: "jaggery",
    categoryName: "Jaggery",
    tagline: "Fine golden granules crafted from heirloom native sugarcane juice",
    shortDescription: "Sun-dried organic jaggery powder made from whole sugarcane without chemical clarifying agents. Easily soluble in hot milk, chai, and baking.",
    description: "Prepared from organically cultivated sugarcane stalks grown along river basins in Kolhapur. The juice is clarified with natural okra (bhindi) mucilage rather than chemical hydrosulphite, preserving high potassium, magnesium, and subtle molasses sweetness.",
    price: 195,
    originalPrice: 230,
    discountPercentage: 15,
    rating: 4.8,
    reviewCount: 188,
    badge: "100% Chemical Free",
    isFeatured: false,
    inStock: true,
    stockCount: 90,
    smokePoint: "Daily Sweetener",
    seedSource: "Organic heirloom sugarcane farms in Kolhapur, Maharashtra",
    extractionMethod: "Natural Okra Clarification & Slow Brass Pan Simmering",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "500g Pouch", price: 110, mrp: 130 },
      { size: "1kg Zip Pouch", price: 195, mrp: 230, isDefault: true }
    ],
    ingredients: "100% Pure Organic Sugarcane Juice (Saccharum officinarum). Zero added sulphur or anti-caking agents.",
    nutritionalInfo: [
      { label: "Energy", value: "383 kcal / 100g" },
      { label: "Iron", value: "2.6mg" },
      { label: "Calcium", value: "80mg" },
      { label: "Total Sugars", value: "85g (Natural Sucrose & Fructose)" }
    ],
    storageInstructions: "Store in a cool dry container. Keep moisture away.",
    culinaryUses: [
      "Daily morning tea, coffee, and golden turmeric milk",
      "Traditional halwa, laddoos, and Indian desserts",
      "Healthy whole-wheat baking and morning oats"
    ],
    faqs: []
  },
  {
    id: 8,
    slug: "raw-multifloral-wild-forest-honey",
    name: "Raw Wild Forest Multifloral Honey",
    category: "supplements",
    categoryName: "Health Supplements",
    tagline: "Unheated, unpasteurized honey harvested from deep tribal forest reserves",
    shortDescription: "Pure raw honey collected by indigenous forest tribes from wild bee hives. Rich in live floral enzymes, pollen, and natural propolis.",
    description: "ShreeKrishna Organics Wild Forest Honey is 100% unprocessed and cold-filtered. Never heated above hive temperature, it retains all its natural enzymes (amylase, invertase), antimicrobial defensin proteins, and complex wildflower aromas.",
    price: 520,
    originalPrice: 620,
    discountPercentage: 16,
    rating: 4.9,
    reviewCount: 230,
    badge: "100% Raw & Wild",
    isFeatured: false,
    inStock: true,
    stockCount: 50,
    smokePoint: "Immunity Wellness",
    seedSource: "Protected Nilgiri Biosphere tribal reserve forests",
    extractionMethod: "Ethical single-cloth filtration without thermal pasteurization",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "500g Glass Jar", price: 520, mrp: 620, isDefault: true },
      { size: "1kg Glass Jar", price: 980, mrp: 1180 }
    ],
    ingredients: "100% Pure Raw Wild Bee Honey. No added sugar syrup, zero C4 adulteration.",
    nutritionalInfo: [
      { label: "Energy", value: "304 kcal / 100g" },
      { label: "Live Enzymes", value: "Active Diastase & Invertase" },
      { label: "Antioxidants", value: "Flavonoids & Phenolic acids" }
    ],
    storageInstructions: "Store at room temperature. Pure raw honey may naturally crystallize; gently place jar in warm water to reliquefy.",
    culinaryUses: [
      "Morning warm water & lemon detox tonic",
      "Drizzled over smoothie bowls, fruits, and yogurt",
      "Natural soothing remedy for throat comfort"
    ],
    faqs: []
  },
  {
    id: 9,
    slug: "shreekrishna-heritage-trio-oil-combo",
    name: "ShreeKrishna Heritage Trio (Mustard + Coconut + Groundnut)",
    category: "other",
    categoryName: "Other Products",
    tagline: "The complete traditional Indian kitchen starter bundle",
    shortDescription: "A curated trio of our best-selling 1L wood-pressed oils. Experience authentic flavours for every Indian cuisine style.",
    description: "Upgrade your household cooking with our complete 3-in-1 pantry collection. Contains 1 Litre Yellow Mustard Oil (for tadkas & curries), 1 Litre Raw Cold-Pressed Coconut Oil (for South Indian delicacies & breakfast), and 1 Litre Wood-Pressed Groundnut Oil (for everyday gravies and deep frying). Packed in eco-friendly protective packaging.",
    price: 1149,
    originalPrice: 1400,
    discountPercentage: 18,
    rating: 5.0,
    reviewCount: 512,
    badge: "Best Value Combo",
    isFeatured: true,
    inStock: true,
    stockCount: 25,
    smokePoint: "Varied according to individual oils in pack",
    seedSource: "Direct farmer collectives from Rajasthan, Gujarat & Kerala",
    extractionMethod: "100% Traditional Wood & Cold Pressed",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "3 x 1 Litre Bottles", price: 1149, mrp: 1400, isDefault: true }
    ],
    ingredients: "Pure Mustard Oil (1L) + Pure Coconut Oil (1L) + Pure Groundnut Oil (1L).",
    nutritionalInfo: [
      { label: "Contains", value: "3 full-size 1L glass/food-grade bottles" },
      { label: "Purity Guarantee", value: "Zero chemicals, unrefined, zero mineral oils" }
    ],
    storageInstructions: "Store individual bottles in a cool, dry place away from heat.",
    culinaryUses: [
      "Complete cooking suite for North, South, East, and Western Indian recipes",
      "Thoughtful healthy gifting for festivals and housewarming"
    ],
    faqs: []
  },
  {
    id: 10,
    slug: "pure-cold-pressed-castor-oil",
    name: "Pure Cold-Pressed Castor (Arandi) Oil",
    category: "other",
    categoryName: "Other Products",
    tagline: "100% Raw, thick, hexane-free & rich in Ricinoleic Acid",
    shortDescription: "Gently extracted from virgin castor beans of Gujarat. Traditional wellness oil for grain preservation, digestive wellness & hair therapy.",
    description: "Our Cold-Pressed Castor Oil is 100% pure, unrefined, and strictly free from chemical hexane solvents. In traditional Indian households, it is prized for coating food grains (like wheat and lentils) for natural multi-year preservation, as well as renowned hair and skin deep hydration.",
    price: 299,
    originalPrice: 350,
    discountPercentage: 15,
    rating: 4.9,
    reviewCount: 164,
    badge: "Wellness Essential",
    isFeatured: false,
    inStock: true,
    stockCount: 40,
    smokePoint: "Not recommended for deep frying (Wellness / Grain use)",
    seedSource: "Selected non-GMO Castor seeds from Mehsana, Gujarat",
    extractionMethod: "Cold Mechanical Extraction (< 35°C)",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "500 ml", price: 299, mrp: 350, isDefault: true },
      { size: "1 Litre", price: 549, mrp: 650 }
    ],
    ingredients: "100% Pure Virgin Cold-Pressed Castor Oil (Ricinus communis).",
    nutritionalInfo: [
      { label: "Ricinoleic Acid", value: "90%" },
      { label: "Oleic Acid", value: "4%" },
      { label: "Linoleic Acid", value: "4%" }
    ],
    storageInstructions: "Store in a cool, dry place.",
    culinaryUses: [
      "Traditional natural food grain preservation (wheat & pulses)",
      "Traditional Ayurvedic wellness and therapeutic rituals"
    ],
    faqs: []
  }
];

export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getProductBySlug = (slug) => products.find(p => p.slug === slug);
export const getProductById = (id) => products.find(p => p.id === Number(id));
