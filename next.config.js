/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "react-tag-input",
  "react-dnd",
  "dnd-core",
  "@react-dnd/invariant",
  "@react-dnd/asap",
  "@react-dnd/shallowequal",
]);

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "field-observer.s3.ca-central-1.amazonaws.com",
        port: "",
        pathname: "/image/upload/**",
      },
    ],
  },
};

// module.exports = nextConfig;

module.exports = withTM({
  reactStrictMode: true,
  experimental: { esmExternals: "loose" },
  images: {
    domains: ['field-observer.s3.ca-central-1.amazonaws.com'],
  },
});