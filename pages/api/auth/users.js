import { UserList } from "../../../lib/data/auth";

export async function getUserList() {
    return await JSON.parse(JSON.stringify(await UserList()));
}

export default async function handler(req, res) {
    const users = await getUserList();

    res.status(200).send(users);
}