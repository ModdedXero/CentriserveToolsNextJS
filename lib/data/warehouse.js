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

    if (isLocation) return false;

    const newLocation = new Inventory({ name: name });
    await newLocation.save();

    return true;
}

export async function UpdateLocation(oldLoc, newLoc) {
    await dbConnect();

    const location = await Inventory.findOne({ name: oldLoc });
    if (!location) return false;

    location.name = newLoc;
    await location.save();
    
    return true;
}

export async function DeleteLocation(name) {
    await dbConnect();

    const location = await Inventory.findOneAndDelete({ name: name });
    if (!location) return false;

    return true;
}