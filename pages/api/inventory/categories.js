import { GetCategories } from "../../../lib/data/warehouse";

export async function parseCategories() {
    const categories = await GetCategories();
    return categories;
}

export default async function handler(req, res) {
    const categories = await GetCategories();
    
    res.status(200).send(categories);
}