/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");
const { withPlaiceholder } = require("@plaiceholder/next");
const runtimeCaching = require("next-pwa/cache");

const withTM = require("next-transpile-modules")([
  "react-tag-input",
  "react-dnd",
  "dnd-core",
  "@react-dnd/invariant",
  "@react-dnd/asap",
  "@react-dnd/shallowequal",
]);

const nextConfiguration = {
  reactStrictMode: true,
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
  experimental: { scrollRestoration: true },
};

module.exports = withPlugins(
  [
    withTM({
      experimental: { esmExternals: "loose" },
    }),
    withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      runtimeCaching,
    }),
    withPlaiceholder,
  ],
  nextConfiguration
);
