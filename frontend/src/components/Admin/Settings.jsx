import './Settings.css'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function Settings({admin, getAdmin}) {
    const [currentAdmin, setCurrentAdmin] = useState(admin);
    const [newName, setNewName] = useState(currentAdmin.username);
    const [newPass, setNewPass] = useState('');
    const [currPass, setCurrPass] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);

    const updateAdmin = async () => {
        try {
            const response = await axios.put(`/api/admins/update_admin/${admin.id}/`, {
                username: newName,
                password: newPass,
            })
            if (response === 200) {
                console.log("Admin updated successfully");
                alert("Admin settings updated successfully");
                getAdmin();
            }
        } catch (error) {
            console.error("Error updating admin:", error);
            alert("Failed to update admin settings. Please try again.");
        }

        if (isConfirming) {
            setIsConfirming(false);
            setCurrPass('');
        }
        setNewPass('');
        setNewName(newName || currentAdmin.username);
    }

    const checkPassword = async () => {
        try {
            if (currPass) {
                const response = await axios.post(`/api/auth/verify_admin_password/${currentAdmin.id}/`, {
                    currPass
                });
                
                if (response.status === 200) {
                    alert("Admin settings updated successfully");
                    updateAdmin();

                    setCurrPass('');
                    setIsConfirming(false);
                } else {
                    alert("Current password is incorrect. Please try again.");
                    return;
                }
            } else {
                alert("Please enter your current password to confirm changes.");
                return;
            }
        } catch(error) {
            console.error("Error confirming admin update:", error);
            alert("Failed to confirm admin update. Please try again.");
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
            <h1>Settings</h1>
            <div className='settings-content'>
                <input type='text' className='settings-username-input' 
                    onChange={(e) => setNewName(e.target.value)} value={newName} 
                    placeholder='new username'
                />
                <input type='password' className='settings-password-input' 
                    onChange={(e) => setNewPass(e.target.value)} value={newPass}
                    placeholder='new password'
                />
                <div className='show-password-container'>
                    <input type='checkbox' className='show-password-checkbox' onChange={() => {
                        const passwordInput = document.querySelector('.settings-password-input');
                        passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
                    }}/>
                    <label className='show-password-label'>Show Password</label>
                </div>
                <button className='settings-update-button' onClick={() => setIsConfirming(true)}>Save</button>
            </div>
            <AnimatePresence>
                {isConfirming && (
                    <div className='settings-modal-overlay'>
                        <div className='settings-modal-content'>
                            <h2>Confirmation</h2>
                            <p>Enter your current password to confirm changes.</p>
                            <input type='password' className='confirm-password-input' 
                                onChange={(e) => setCurrPass(e.target.value)} value={currPass}
                                placeholder='password'
                            />
                            <div className='show-password-container'>
                                <input type='checkbox' className='show-password-checkbox' onChange={() => {
                                    const passwordInput = document.querySelector('.confirm-password-input');
                                    passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
                                }}/>
                                <label className='show-password-label'>Show Password</label>
                            </div>
                            <div className='settings-modal-buttons'>
                                <button className='settings-modal-confirm-button' onClick={() => checkPassword()}
                                > Confirm </button>
                                <button className='settings-modal-cancel-button' onClick={() => {
                                    setIsConfirming(false);
                                    setCurrPass('');
                                    setNewPass('');
                                    setNewName(currentAdmin.username);
                                }}> Cancel </button>
                            </div>
                        </div>
                        
                    </div>
                )}
            </AnimatePresence>
        </motion-div>
    )
}

export default Settings;