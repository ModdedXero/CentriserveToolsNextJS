const fs = require("../../../../lib/file_saver");
const ExcelJS = require("exceljs");

export default async function handler(req, res) {
    const { report } = req.query;

    switch (report) {
        case "all-comparison":
            DownloadReport(res, "All Sites Agent Comparison");
            break;
        case "error-comparison":
            DownloadReport(res, "All Sites Error Agent Comparison");
            break;
        case "tamper-protection":
            DownloadReport(res, "All Sites Tamper Protection Check");
            break;
        case "test":
            DownloadReport(res, "Test Report Check");
            break;
        default:
            res.status(404).send("No reports found!");
    }
}

async function DownloadReport(res, repName) {
    const file = await fs.IsFile(repName + ".xlsx", fs.FileTypes.ReportServer);
    if (file) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.status(200);
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(`${fs.FileTypes.ReportServer}/${repName}.xlsx`);
        await wb.xlsx.write(res);
    } else {
        res.status(401).json({ response: "Failed to retrieve report!" });
    }
  }