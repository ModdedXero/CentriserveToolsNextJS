import { GetLocations } from "../../../lib/data/warehouse";

export async function parseLocations() {
    const locations = await GetLocations();
    const retLocations = [];
    for (const loc of locations) retLocations.push(loc.name);

    return retLocations;
}

export default async function handler(req, res) {
    const locations = await parseLocations();

    res.status(200).send(locations);
}