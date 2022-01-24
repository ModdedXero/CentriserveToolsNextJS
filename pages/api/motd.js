import Motd from "../../models/motd";
import dbConnect from "../../lib/dbConnector";

export default async function handler(req, res) {
    await dbConnect();

    const message = await Motd.find();

    res.status(200).send(message[0].message || "No message");
}