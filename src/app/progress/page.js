'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentProgressPage() {
    const router = useRouter();
    const [studentId, setStudentId] = useState('');
    const [enrollments, setEnrollments] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (!role) router.push('/login');
    }, [router]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentId.trim()) return;
        setLoading(true); setError(''); setSearched(true);
        try {
            const res = await fetch(`/api/students/progress?studentId=${studentId.trim()}`);
            const data = await res.json();
            if (data.success) setEnrollments(data.data);
            else setError(data.error || 'Failed to retrieve progress data.');
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const completedCount = enrollments.filter(e => e.PROGRESS_PERCENTAGE >= 100 || e.STATUS === 'completed').length;
    const avgProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((s, e) => s + (e.PROGRESS_PERCENTAGE || 0), 0) / enrollments.length)
        : 0;

    return (
        <div style={{ minHeight: '100vh' }}>
            <nav className="cc-nav" style={{ padding: '0 32px' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                        }}>🎓</div>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>CourseConnect</span>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => router.push('/')}>← Dashboard</button>
                </div>
            </nav>

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: '#ecfdf5', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '22px', border: '1px solid #a7f3d0'
                        }}>🎓</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }} className="gradient-text">
                            Student Progress
                        </h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                        Track enrollment completion and course performance
                    </p>
                </div>

                {/* Search Card */}
                <div style={{
                    background: '#fff', borderRadius: '16px', border: '1.5px solid #e0e7ff',
                    padding: '28px', marginBottom: '32px',
                    boxShadow: '0 4px 16px rgba(79,70,229,0.07)'
                }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label className="cc-label">Student ID</label>
                            <input
                                type="text"
                                placeholder="e.g., S001"
                                value={studentId}
                                onChange={e => setStudentId(e.target.value)}
                                className="cc-input"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                            {loading ? (
                                <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                            ) : '🔍 View Progress'}
                        </button>
                    </form>
                </div>

                {error && <div className="alert-error fade-in" style={{ marginBottom: '24px' }}>⚠️ {error}</div>}

                {/* Stats row */}
                {!loading && searched && enrollments.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                        <div className="stat-card" style={{ padding: '20px' }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.75, margin: '0 0 8px 0' }}>Enrolled</p>
                                <p style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>{enrollments.length}</p>
                            </div>
                        </div>
                        <div className="stat-card stat-card-emerald" style={{ padding: '20px' }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.75, margin: '0 0 8px 0' }}>Completed</p>
                                <p style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>{completedCount}</p>
                            </div>
                        </div>
                        <div style={{
                            background: '#fff', borderRadius: '16px', padding: '20px',
                            border: '1.5px solid #e0e7ff', boxShadow: '0 4px 12px rgba(79,70,229,0.08)'
                        }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 8px 0' }}>Avg Progress</p>
                            <p style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 8px 0' }} className="gradient-text">{avgProgress}%</p>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${avgProgress}%` }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Enrollment Cards */}
                {!loading && searched && (
                    <>
                        {enrollments.length === 0 ? (
                            <div className="cc-card" style={{ padding: '60px', textAlign: 'center' }}>
                                <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</p>
                                <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No enrollments found</p>
                                <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Student ID: <strong>{studentId}</strong></p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                {enrollments.map((en, idx) => {
                                    const pct = en.PROGRESS_PERCENTAGE || 0;
                                    const done = pct >= 100 || en.STATUS === 'completed';
                                    return (
                                        <div key={idx} className="cc-card fade-in-up" style={{ padding: '22px', animationDelay: `${idx * 60}ms` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#111827', lineHeight: 1.4, flex: 1, paddingRight: '12px' }}>
                                                    {en.TITLE}
                                                </h3>
                                                <span className={`badge ${done ? 'badge-emerald' : 'badge-indigo'}`} style={{ flexShrink: 0 }}>
                                                    {done ? '✓ Done' : en.STATUS}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                                                {en.CATEGORY}
                                            </p>
                                            <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>Course Progress</span>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: done ? '#059669' : '#4f46e5' }}>{pct}%</span>
                                            </div>
                                            <div className="progress-track">
                                                <div
                                                    className={`progress-fill ${done ? 'progress-fill-emerald' : ''}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {en.ENROLLMENT_ID}</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>Rs. {Number(en.PRICE).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
