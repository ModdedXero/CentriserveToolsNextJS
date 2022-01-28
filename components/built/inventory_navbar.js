import Router from "next/router";
import { Navbar, NavGroup } from "../../components/navbar";
import { GlassButton } from "../button";

export default function InventoryNavbar() {
    return (
        <Navbar vertical width="150px">
            <NavGroup>
                <GlassButton onClick={_ => Router.push("/inventory")} thick>
                    Dashboard
                </GlassButton>
            </NavGroup>
            <NavGroup>
                <GlassButton onClick={_ => Router.push("/inventory/inventory")} thick>
                    Inventory
                </GlassButton>
                <GlassButton onClick={_ => Router.push("/inventory/projects")} thick>
                    Projects
                </GlassButton>
            </NavGroup>
            <NavGroup align="final">
                <GlassButton onClick={_ => Router.push("/inventory/admin")} thick>
                    Admin
                </GlassButton>
            </NavGroup>
        </Navbar>
    )
}