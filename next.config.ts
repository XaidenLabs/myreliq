import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      os: false,
      path: false,
      process: false,
    };

    // Polyfill or mock node: prefixes
    config.resolve.alias = {
      ...config.resolve.alias,
      "node:path": "path-browserify",
      "node:fs": false,
      "node:os": false,
      "node:crypto": "crypto-browserify",
      "node:stream": "stream-browserify",
      "node:util": "util",
      "node:url": "url",
      inquirer: false,
      "stream/promises": false,
    };
    return config;
  },
};

export default nextConfig;
