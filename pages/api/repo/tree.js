import FileStore from "../../../lib/data/file_store";

export default async function handler(req, res) {
    const index = await FileStore.GetRepoFileTree();
    res.status(200).send(index);
}