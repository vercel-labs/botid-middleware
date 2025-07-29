import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const botResult = await checkBotId();

  console.log("botResult", botResult);

  if (botResult.isBot) {
    return NextResponse.json(
      { error: "Bot is not allowed to access this endpoint" },
      { status: 401 }
    );
  }
  // Handle the /api/generate rewrite directly in middleware
  console.log("request.nextUrl.pathname", request.nextUrl.pathname);
  if (request.nextUrl.pathname === "/api/generate") {
    console.log("rewrite");
    // Create the destination URL
    const url = new URL("https://botid-edge-test.vercel.app/api/generate");

    // Copy search params
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // Create new headers with the x-api-secret header
    const headers = new Headers(request.headers);
    headers.set("x-api-secret", process.env.SECRET_KEY || "");

    console.log("Adding header x-api-secret:", process.env.SECRET_KEY);

    // Rewrite to the external URL with headers
    return NextResponse.rewrite(url, {
      headers: headers,
    });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-api-secret",
    process.env.SECRET_KEY || "your-secret-value"
  );
  // If no x-is-human header, just continue the request normally
  // IMPORTANT:
  //  Be sure to confirm the existance of the x-is-human header in the backend resource
  //  Performing this check in the middleware allows for a bad actor to not pass
  //  x-is-human to bypass the middleware check
  //
  //  Ensure that the header is present in the backend resource
  return NextResponse.next({
    headers: requestHeaders,
  });
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    {
      source: "/(.*)",
      has: [{ type: "header", key: "x-is-human" }],
    },
  ],
};
