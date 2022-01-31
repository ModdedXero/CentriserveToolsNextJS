import { CreateCategory } from "../../../../lib/data/warehouse";

export default async function handler(req, res) {
    const { name } = req.body;
    
    const result = await CreateCategory(name);
    if (!result) res.status(201).send("Failed to create category");
    else res.status(200).send("Category created");
}