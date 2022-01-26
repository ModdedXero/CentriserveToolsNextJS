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
  }
}
