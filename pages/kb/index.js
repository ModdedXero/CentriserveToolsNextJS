import KBNavbar from "../../components/built/kb_navbar";
import SiteNavbar from "../../components/built/site_navbar";

import styles from "../../styles/kb.module.css";

export default function KnowledgeBase() {
    return (
        <div className="page-container">
            <SiteNavbar />
            <div className={styles.mx_kb}>
                <KBNavbar />
                <div className={styles.mx_kb_body}>

                </div>
            </div>
        </div>
    )
}