/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    })
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "k.kakaocdn.net", // 카카오
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net", // 네이버
        port: "",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com", // GCP
        port: "",
        pathname: "/convey-your-mind-dev-bucket/**",
      },
    ],
  },
}

module.exports = nextConfig
