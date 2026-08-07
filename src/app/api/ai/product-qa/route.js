import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt, product } = await req.json();

    if (!prompt || !product) {
      return NextResponse.json(
        { success: false, message: "Prompt and Product details are required" },
        { status: 400 },
      );
    }

    const systemPrompt = `You are an expert B2B Textile Fabric Specialist answering buyer queries about a SPECIFIC fabric.

Fabric Context:
- Title: ${product.title || product.name}
- Material: ${product.material || "Cotton"}
- Composition: ${product.composition || "100% Cotton"}
- GSM: ${product.gsm || "N/A"}
- Price: ₹${product.price}/meter
- MOQ: ${product.moq} meters
- Width: ${product.width || '58-60"'}
- Description: ${product.description || "N/A"}

Buyer Question: "${prompt}"

Rules:
1. Answer strictly based on textile domain knowledge, fabric behavior, garment manufacturing suitability, wash care, shrinkage, and dyeing characteristics related to this specific fabric.
2. Keep the answer professional, technical yet concise (max 3-4 sentences).
3. If asked if it's suitable for a specific garment (e.g. hoodies, dresses, shirts), evaluate based on the GSM and material blend.`;

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
          max_tokens: 300,
          temperature: 0.3,
        }),
      },
    );

    const hfData = await response.json();
    const answer =
      hfData.choices?.[0]?.message?.content?.trim() ||
      "I couldn't fetch details for this fabric. Please consult the supplier directly.";

    return NextResponse.json({ success: true, answer });
  } catch (error) {
    console.error("Product AI Q&A Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
