import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/generate",
        destination: "https://botid-edge-test.vercel.app/api/generate",
      },
    ];
  },
  headers: async () => {
    return [
      {
        basePath: false,
        source: "/api/generate",
        headers: [{ key: "x-api-secret", value: process.env.SECRET_KEY || "" }],
      },
    ];
  },
};

export default withBotId(nextConfig);
