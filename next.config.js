/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const withTM = require("next-transpile-modules")([
  "react-tag-input",
  "react-dnd",
  "dnd-core",
  "@react-dnd/invariant",
  "@react-dnd/asap",
  "@react-dnd/shallowequal",
]);

module.exports = withTM({
  reactStrictMode: false,
  experimental: { esmExternals: "loose", scrollRestoration: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "field-observer.s3.ca-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching,
  },
});
