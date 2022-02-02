import { GetLocation } from "../../../../lib/data/warehouse";

export default async function handler(req, res) {
    const { location } = req.body;
    
    const result = await GetLocation(location);
    if (!result) res.status(201).send("Failed to find location");
    else res.status(200).send(result);
}