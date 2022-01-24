import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function SiteNavbar() {
    const [isNavTop, setNavTop] = useState(true);

    useEffect(() => {
        window.onscroll = () => {
            if (window.scrollY === 0) setNavTop(true);
            else setNavTop(false);
        }
    });

    return (
        <Navbar className={`${!isNavTop ? "navbar-shrink" : ""}`} id="mainNav" variant="light" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand href="#home">CSIT Tools</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <NavDropdown title="Agents" id="agentsDropdownNav">
                        <NavDropdown.Item href="#chart">Chart</NavDropdown.Item>
                        <NavDropdown.Item href="#reports">Reports</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#downloads">Downloads</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}