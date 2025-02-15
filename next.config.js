const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' cdnjs.cloudflare.com unpkg.com cdn.jsdelivr.net; script-src-elem 'self' 'unsafe-inline' cdnjs.cloudflare.com unpkg.com cdn.jsdelivr.net;"
          }
        ]
      }
    ]
  }
}

module.exports = withNextra(nextConfig)
