const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]/*,
    // Paramètres d'optimisation supplémentaires
    quality: 75,
    placeholder: 'empty',*/
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'assets/scss/custom.scss')],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
