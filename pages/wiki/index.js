import WikiNavbar from "../../components/built/kb_navbar";
import SiteNavbar from "../../components/built/site_navbar";

import styles from "../../styles/wiki.module.css";

export default function Wiki() {
    return (
        <div className="page-container">
            <SiteNavbar />
            <div className={styles.mx_wiki}>
                <WikiNavbar />
                <div className={styles.mx_wiki_body}>
                    
                </div>
            </div>
        </div>
    )
}