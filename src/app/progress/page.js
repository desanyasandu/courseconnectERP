'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const IconCap = ({ size = '16px' }) => (
    <svg style={{ width: size, height: size }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
    </svg>
);

const IconArrowLeft = () => (
    <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const IconSearch = () => (
    <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
    </svg>
);

const IconCheck = () => (
    <svg style={{ width: '13px', height: '13px', display: 'inline-block', marginRight: '4px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const IconReport = () => (
    <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

function ProgressUpdater({ enrollmentId, initialProgress, onUpdated }) {
    const [progress, setProgress] = useState(initialProgress);
    const [updating, setUpdating] = useState(false);
    const [showSlider, setShowSlider] = useState(false);

    useEffect(() => {
        setProgress(initialProgress);
    }, [initialProgress]);

    const handleSave = async () => {
        setUpdating(true);
        try {
            const res = await fetch('/api/enrollments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enrollment_id: enrollmentId, progress_percentage: progress })
            });
            const data = await res.json();
            if (data.success) {
                onUpdated(progress);
                setShowSlider(false);
            }
        } catch (err) {
            console.error("Failed to update progress", err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div style={{ marginTop: '14px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
            {!showSlider ? (
                <button
                    onClick={() => setShowSlider(true)}
                    className="btn btn-ghost btn-sm"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '6px 12px' }}
                >
                    ⚙️ Update Progress
                </button>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4b5563' }}>Adjust Progress:</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5' }}>{progress}%</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#4f46e5', cursor: 'pointer' }}
                        />
                        <button
                            onClick={handleSave}
                            disabled={updating}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                        >
                            {updating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={() => { setShowSlider(false); setProgress(initialProgress); }}
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function StudentProgressPage() {
    const router = useRouter();
    const [studentId, setStudentId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [enrollments, setEnrollments] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [allProgress, setAllProgress] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const uid = localStorage.getItem('userId');
        if (!role) {
            router.push('/login');
            return;
        }
        setUserRole(role);
        
        if (role === 'student' && uid) {
            setStudentId(uid);
            setLoading(true); setError(''); setSearched(true);
            fetch(`/api/students/progress?studentId=${uid}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setEnrollments(data.data);
                    else setError(data.error || 'Failed to retrieve progress data.');
                })
                .catch(() => setError('Connection error. Please try again.'))
                .finally(() => setLoading(false));
        }

        // Fetch all registered students and their global progress if lecturer/admin
        if (role === 'lecturer' || role === 'admin') {
            fetch('/api/students/list')
                .then(res => res.json())
                .then(data => {
                    if (data.success) setAllStudents(data.data);
                })
                .catch(console.error);

            fetch('/api/students/progress/all')
                .then(res => res.json())
                .then(data => {
                    if (data.success) setAllProgress(data.data);
                })
                .catch(console.error);
        }
    }, [router]);

    const triggerSearch = async (targetId) => {
        setLoading(true); setError(''); setSearched(true);
        try {
            const res = await fetch(`/api/students/progress?studentId=${targetId}`);
            const data = await res.json();
            if (data.success) setEnrollments(data.data);
            else setError(data.error || 'Failed to retrieve progress data.');
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!studentId.trim()) return;
        await triggerSearch(studentId.trim());
    };

    const completedCount = enrollments.filter(e => e.PROGRESS_PERCENTAGE >= 100 || e.STATUS === 'completed').length;
    const avgProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((s, e) => s + (e.PROGRESS_PERCENTAGE || 0), 0) / enrollments.length)
        : 0;

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Navbar */}
            <nav className="cc-nav" style={{ padding: '0 32px' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                            src="/logo.png" 
                            alt="Logo" 
                            style={{
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.15)'
                            }}
                        />
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>CourseConnect</span>
                    </div>
                    <button className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} onClick={() => router.push('/')}>
                        <IconArrowLeft />
                        Dashboard
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: '#ecfdf5', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#059669', border: '1px solid #a7f3d0'
                        }}>
                            <IconCap size="20px" />
                        </div>
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
                    {userRole !== 'student' && allStudents.length > 0 && (
                        <div style={{ marginBottom: '20px', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '20px' }}>
                            <label className="cc-label" style={{ display: 'block', marginBottom: '8px', color: '#4f46e5', fontWeight: 700 }}>
                                Select Student from Directory
                            </label>
                            <select
                                className="cc-input cc-select"
                                value={studentId}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setStudentId(val);
                                    if (val) {
                                        triggerSearch(val);
                                    }
                                }}
                            >
                                <option value="">— Select a registered student —</option>
                                {allStudents.map(s => (
                                    <option key={s.STUDENT_ID} value={s.STUDENT_ID}>
                                        {s.FIRST_NAME} {s.LAST_NAME} (Username: {s.USERNAME} | Student ID: {s.STUDENT_ID})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
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
                                readOnly={userRole === 'student'}
                                style={userRole === 'student' ? { background: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' } : {}}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {loading ? (
                                <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                            ) : (
                                <>
                                    <IconSearch />
                                    View Progress
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="alert-error fade-in" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        {error}
                    </div>
                )}

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
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    background: '#f1f5f9', color: '#64748b', marginBottom: '16px'
                                }}>
                                    <IconReport />
                                </div>
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
                                                <span className={`badge ${done ? 'badge-emerald' : 'badge-indigo'}`} style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
                                                    {done && <IconCheck />}
                                                    {done ? 'Done' : en.STATUS}
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
                                            <ProgressUpdater
                                                enrollmentId={en.ENROLLMENT_ID}
                                                initialProgress={pct}
                                                onUpdated={(newProgress) => {
                                                    setEnrollments(prev =>
                                                        prev.map(item =>
                                                            item.ENROLLMENT_ID === en.ENROLLMENT_ID
                                                                ? { ...item, PROGRESS_PERCENTAGE: newProgress, STATUS: newProgress >= 100 ? 'completed' : 'active' }
                                                                : item
                                                        )
                                                    );
                                                    setAllProgress(prev =>
                                                        prev.map(item =>
                                                            item.ENROLLMENT_ID === en.ENROLLMENT_ID
                                                                ? { ...item, PROGRESS_PERCENTAGE: newProgress, STATUS: newProgress >= 100 ? 'completed' : 'active' }
                                                                : item
                                                        )
                                                    );
                                                }}
                                            />
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

                {/* 2. Directory List of all enrolled students and progress */}
                {userRole !== 'student' && allProgress.length > 0 && (
                    <div style={{ marginTop: '48px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                                All Enrolled Students &amp; Course Progress
                            </h2>
                            <span className="badge badge-indigo" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}>
                                {allProgress.length} Enrollments
                            </span>
                        </div>
                        <div className="cc-card" style={{ padding: 0, overflow: 'hidden', background: '#fff' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <tr>
                                            <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>Student</th>
                                            <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>Username</th>
                                            <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569' }}>Course Title</th>
                                            <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569', width: '220px' }}>Progress</th>
                                            <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allProgress.map((p) => {
                                            const pct = p.PROGRESS_PERCENTAGE || 0;
                                            const done = pct >= 100 || p.STATUS === 'completed';
                                            return (
                                                <tr key={p.ENROLLMENT_ID} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>
                                                        <div>{p.FIRST_NAME} {p.LAST_NAME}</div>
                                                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>ID: {p.STUDENT_ID}</span>
                                                    </td>
                                                    <td style={{ padding: '14px 16px', color: '#475569' }}>@{p.USERNAME}</td>
                                                    <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 500 }}>{p.COURSE_TITLE}</td>
                                                    <td style={{ padding: '14px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div className="progress-track" style={{ flex: 1, height: '8px', margin: 0 }}>
                                                                <div className={`progress-fill ${done ? 'progress-fill-emerald' : ''}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: done ? '#059669' : '#4f46e5', minWidth: '32px', textAlign: 'right' }}>{pct}%</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                                        <button
                                                            onClick={() => {
                                                                setStudentId(p.STUDENT_ID);
                                                                triggerSearch(p.STUDENT_ID);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            className="btn btn-ghost btn-sm"
                                                            style={{ color: '#4f46e5', borderColor: '#c7d2fe', padding: '4px 8px', fontSize: '0.75rem' }}
                                                        >
                                                            🔍 Edit Progress
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
