module.exports = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/downloads/:id",
        headers: [
          {
            key: "Content-Disposition",
            value: "attachment"
          }
        ]
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty"
      }
    }

    return config;
  }
}
