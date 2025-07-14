import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import Panel from './Panel';

function Admin() {
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
                alert("Your session has expired. Please log in again.");
                setIsAuthenticated(false);
                window.location.reload();
            } else {
                setIsAuthenticated(false);
            }
        }
    },[currentAdmin, isAuthenticated]);
    
    return (
        <div>
            {!currentAdmin ? (
                <Login getAdmin={getAdmin}/>
            ) : (
                <Panel currentAdmin={currentAdmin} getAdmin={getAdmin}/>
            )}
        </div>
    );
}

export default Admin;