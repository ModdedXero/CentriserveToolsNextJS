const fs = require("./file_saver");

async function Info(str, type = "GLOBAL") {
    const data = `[Info][${getTime()}][${type}] : ${str}`;
    console.log(data);
    await writeToFile("info.log", data);
}

async function Warn(str, type = "GLOBAL") {
    const data = `[Warn][${getTime()}][${type}] : ${str}`;
    console.log(data);
    await writeToFile("warn.log", data);
}

async function Error(str, type = "GLOBAL") {
    const data = `[Error][${getTime()}][${type}] : ${str}`;
    console.log(data);
    await writeToFile("error.log", data);
}

async function writeToFile(log, data) {
    await fs.AppendFile(log, data + "\n", fs.FileTypes.Logs);
}

function getTime() {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
}

exports.Info = Info;
exports.Warn = Warn;
exports.Error = Error;