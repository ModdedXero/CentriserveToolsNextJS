module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
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
  }
}
