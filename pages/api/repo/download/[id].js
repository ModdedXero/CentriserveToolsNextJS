import FileStore from "../../../../lib/data/file_store";

export default async function handler(req, res) {
    const { id } = req.query;
    FileStore.DownloadFile(res, id);
}