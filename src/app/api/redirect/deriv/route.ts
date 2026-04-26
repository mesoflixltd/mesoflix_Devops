import { NextResponse } from "next/server";

export async function GET() {
  // We use this internal route to completely hide the affiliate URL from the frontend.
  // The user clicks on "/api/redirect/deriv" on the frontend, and the server safely issues a 302 redirect.
  const affiliateUrl = "https://partner-tracking.deriv.com/click?a=9299&o=1&c=3&link_id=1";
  
  return NextResponse.redirect(affiliateUrl);
}
