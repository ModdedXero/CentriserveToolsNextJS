import { DeleteCategory } from "../../../../lib/data/warehouse";

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        res.status(500).send("Route invalid");
        return;
    }

    const { name } = req.query;
    
    const result = await DeleteCategory(name);
    if (!result) res.status(201).send("Failed to delete category");
    else res.status(200).send("Category deleted");
}