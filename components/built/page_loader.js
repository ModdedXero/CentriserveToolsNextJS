
import { ImSpinner5 } from 'react-icons/im';

import styles from "../../styles/loader.module.css";

export default function PageLoader() {
    return (
        <div className="page-container">
            <div className={styles.mx_loader}>
                <ImSpinner5 className='animate-spin' />
                <p>Loading...</p>
            </div>
        </div>
    );
}