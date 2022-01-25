const Blob = require("buffer").Blob;
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
            const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
            await blob.arrayBuffer()
                .then(async array => {
                    fs.WriteFile(`${title}.xlsx`, Buffer.from(array), fs.FileTypes.Report);
                })
            })
            .catch(err => console.log(err))
        }

const Reports = [
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