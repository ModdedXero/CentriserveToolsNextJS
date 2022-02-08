import { UpdateUser } from "../../../lib/data/auth";

export default async function handler(req, res) {
    const { username, user } = req.body;
    const result = await UpdateUser(username, user);

    if (result) res.status(200).send("User updated");
    else res.status(201).send("User failed to update");
}