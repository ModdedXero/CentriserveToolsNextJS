import FileStore from "../../../lib/data/file_store";

export default async function handler(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No Files were uploaded");
    }

    for (const [key, value] of Object.entries(req.files)) {
        await FileStore.SaveFile(req.files[key], req.body.path);
    }

    res.status(200).send("File saved!");
}