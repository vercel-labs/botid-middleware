import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/generate",
        destination: "https://botid-edge-test.vercel.app/api/generate",
        headers: [
          {
            key: "api-secret",
            value: process.env.SECRET_KEY || "",
          },
        ],
      },
    ];
  },
};

export default withBotId(nextConfig);
