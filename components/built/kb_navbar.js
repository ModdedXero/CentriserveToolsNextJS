import { useState } from "react";

import { Navbar, NavGroup, NavDropdown, NavLink } from "../navbar"
import Button from "../button";
import Select from "../select";

export default function KBNavbar() {
    const [query, setQuery] = useState();

    return (
        <Navbar zIndex={1000}>
            <NavGroup align={"center"}>
                <Select
                    width="40vw"
                    options={[]}
                    getQuery={setQuery}
                />
                <Button>Search</Button>
            </NavGroup>
        </Navbar>
    )
}