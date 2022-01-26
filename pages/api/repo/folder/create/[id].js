import FileStore from "../../../lib/data/file_store";

export default async function handler(req, res) {
    const result = await FileStore.CreateFolder(req.body.folderName, req.body.path);

    if (!result) {
        res.status(200).send("Folder created!");
    } else {
        res.status(400).send("Folder failed to save!");
    }
}