const axios = require("axios");

let SophosAccessToken;
let SophosPartnerID;

async function Init() {
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
    }

    console.log("Sophos API Init!");
}

async function GetSites() {
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

    // Apply a filter to the tenants for non valid names (Change to a Admin mapping page in future)
    for (let i = 0; i < tenants.length; i++) {
        if (tenants[i]) {
            for (let j = 0; j < tenants[i].length; j++) {
                if (tenants[i][j].name && !tenants[i][j].name.includes("ZZZ") && !tenants[i][j].name.includes("XX") && !tenants[i][j].name.includes("null")) {
                    sites.push(tenants[i][j].name);
                }
            }
        }
    }
    
    // Sort the sites alphebetical and remove duplicates
    sites.sort((a, b) => a.localeCompare(b));
    sitesUniq = sites.filter((item, pos, self) => {
        if (self[pos + 1]) {
            return self[pos] != self[pos + 1];
        } else {
            return true;
        }
    })

    return sitesUniq;
}

exports.GetSites = GetSites;