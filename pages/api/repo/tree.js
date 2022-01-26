import FileStore from "../../../lib/data/file_store";

export async function getRepoTree() {
    const tree = await FileStore.GetRepoFileTree();
    return tree;
}

export default async function handler(req, res) {
    const tree = await getRepoTree();
    res.status(200).send(tree);
}