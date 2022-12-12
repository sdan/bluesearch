/** @type {import('next').NextConfig} */

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,

  // Uncoment to add domain whitelist
  images: {
    domains: ['res.cloudinary.com', 'pbs.twimg.com', 'abs.twimg.com'],
  },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};
