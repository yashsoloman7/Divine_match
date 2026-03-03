import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCandidates } from '../services/candidateService';
import { Users, LayoutDashboard, Sparkles, Filter } from 'lucide-react';

const AdminDashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStr, setFilterStr] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const data = await getCandidates();
            setCandidates(data);
            setLoading(false);
        };
        loadData();
    }, []);

    const calculateMatches = (candidate, all) => {
        return all
            .filter(c => c.id !== candidate.id && c.gender !== candidate.gender)
            .map(potential => {
                // Calculate common interests
                const commonInterests = candidate.interests.filter(i => potential.interests.includes(i));
                const score = commonInterests.length * 10;

                let ageDiff = Math.abs(candidate.age - potential.age);
                let ageBonus = ageDiff <= 5 ? 20 : (ageDiff <= 10 ? 10 : 0);

                // Final score (Interests weight more + age bonus)
                const totalScore = score + ageBonus;

                return {
                    match: potential,
                    score: totalScore,
                    commonInterests
                };
            })
            .filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score);
    };

    const runAnalysis = () => {
        // Generate matchmaking map for all candidates
        const analysisMap = candidates.map(c => ({
            candidate: c,
            topMatches: calculateMatches(c, candidates).slice(0, 3) // Top 3 matches
        }));
        setMatches(analysisMap);
    };

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading Admin Data...</div>;
    }

    const filteredMatches = matches.filter(m =>
        m.candidate.fullName.toLowerCase().includes(filterStr.toLowerCase()) ||
        m.candidate.status.toLowerCase().includes(filterStr.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <div>
                    <h2 className="heading-2" style={{ color: 'var(--primary-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <LayoutDashboard size={28} /> Admin Console
                    </h2>
                    <p className="text-lead" style={{ margin: 0 }}>System-wide operations and match analysis restricted to authorized admins.</p>
                    <Link to="/admin/add-candidate" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem 1rem' }}>
                        <Users size={16} /> Add New Candidate
                    </Link>
                </div>
                <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '1rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{candidates.length}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Candidates</div>
                </div>
            </div>

            {matches.length === 0 ? (
                <div className="glass-card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <Sparkles size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
                    <h3 className="heading-3">Run Match Analysis</h3>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Our algorithm will cross-reference all registered single, widowed, and divorced candidates
                        to find compatible pairs based on shared interests, age, and spiritual values.
                    </p>
                    <button onClick={runAnalysis} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        <Sparkles size={20} style={{ marginRight: '0.5rem' }} /> Execute Engine
                    </button>
                </div>
            ) : (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(155,106,56,0.2)' }}>
                            <Filter size={20} color="var(--text-light)" style={{ marginRight: '0.5rem' }} />
                            <input
                                type="text"
                                placeholder="Filter results by name or status..."
                                style={{ border: 'none', outline: 'none', width: '100%', font: 'inherit', color: 'var(--text-primary)' }}
                                value={filterStr}
                                onChange={(e) => setFilterStr(e.target.value)}
                            />
                        </div>
                        <button onClick={runAnalysis} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Sparkles size={18} /> Rerun Algorithm
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                        {filteredMatches.map(({ candidate, topMatches }, idx) => (
                            <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(155,106,56,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--primary-dark)', margin: 0 }}>{candidate.fullName}</h4>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                            {candidate.age} yrs &bull; {candidate.status} &bull; {candidate.gender}
                                        </div>
                                    </div>
                                    <span style={{ background: 'rgba(155,106,56,0.1)', color: 'var(--primary-dark)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        {topMatches.length} Matches Found
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {topMatches.map((m, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: i === 0 ? '3px solid var(--primary)' : '3px solid transparent' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{m.match.fullName} ({m.match.age})</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                    Shared: {m.commonInterests.join(', ')}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>{m.score}%</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Compatibility</div>
                                            </div>
                                        </div>
                                    ))}
                                    {topMatches.length === 0 && (
                                        <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '1rem' }}>
                                            No highly compatible matches found yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
