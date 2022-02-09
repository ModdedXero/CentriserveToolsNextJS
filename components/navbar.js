import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import styles from "../styles/navbar.module.css";

export function Navbar({ children, zIndex, top=0, vertical=false, width }) {
    const [sticky, setSticky] = useState();
    const navRef = useRef();

    useEffect(() => {
        setSticky(top || navRef.current.getBoundingClientRect().top);
    }, [])

    if (vertical) {
        return (
            <nav ref={navRef} className={styles.mx_navbar_vertical} style={{ 
                zIndex: zIndex, width: width
            }}>
                <div className={styles.mx_navbar_container_vertical}>
                    {children}
                </div>
            </nav>
        )
    }

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
            className = styles.mx_navbar_group_final;
            break;
        case "final":
            className = styles.mx_navbar_group_final;
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

export function NavLink({ href, children, ...props}) {
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl("/" + window.location.pathname.split("/")[1]);
    }, [])

    return (
        <div className={styles.mx_navbar_link} {...props}>
            {(url === href) && <p>{children}</p>}
            {(url !== href) &&<Link href={href}>{children}</Link>}
        </div>
    )
}