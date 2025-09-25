import type { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import type {
  MenuItemDetection,
  NutritionAnalysis,
  NutritionScan,
} from '@/lib/types';

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
if (!googleApiKey) {
  throw new Error('Google API key is not defined in environment variables');
}
const genAI = new GoogleGenerativeAI(googleApiKey);

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return Response.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Step 1: Food Detection using Gemini Vision
    console.log('[v0] Starting food detection with Gemini Vision');
    const menuItems = await detectFoodItems(imageUrl);
    console.log('[v0] Detected menu items:', menuItems);

    // Step 2: Nutrition Analysis using Gemini Text
    console.log('[v0] Starting nutrition analysis');
    const nutritionFacts = await analyzeNutrition(menuItems);
    console.log('[v0] Nutrition analysis complete:', nutritionFacts);

    // Step 3: Save to Supabase
    console.log('[v0] Saving to database');
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('nutrition_scans')
      .insert({
        image_url: imageUrl,
        menu_items: menuItems,
        nutrition_facts: nutritionFacts,
      })
      .select()
      .single();

    if (error) {
      console.error('[v0] Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('[v0] Successfully saved scan result');

    const scanResult: NutritionScan = {
      id: data.id,
      image_url: data.image_url,
      scan_date: data.scan_date,
      menu_items: data.menu_items,
      nutrition_facts: data.nutrition_facts,
      created_at: data.created_at,
    };

    return Response.json(scanResult);
  } catch (error) {
    console.error('[v0] API error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 },
    );
  }
}

async function detectFoodItems(imageUrl: string): Promise<MenuItemDetection[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are a food detection expert. Analyze this meal photo and identify visible food items with estimated portion sizes.

Task: Identify all visible food items and estimate their weight in grams.

Output format: Return ONLY a valid JSON array with this exact structure:
[
  {
    "nama_menu": "Food name in Indonesian",
    "estimasi_gram": number,
    "deskripsi": "Brief description of the food item",
    "proses_pengolahan": "Brief description of how the food appears to be prepared"
  }
]

Important:
- Be accurate with portion size estimates
- Use Indonesian names for food items
- Include all visible food items
- Return only the JSON array, no other text`;

  try {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageResponse.headers.get('content-type') || 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in vision response');
    }

    const menuItems = JSON.parse(jsonMatch[0]);
    return menuItems;
  } catch (error) {
    console.error('[v0] Food detection error:', error);
    throw new Error(
      `Food detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function analyzeNutrition(
  menuItems: MenuItemDetection[],
): Promise<NutritionAnalysis> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `You are a nutrition analysis assistant. Calculate detailed nutritional information for the following food items.

Input: ${JSON.stringify(menuItems)}

Task: Calculate calories, protein, fat, carbs, sodium, and fiber for each item and provide a total summary.

Output format: Return ONLY a valid JSON object with this exact structure:
{
  "nutrition_summary": {
    "calories_kcal": number,
    "protein_g": number,
    "fat_g": number,
    "carbs_g": number,
    "sodium_mg": number,
    "fiber_g": number
  },
  "items": [
    {
      "name": "Food name in English",
      "grams": number,
      "calories_kcal": number,
      "protein_g": number,
      "fat_g": number,
      "carbs_g": number,
      "sodium_mg": number,
      "fiber_g": number
    }
  ]
}

Important:
- Use accurate nutritional data based on standard food databases
- Convert Indonesian food names to English for the items array
- Ensure all numbers are realistic and properly calculated
- The summary should be the sum of all individual items
- Return only the JSON object, no other text`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in nutrition response');
    }

    const nutritionAnalysis = JSON.parse(jsonMatch[0]);
    return nutritionAnalysis;
  } catch (error) {
    console.error('[v0] Nutrition analysis error:', error);
    throw new Error(
      `Nutrition analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
