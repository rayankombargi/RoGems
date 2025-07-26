import './NavBar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {

    return (
        <nav className='navbar'>
            <Link to='/' className='navbar-link'>Home</Link>
            <Link to='/discover' className='navbar-link'>Discover</Link>
            <Link to='/search' className='navbar-link'>Search</Link>
            <Link to='/services' className='navbar-link'>Services</Link>
            <Link to='/admin' className='navbar-link'>Admin</Link>
        </nav>
    );
}

export default NavBar;