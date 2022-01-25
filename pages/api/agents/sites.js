const SophosAPI = require("../../../lib/data/sophos_api");

// Retrieves Site List from Sophos of Site Names
export async function getSites() {
    const sites =  await SophosAPI.GetSites();
    const siteNames = [];
    sites.forEach(site => {
        siteNames.push(site.name);
    });
    return siteNames;
}

export default async function handler(req, res) {
    const sites = await getSites();
    res.status(200).send(sites);
}