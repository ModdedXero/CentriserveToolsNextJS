import { ValidateHash } from "../../../lib/data/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(500).send("Route invalid");
        return;
    }

    const { email, hash } = req.body;

    const result = await ValidateHash(email, hash);

    if (!result) res.status(400).send("User not validated");
    else res.status(200).send("User validated");
}