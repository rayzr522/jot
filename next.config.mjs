import withPWAInit from "@ducanh2912/next-pwa";
import "./src/env.mjs";

const withPWA = withPWAInit({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

// export default withPWA(nextConfig);
export default nextConfig;
