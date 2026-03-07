import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ').filter(p => p.trim() !== '');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <nav className="navbar container">
            <Link to="/" className="logo">
                <Heart size={28} color="var(--primary)" fill="var(--primary)" />
                Divine Match
            </Link>

            <div className="nav-links">
                <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                <Link to="/events" className={`nav-link ${isActive('/events')}`}>Mega Events</Link>

                {user ? (
                    <>
                        {(!user.role || user.role === 'candidate' || user.role === 'user') && (
                            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>My Profile</Link>
                        )}
                        {user.role === 'guardian' && (
                            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>Host Profile</Link>
                        )}
                        {(user.role === 'admin' || user.role === 'host') && (
                            <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Admin</Link>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '2rem', borderLeft: '1px solid rgba(155, 106, 56, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} title={user.name}>
                                    {getInitials(user.name)}
                                </div>
                                <span style={{ fontWeight: 500, color: 'var(--primary-dark)', fontSize: '0.9rem' }}>{user.name}</span>
                            </div>
                            <button onClick={logout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem', paddingLeft: '2rem', borderLeft: '1px solid rgba(155, 106, 56, 0.2)' }}>
                        <Link to="/login" className="btn-outline" style={{ padding: '0.5rem 1.25rem' }}>Log In</Link>
                        <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
