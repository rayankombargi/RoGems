import './NotBar.css';
import { useState, useEffect } from 'react';
import react from 'react';

function NotBar({message, status, setNotification, setNotDetails}) {

    const [secondsElapsed, setSecondsElapsed] = useState(5);

    useEffect(() => {
        if (secondsElapsed <= 0) {
            setNotification(false);
            setNotDetails({});
            return;
        }
        const timeout = setTimeout(() => {
            setSecondsElapsed(secondsElapsed - 1);
        }, 1000);
    }, [secondsElapsed])
    return (
        status === 'error' ?  (
            <div className='notbar-error'>
                <div className='notbar-message'>{message}</div>
            </div>
        ) :  (
            <div className='notbar-success'>
                <div className='notbar-message'>{message}</div>
                <audio src={require('../Sounds/Notification.mp3')} autoPlay />
            </div>
        )
    );
}

export default NotBar;