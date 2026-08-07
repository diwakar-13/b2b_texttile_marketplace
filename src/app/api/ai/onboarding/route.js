import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, role } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Prompt is required" },
        { status: 400 },
      );
    }

    const systemPrompt =
      role === "BUYER"
        ? `You are an AI Onboarding Assistant for a B2B Textile Marketplace.
Extract the buyer's preferences from their statement: "${prompt}".
Return ONLY a valid JSON object with keys:
- "businessType": string (e.g., "Garment Manufacturer", "Brand", "Retailer")
- "industry": string (e.g., "Apparel & Fashion", "Home Textile")
- "preferredFabric": string (e.g., "Cotton", "Denim", "Silk")
- "typicalOrderQuantity": number (estimated MOQ in meters, default 500)
- "budgetRange": string (e.g., "$2,000 - $10,000")
- "summaryMessage": string (a polite 1-sentence confirmation response)`
        : `You are an AI Onboarding Assistant for a B2B Textile Marketplace.
Extract the supplier's details from their statement: "${prompt}".
Return ONLY a valid JSON object with keys:
- "businessName": string
- "businessType": string (e.g., "Textile Mill", "Manufacturer", "Trader")
- "contactNumber": string
- "businessAddress": string
- "fabricsOffered": string (e.g., "Cotton, Denim, Silk")
- "minimumOrderQuantity": number (default 500)
- "summaryMessage": string (a polite 1-sentence confirmation response)`;

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
          max_tokens: 400,
          temperature: 0.2,
        }),
      },
    );

    const hfData = await response.json();
    const aiOutput = hfData.choices?.[0]?.message?.content?.trim() || "";

    let extractedData = {};
    try {
      const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) extractedData = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.log("JSON Parse fallback in onboarding");
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error("AI Onboarding Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
