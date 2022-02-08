import Router from "next/router";
import { useEffect, useState } from "react";

import { Navbar, NavGroup } from "../../components/navbar";
import { GlassButton } from "../button";
import { useAuth } from "./context";

export default function InventoryNavbar() {
    const { ValidateSecurity } = useAuth();

    const [url, setUrl] = useState("");
    const [security, setSecurity] = useState();

    useEffect(() => {
        setUrl(window.location.pathname);

        async function getSecurity() {
            setSecurity(await ValidateSecurity("Inventory", 0));
        }

        getSecurity();
    }, [])

    return (
        <Navbar vertical width="150px">
            <NavGroup>
                <GlassButton selected={url === "/inventory"} onClick={_ => Router.push("/inventory")} thick>
                    Dashboard
                </GlassButton>
            </NavGroup>
            <NavGroup>
                <GlassButton selected={url === "/inventory/inventory"} onClick={_ => Router.push("/inventory/inventory")} thick>
                    Inventory
                </GlassButton>
                <GlassButton selected={url === "/inventory/projects"} onClick={_ => Router.push("/inventory/projects")} thick>
                    Projects
                </GlassButton>
            </NavGroup>
            {security >= 2 &&
            <NavGroup align="final">
                <GlassButton selected={url === "/inventory/admin"} onClick={_ => Router.push("/inventory/admin")} thick>
                    Admin
                </GlassButton>
            </NavGroup>}
        </Navbar>
    )
}