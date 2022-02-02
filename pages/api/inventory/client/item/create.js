import { AddItem } from "../../../../../lib/data/warehouse";

export default async function handler(req, res) {
    const { item, location, category } = req.body;

    const result = await AddItem(item, location, category);
    if (!result) res.status(201).send("Failed to create item");
    else res.status(200).send("Created item");
}