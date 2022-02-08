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
    const categories = await GetCategories();

    const newLocation = new Inventory({ name: name, categories: [] });
    for (const cat of categories) {
        newLocation.categories.push({ name: cat.name, unique: cat.unique, itemNames: cat.itemNames, customFields: cat.customFields });
    }

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
    return location[0] ? JSON.parse(JSON.stringify(location[0].categories)) : [];
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

export async function UpdateCategory(oldCat, newCat) {
    await dbConnect();

    const locations = await Inventory.find();
    if (!locations.length) return false;

    for (let i = 0; i < locations.length; i++) {
        for (let j = 0; j < locations[i].categories.length; j++) {
            if (locations[i].categories[j].name === oldCat.name) {
                locations[i].categories[j] = newCat;
            }
        }
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

/* Client */

export async function GetLocation(location) {
    await dbConnect();

    const loc = await Inventory.findOne({ name: location });

    return loc;
}

export async function AddItem(item, location, category) {
    await dbConnect();

    const loc = await Inventory.findOne({ name: location });
    
    let catIndex = -1;
    for (let i = 0; i < loc.categories.length; i++) {
        if (loc.categories[i].name === category) {
            catIndex = i;
            break;
        }
    }
    if (catIndex === -1) return false;

    let itemHandled = false;
    for (let i = 0; i < loc.categories[catIndex].items.length; i++) {
        if (loc.categories[catIndex].unique){
            if (loc.categories[catIndex].items[i].name === item.name) {
                loc.categories[catIndex].items[i].subItems.push(item);
                loc.categories[catIndex].items[i].amount += 1;
                itemHandled = true;
                break;
            }
        } else {
            if (loc.categories[catIndex].items[i].name === item.name) {
                loc.categories[catIndex].items[i].amount += item.amount;
                itemHandled = true;
                break;
            }
        }
    }
    
    if (!itemHandled) {
        const index = loc.categories[catIndex].items.push(item)
        if (loc.categories[catIndex].unique) {
            loc.categories[catIndex].items[index - 1].subItems.push(item);
        }
    }

    await loc.save();

    return true;
}

export async function UpdateItem(location, category, oldItem, newItem) {
    await dbConnect();

    const loc = await Inventory.findOne({ name: location });
    if (!loc) return false;

    let catIndex = -1;
    for (let i = 0; i < loc.categories.length; i++) {
        if (loc.categories[i].name === category) {
            catIndex = i;
            break;
        }
    }
    if (catIndex === -1) return false;

    for (let i = 0; i < loc.categories[catIndex].items.length; i++) {
        if (loc.categories[catIndex].items[i].name === oldItem.name) {
            loc.categories[catIndex].items[i] = newItem;
        }
    }

    await loc.save();

    return true;
}

export async function CheckoutItems(location, cart, reason, ticket, username) {
    await dbConnect();

    const loc = await Inventory.findOne({ name: location });
    if (!loc) return false;
    
    loc.history.push({ username, ticket, items: cart, reason });
    // Loop through existing items and remove them
    for (const bag of cart) {
        for (let i = 0; i < loc.categories.length; i++) {
            if (bag.category === loc.categories[i].name) {

                for (const item of bag.items) {
                    if (loc.categories[i].unique) {
                        for (let j = 0; j < loc.categories[i].items.length; j++) {
                            if (loc.categories[i].items[j].name === item.name) {
                                for (let k = 0; k < loc.categories[i].items[j].subItems.length; k++) {
                                    if (loc.categories[i].items[j].subItems[k].serial === item.serial) {
                                        loc.categories[i].items[j].subItems.splice(k, 1);
                                        break;
                                    }
                                }

                                if (loc.categories[i].items[j].subItems.length <= 0) {
                                    loc.categories[i].items.splice(j, 1);
                                }
                            }
                        }
                    } else {
                        for (let j = 0; j < loc.categories[i].items.length; j++) {
                            if (loc.categories[i].items[j].name === item.name) {
                                loc.categories[i].items[j].amount -= item.amount;
                            }

                            if (loc.categories[i].items[j].amount <= 0) {
                                loc.categories[i].items.splice(j, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    await loc.save();
    return true;
}