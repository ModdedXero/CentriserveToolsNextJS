const axios = require("axios");

let DattoAccessToken;

async function Init() {
    while (!DattoAccessToken) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const Token = await axios.post(`${process.env.DATTO_API_URL}/auth/oauth/token`,
        `grant_type=password&username=${process.env.DATTO_CLIENT_KEY}&password=${process.env.DATTO_SECRET_KEY}`,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" }, auth: { username: "public-client", password: "public" }});

        DattoAccessToken = Token.data.access_token;
    }
}

async function GetDevices(siteName) {
    await Init();
    
    let tenant;
    let deviceInfo = [];

    let tenants = await axios.get(
        `${process.env.DATTO_API_URL}/api/v2/account/sites`, 
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }}
    );

    tenants = tenants.data.sites;

    if (!tenants || !tenants.length) return [];
    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i].name.toLowerCase().replace(/ /g, "") == siteName.toLowerCase().replace(/ /g, "")) {
            tenant = tenants[i];
            break;
        }
    }

    if (!tenant) {
        return [];
    }

    tenant.devices = await axios.get(`${process.env.DATTO_API_URL}/api/v2/site/${tenant.uid}/devices`,
        { headers: { Authorization: `Bearer ${DattoAccessToken}` }});

    tenant.devices = tenant.devices.data.devices;

    for (let i = 0; i < (tenant.devices ? tenant.devices.length : 0); i++) {
        tenant.devices[i].hostname = tenant.devices[i].hostname.toUpperCase();
        deviceInfo.push(tenant.devices[i]);
    }

    return deviceInfo.sort((a, b) => a.hostname.localeCompare(b.hostname));
}

exports.GetDevices = GetDevices;