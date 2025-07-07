import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import Panel from './Panel';

function Admin() {
    const [currentAdmin, setCurrentAdmin] = useState(null);
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
    },[]);
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