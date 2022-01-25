import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import styles from "../styles/navbar.module.css";

export function Navbar({ children, zIndex }) {
    const [sticky, setSticky] = useState();
    const navRef = useRef();

    useEffect(() => {
        console.log(navRef.current.getBoundingClientRect())
        setSticky(navRef.current.getBoundingClientRect().top);
    }, [])

    return (
        <nav ref={navRef} className={styles.mx_navbar} style={{ 
            zIndex: zIndex, top: sticky
        }}>
            <div className={styles.mx_navbar_container}>
                {children}
            </div>
        </nav>
    )
}

export function NavGroup({ children, align }) {
    let className;

    switch (align) {
        case "right":
            className = styles.mx_navbar_group_right;
            break;
        default:
            className = styles.mx_navbar_group;
    }

    return (
        <div className={className}>
            {children}
        </div>
    )
}

export function NavDropdown({ label, children }) {
    return (
        <div className={styles.mx_navbar_dropdown}>
            <button>{label}</button>
            <div>
                {children}
            </div>
        </div>
    )
}

export function NavLink({ href, children }) {
    return <Link href={href}>{children}</Link>
}