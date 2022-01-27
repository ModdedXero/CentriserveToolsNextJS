import { signOut, useSession } from "next-auth/react";

import Button from "../button";
import { Navbar, NavGroup, NavDropdown, NavLink } from "../navbar"

export default function SiteNavbar() {
    const { data: session } = useSession();

    console
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
                {!session && <NavLink href="/login">Login</NavLink>}
                {session && <Button onClick={signOut}>Logout</Button>}
            </NavGroup>
        </Navbar>
    )
}