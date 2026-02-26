import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--surface-alt)',
            padding: '4rem 2rem 2rem',
            textAlign: 'center',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h3 className="heading-3" style={{ color: 'var(--primary-light)', fontFamily: 'var(--font-serif)' }}>
                    Divine Match
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
                    Uniting souls in Christ. Find your eternal partner and join our annual Yuvak Yuvti Sammelan.
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Divine Match Christian Matrimony. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
