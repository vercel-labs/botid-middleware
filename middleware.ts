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
  // If no x-is-human header, just continue the request normally
  // IMPORTANT:
  //  Be sure to confirm the existance of the x-is-human header in the backend resource
  //  Performing this check in the middleware allows for a bad actor to not pass
  //  x-is-human to bypass the middleware check
  //
  //  Ensure that the header is present in the backend resource
  console.log("process.env.SECRET_KEY", process.env.SECRET_KEY);
  return NextResponse.next({
    headers: {
      ...request.headers,
      "api-secret": process.env.SECRET_KEY,
    },
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
