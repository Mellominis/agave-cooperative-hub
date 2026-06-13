import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
    return;
  }

  try {
    const { fullName, email, role, enterpriseName, source } = req.body || {};

    if (!fullName || !email) {
      res.status(400).json({ success: false, error: "Missing required fields: fullName and email" });
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY environment variable is not defined. Simulating Resend response.");
      res.status(200).json({
        success: true,
        id: "simulated_id_" + Math.random().toString(36).substring(2, 11),
        message: "Key unconfigured. Under developer sandbox simulation mode.",
      });
      return;
    }

    const resend = new Resend(apiKey);

    // Sender and Recipient Configuration
    // - Sender: hello@mellominis.com (or onboarding@resend.dev for testing)
    // - Recipient: hello@mellominis.com
    const isTestingKey = apiKey.startsWith("re_onboarding") || apiKey === "re_12345678";
    const sender = isTestingKey ? "onboarding@resend.dev" : "hello@mellominis.com";
    const recipient = "hello@mellominis.com";

    const { data, error } = await resend.emails.send({
      from: `Agave Cooperative Hub <${sender}>`,
      to: [recipient],
      replyTo: email,
      subject: `New Agave Cooperative Registration: ${fullName}`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eae8e5; border-radius: 12px; background-color: #faf9f6; color: #1c1917;">
          <h2 style="font-size: 20px; font-weight: 700; color: #1c1917; border-bottom: 2px solid #decfae; padding-bottom: 12px; margin-top: 0; letter-spacing: -0.025em;">
            New Registration Received
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #44403c; margin-bottom: 24px;">
            A new member has completed enrollment through the <strong>Mellow Minis Agave Initiative</strong>.
          </p>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
            <tbody>
              <tr>
                <td style="padding: 12px 8px; font-weight: 600; color: #78716c; border-bottom: 1px solid #eae8e5; width: 35%;">Full Name</td>
                <td style="padding: 12px 8px; color: #1c1917; border-bottom: 1px solid #eae8e5; font-weight: 500;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; font-weight: 600; color: #78716c; border-bottom: 1px solid #eae8e5;">Email Address</td>
                <td style="padding: 12px 8px; color: #1c1917; border-bottom: 1px solid #eae8e5; font-weight: 500;">
                  <a href="mailto:${email}" style="color: #bc8f42; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; font-weight: 600; color: #78716c; border-bottom: 1px solid #eae8e5;">Cooperative Role / Interest</td>
                <td style="padding: 12px 8px; color: #1c1917; border-bottom: 1px solid #eae8e5; font-weight: 500; text-transform: capitalize;">${role}</td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; font-weight: 600; color: #78716c; border-bottom: 1px solid #eae8e5;">District / Province</td>
                <td style="padding: 12px 8px; color: #1c1917; border-bottom: 1px solid #eae8e5;">${enterpriseName || "Unspecified"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; font-weight: 600; color: #78716c; border-bottom: 1px solid #eae8e5;">Form Source Space</td>
                <td style="padding: 12px 8px; color: #78716c; border-bottom: 1px solid #eae8e5; font-family: monospace; font-size: 12px;">${source || "Main Banner"}</td>
              </tr>
            </tbody>
          </table>
          
          <div style="text-align: center; border-top: 1px solid #eae8e5; padding-top: 20px; font-size: 11px; color: #a8a29e;">
            Automated notification dispatch via Resend on behalf of Mellow Minis Hub.
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API failed:", error);
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error("Internal Resend endpoint handler error:", err);
    res.status(500).json({ success: false, error: err?.message || "Internal server error" });
  }
}
