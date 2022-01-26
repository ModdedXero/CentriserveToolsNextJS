import FileStore from "../../../../lib/data/file_store";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "5gb"
        }
    }
}

export default async function handler(req, res) {
    const { id } = req.query;
    FileStore.DownloadFile(res, id);
}