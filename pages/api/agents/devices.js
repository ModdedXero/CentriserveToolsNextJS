const SophosAPI = require("../../../lib/sophos_api");
const DattoAPI = require("../../../lib/datto_api");

// Retrieve Devices from Sophos and Datto and create comparison
export default async function handler(req, res) {
    const sophosDevices = await SophosAPI.GetDevices(req.body.site);
    const dattoDevices = await DattoAPI.GetDevices(req.body.site);

    res.status(200).json({
        dattoCount: dattoDevices ? dattoDevices.length : 0,
        sophosCount: sophosDevices ? sophosDevices.length : 0,
        comparison: GenerateComputerList(dattoDevices, sophosDevices)
    });
}

// Parse Datto and Sophos devices and create comparison
function GenerateComputerList(dattoDevices, sophosDevices) {
    const length = (sophosDevices ? sophosDevices.length : 0) + (dattoDevices ? dattoDevices.length : 0);
    let deviceList = [];

    for (let i = 0; i < length; i++) {
      if (sophosDevices[i] && dattoDevices[i]) {
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
        if (sophosDevices[i] && !dattoDevices[i]) {
          deviceList.push({ isEqual: false, datto: "", sophos: sophosDevices[i] });
        } else if (!sophosDevices[i] && dattoDevices[i]) {
          deviceList.push({ isEqual: false, datto: dattoDevices[i], sophos: "" });
        } else {
          return deviceList;
        }
      }
    }

    return deviceList;
}

// Compare string alphebetically
function strcmp(a, b) {
    if (a === b) return 0;
    if (a > b) return 1;
    return -1;
}