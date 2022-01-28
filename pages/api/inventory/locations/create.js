import { CreateLocation } from "../../../../lib/data/warehouse";

export default async function handler(req, res) {
    const { name } = req.body;
    
    const result = await CreateLocation(name);
    if (!result) res.status(201).send("Failed to create location");
    else res.status(200).send("Location created");
}