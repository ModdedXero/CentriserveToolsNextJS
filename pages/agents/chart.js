import axios from "axios"
import { useEffect, useState } from "react";

import { Navbar, NavGroup } from "../../components/navbar";
import Select from "../../components/select";
import SiteNavbar from "../../components/built/site_navbar";
import { Table, TableBody, TableHead, TableHCell } from "../../components/table";

export default function Chart({ sites }) {
    const [selectedSite, setSelectedSite] = useState();
    
    const [filter, setFilter] = useState("All Devices");
    const [computers, setComputers] = useState({});

    async function SelectSite(e) {
        setSelectedSite(e);
        setComputers({});

        const resData = await axios.post(`/api/agents/devices`, { site: e });

        const newSite = {};
        newSite.sophosCount = resData.data.sophosCount;
        newSite.dattoCount = resData.data.dattoCount;
        newSite.comparison = resData.data.comparison;

        setComputers(newSite);
    }

    return (
        <div className="page-container">
            <SiteNavbar />
            <div className="page-wrapper">
            <Navbar>
                <NavGroup>
                    <Select 
                        options={sites} 
                        onChange={i => SelectSite(i)} 
                        width="400px"
                    />
                </NavGroup>
                <NavGroup>
                    <Select 
                        defaultValue="All Devices"
                        options={[ "All Devices", "Error Devices", "Stable Devices" ]} 
                        onChange={i => setFilter(i)}
                        width="180px"
                    />
                </NavGroup>
                <NavGroup>
                    <Button>Download Agent</Button>
                    <Button>Refresh Site</Button>
                    <Button disabled>
                        Computer Count: {computers.comparison && computers.comparison.length}
                    </Button>
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
                            return <ChartTable key={index} device={comp} filter={filter} />
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

import { getSites } from "../api/agents/sites";
import ChartTable from "../../components/pages/chart_table";
import Button from "../../components/button";

export async function getStaticProps({ params }) {
    const req = await getSites();

    return {
        props: { sites: req }
    }
}