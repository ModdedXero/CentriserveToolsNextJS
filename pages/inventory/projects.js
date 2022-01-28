import { SecureComponent } from "../../components/built/context";
import SiteNavbar from "../../components/built/site_navbar";
import InventoryNavbar from "../../components/built/inventory_navbar";
import styles from "../../styles/inventory.module.css";

export default function InventoryPage() {
    return (
        <SecureComponent>
            <SiteNavbar />
            <div className={styles.mx_inventory_wrapper}>
                <InventoryNavbar />
                <div className={styles.mx_inventory_page}>
                    <div className={styles.mx_inventory_input}>
                        
                    </div>
                    Projects
                </div>
            </div>
        </SecureComponent>
    )
}