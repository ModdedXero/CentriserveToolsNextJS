import { UpdateLocation } from "../../../../lib/data/warehouse";

export default async function handler(req, res) {
    const { oldLoc, newLoc } = req.body;
    
    const result = await UpdateLocation(oldLoc, newLoc);
    if (!result) res.status(201).send("Failed to update location");
    else res.status(200).send("Location updated");
}