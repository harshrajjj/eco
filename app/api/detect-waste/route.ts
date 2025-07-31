import { type NextRequest, NextResponse } from "next/server"

// Waste categories for CLIP classification
const WASTE_CATEGORIES = [
  { id: "plastic_bottle", label: "plastic bottle", description: "a plastic water or soda bottle" },
  { id: "glass_bottle", label: "glass bottle", description: "a glass bottle or jar" },
  { id: "aluminum_can", label: "aluminum can", description: "an aluminum soda or beer can" },
  { id: "paper_waste", label: "paper waste", description: "paper, newspaper, or cardboard" },
  { id: "cardboard", label: "cardboard", description: "cardboard box or packaging" },
  { id: "plastic_bag", label: "plastic bag", description: "a plastic shopping or garbage bag" },
  { id: "food_waste", label: "food waste", description: "leftover food or organic waste" },
  { id: "electronic_waste", label: "electronic waste", description: "electronic device, phone, or battery" },
  { id: "textile_waste", label: "textile waste", description: "clothing, fabric, or textile material" },
  { id: "metal_scrap", label: "metal scrap", description: "metal objects or scrap metal" },
  { id: "hazardous_waste", label: "hazardous waste", description: "chemical containers or hazardous materials" },
  { id: "general_trash", label: "general trash", description: "mixed waste or unidentifiable garbage" }
]

// Google ViT model for waste detection with ImageNet mapping
async function detectWasteWithCLIP(base64Image: string) {
  try {
    console.log("🤖 Using Google ViT model with ImageNet mapping...")

    // Step 1: Use Google ViT model (ye working hai!)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: base64Image
        }),
      }
    )

    console.log("API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", errorText)
      return {
        success: false,
        error: `API Error: ${response.status}`,
        message: errorText
      }
    }

    const result = await response.json()
    console.log("🔍 ViT API Response:", JSON.stringify(result, null, 2))

    // Step 2: Map ImageNet classes to waste categories (COMPREHENSIVE MAPPING)
    if (Array.isArray(result)) {
      const mappedResults = result.map((item: any) => {
        // COMPREHENSIVE ImageNet to waste category mapping
        const imagenetToWasteMap: { [key: string]: string } = {

          // ========== PLASTIC BOTTLES & CONTAINERS ==========
          'water bottle': 'plastic_bottle',
          'pop bottle': 'plastic_bottle',
          'soda bottle': 'plastic_bottle',
          'plastic bottle': 'plastic_bottle',
          'pill bottle': 'plastic_bottle',
          'shampoo bottle': 'plastic_bottle',
          'detergent bottle': 'plastic_bottle',
          'milk jug': 'plastic_bottle',
          'juice bottle': 'plastic_bottle',
          'sports bottle': 'plastic_bottle',
          'squeeze bottle': 'plastic_bottle',
          'lotion bottle': 'plastic_bottle',
          'container': 'plastic_bottle',
          'plastic container': 'plastic_bottle',
          'tupperware': 'plastic_bottle',
          'food container': 'plastic_bottle',

          // ========== GLASS BOTTLES & JARS ==========
          'beer bottle': 'glass_bottle',
          'wine bottle': 'glass_bottle',
          'glass bottle': 'glass_bottle',
          'champagne bottle': 'glass_bottle',
          'liquor bottle': 'glass_bottle',
          'perfume bottle': 'glass_bottle',
          'medicine bottle': 'glass_bottle',
          'jar': 'glass_bottle',
          'mason jar': 'glass_bottle',
          'pickle jar': 'glass_bottle',
          'jam jar': 'glass_bottle',
          'honey jar': 'glass_bottle',
          'baby food jar': 'glass_bottle',
          'glass container': 'glass_bottle',
          'vase': 'glass_bottle',
          'drinking glass': 'glass_bottle',

          // ========== ALUMINUM CANS & METAL ==========
          'beer can': 'aluminum_can',
          'tin can': 'aluminum_can',
          'soda can': 'aluminum_can',
          'aluminum can': 'aluminum_can',
          'energy drink can': 'aluminum_can',
          'soup can': 'aluminum_can',
          'food can': 'aluminum_can',
          'cat food can': 'aluminum_can',
          'dog food can': 'aluminum_can',
          'tuna can': 'aluminum_can',
          'tomato can': 'aluminum_can',
          'paint can': 'metal_scrap',
          'spray can': 'aluminum_can',
          'aerosol can': 'aluminum_can',
          'metal container': 'metal_scrap',
          'steel can': 'metal_scrap',
          'metal box': 'metal_scrap',
          'tin': 'metal_scrap',
          'aluminum foil': 'metal_scrap',
          'metal scrap': 'metal_scrap',
          'wire': 'metal_scrap',
          'nail': 'metal_scrap',
          'screw': 'metal_scrap',

          // ========== PAPER & CARDBOARD ==========
          'envelope': 'paper_waste',
          'notebook': 'paper_waste',
          'book jacket': 'paper_waste',
          'menu': 'paper_waste',
          'newspaper': 'paper_waste',
          'magazine': 'paper_waste',
          'paper': 'paper_waste',
          'document': 'paper_waste',
          'receipt': 'paper_waste',
          'letter': 'paper_waste',
          'flyer': 'paper_waste',
          'brochure': 'paper_waste',
          'catalog': 'paper_waste',
          'book': 'paper_waste',
          'comic book': 'paper_waste',
          'tissue': 'paper_waste',
          'napkin': 'paper_waste',
          'paper towel': 'paper_waste',
          'toilet paper': 'paper_waste',
          'paper bag': 'paper_waste',
          'gift wrap': 'paper_waste',
          'wrapping paper': 'paper_waste',

          // ========== CARDBOARD & PACKAGING ==========
          'carton': 'cardboard',
          'cardboard': 'cardboard',
          'box': 'cardboard',
          'shipping box': 'cardboard',
          'pizza box': 'cardboard',
          'cereal box': 'cardboard',
          'shoe box': 'cardboard',
          'package': 'cardboard',
          'packaging': 'cardboard',
          'corrugated box': 'cardboard',
          'mailbox': 'cardboard',
          'egg carton': 'cardboard',
          'milk carton': 'cardboard',
          'juice carton': 'cardboard',
          'takeout box': 'cardboard',
          'delivery box': 'cardboard',

          // ========== PLASTIC BAGS & FLEXIBLE PLASTICS ==========
          'plastic bag': 'plastic_bag',
          'shopping bag': 'plastic_bag',
          'grocery bag': 'plastic_bag',
          'garbage bag': 'plastic_bag',
          'trash bag': 'plastic_bag',
          'ziplock bag': 'plastic_bag',
          'food bag': 'plastic_bag',
          'bread bag': 'plastic_bag',
          'produce bag': 'plastic_bag',
          'dry cleaning bag': 'plastic_bag',
          'plastic wrap': 'plastic_bag',
          'cling wrap': 'plastic_bag',
          'bubble wrap': 'plastic_bag',
          'plastic film': 'plastic_bag',
          'packaging film': 'plastic_bag',

          // ========== ELECTRONIC WASTE ==========
          'cellular telephone': 'electronic_waste',
          'mobile phone': 'electronic_waste',
          'smartphone': 'electronic_waste',
          'laptop': 'electronic_waste',
          'desktop computer': 'electronic_waste',
          'computer': 'electronic_waste',
          'tablet': 'electronic_waste',
          'monitor': 'electronic_waste',
          'television': 'electronic_waste',
          'tv': 'electronic_waste',
          'radio': 'electronic_waste',
          'speaker': 'electronic_waste',
          'headphones': 'electronic_waste',
          'earphones': 'electronic_waste',
          'camera': 'electronic_waste',
          'video camera': 'electronic_waste',
          'printer': 'electronic_waste',
          'keyboard': 'electronic_waste',
          'mouse': 'electronic_waste',
          'charger': 'electronic_waste',
          'cable': 'electronic_waste',
          'battery': 'electronic_waste',
          'remote control': 'electronic_waste',
          'game controller': 'electronic_waste',
          'electronic device': 'electronic_waste',
          'circuit board': 'electronic_waste',
          'hard drive': 'electronic_waste',
          'cd': 'electronic_waste',
          'dvd': 'electronic_waste',
          'usb drive': 'electronic_waste',

          // ========== FOOD WASTE & ORGANIC ==========
          'banana': 'food_waste',
          'orange': 'food_waste',
          'apple': 'food_waste',
          'fruit': 'food_waste',
          'vegetable': 'food_waste',
          'potato': 'food_waste',
          'carrot': 'food_waste',
          'tomato': 'food_waste',
          'onion': 'food_waste',
          'lettuce': 'food_waste',
          'bread': 'food_waste',
          'sandwich': 'food_waste',
          'pizza': 'food_waste',
          'cake': 'food_waste',
          'cookie': 'food_waste',
          'meat': 'food_waste',
          'chicken': 'food_waste',
          'fish': 'food_waste',
          'cheese': 'food_waste',
          'egg': 'food_waste',
          'rice': 'food_waste',
          'pasta': 'food_waste',
          'leftovers': 'food_waste',
          'food scraps': 'food_waste',
          'organic waste': 'food_waste',
          'compost': 'food_waste',
          'coffee grounds': 'food_waste',
          'tea bag': 'food_waste',
          'eggshell': 'food_waste',
          'fruit peel': 'food_waste',
          'vegetable peel': 'food_waste',

          // ========== TEXTILE WASTE ==========
          'clothing': 'textile_waste',
          'shirt': 'textile_waste',
          'pants': 'textile_waste',
          'dress': 'textile_waste',
          'jacket': 'textile_waste',
          'sweater': 'textile_waste',
          'jeans': 'textile_waste',
          'socks': 'textile_waste',
          'underwear': 'textile_waste',
          'shoes': 'textile_waste',
          'sneakers': 'textile_waste',
          'boots': 'textile_waste',
          'fabric': 'textile_waste',
          'cloth': 'textile_waste',
          'towel': 'textile_waste',
          'bedsheet': 'textile_waste',
          'pillow': 'textile_waste',
          'blanket': 'textile_waste',
          'curtain': 'textile_waste',
          'carpet': 'textile_waste',
          'rug': 'textile_waste',
          'bag': 'textile_waste',
          'backpack': 'textile_waste',
          'purse': 'textile_waste',
          'wallet': 'textile_waste',

          // ========== HAZARDOUS WASTE ==========
          'chemical': 'hazardous_waste',
          'poison': 'hazardous_waste',
          'pesticide': 'hazardous_waste',
          'cleaning product': 'hazardous_waste',
          'bleach': 'hazardous_waste',
          'acid': 'hazardous_waste',
          'solvent': 'hazardous_waste',
          'paint': 'hazardous_waste',
          'oil': 'hazardous_waste',
          'gasoline': 'hazardous_waste',
          'motor oil': 'hazardous_waste',
          'antifreeze': 'hazardous_waste',
          'fluorescent bulb': 'hazardous_waste',
          'light bulb': 'hazardous_waste',
          'thermometer': 'hazardous_waste',
          'medical waste': 'hazardous_waste',
          'syringe': 'hazardous_waste',
          'medication': 'hazardous_waste',
          'pills': 'hazardous_waste',

          // ========== GENERAL TRASH ==========
          'trash': 'general_trash',
          'garbage': 'general_trash',
          'waste': 'general_trash',
          'litter': 'general_trash',
          'debris': 'general_trash',
          'junk': 'general_trash',
          'rubbish': 'general_trash',
          'mixed waste': 'general_trash',
          'disposable': 'general_trash',
          'styrofoam': 'general_trash',
          'foam': 'general_trash',
          'plastic utensils': 'general_trash',
          'straw': 'general_trash',
          'cigarette': 'general_trash',
          'cigarette butt': 'general_trash',
          'gum': 'general_trash',
          'wrapper': 'general_trash',
          'chip bag': 'general_trash',
          'candy wrapper': 'general_trash',
          'foil wrapper': 'general_trash',
          'plastic wrapper': 'general_trash',
          'unknown object': 'general_trash',
          'unidentifiable': 'general_trash'
        }

        // SMART KEYWORD MATCHING for best result
        const itemLabel = item.label.toLowerCase()
        let wasteId = 'general_trash'
        let matchScore = 0
        let matchedKeyword = ''

        // Step 1: Check for exact matches first (highest priority)
        if (imagenetToWasteMap[itemLabel]) {
          wasteId = imagenetToWasteMap[itemLabel]
          matchScore = 100
          matchedKeyword = itemLabel
        } else {
          // Step 2: Keyword matching with scoring
          for (const [imagenetClass, wasteCategory] of Object.entries(imagenetToWasteMap)) {
            const keywords = imagenetClass.split(' ')
            let currentScore = 0

            // Check each keyword
            keywords.forEach(keyword => {
              if (itemLabel.includes(keyword)) {
                currentScore += 20 // Each keyword match = 20 points
              }
              if (keyword.includes(itemLabel)) {
                currentScore += 15 // Partial match = 15 points
              }
            })

            // Bonus for exact substring match
            if (itemLabel.includes(imagenetClass)) {
              currentScore += 30
            }
            if (imagenetClass.includes(itemLabel)) {
              currentScore += 25
            }

            // Update if this is the best match so far
            if (currentScore > matchScore) {
              matchScore = currentScore
              wasteId = wasteCategory
              matchedKeyword = imagenetClass
            }
          }
        }

        const wasteCategory = WASTE_CATEGORIES.find(cat => cat.id === wasteId) || WASTE_CATEGORIES[11]

        return {
          ...item,
          waste_id: wasteId,
          waste_label: wasteCategory.label,
          original_description: wasteCategory.description,
          imagenet_label: item.label,
          matched_keyword: matchedKeyword,
          match_score: matchScore,
          confidence_boost: matchScore > 50 ? item.score * 1.2 : item.score // Boost confidence for good matches
        }
      })

      // Sort by confidence_boost to get the BEST result first
      const sortedResults = mappedResults.sort((a, b) => b.confidence_boost - a.confidence_boost)

      // Return ONLY the best result
      const bestResult = sortedResults[0]

      console.log(`🎯 BEST MATCH: "${bestResult.imagenet_label}" → "${bestResult.waste_label}" (keyword: "${bestResult.matched_keyword}", score: ${bestResult.match_score})`)

      return {
        success: true,
        api_response: [bestResult], // Only return the best one
        source: "vit_smart_keyword_matching",
        best_match: bestResult,
        total_candidates: result.length,
        selected_reason: `Best keyword match: "${bestResult.matched_keyword}" with score ${bestResult.match_score}`
      }
    }

    // Fallback response format
    return {
      success: true,
      api_response: result,
      source: "zero_shot_classification"
    }

  } catch (error) {
    console.error("Classification API call error:", error)
    return {
      success: false,
      error: "Classification API call failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    console.log("=== Waste Detection API Called ===")
    
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: "No image file provided" 
      }, { status: 400 })
    }

    console.log(`Image received: ${file.name} Size: ${file.size} Type: ${file.type}`)

    // Convert image to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    
    console.log(`Image converted to base64, length: ${base64Image.length}`)

    // Call OpenAI CLIP for waste detection
    const result = await detectWasteWithCLIP(base64Image)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to process image",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 })
  }
}
