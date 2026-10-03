import './Settings.css'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import NotBar from '../NotBar/NotBar';
import Loading from '../Loading/Loading';

function Settings({admin, getAdmin}) {
    const [currentAdmin, setCurrentAdmin] = useState(admin);
    const [newName, setNewName] = useState(currentAdmin.username);
    const [newPass, setNewPass] = useState('');
    const [newPassConfirm, setNewPassConfirm] = useState('');
    const [currPass, setCurrPass] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [notification, setNotification] = useState(false);
    const [notDetails, setNotDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.querySelector('button[type="submit"]')?.click();
        }
    }

    const updateAdmin = async () => {
        try {
            const response = await axios.put(`/api/admins/update_admin/${admin.id}/`, {
                username: newName,
                password: newPass,
            })
            if (response === 200) {
                console.log("Admin updated successfully");
                setNotDetails({ message: "Admin settings updated successfully", status: "success" });
                setNotification(true);
                getAdmin();
            }
        } catch (error) {
            console.error("Error updating admin:", error);
            setNotDetails({ message: "Failed to update admin settings", status: "error" });
            setNotification(true);
        }

        if (isConfirming) {
            setIsConfirming(false);
            setCurrPass('');
        }
        setNewPass('');
        setNewPassConfirm('');
        setNewName(newName || currentAdmin.username);
    }

    const checkPassword = async () => {
        setLoading(true);
        try {
            if (currPass) {
                const response = await axios.post(`/api/auth/verify_admin_password/${currentAdmin.id}/`, {
                    currPass
                });
                
                if (response.status === 200) {
                    if (newPass !== newPassConfirm) {
                        setNotDetails({ message: "New password and confirmation do not match", status: "error" });
                        setNotification(true);
                        return;
                    }
                    setNotDetails({ message: "Admin settings updated successfully", status: "success" });
                    setNotification(true);
                    await updateAdmin();

                    setCurrPass('');
                    setIsConfirming(false);
                } else {
                    setNotDetails({ message: "Current password is incorrect", status: "error" });
                    setNotification(true);
                    return;
                }
            } else {
                setNotDetails({ message: "Please enter your current password to confirm changes", status: "error"});
                setNotification(true);
                return;
            }
        } catch(error) {
            console.error("Error confirming admin update:", error);
            setNotDetails({ message: "Failed to confirm admin update", status: "error" });
            setNotification(true);
        } finally {
            setLoading(false);
        }
    }



    return (
        <motion-div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1, scale: 0 }}
            transition={{ duration: 0.8 }}   
            className='panel-settings'
        >
            {loading && <Loading />}
            {notification && <NotBar message={notDetails.message} status={notDetails.status} setNotification={setNotification} setNotDetails={setNotDetails}/>}
            <h1>Settings</h1>
                <form className='settings-content' onSubmit={(event) => {
                    event.preventDefault();
                    setIsConfirming(true);
                }} onKeyDown={handleEnterKey}>
                <input type='text' className='settings-username-input' 
                    onChange={(e) => setNewName(e.target.value)} value={newName} 
                    placeholder='new username'
                />
                <input type='password' className='new-password-input' 
                    onChange={(e) => setNewPass(e.target.value)} value={newPass}
                    placeholder='new password'
                />
                <input type='password' className='confirm-password-input' 
                    onChange={(e) => setNewPassConfirm(e.target.value)} value={newPassConfirm}
                    placeholder='Confirme new password'
                />
                <div className='show-password-container'>
                    <input type='checkbox' className='show-password-checkbox' onChange={() => {
                        const newPassInput = document.querySelector('.new-password-input');
                        newPassInput.type = (newPassInput.type === 'password') ? 'text' : 'password';

                        const confirmPassInput = document.querySelector('.confirm-password-input');
                        confirmPassInput.type = (confirmPassInput.type === 'password') ? 'text' : 'password';
                    }}/>
                    <label className='show-password-label'>Show Password</label>
                </div>
                <button type='submit' className='settings-update-button'>Save</button>
            </form>
            <AnimatePresence>
                {isConfirming && (
                    <div className='settings-modal-overlay'>
                        <form className='settings-modal-content' onSubmit={(event) => {
                            event.preventDefault();
                            checkPassword();
                        }} onKeyDown={handleEnterKey}>
                            <h2>Confirmation</h2>
                            <p>Enter your current password to confirm changes.</p>
                            <input type='password' className='verify-password-input' 
                                onChange={(e) => setCurrPass(e.target.value)} value={currPass}
                                placeholder='password'
                            />
                            <div className='show-password-container'>
                                <input type='checkbox' className='show-password-checkbox' onChange={() => {
                                    const passwordInput = document.querySelector('.verify-password-input');
                                    passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
                                }}/>
                                <label className='show-password-label'>Show Password</label>
                            </div>
                            <div className='settings-modal-buttons'>
                                <button type='submit' className='settings-modal-confirm-button'
                                > Confirm </button>
                                <button type='button' className='settings-modal-cancel-button' onClick={() => {
                                    setIsConfirming(false);
                                    setCurrPass('');
                                    setNewPass('');
                                    setNewPassConfirm('');
                                    setNewName(currentAdmin.username);
                                }}> Cancel </button>
                            </div>
                        </form>
                        
                    </div>
                )}
            </AnimatePresence>
        </motion-div>
    )
}

export default Settings;