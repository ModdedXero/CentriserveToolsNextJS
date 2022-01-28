import { DeleteLocation } from "../../../../lib/data/warehouse";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        res.status(500).send("Route invalid");
        return;
    }

    const { name } = req.query;
    
    const result = await DeleteLocation(name);
    if (!result) res.status(201).send("Failed to delete location");
    else res.status(200).send("Location deleted");
}