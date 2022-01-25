import { Navbar, NavGroup, NavDropdown, NavLink } from "../navbar"

export default function SiteNavbar() {
    return (
        <Navbar zIndex={1000}>
            <NavGroup>
                <NavLink href="/">CSIT Tools</NavLink>
            </NavGroup>
            <NavGroup>
                <NavLink href="/">Home</NavLink>
                <NavDropdown label="Agents">
                    <NavLink href="/agents/chart">Chart</NavLink>
                    <NavLink href="/agents/report">Report</NavLink>
                </NavDropdown>
                <NavLink href="/downloads">Downloads</NavLink>
                <NavLink href="/inventory">Inventory</NavLink>
            </NavGroup>
            <NavGroup align="right">
                <NavLink href="/login">Login</NavLink>
            </NavGroup>
        </Navbar>
    )
}