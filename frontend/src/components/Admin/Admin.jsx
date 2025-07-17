import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import Panel from './Panel';
import NotBar  from '../NotBar/NotBar';

function Admin() {
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionTime, setSessionTime] = useState(20);
    const [notification, setNotification] = useState(false);
    const [notDetails, setNotDetails] = useState({});

    const getAdmin = async () => {
        try {
            const response = await axios.get('/api/admins/get_current_admin/');
            setCurrentAdmin(response.data);
        } catch (error) {
            setCurrentAdmin(null);
        }
    };
    useEffect(() => {
        getAdmin();
        if (currentAdmin) {
            if (!isAuthenticated) {
                setIsAuthenticated(true);
            }
        } else {
            if (isAuthenticated) {
                setNotDetails({ message: "Your session has expired. Please log in again.", status: "error" });
                setNotification(true);
                setIsAuthenticated(false);
                window.location.reload();
            } else {
                setIsAuthenticated(false);
            }
        }
    },[currentAdmin, isAuthenticated]);
    
    return (
        <div>
            {notification && <NotBar message={notDetails.message} status={notDetails.status} setNotification={setNotification} setNotDetails={setNotDetails}/>}
            {!currentAdmin ? (
                <Login getAdmin={getAdmin} isAuthenticated={isAuthenticated} sessionTime={sessionTime} setSessionTime={setSessionTime}/>
            ) : (
                <Panel currentAdmin={currentAdmin} getAdmin={getAdmin}/>
            )}
        </div>
    );
}

export default Admin;