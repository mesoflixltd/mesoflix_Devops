// Utilize Native Node 22 Fetch

async function testEmail() {
  const BREVO_API_KEY = "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";
  const SENDER_EMAIL = "admin@tradermind.site";
  const TEST_RECIPIENT = "admin@tradermind.site"; // Send it to themselves

  console.log("Attempting to send email via Brevo API...");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: "Mesoflix Systems", email: SENDER_EMAIL },
      to: [{ email: TEST_RECIPIENT, name: "Test User" }],
      subject: "Test Diagnostic | Brevo Connection",
      htmlContent: "<p>If you see this, the API works.</p>"
    })
  });

  const statusCode = res.status;
  const data = await res.json().catch(() => null);

  console.log("Status Code:", statusCode);
  console.log("Response Body:", data);
}

testEmail();
