import { UpdateItem } from "../../../../../lib/data/warehouse";

export default async function handler(req, res) {
    const { newItem, oldItem, location, category } = req.body;

    const result = await UpdateItem(location, category, oldItem, newItem);
    if (!result) res.status(201).send("Failed to edit item");
    else res.status(200).send("Edited item");
}