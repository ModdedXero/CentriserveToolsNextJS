import Motd from "../../models/motd";
import dbConnect from "../../lib/db_connector";

export default async function handler(req, res) {
    await dbConnect();

    res.status(200).send("No message");
}