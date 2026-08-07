import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { firstName, lastName, email, message } = await req.json();

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Saari required details bharein." },
        { status: 400 },
      );
    }

    // Read email from env or fallback variable
    const targetEmail =
      process.env.ADMIN_EMAIL ||
      process.env.CONTACT_EMAIL ||
      "admin@example.com";

    // Resend Email Send Execution
    const data = await resend.emails.send({
      from: "Textil Contact Form <onboarding@resend.dev>",
      to: [targetEmail],
      subject: `New B2B Inquiry from ${firstName} ${lastName || ""}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; rounded: 12px;">
          <h2 style="border-bottom: 2px solid #000; padding-bottom: 8px;">New Contact Inquiry - Textil B2B</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName || ""}</p>
          <p><strong>Sender Email:</strong> ${email}</p>
          <p><strong>Message / Requirement:</strong></p>
          <blockquote style="background: #f4f4f5; padding: 14px; border-left: 4px solid #000; margin-top: 10px; font-size: 14px;">
            ${message}
          </blockquote>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Resend API Error:", error);
    return NextResponse.json(
      { success: false, error: "Email bhejne me issue aaya. Try again." },
      { status: 500 },
    );
  }
}
