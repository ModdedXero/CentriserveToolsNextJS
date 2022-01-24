const axios = require("axios");
const SophosAPI = require("../../../lib/sophos_api");

export default async function handler(req, res) {
    const sites = await SophosAPI.GetSites();
    res.status(200).send(sites);
}