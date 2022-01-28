import axios from "axios";
import { useEffect, useState } from "react";

import {GlassButton as Button} from "../../button";
import { TableBCell, TableRow } from "../../table";

export default function ChartTable({ device, filter, refresh }) {
    const [currentDevice, setCurrentDevice] = useState(GenerateInfo(device, filter));

    useEffect(() => {
        setCurrentDevice(GenerateInfo(device, filter));
    }, [filter])

    function OpenDattoDevice() {
        if (device) window.open(device.datto.portalUrl);
    }

    async function EnableTamperProtection() {
        await axios.post("/api/agents/enabletamper", { id: device.sophos.id, tenantId: device.sophos.tenant.id })
            .then(_ => refresh())
    }

    if (!currentDevice) return null;
    return (
        <TableRow>
            <TableBCell>{currentDevice.hostname}</TableBCell>
            <TableBCell>{currentDevice.type}</TableBCell>
            <TableBCell>{currentDevice.platform}</TableBCell>
            <TableBCell>{currentDevice.lastLogin}</TableBCell>
            <TableBCell>{currentDevice.domain}</TableBCell>
            <TableBCell>{currentDevice.intIp}</TableBCell>
            <TableBCell>{currentDevice.extIp}</TableBCell>
            <TableBCell>{currentDevice.antivirus}</TableBCell>
            <TableBCell>  
                {currentDevice.dattoLink 
                ? <Button onClick={_ => OpenDattoDevice(currentDevice.dattoLink)}>
                    Installed
                </Button> 
                : "Not Installed"}
            </TableBCell>
            <TableBCell>{currentDevice.sophos}</TableBCell>
            <TableBCell>
                {currentDevice.tamper === "Disabled" 
                ? <Button onClick={EnableTamperProtection}>Disabled</Button>
                : currentDevice.tamper}
            </TableBCell>
        </TableRow>
    )
}

function GenerateInfo(device, filter) {
    let currentDevice = {
        hostname: "",
        type: "",
        platform: "",
        lastLogin: "",
        domain: "",
        intIp: "",
        extIp: "",
        antivirus: "",
        datto: "",
        tamper: "",
        sophos: "",
        dattoLink: ""
    }

    if (filter === "Stable Devices" && !device.isEqual) {
        return false;
    } else if (filter === "Error Devices" && device.isEqual) {
        return false;
    }

    if (device && device.datto) {
        currentDevice.hostname = device.datto.hostname;
        currentDevice.type = device.datto.deviceType.category;
        currentDevice.platform = device.datto.operatingSystem;
        currentDevice.lastLogin = device.datto.lastLoggedInUser;
        currentDevice.domain = device.datto.domain;
        currentDevice.intIp = device.datto.intIpAddress;
        currentDevice.extIp = device.datto.extIpAddress;
        currentDevice.antivirus = device.datto.antivirus ? device.datto.antivirus.antivirusProduct : "None";
        currentDevice.datto = "Installed"
        currentDevice.dattoLink = device.datto.portalUrl;
    } else if (device && device.sophos) {
        currentDevice.hostname = device.sophos.hostname;
        currentDevice.type = (device.sophos.os.isServer ? "Server" : "Desktop")
        currentDevice.platform = device.sophos.os.platform;
        currentDevice.lastLogin = device.sophos.associatedPerson ? device.sophos.associatedPerson.viaLogin : null;
        currentDevice.extIp = "Unavailable";
        currentDevice.intIp = device.sophos.ipv4Addresses[0];
        currentDevice.antivirus = "Sophos";
        currentDevice.datto = "Not Installed";
        currentDevice.domain = "Unavailable";
    }

    if (device && device.sophos) {
        currentDevice.tamper = device.sophos.tamperProtectionEnabled ? "Enabled" : "Disabled";
        currentDevice.sophos = "Installed";
    } else if (device && !device.sophos) {
        currentDevice.tamper = "Unavailable";
        currentDevice.sophos = "Not Installed";
    }

    return currentDevice;
}