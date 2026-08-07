import { NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req) {
  try {
    const { prompt, productContext } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Prompt is required" },
        { status: 400 },
      );
    }

    // 🎯 CASE 1: PRODUCT DETAIL PAGE PAR AI SPECIFIC FABRIC Q&A KAREGA
    if (productContext) {
      const productSystemPrompt = `You are an official AI Fabric Technical Expert answering a buyer's question about a SPECIFIC fabric currently being viewed.

CURRENT FABRIC DETAILS:
- Name/Title: ${productContext.title || productContext.name || "Fabric Roll"}
- Material: ${productContext.material || "Cotton"}
- Composition: ${productContext.composition || "100% Certified Organic"}
- GSM: ${productContext.gsm || "N/A"} GSM
- Price: ₹${productContext.price}/meter
- MOQ: ${productContext.moq || 500} meters
- Width: ${productContext.width || '58-60"'}
- Description: ${productContext.description || "N/A"}

Buyer Question: "${prompt}"

Rules:
1. Answer directly about THIS specific fabric's wash care, shrinkage %, garment suitability (e.g., hoodies, shirts, dresses), or technical properties.
2. Keep the answer professional, technical, and concise (2-4 sentences).
3. Do NOT recommend other products.
4. Return response ONLY in strict JSON format:
{
  "message": "Your clear technical answer string here.",
  "recommendedProductIds": []
}`;

      let aiOutput = "";
      try {
        const response = await fetch(
          "https://router.huggingface.co/v1/chat/completions",
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_TOKEN}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              model: "Qwen/Qwen2.5-Coder-32B-Instruct",
              messages: [
                { role: "system", content: productSystemPrompt },
                { role: "user", content: prompt },
              ],
              max_tokens: 400,
              temperature: 0.2,
            }),
          },
        );

        const hfData = await response.json();
        aiOutput = hfData.choices?.[0]?.message?.content?.trim() || "";
      } catch (apiErr) {
        console.log("Product Q&A HF API Call Error:", apiErr.message);
      }

      let parsedResult = { message: "" };
      try {
        const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.log("JSON Parse Fallback in Product Q&A");
      }

      return NextResponse.json({
        success: true,
        data: {
          message:
            parsedResult.message ||
            `For ${productContext.title || productContext.name}, this fabric is engineered for premium apparel manufacturing. Contact the supplier for specific wash-testing certificates.`,
          recommendedProducts: [],
          isProductQA: true,
        },
      });
    }

    // 🎯 CASE 2: TERI PURANI APNA TERRA FORM (HOME / MARKETPLACE CATALOG RECOMMENDATIONS)
    // 1. Direct Safe Database Fetch (Original Logic)
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
          description: p.description || "",
          imageUrl: imgUrl,
        };
      });
    } catch (dbErr) {
      console.log("DB Fetch Relational Fallback:", dbErr.message);

      try {
        const simpleProducts = await db.query.products.findMany();
        cleanCatalog = simpleProducts.map((p) => ({
          id: p.id,
          name: p.name || "Fabric Roll",
          material: p.material || "Cotton",
          gsm: p.gsm || 200,
          price: p.price || 150,
          description: p.description || "",
          imageUrl: p.imageUrl || "",
        }));
      } catch (e) {
        console.log("DB Critical Fallback");
      }
    }

    // System Prompt for Strict Catalog Matching (Original Logic)
    const systemPrompt = `You are an official AI Fabric Consultant.
Buyer Query: "${prompt}"

Catalog Data:
${JSON.stringify(cleanCatalog)}

Rules:
1. Recommend 2 to 3 product IDs from the catalog matching the request.
2. NEVER send negative replies or say "not available". Always pick matching items.
3. Return response ONLY in strict JSON format:
{
  "message": "Write a helpful 1-2 sentence recommendation for the selected fabrics.",
  "recommendedProductIds": ["id1", "id2"]
}`;

    // 2. Call HuggingFace Router API (Original Logic)
    let aiOutput = "";
    try {
      const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            model: "Qwen/Qwen2.5-Coder-32B-Instruct",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            max_tokens: 500,
            temperature: 0.2,
          }),
        },
      );

      const hfData = await response.json();
      aiOutput = hfData.choices?.[0]?.message?.content?.trim() || "";
    } catch (apiErr) {
      console.log("HF API Call Error:", apiErr.message);
    }

    // 3. Parse JSON Output (Original Logic)
    let parsedResult = { message: "", recommendedProductIds: [] };
    try {
      const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsedResult = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.log("JSON Match Fallback Active");
    }

    // 4. Match DB Products (Original Logic)
    let recommendedProducts = cleanCatalog.filter((item) =>
      parsedResult.recommendedProductIds?.includes(item.id),
    );

    // Fallback Product Filter (Original Logic)
    if (recommendedProducts.length === 0 && cleanCatalog.length > 0) {
      const lowerPrompt = prompt.toLowerCase();
      recommendedProducts = cleanCatalog.filter(
        (p) =>
          p.name.toLowerCase().includes("cotton") ||
          p.material.toLowerCase().includes("cotton") ||
          (lowerPrompt.includes("200") && p.gsm >= 180),
      );

      if (recommendedProducts.length === 0) {
        recommendedProducts = cleanCatalog.slice(0, 3);
      } else {
        recommendedProducts = recommendedProducts.slice(0, 3);
      }
    }

    // Refusal Text Filter (Original Logic)
    const rawMsg = (parsedResult.message || "").toLowerCase();
    const isNegative =
      !parsedResult.message ||
      rawMsg.includes("no product") ||
      rawMsg.includes("don't have") ||
      rawMsg.includes("not available") ||
      rawMsg.includes("unfortunately");

    const finalMessage = isNegative
      ? "Here are the best matching high-quality fabrics from our catalog:"
      : parsedResult.message;

    return NextResponse.json({
      success: true,
      data: {
        message: finalMessage,
        recommendedProducts,
        isProductQA: false,
      },
    });
  } catch (error) {
    console.error("AI API Root Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}