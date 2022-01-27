import { Signup } from "../../../lib/data/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(500).send("Route invalid");
        return;
    }

    const { email, password } = req.body;

    const result = await Signup(email, password);
    if (result === 0x00) res.status(200).send("User created");
    else res.status(400).send("Failed to create user");
}