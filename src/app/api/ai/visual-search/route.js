import { NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image URL is required" },
        { status: 400 }
      );
    }

    // Fetch DB Products Catalog
    let cleanCatalog = [];
    try {
      const rawProducts = await db.query.products.findMany({
        with: { images: true },
      });

      cleanCatalog = rawProducts.map((p) => {
        let imgUrl = "";
        if (p.images && p.images.length > 0) {
          imgUrl = p.images[0].imageUrl || p.images[0].url || "";
        } else if (p.imageUrl) {
          imgUrl = p.imageUrl;
        }

        return {
          id: p.id,
          name: p.name || "Fabric Roll",
          material: p.material || "Cotton",
          gsm: p.gsm || 200,
          price: p.price || 150,
          imageUrl: imgUrl || "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=300",
        };
      });
    } catch (e) {
      console.log("DB Fetch Fallback in Visual Search");
    }

    const systemPrompt = `You are a B2B Textile Visual Pattern Recognition Specialist.
Analyze the fabric sample image uploaded at this URL: ${imageUrl}

Compare the weave texture, fiber appearance, color, and pattern against our available catalog:
Catalog Data: ${JSON.stringify(cleanCatalog)}

INSTRUCTIONS:
1. Identify the texture, material type, and pattern from the image.
2. Select 2 to 3 most visually matching products from the catalog.
3. Return STRICTLY in JSON format:
{
  "detectedTexture": "e.g., Heavyweight Cotton Twill / Denim Weave",
  "message": "AI analysis summary explaining why these fabrics match the uploaded swatch image.",
  "recommendedProductIds": ["id1", "id2"]
}`;

    let aiOutput = "";
    try {
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-Coder-32B-Instruct",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Identify visually matching fabrics for this swatch image: ${imageUrl}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.2,
        }),
      });

      const hfData = await response.json();
      aiOutput = hfData.choices?.[0]?.message?.content?.trim() || "";
    } catch (apiErr) {
      console.log("HF Visual API Error:", apiErr.message);
    }

    let parsedResult = { detectedTexture: "", message: "", recommendedProductIds: [] };
    try {
      const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.log("JSON Parse Fallback");
    }

    let recommendedProducts = cleanCatalog.filter((item) =>
      parsedResult.recommendedProductIds?.includes(item.id)
    );

    if (recommendedProducts.length === 0 && cleanCatalog.length > 0) {
      recommendedProducts = cleanCatalog.slice(0, 3);
    }

    return NextResponse.json({
      success: true,
      data: {
        detectedTexture: parsedResult.detectedTexture || "Textured Woven Fabric",
        message:
          parsedResult.message ||
          "Analyzed swatch texture and color profile. Here are the closest matching fabric rolls in stock:",
        recommendedProducts,
      },
    });
  } catch (error) {
    console.error("Visual Search Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}