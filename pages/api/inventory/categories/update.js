import { UpdateCategory } from "../../../../lib/data/warehouse";

export default async function handler(req, res) {
    const { oldCat, newCat } = req.body;
    
    const result = await UpdateCategory(oldCat, newCat);
    if (!result) res.status(201).send("Failed to update category");
    else res.status(200).send("Category updated");
}