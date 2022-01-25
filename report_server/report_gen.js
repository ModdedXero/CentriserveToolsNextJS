const ExcelJS = require("exceljs");

const fs = require("../lib/file_saver");

const DattoData = require("./datto_api");
const SophosData = require("./sophos_api");

/* Report Generators */

async function GenAllSitesAgentComparison() {
    const workbook = new ExcelJS.Workbook();
  
    const sites = await SophosData.GetSites();
  
    for await (const siteName of sites) {
      await new Promise(resolve => setTimeout(resolve, 500))

      let sheet;

      try {
        sheet = workbook.addWorksheet(siteName.name.substring(0, 30).replace(/[.*+?^${}()|\/[\]\\]/g, ""));
      } catch {
        sheet = workbook.addWorksheet(siteName.name.substring(0, 29).replace(/[.*+?^${}()|\/[\]\\]/g, "") + "1");
      }

      sheet.columns = [
          { header: "Sophos", key: "sophos", width: 30 }, 
          { header: "Datto", key: "datto", width: 30}
      ];

      const dattoDevices = await DattoData.GetDevices(siteName.name);
      const sophosDevices = await SophosData.GetDevices(siteName.name);

      let deviceCompList = GenerateComputerList(dattoDevices, sophosDevices);
  
      deviceCompList.forEach((val) => {
          const row = sheet.addRow({ sophos: val.sophos.hostname, datto: val.datto.hostname });
          if (val.isEqual) {
            row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BAE7B5"} };
            row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BAE7B5"} };
        } else {
            row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
            row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
        }
      })
    }

    return workbook;
}

async function GenSiteAgentComparison(siteName) {
    const workbook = new ExcelJS.Workbook();
  
    const sheet = workbook.addWorksheet(siteName.name);
    sheet.columns = [
        { header: "Sophos", key: "sophos", width: 30 }, 
        { header: "Datto", key: "datto", width: 30}
    ];

    const dattoDevices = await DattoData.GetDevices(siteName.name);
    const sophosDevices = await SophosData.GetDevices(siteName.name);
  
    const deviceCompList = GenerateComputerList(dattoDevices, sophosDevices);
  
    deviceCompList.forEach((val) => {
      const row = sheet.addRow({ sophos: val.sophos.hostname, datto: val.datto.hostname });
      if (val.isEqual) {
        row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BAE7B5"} };
        row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BAE7B5"} };
      } else {
        row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
        row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
      }
    })
  
    return workbook;
}

async function GetSiteErrorAgentComparison() {
  const workbook = new ExcelJS.Workbook();

  const sites = await SophosData.GetSites();

  const sheet = workbook.addWorksheet("Error Devices");

  sheet.columns = [
    { header: "Sophos", key: "sophos", width: 30 }, 
    { header: "Datto", key: "datto", width: 30}
  ];
  
  for await (const siteName of sites) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const dattoDevices = await DattoData.GetDevices(siteName.name);
    const sophosDevices = await SophosData.GetDevices(siteName.name);

    let deviceCompList = GenerateComputerList(dattoDevices, sophosDevices);

    let filteredDevices = deviceCompList.filter(val => !val.isEqual);

    if (filteredDevices.length) {
      sheet.addRow({ sophos: ""});
      sheet.addRow({ sophos: siteName.name });
  
      filteredDevices.forEach((val) => {
          if (!val.isEqual) {
            const row = sheet.addRow({ sophos: val.sophos.hostname, datto: val.datto.hostname })
            row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
            row.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DDB0B1"} };
          }
      })
    }
  }

  return workbook;
}

async function GetSitesTamperProtectionCheck() {
  const workbook = new ExcelJS.Workbook();

  const sites = await SophosData.GetSites();

  const sheet = workbook.addWorksheet("Error Devices");

  sheet.columns = [
    { header: "Device", key: "sophos", width: 30 }, 
  ];
  
  for await (const siteName of sites) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const sophosDevices = await SophosData.GetDevices(siteName.name);

    let filteredDevices = sophosDevices.filter(val => !val.tamperProtectionEnabled);

    if (filteredDevices.length) {
      sheet.addRow({ sophos: ""});
      sheet.addRow({ sophos: siteName.name });
  
      filteredDevices.forEach((val) => {
        const row = sheet.addRow({ sophos: val.hostname })
        row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "c2b92b"} };
      })
    }
  }

  return workbook;
}

async function GetTestCheck() {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Test Sheet");

    sheet.columns = [
        { header: "Test", key: "testKey", width: 30 }
    ];

    sheet.addRow({ testKey: "Test Value" });

    return workbook;
}

/* General Functions */

// Method for comparing string alphabetical order
function strcmp(a, b) {
  if (a === b) return 0;
  if (a > b) return 1;
  return -1;
}

// Filters Datto and Sophos device arrays into comparison
function GenerateComputerList(dattoDevices, sophosDevices) {
  const length = () => {
    if (dattoDevices && sophosDevices) {
      return dattoDevices.length + sophosDevices.length;
    } else if (!dattoDevices) {
      return sophosDevices.length;
    } else {
      return dattoDevices.length;
    }
  };

  let deviceList = [];

  for (let i = 0; i < length(); i++) {
    if (sophosDevices && dattoDevices && sophosDevices[i] && dattoDevices[i]) {
      switch (strcmp(sophosDevices[i].hostname, dattoDevices[i].hostname)) {
        case 0: 
          deviceList.push({ isEqual: true, datto: dattoDevices[i], sophos: sophosDevices[i] });
          break;
        case -1:
          dattoDevices.splice(i, 0, "");
          deviceList.push({ isEqual: false, datto: "", sophos: sophosDevices[i] });
          break;
        case 1:
          sophosDevices.splice(i, 0, "")
          deviceList.push({ isEqual: false, datto: dattoDevices[i], sophos: "" });
          break;
        default:
          console.log("Error sorting devices!");
      }
    } else {
      if (!dattoDevices || (sophosDevices && sophosDevices[i] && !dattoDevices[i])) {
        deviceList.push({ isEqual: false, datto: "", sophos: sophosDevices[i] });
      } else if (!sophosDevices || (dattoDevices && !sophosDevices[i] && dattoDevices[i])) {
        deviceList.push({ isEqual: false, datto: dattoDevices[i], sophos: "" });
      } else {
        return deviceList;
      }
    }
  }

  return deviceList;
}



exports.GenSiteAgentComparison = GenSiteAgentComparison;
exports.GenAllSitesAgentComparison = GenAllSitesAgentComparison;
exports.GetSiteErrorAgentComparison = GetSiteErrorAgentComparison;
exports.GetSitesTamperProtectionCheck = GetSitesTamperProtectionCheck;
exports.GetTestCheck = GetTestCheck;