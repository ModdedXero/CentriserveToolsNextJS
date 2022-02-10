const axios = require("axios");
const logger = require("../logger");

let DattoAccessToken;

async function Init() {
    if (DattoAccessToken) return;

    while (!DattoAccessToken) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const Token = await axios.post(`${process.env.DATTO_API_URL}/auth/oauth/token`,
        `grant_type=password&username=${process.env.DATTO_CLIENT_KEY}&password=${process.env.DATTO_SECRET_KEY}`,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" }, auth: { username: "public-client", password: "public" }});

        DattoAccessToken = Token.data.access_token;

        if (!DattoAccessToken)
            logger.Error("Datto API Failed!", "DATTO");
    }

    logger.Info("Datto API Init!", "DATTO");
}

async function GetDevices(site) {
    // TODO: Creat a Cache for devices at each site

    // Make sure API is Initialized
    await Init();
    
    let tenant;
    let deviceInfo = [];

    // Get Sites from Datto API
    let tenants = await axios.get(
        `${process.env.DATTO_API_URL}/api/v2/account/sites`, 
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }}
    );

    tenants = tenants.data.sites;

    // Check tenants for selected site
    if (!tenants || !tenants.length) {
        logger.Error("Failed to retrieve tenants!", "DATTO");
        return [];
    }
    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name.toLowerCase().replace(/ /g, "") == site.toLowerCase().replace("lpdg - ", "").replace(/ /g, "")) {
            tenant = tenants[i];
            break;
        }
    }

    if (!tenant) {
        logger.Warn(`Tenant for ${site} was not found!`, "DATTO");
        return [];
    }

    // Retrieve devices for selected tenant
    tenant.devices = await axios.get(`${process.env.DATTO_API_URL}/api/v2/site/${tenant.uid}/devices`,
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }});

    tenant.devices = tenant.devices.data.devices;

    // Filter devices into return array
    for (let i = 0; i < (tenant.devices ? tenant.devices.length : 0); i++) {
        tenant.devices[i].hostname = tenant.devices[i].hostname.toUpperCase();
        deviceInfo.push(tenant.devices[i]);
    }

    logger.Info(`Retrieved devices for ${site}!`, "DATTO");
    return deviceInfo.sort((a, b) => a.hostname.localeCompare(b.hostname));
}

exports.GetDevices = GetDevices;