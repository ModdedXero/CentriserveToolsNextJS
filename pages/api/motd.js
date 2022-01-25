import Motd from "../../models/motd";
import dbConnect from "../../lib/data/db_connector";

// Returns a message of the day from DB
export default async function handler(req, res) {
    await dbConnect();

    res.status(200).send("No message");
}