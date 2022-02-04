import { CheckoutItems } from "../../../lib/data/warehouse";

export default async function handler(req, res) {
    const { location, cart, reason, ticket, username } = req.body;

    const result = await CheckoutItems(location, cart, reason, ticket, username);
    res.status(200).send("Test");
}