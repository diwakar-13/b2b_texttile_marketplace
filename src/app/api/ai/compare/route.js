import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { productA, productB } = await req.json();

    if (!productA || !productB) {
      return NextResponse.json(
        {
          success: false,
          message: "Both products are required for comparison",
        },
        { status: 400 },
      );
    }

    const systemPrompt = `You are an expert B2B Textile Technical Engineer comparing two fabric products.

FABRIC A (Base Selection):
- Name: ${productA.name || productA.title}
- Material: ${productA.material || "Cotton"}
- GSM: ${productA.gsm} GSM
- Price: ₹${productA.price}/m
- MOQ: ${productA.moq} meters
- Composition: ${productA.composition || "N/A"}

FABRIC B (Compared Selection):
- Name: ${productB.name || productB.title}
- Material: ${productB.material || "Cotton"}
- GSM: ${productB.gsm} GSM
- Price: ₹${productB.price}/m
- MOQ: ${productB.moq} meters
- Composition: ${productB.composition || "N/A"}

INSTRUCTIONS:
Provide a structured technical comparison between Fabric A and Fabric B.
Cover:
1. Weight & Thickness (GSM Analysis)
2. Garment Suitability (Hoodies, Shirts, Ethnic, Summer/Winter)
3. Durability & Wash Care
4. Cost Efficiency & Value
5. Final Verdict (Which fabric to choose for what purpose)

Keep tone concise, professional, B2B focused. Use clean bullet points.`;

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
            {
              role: "user",
              content:
                "Generate detailed side-by-side technical comparison and verdict.",
            },
          ],
          max_tokens: 600,
          temperature: 0.2,
        }),
      },
    );

    const hfData = await response.json();
    const comparisonText =
      hfData.choices?.[0]?.message?.content?.trim() ||
      "Technical comparison generated based on GSM, blend, and pricing.";

    return NextResponse.json({ success: true, comparisonText });
  } catch (error) {
    console.error("Compare API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
