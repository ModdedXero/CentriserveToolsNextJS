const SophosAPI = require("../../../lib/data/sophos_api");

export default async function handler(req, res) {
    await SophosAPI.EnableTamperProtection(req.body.id, req.body.tenantId);
    res.status(200).send("Tamper protection enabled!");
}