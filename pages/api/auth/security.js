import { ValidateSecurity } from "../../../lib/data/auth";

export default async function handler(req, res) {
    const { username, security } = req.body;
    const result = await ValidateSecurity(username, security);

    if (result !== -1) res.status(200).send(result);
    else res.status(201).send("Failed to get security for user");
}