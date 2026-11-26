import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // QR code sticker redirect — update destination anytime without reprinting
        source: "/qr",
        destination: "/shop",
        permanent: false, // keep false so we can change destination freely
      },
    ];
  },
};

export default nextConfig;
