import './Panel.css';
import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import NotBar from '../NotBar/NotBar';
import ManageTickets from './ManageTickets';
import AddExperience from './AddExperience';
import ManageExperiences from './ManageExperiences';
import Settings from './Settings';

function Panel({currentAdmin, getAdmin}) {
    const [admin, setAdmin] = useState(currentAdmin);
    const [action, setAction] = useState("Requests");
    const [inSettings, setInSettings] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [notification, setNotification] = useState(false);
    const [notDetails, setNotDetails] = useState({});

    const fetchExperiences = async () => {
        try {
            const res = await axios.get('/api/experiences/fetch_experiences/');
            setExperiences(res.data);
        } catch (e) {
            console.error("Error fetching experiences:", e);
        }
    };

    useEffect(() => {
        fetchExperiences();
        getAdmin();
        setAdmin(currentAdmin);
    }, [])

    const logout = async () => {
        try {
            setAdmin(null);
            await axios.get('/api/auth/logout/');
            getAdmin();
        } catch (error) {
            console.error("Logout failed:", error);
            setNotDetails({message: "Logout failed. Please try again.", status: "error"});
            setNotification(true);
        }
    }

    return (
        currentAdmin ? (
            <div className='Panel'>
                {notification && <NotBar message={notDetails.message} status={notDetails.status} setNotification={setNotification} setNotDetails={setNotDetails}/>}
                <NavBar/>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1, scale: 0 }}
                    transition={{ duration: 0.8 }}
                    className='panel-page'
                >
                    <h1>Admin Panel</h1>
                    <div className='panel-container'>
                        <div className='panel-content'>
                            <div className='panel-content-header'>
                                {admin && admin.username ? (
                                    <h2>Welcome {admin.username}</h2>
                                ) : (
                                    <h2>Loging out</h2>
                                )}
                                <button className='panel-settings-button' onClick={inSettings ? () => setInSettings(false) : () => setInSettings(true)}>{inSettings ? (<>Menu</>) : (<>Settings</>)}</button>
                                <button className='logout-button' onClick={logout}>Logout</button>
                            </div>
                            {inSettings ? (
                                <div className='panel-settings'>
                                    <Settings admin={admin} getAdmin={getAdmin}/>
                                </div>
                            ) : (
                                <>
                                    <div className='panel-content-actions'>
                                        <button className={action === "Requests" ? 'selected-panel-action-button' : 'panel-action-button'} onClick={() => setAction("Requests")}>Requests</button>
                                        <button className={action === "addExperience" ? 'selected-panel-action-button' : 'panel-action-button'} onClick={() => setAction("addExperience")}>Add Experience</button>
                                        <button className={action === "manageExperiences" ? 'selected-panel-action-button' : 'panel-action-button'} onClick={() => setAction("manageExperiences")}>Manage Experiences</button>
                                    </div>
                                    <div className='data-table'>
                                        {action === "Requests" && <ManageTickets experiences={experiences} fetchExperiences={fetchExperiences}/>}
                                        {action === "addExperience" && <AddExperience experiences={experiences} fetchExperiences={fetchExperiences}/>}
                                        {action === "manageExperiences" && <ManageExperiences experiences={experiences} fetchExperiences={fetchExperiences}/>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>) : (
            <div>
                <h1>Admin not fetched</h1>
            </div>
        )

    );
}

export default Panel;