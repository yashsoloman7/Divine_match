import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const { loginWithGoogle, loginWithEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Get the return url from location state or default to '/'
    const from = location.state?.from?.pathname || "/";

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setError('');
        try {
            await loginWithGoogle(credentialResponse.credential);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Google Sign-In failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Login Failed. Please try again.');
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await loginWithEmail(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - var(--nav-height) - 100px)' }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2.5rem' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(155, 106, 56, 0.1)', marginBottom: '1rem' }}>
                        <Heart size={30} color="var(--primary)" fill="var(--primary)" />
                    </div>
                    <h2 className="heading-2" style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>Welcome to Divine Match</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Please sign in to access the portal.</p>
                </div>

                {error && <div style={{ background: 'rgba(211, 47, 47, 0.1)', color: 'var(--error)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleEmailSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isLoading}>
                        {isLoading ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: 'var(--text-light)' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(155, 106, 56, 0.2)' }}></div>
                    <span style={{ padding: '0 1rem', fontSize: '0.85rem' }}>or secure access via Google</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(155, 106, 56, 0.2)' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        shape="pill"
                        size="large"
                        width="300"
                    />
                </div>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '500' }}>Sign Up</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
