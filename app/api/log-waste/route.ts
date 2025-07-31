import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const wasteLogEntry = await request.json()

    // Validate the waste log entry
    if (!wasteLogEntry.type || !wasteLogEntry.timestamp) {
      return NextResponse.json({ error: "Invalid waste log entry" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Save to database (e.g., Supabase, MongoDB, PostgreSQL)
    // 2. Update user's eco points
    // 3. Update community statistics
    // 4. Send notifications to nearby users or NGOs if needed

    // Mock database save
    console.log("Saving waste log entry:", wasteLogEntry)

    // Mock response with updated user stats
    const response = {
      success: true,
      message: "Waste logged successfully",
      ecoPointsEarned: 10,
      totalEcoPoints: 2460, // This would come from the database
      wasteLogId: `waste_${Date.now()}`,
      communityImpact: {
        totalItemsLogged: 1245891, // Updated community total
        co2Saved: 325.2, // Updated CO2 savings
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error logging waste:", error)
    return NextResponse.json({ error: "Failed to log waste" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user's waste log history
    // In production, you'd get the user ID from authentication
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "demo_user"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Mock waste log history
    const wasteHistory = Array.from({ length: limit }, (_, i) => ({
      id: `waste_${Date.now() - i * 86400000}`, // One day apart
      type: ["Plastic Bottle", "Glass Container", "Aluminum Can", "Paper Waste"][i % 4],
      confidence: 85 + Math.random() * 15,
      recyclable: Math.random() > 0.3,
      timestamp: new Date(Date.now() - i * 86400000).toISOString(),
      ecoPointsEarned: Math.floor(Math.random() * 20) + 5,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
      },
    }))

    return NextResponse.json({
      success: true,
      wasteHistory,
      totalItems: wasteHistory.length,
    })
  } catch (error) {
    console.error("Error fetching waste history:", error)
    return NextResponse.json({ error: "Failed to fetch waste history" }, { status: 500 })
  }
}
