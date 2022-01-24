import Link from "next/link";

import styles from "../styles/navbar.module.css";

export default function SiteNavbar() {
    return (
        <nav className={styles.mx_navbar}>
            <ul className={styles.mx_navbar_container}>
                <li className={styles.mx_navbar_group}>
                    <Link href="/">CSIT Tools</Link>
                </li>
                <li className={styles.mx_navbar_group}>
                    <Link href="/">Home</Link>
                    <div className={styles.mx_navbar_dropdown}>
                        <button></button>
                        <div>

                        </div>
                    </div>
                    <Link href="/downloads">Downloads</Link>
                    <Link href="/inventory">Inventory</Link>
                </li>
                <li className={styles.mx_navbar_group + " right"}>
                    <Link href="/login">Login</Link>
                </li>
            </ul>
        </nav>
    )
}