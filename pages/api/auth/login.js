import { Login } from "../../../lib/data/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(500).send("Route invalid");
        return;
    }

    const { email, password } = req.body;

    const result = await Login(email, password);

    if (result === 0x01) res.status(400).send("User not found");
    else if (result === 0x02) res.status(401).send("Password is incorrect");
    else res.status(200).json(result);
}