import './NavBar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {

    return (
        <nav className='navbar'>
            <Link to='/' className='navbar-home'>Home</Link>
            <Link to='/discover' className='navbar-discover'>Discover</Link>
            <Link to='/services' className='navbar-services'>Services</Link>
        </nav>
    );
}

export default NavBar;