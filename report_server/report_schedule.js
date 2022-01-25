const fs = require("../lib/file_saver");

const ReportGenerator = require("./report_gen");

async function Initialize() {
    setInterval(async () => {
        Reports.forEach(async (rep) => {
            await GenerateReport(() => rep.generator(), rep.title);
        })
    }, 60 * 60 * 1000);

    Reports.forEach(async (rep) => {
        await GenerateReport(() => rep.generator(), rep.title);
    })
}

async function GenerateReport(repGen, title) {
    const wb = await repGen();
    await wb.xlsx.writeBuffer()
        .then(async data => {
            await fs.WriteFile(`${title}.xlsx`, data, fs.FileTypes.Report);
        })
}

const Reports = [
    {
        title: "Test Report Check",
        generator: () => {return ReportGenerator.GetTestCheck()}
    },
    {
        title: "All Sites Tamper Protection Check",
        generator: () => {return ReportGenerator.GetSitesTamperProtectionCheck()}
    },
    {
        title: "All Sites Agent Comparison",
        generator: () => {return ReportGenerator.GenAllSitesAgentComparison()},
    },
    {
        title: "All Sites Error Agent Comparison",
        generator: () => {return ReportGenerator.GetSiteErrorAgentComparison()}
    }
]

exports.Initialize = Initialize;