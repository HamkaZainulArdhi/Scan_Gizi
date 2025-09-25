import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { NutritionScan } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const scanData: NutritionScan & { user_id: string } = await request.json()

    // Insert the scan data into the database
    const { data, error } = await supabase
      .from("nutrition_scans")
      .insert({
        user_id: user.id,
        image_url: scanData.image_url,
        menu_items: scanData.menu_items,
        nutrition_facts: scanData.nutrition_facts,
        scan_date: scanData.scan_date,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save scan" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Save scan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
