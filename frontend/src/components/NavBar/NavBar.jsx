import './NavBar.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className='navbar'>
            <button
                type='button'
                className='navbar-toggle'
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((isOpen) => !isOpen)}
            >
                <span />
                <span />
                <span />
            </button>
            <div className={`navbar-menu${menuOpen ? ' navbar-menu-open' : ''}`}>
                <Link to='/' className='navbar-link' onClick={closeMenu}>Home</Link>
                <Link to='/discover' className='navbar-link' onClick={closeMenu}>Discover</Link>
                <Link to='/search' className='navbar-link' onClick={closeMenu}>Search</Link>
                <Link to='/services' className='navbar-link' onClick={closeMenu}>Services</Link>
                <Link to='/admin' className='navbar-link' onClick={closeMenu}>Admin</Link>
            </div>
        </nav>
    );
}

export default NavBar;