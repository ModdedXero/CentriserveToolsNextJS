import axios from "axios"
import { useState } from "react";
import fileDownload from "js-file-download";

import { SecureComponent } from "../components/built/context";
import ChartTable from "../components/pages/agents/chart_table";
import SiteNavbar from "../components/built/site_navbar";
import { Navbar, NavGroup } from "../components/navbar";
import Select from "../components/select";
import Button from "../components/button";
import { Dropdown, DropdownItem } from "../components/dropdown";
import { Table, TableBody, TableHead, TableHCell } from "../components/table";

export default function Agents({ sites }) {
    // Current Selected Site to display
    const [selectedSite, setSelectedSite] = useState();
    
    // States set when a site is selected
    const [filter, setFilter] = useState("All Devices");
    const [computers, setComputers] = useState({});
    const [dattoAgentLink, setDattoAgentLink] = useState();

    async function SelectSite(e) {
        setSelectedSite(e);
        setComputers({});
        setDattoAgentLink(null);

        const resData = await axios.post(`/api/agents/devices/${e}`);

        const newSite = {};
        newSite.sophosCount = resData.data.sophosCount;
        newSite.dattoCount = resData.data.dattoCount;
        newSite.comparison = resData.data.comparison;

        newSite.comparison.some((comp) => {
            if (comp.datto) {
                setDattoAgentLink(comp.datto.siteUid);
                return true;
            }
        });

        setComputers(newSite);
    }

    // Opens window with Datto Agent download for selected site
    function DownloadAgent() {
        if (dattoAgentLink)
            window.open(`https://zinfandel.centrastage.net/csm/profile/downloadAgent/${dattoAgentLink}`);
    }

    // Refresh the devices for the selected site
    function RefreshSite() {
        SelectSite(selectedSite);
    }

    async function DownloadReport(url, title) {
        await axios.get(`/api/agents/reports/${url}`, { responseType: "blob" })
            .then(res => {
                fileDownload(res.data, `${title}.xlsx`)
            })
    }

    return (
        <SecureComponent>
            <SiteNavbar />
            <div className="page-wrapper">
                <Navbar>
                    <NavGroup>
                        <Select 
                            options={sites} 
                            onChange={i => SelectSite(i.value)} 
                            width="calc(30vw)"
                        />
                    </NavGroup>
                    <NavGroup>
                        <Select 
                            defaultValue="All Devices"
                            options={[ "All Devices", "Error Devices", "Stable Devices" ]} 
                            onChange={i => setFilter(i.value)}
                            width="180px"
                        />
                    </NavGroup>
                    <NavGroup>
                        <Button onClick={_ => DownloadAgent()}>
                            Download Agent
                        </Button>
                        <Button onClick={_ => RefreshSite()}>
                            Refresh Site
                        </Button>
                        <Button disabled>
                            Computers: {computers.comparison && computers.comparison.length}
                        </Button>
                        <Dropdown label="Download Report">
                            <DropdownItem
                                onClick={_ => DownloadReport("all-comparison", "All Sites Agent Comparison")}
                            >
                                Agent Comparison
                            </DropdownItem>
                            <DropdownItem
                                onClick={_ => DownloadReport("error-comparison", "All Sites Error Agent Comparison")}
                            >
                                Error Agent Comparison
                            </DropdownItem>
                            <DropdownItem
                                onClick={_ => DownloadReport("tamper-protection", "All Sites Tamper Protection Check")}

                            >
                                Tamper Protection Check
                            </DropdownItem>
                        </Dropdown>
                    </NavGroup>
                </Navbar>
                <Table>
                    <TableHead>
                        <TableHCell>Hostname</TableHCell>
                        <TableHCell>Type</TableHCell>
                        <TableHCell>Platform</TableHCell>
                        <TableHCell>Last User</TableHCell>
                        <TableHCell>Domain</TableHCell>
                        <TableHCell>Internal IP</TableHCell>
                        <TableHCell>External IP</TableHCell>
                        <TableHCell>Antivirus</TableHCell>
                        <TableHCell>Datto</TableHCell>
                        <TableHCell>Sophos Portal</TableHCell>
                        <TableHCell>Tamper Protection</TableHCell>
                    </TableHead>
                    <TableBody>
                        {computers.comparison &&
                        computers.comparison.map((comp, index) => {
                            return <ChartTable key={index} device={comp} filter={filter} refresh={RefreshSite} />
                        })}
                    </TableBody>
                </Table>
            </div>
        </SecureComponent>
    )
}

import { getSites } from "../pages/api/agents/sites";

export async function getStaticProps({ params }) {
    const req = await getSites();

    return {
        props: { sites: req }
    }
}