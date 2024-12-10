import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <>
            <div className={styles.navContainer}>
                <div className={styles.leftside}>
                    <div className={styles.actTrackContainer}>
                        <h1>Act-Track</h1>
                    </div>
                    <div className={styles.pageContainer}>
                        <div className={styles.myProjects}>
                            <Link to="/ongoing" className={styles.Link}>Ongoing</Link>
                        </div>
                        <div className={styles.myAccount}>
                            <Link to="/completed" className={styles.Link}>Completed</Link>
                        </div>
                        <div className={styles.myAccount}>
                            <Link to="/myaccount" className={styles.Link}>My Account</Link>
                        </div>
                        <div className={styles.logout}>
                            <Link to="/" className={styles.Link}>Logout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Navbar;
