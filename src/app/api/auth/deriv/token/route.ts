import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, codeVerifier, clientId } = await req.json();

    const redirectUri = `${new URL(req.url).origin}/onboarding/callback`;

    const response = await fetch("https://auth.deriv.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error_description || "Token exchange failed" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Deriv Auth Callback Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
