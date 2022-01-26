import { IncomingForm } from "formidable";
import FileStore from "../../../lib/data/file_store";

export const config = {
    api: {
        bodyParser: false
    }
}

export default async function handler(req, res) {
    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm({ maxFileSize: 3 * 1024 * 1024 * 1024 });
        
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })

    try {
        if (!data.files || Object.keys(data.files).length === 0) {
            return res.status(400).send("No Files were uploaded");
        }
    
        for (const [key, value] of Object.entries(data.files)) {
            await FileStore.SaveFile(data.files[key], data.fields.path);
        }
    } catch (err) {
        console.log(err)
    }

    res.status(200).send("File saved!");
}