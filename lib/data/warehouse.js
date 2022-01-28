import Inventory from "../../models/inventory";
import dbConnect from "./db_connector";

export async function GetLocations() {
    await dbConnect();

    const locations = await Inventory.find();
    return locations;
}

export async function CreateLocation(name) {
    await dbConnect();

    const isLocation = await Inventory.findOne({ name: name });

    if (isLocation) return;

    const newLocation = new Inventory({ name: name });
    await newLocation.save();
}