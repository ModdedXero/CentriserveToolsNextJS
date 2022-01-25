const axios = require("axios");
const fs = require("../lib/file_saver");
const logger = require("../lib/logger");

let SophosAccessToken = global.SophosAccessToken;
let SophosPartnerID = global.SophosPartnerID;

if (!SophosAccessToken || !SophosPartnerID) {
    SophosAccessToken = global.SophosAccessToken = null;
    SophosPartnerID = global.SophosPartnerID = null;
}

async function Init() {
    if (SophosPartnerID) return;

    while (!SophosPartnerID) {
        // Set Delay to not overload Sophos API or Axios
        await new Promise(resolve => setTimeout(resolve, 1500));

        const AccessToken = await axios.post("https://id.sophos.com/api/v2/oauth2/token", 
            `grant_type=client_credentials&client_id=${process.env.SOPHOS_CLIENT_KEY}&client_secret=${process.env.SOPHOS_SECRET_KEY}&scope=token`);

        if (AccessToken.data.access_token) {
            SophosAccessToken = AccessToken.data.access_token;
            const PartnerID = await axios.get(`${process.env.SOPHOS_API_URL}/whoami/v1`,
                { headers: { Authorization: `Bearer ${SophosAccessToken}` }});
            SophosPartnerID = PartnerID.data.id;
        }

        if (!SophosPartnerID)
            logger.Error("Sophos API Failed!", "SOPHOS");
    }

    // logging for Sophos API Error INIT
    logger.Info("Sophos API Init!", "SOPHOS");
}

async function GetSites(force) {
    // Check if local cache exists
    if (!force && await fs.IsFile("sites.mxd", fs.FileTypes.Agents)) {
        GetSites(true);
        return JSON.parse(await fs.ReadFile("sites.mxd", fs.FileTypes.Agents)).sites;
    }

    // Make sure API is Initialized
    await Init();

    // Create Tenants and Sites array to hold Sophos Data
    const tenants = [];
    const sites = [];

    // Loop through all Sophos API calls to get tenants
    await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants?page=1&pageSize=100&pageTotal=true`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
        .then(async doc => {
            for (let i = 1; i <= doc.data.pages.total; i++) {
                await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants?page=${i}&pageSize=100&pageTotal=true`, 
                { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
                    .then(doc => { tenants.push(doc.data.items) })
                    .catch(err => {});
            }
        })
        .catch(err => console.log(err))

    if (!tenants.length) {
        logger.Error("Failed to retrieve tenants!", "SOPHOS");
        return [];
    }
    // Apply a filter to the tenants for non valid names (Change to a Admin mapping page in future)
    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i]) {
            for (let j = 0; j < tenants[i].length; j++) {
                if (tenants[i][j].name && !tenants[i][j].name.includes("ZZZ") && !tenants[i][j].name.includes("XX") && !tenants[i][j].name.includes("null")) {
                    sites.push(tenants[i][j]);
                }
            }
        }
    }
    
    // Sort the sites alphebetical and remove duplicates
    sites.sort((a, b) => a.name.localeCompare(b.name));
    sitesUniq = sites.filter((item, pos, self) => {
        if (self[pos + 1]) {
            return self[pos].name != self[pos + 1].name;
        } else {
            return true;
        }
    })

    // Return all data and sort before res.send
    fs.WriteFile("sites.mxd", JSON.stringify({ sites: sitesUniq }), fs.FileTypes.Agents);
    return sitesUniq;
}

async function GetDevices(site) {
    // Make sure API is Initialized
    await Init();
    
    // Create Tenants and Sites array to hold Sophos Data
    const deviceInfo = [];
    let tenants = [];
    let tenant;

    // Check if local cache exists
    if (!(await fs.IsFile("sites.mxd", fs.FileTypes.Agents))) {
        // Loop through all Sophos API calls to get tenants
        await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants?page=1&pageSize=100&pageTotal=true`, 
            { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
            .then(async doc => {
                for (let i = 1; i <= doc.data.pages.total; i++) {
                    await axios.get(`${process.env.SOPHOS_API_URL}/partner/v1/tenants?page=${i}&pageSize=100&pageTotal=true`, 
                    { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Partner-ID": SophosPartnerID }})
                        .then(doc => { tenants.push(doc.data.items) })
                        .catch(err => {});
                }
            })
            .catch(err => console.log(err))

        if (!tenants.length) {
            logger.Error("Failed to retrieve tenants!", "SOPHOS");
            return [];
        }
        // Apply a filter to the tenants for non valid names (Change to a Admin mapping page in future)
        for (let i = 0; i < tenants.length; i++) {
            if (tenants[i]) {
                for (let j = 0; j < tenants[i].length; j++) {
                    if (tenants[i][j].name === site) {
                        tenant = tenants[i][j];
                    }
                }
            }
        }
    } else {
        // Retrieve sites list from local cache
        tenants = JSON.parse(await fs.ReadFile("sites.mxd", fs.FileTypes.Agents)).sites;

        // Apply a filter to the tenants for non valid names (Change to a Admin mapping page in future)
        for (let i = 0; i < tenants.length; i++) {
            if (tenants[i].name === site) {
                tenant = tenants[i];
            }
        }
    }

    if (!tenant) {
        logger.Warn(`Tenant for ${site} was not found!`, "SOPHOS");
        return [];
    }
    tenant.devices = await axios.get(`${tenant.apiHost}/endpoint/v1/endpoints?view=full`, 
        { headers: { Authorization: `Bearer ${SophosAccessToken}`, "X-Tenant-ID": tenant.id }});

    tenant.devices = tenant.devices.data.items;

    for (let i = 0; i < tenant.devices.length; i++) {
        tenant.devices[i].hostname = tenant.devices[i].hostname.toUpperCase().substring(0, 15);
        deviceInfo.push(tenant.devices[i]);
    }

    logger.Info(`Retrieved devices for ${site}!`, "SOPHOS");
    return deviceInfo.sort((a, b) => a.hostname.localeCompare(b.hostname));
}

exports.GetSites = GetSites;
exports.GetDevices = GetDevices;