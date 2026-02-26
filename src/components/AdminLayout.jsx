import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, LogOut, Home, Heart, Shield } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active-admin-nav' : '';
    };

    const navItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem',
        borderRadius: 'var(--radius-sm)',
        color: 'white',
        textDecoration: 'none',
        transition: 'var(--transition)',
        opacity: 0.8,
    };

    const activeCss = `
    .admin-nav-item:hover {
      background-color: rgba(255,255,255,0.1);
    }
    .active-admin-nav {
      background-color: var(--primary-light) !important;
      opacity: 1 !important;
      font-weight: 500;
    }
  `;

    return (
        <>
            <style>{activeCss}</style>
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>

                {/* Sidebar */}
                <div style={{
                    width: '280px',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 100
                }}>
                    {/* Brand */}
                    <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                            <Heart size={24} fill="var(--primary)" color="var(--primary)" />
                            Divine Match
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <Link to="/admin" className={`admin-nav-item ${isActive('/admin')}`} style={navItemStyle}>
                            <LayoutDashboard size={20} /> Matchmaking Info
                        </Link>
                        <Link to="/admin/users" className={`admin-nav-item ${isActive('/admin/users')}`} style={navItemStyle}>
                            <Users size={20} /> Manage Candidates
                        </Link>
                        <Link to="/admin/events" className={`admin-nav-item ${isActive('/admin/events')}`} style={navItemStyle}>
                            <Calendar size={20} /> Event Registrations
                        </Link>
                        <Link to="/admin/hosts" className={`admin-nav-item ${isActive('/admin/hosts')}`} style={navItemStyle}>
                            <Shield size={20} /> Admins & Hosts
                        </Link>
                    </div>

                    {/* Footer / Profile */}
                    <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <img src={user?.avatar} alt="Admin" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                            <div>
                                <div style={{ fontWeight: 500 }}>{user?.name}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Administrator</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/" className="admin-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', opacity: 0.8, fontSize: '0.9rem', padding: '0.5rem', borderRadius: '4px' }}>
                                <Home size={16} /> Public Site
                            </Link>
                            <button className="admin-nav-item" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff8a80', width: '100%', textAlign: 'left', fontSize: '0.9rem', padding: '0.5rem', borderRadius: '4px' }}>
                                <LogOut size={16} /> Log Out System
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Workspace */}
                <div style={{ marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                    {/* Topbar */}
                    <div style={{
                        height: '70px',
                        backgroundColor: 'white',
                        borderBottom: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 2rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <h1 className="heading-3" style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.25rem' }}>
                            Control Panel Workspace
                        </h1>
                    </div>

                    {/* Dynamic Content */}
                    <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                        <Outlet />
                    </main>

                </div>
            </div>
        </>
    );
};

export default AdminLayout;
