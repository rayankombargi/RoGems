import './Home.css';
import { useState, useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../NavBar/NavBar';

function Home() {
    const robloxImage = '/images/robloxImage.webp';
    const RoGems = '/images/RoGems.png';
    const navigate = useNavigate();
    const toDiscover = () => {
        navigate('/Discover');
    }
    const toSearch = () => {
        navigate('/Search');
    }
    const toServices = () => {
        navigate('/Services');
    }

    const [experiences, setExperiences] = useState([]);
    const fetchExperiences = async () => {
        try {
            const response = await fetch('/api/experiences/fetch_experiences/');
            if (response.status === 200) {
                const data = await response.json();
                setExperiences(data);
            } else {
                console.error('Failed to fetch experiences:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
    }

    const [requests, setRequests] = useState([]);
    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/requests/fetch_requests/');
            if (response.status === 200) {
                const data = await response.json();
                setRequests(data);
            } else {
                console.error('Failed to fetch requests:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    }

    useEffect(() => {
        fetchExperiences();
        fetchRequests();
    }, []);

    return (
        <div className='Home'>
            <NavBar />
            <div className='home-background'
                style={{
                    backgroundImage: `url(${robloxImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    position: 'relative',
                    minHeight: '92.5vh',
                    imageRendering: 'high-quality',
                }}
            >
                <div
                    className='home-content'
                >
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                        className='home-header'
                    >
                        <h1> Welcome to RoGems! </h1>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                        className='home-info-1'
                    >
                        <h1>📊 Project Overview 📊</h1>
                        <div className='stats-cards'>
                            <div className='stats-card'>
                                <h1> 🎮 {experiences.length} Total Experiences</h1>
                            </div>
                            <div className='stats-card'>
                                <h1> 📝 {requests.length} Current Requests</h1>
                            </div>
                            <div className='stats-card'>
                                <h1> ✅ 0 Approved Requests</h1>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                        className='home-info-2'
                    >
                        <h1>Get Started</h1>
                        <div className='navigation-cards'>
                            <div className='navigation-card' onClick={toDiscover}>
                                <h3>🎮 Discover 🎮</h3>
                                <p>Explore hidden experiences on the Roblox platform from amazing developers!</p>
                                <span className='card-action'>Explore Now →</span>
                            </div>
                            <div className='navigation-card' onClick={toSearch}>
                                <h3>🔎 Search 🔍</h3>
                                <p>Use advanced filters to find specific experiences that match your interests.</p>
                                <span className='card-action'>Search Now →</span>
                            </div>
                            <div className='navigation-card' onClick={toServices}>
                                <h3>📝 Services 📝</h3>
                                <p>Request experiences to be added to the platform or contact us for support.</p>
                                <span className='card-action'>Request Now →</span>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                        className='home-info-3'
                    >
                        <h1> What is RoGems?</h1>
                        <img src={RoGems} alt='RoGems Logo' className='home-rogems-image'/>
                        <div className='home-info-3-paragraph'>
                            <h2>RoGems is a nonprofit fan-made project with an aim of helping startup developers expose their experiences from the Roblox platform.</h2>
                            <h2>It is also made to bring attention to forgotten Roblox games from the 2010s era.</h2>
                            <h2>Users will be able to discover these new or hidden experiences.</h2>
                            <h2>Developers and Users can freely request to add them into this website's front page.</h2>
                            <h2>Independently developed by Rayan Kombargi.</h2>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                        className='home-info-4'
                    >
                        <h1>Copyright Disclaimer</h1>
                        <div className='home-info-4-paragraph'>
                            <h2> This website operates under the provisions of Section 107 of the U.S. Copyright Act, 
        which allows for the fair use of copyrighted material for purposes such as criticism, 
        comment, news reporting, teaching, scholarship, and research. The use of Roblox experience 
        data, images, and related content on this platform is intended solely for educational 
        purposes, creator and user support, and portfolio demonstration. This constitutes fair use as 
        it is transformative in nature, serves a nonprofit educational purpose, and aims to 
        benefit the Roblox community by providing exposure to lesser-known experiences. 
        All content belongs to their respective creators and Roblox Corporation. This project 
        is not affiliated with or endorsed by Roblox Corporation.</h2>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Home;