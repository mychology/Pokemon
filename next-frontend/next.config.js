/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Make sure the Next.js dev indicator is visible in development
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
    appIsrStatus: true,
  },
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
