import Inventory from "../../models/inventory";
import dbConnect from "./db_connector";

/* Locations */

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

/* Categories */

export async function GetCategories() {
    await dbConnect();

    const location = await Inventory.find();

    // Mongoose contains _id Object, converting object to string for NextJS getServerSideProps
    return JSON.parse(JSON.stringify(location[0].categories));
}

export async function CreateCategory(category) {
    await dbConnect();

    const locations = await Inventory.find();
    if (!locations.length || locations[0].categories.filter(e => e.name === category).length) return false;

    for (let i = 0; i < locations.length; i++) {
        locations[i].categories.push({ name: category });
    }

    for await (const loc of locations) {
        await loc.save();
    }

    return true;
}

export async function DeleteCategory(category) {
    await dbConnect();

    const locations = await Inventory.find();
    if (!locations.length) return false;

    for (let i = 0; i < locations.length; i++) {
        for (let j = 0; j < locations[i].categories.length; j++) {
            if (locations[i].categories[j].name === category) {
                locations[i].categories.splice(j, 1);
            }
        }
    }

    for await (const loc of locations) {
        await loc.save();
    }

    return true;
}