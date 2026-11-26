import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/business-transformation',
        destination: '/consulting-advisory',
        permanent: true,
      },
      {
        source: '/technology-digital',
        destination: '/technology-solutions',
        permanent: true,
      },
      {
        source: '/professional-training',
        destination: '/academy-training',
        permanent: true,
      },
    ];
  },
};

export default config;
