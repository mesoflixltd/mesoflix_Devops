export async function sendWelcomeEmail({ 
  name, 
  email, 
  domainName, 
  magicKey 
}: { 
  name: string; 
  email: string; 
  domainName: string; 
  magicKey: string; 
}) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "admin@tradermind.site";
  
  // Force production domain for emails to avoid .netlify.app redirects
  let SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tradermind.site";
  if (SITE_URL.includes("netlify.app")) {
    SITE_URL = "https://tradermind.site";
  }

  if (!BREVO_API_KEY) {
    console.error("FATAL: No Brevo API key found inside Next.js process! THE SERVER MUST BE RESTARTED.");
    throw new Error("Missing Brevo API Key Environment Variable.");
  }

  const magicLink = `${SITE_URL}/api/auth/verify?token=${magicKey}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; background-color: #020617; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center; }
        .logo { max-width: 80px; margin-bottom: 30px; }
        .title { color: #ffffff; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; font-style: italic; }
        .accent { color: #ff444f; }
        .text { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6; font-weight: 500; margin-bottom: 20px; text-align: left; }
        .box { background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin-bottom: 30px; text-align: left; }
        .btn-wrapper { margin: 40px 0; }
        .btn { display: inline-block; background-color: #ff444f; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; box-shadow: 0 0 20px rgba(255,68,79,0.3); }
        .footer { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; margin-top: 40px; }
        .socials { margin-bottom: 20px; }
        .social-link { color: #ff444f; text-decoration: none; margin: 0 10px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
        .disclaimer { font-size: 10px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 2px; }
      </style>
    </head>
    <body style="background-color: #020617;">
      <div class="container">
        <!-- Optional: Point to your absolute logo URL -->
        <img src="${SITE_URL}/favicon.png" alt="Mesoflix Logo" class="logo" />
        
        <h1 class="title">System Initialization <br/><span class="accent">Complete</span></h1>
        
        <div class="box">
          <p class="text">Welcome aboard, <strong>${name}</strong>.</p>
          <p class="text">Your institutional profile has been verified and your infrastructure for <strong>${domainName}</strong> is now securely linked to the Mesoflix Ecosystem.</p>
          <p class="text"><strong>Development will take approximately 24 hours.</strong> If it delays, you can always contact our support framework.</p>
          <p class="text">We utilize a zero-trust, passwordless architectural framework. A puzzle key tied specifically to your dashboard instance has been generated. By clicking the link below, your device footprint will be explicitly tracked and limited for security.</p>
        </div>

        <div class="btn-wrapper">
          <a href="${magicLink}" class="btn">Initialize Your Dashboard</a>
        </div>

        <p class="text" style="text-align: center; font-size: 12px; color: rgba(255,255,255,0.4);">
          If you did not request this infrastructure setup, securely ignore this transmission.
        </p>

        <div class="footer">
          <div class="socials">
            <a href="https://twitter.com" target="_blank" class="social-link">X (Twitter)</a> | 
            <a href="https://t.me" target="_blank" class="social-link">Telegram</a> | 
            <a href="https://wa.me" target="_blank" class="social-link">WhatsApp</a> | 
            <a href="https://tiktok.com" target="_blank" class="social-link">TikTok</a> | 
            <a href="https://instagram.com" target="_blank" class="social-link">Instagram</a>
          </div>
          <p class="disclaimer">© 2026 Mesoflix Systems. Elite Trading Architecture.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: "Mesoflix Systems", email: SENDER_EMAIL },
        to: [{ email, name }],
        subject: "Infrastructure Ready | Access Your Mesoflix Dashboard",
        htmlContent: htmlContent
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Brevo Email Sending Failed:", errData);
    } else {
      console.log(`Welcome email successfully dispatched to ${email}`);
    }
  } catch (error) {
    console.error("Brevo API Fetch Error:", error);
  }
}

export async function sendAdminWelcomeEmail({ 
  email, 
  magicKey 
}: { 
  email: string; 
  magicKey: string; 
}) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "admin@tradermind.site";
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tradermind.site";

  if (!BREVO_API_KEY) throw new Error("Missing Brevo API Key.");

  // Force production domain and hidden admin path
  let ADMIN_URL = SITE_URL.includes("netlify.app") ? "https://tradermind.site" : SITE_URL;
  const magicLink = `${ADMIN_URL}/api/auth/admin/verify?token=${magicKey}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>
        body { background-color: #020617; color: #ffffff; font-family: sans-serif; }
        .container { max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #1e293b; background-color: #020617; border-radius: 24px; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; font-style: italic; color: #ef4444; }
        .title { font-size: 32px; font-weight: 900; margin: 20px 0; color: #ffffff; text-transform: uppercase; letter-spacing: -2px; }
        .desc { color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 40px; }
        .btn { display: inline-block; background-color: #ef4444; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 2px; }
        .footer { margin-top: 60px; font-size: 11px; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Institutional Core</div>
        <h1 class="title">Admin Authority Access</h1>
        <p class="desc">A secure administrative session has been initialized for node: ${email}. Proceed below to enter the Mesoflix Staff Command Centre.</p>
        <a href="${magicLink}" class="btn">Enter Command Centre</a>
        <div class="footer">
          This is an automated system notification. Unauthorized access attempts are logged and neutralized.
        </div>
      </div>
    </body>
    </html>
  `;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Mesoflix Authority", email: SENDER_EMAIL },
      to: [{ email }],
      subject: "RE: Admin Authority Access Node",
      htmlContent: htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Brevo API Error:", errorData);
    throw new Error(`Email failed: ${response.statusText}`);
  }

  return response.json();
}
