import Router from "next/router";

import Button from "../button";
import { Navbar, NavGroup, NavDropdown, NavLink } from "../navbar"
import { useAuth } from "./context";

export default function SiteNavbar() {
    const { currentUser, Logout } = useAuth();

    return (
        <Navbar zIndex={1000}>
            <NavGroup>
                <NavLink href="/">CSIT Tools</NavLink>
            </NavGroup>
            <NavGroup>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/agents">Agents</NavLink>
                <NavLink href="/downloads">Downloads</NavLink>
                <NavLink href="/inventory">Inventory</NavLink>
            </NavGroup>
            <NavGroup align="right">
                {!currentUser && 
                <Button onClick={_ => Router.push("/login")}>Login</Button>}
                {currentUser && 
                <Button onClick={Logout}>Logout</Button>}
            </NavGroup>
        </Navbar>
    )
}