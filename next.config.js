/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "react-tag-input",
  "react-dnd",
  "dnd-core",
  "@react-dnd/invariant",
  "@react-dnd/asap",
  "@react-dnd/shallowequal",
])

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@react-dnd/asap',
    '@react-dnd/invariant',
    '@react-dnd/shallowequal',
    'dnd-core',
    'react-dnd',
    'react-dnd-html5-backend',
  ],
};

module.exports = nextConfig;

module.exports = withTM({
  experimental: { esmExternals: "loose" },
});
