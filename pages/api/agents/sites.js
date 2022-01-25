const axios = require("axios");
const SophosAPI = require("../../../lib/sophos_api");

export async function getSites() {
    const sites =  await SophosAPI.GetSites();
    const siteNames = [];
    sites.forEach(site => {
        siteNames.push(site.name);
    });
    return siteNames;
}

export default async function handler(req, res) {
    const sites = await SophosAPI.GetSites();
    res.status(200).send(sites);
}