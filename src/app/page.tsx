'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const IconCap = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
    </svg>
);

const IconChat = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.17 48.17 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
);

const IconCard = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-5.25-9h16.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
);

const IconPlus = () => (
    <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const NAV_LINKS = [
    { href: '/forums', label: 'Forums', icon: IconChat, roles: ['all'] },
    { href: '/progress', label: 'Progress', icon: IconCap, roles: ['all'] },
    { href: '/checkout', label: 'Checkout', icon: IconCard, roles: ['all'] },
    { href: '/create-course', label: 'New Course', icon: IconPlus, roles: ['admin', 'lecturer'], primary: true },
];

const ROLE_COLORS = {
    admin: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    lecturer: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
    student: { bg: '#eef2ff', text: '#3730a3', border: '#c7d2fe' },
};

function ReviewForm({ courseId, studentId, onCompleted }: { courseId: string; studentId: string; onCompleted: () => void }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_id: courseId, student_id: studentId, rating, comment })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onCompleted();
                }, 1500);
            }
        } catch (err) {
            console.error("Failed to submit review", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 0', fontWeight: 600 }}>
                <span>✅</span> Thank you! Rating submitted.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '12px', padding: '12px', background: '#f8f9ff', borderRadius: '10px', border: '1px dashed #c7d2fe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Rate this course:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: 0 }}
                        >
                            {star <= rating ? '⭐' : '☆'}
                        </button>
                    ))}
                </div>
            </div>
            <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="cc-input"
                style={{ padding: '6px 10px', fontSize: '0.78rem', minHeight: '44px', marginBottom: '8px', borderRadius: '8px' }}
            />
            <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '6px 12px' }}
            >
                {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
        </form>
    );
}

function ProgressUpdater({ enrollmentId, initialProgress, onUpdated }: { enrollmentId: string; initialProgress: number; onUpdated: (val: number) => void }) {
    const [progress, setProgress] = useState(initialProgress);
    const [updating, setUpdating] = useState(false);
    const [showSlider, setShowSlider] = useState(false);

    // Sync progress state if initialProgress changes
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

export default function Dashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [revenue, setRevenue] = useState<number>(0);
    const [topCourses, setTopCourses] = useState<any[]>([]);
    const [studentProgress, setStudentProgress] = useState<any[]>([]);
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const uid = localStorage.getItem('userId');
        if (!role) { router.push('/login'); return; }
        setUserRole(role);
        setUserId(uid);

        const fetches: Promise<any>[] = [
            fetch('/api/courses').then(r => r.json())
        ];

        // Fetch revenue only for admin
        if (role === 'admin') {
            fetches.push(fetch('/api/reports/revenue').then(r => r.json()));
            
            // Also fetch pending payments for admin
            fetch('/api/payments/pending')
                .then(r => r.json())
                .then(data => {
                    if (data.success) setPendingPayments(data.data);
                })
                .catch(console.error);
        } else {
            fetches.push(Promise.resolve({ success: true, totalRevenue: 0 }));
        }

        // Fetch top rated analytics only for admin/lecturer
        if (role === 'admin' || role === 'lecturer') {
            fetches.push(fetch('/api/analytics/top-rated').then(r => r.json()));
        } else {
            fetches.push(Promise.resolve({ success: true, data: [] }));
        }

        // Fetch student progress only for student
        if (role === 'student' && uid) {
            fetches.push(fetch(`/api/students/progress?studentId=${uid}`).then(r => r.json()));
        } else {
            fetches.push(Promise.resolve({ success: true, data: [] }));
        }

        Promise.all(fetches)
        .then(([courseData, revenueData, topData, progressData]) => {
            if (courseData.success) setCourses(courseData.data);
            if (revenueData.success) setRevenue(revenueData.totalRevenue);
            if (topData.success) setTopCourses(topData.data);
            if (progressData.success) setStudentProgress(progressData.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [router]);

    const handleApprovePayment = async (paymentId: string, enrollmentId: string) => {
        try {
            const res = await fetch('/api/payments/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_id: paymentId, enrollment_id: enrollmentId })
            });
            const data = await res.json();
            if (data.success) {
                // Filter out the approved payment from state
                setPendingPayments(prev => prev.filter(p => p.PAYMENT_ID !== paymentId));
                // Fetch updated revenue
                fetch('/api/reports/revenue')
                    .then(r => r.json())
                    .then(revData => {
                        if (revData.success) setRevenue(revData.totalRevenue);
                    });
            } else {
                alert(data.error || "Failed to approve payment.");
            }
        } catch (err) {
            console.error("Approval request failed", err);
        }
    };

    const handleUnenroll = async (enrollmentId: string, courseTitle: string) => {
        if (!confirm(`Are you sure you want to unenroll from "${courseTitle}"?`)) {
            return;
        }
        try {
            const res = await fetch('/api/enrollments/unenroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enrollment_id: enrollmentId })
            });
            const data = await res.json();
            if (data.success) {
                // Filter out the enrollment from studentProgress locally
                setStudentProgress(prev => prev.filter(e => e.ENROLLMENT_ID !== enrollmentId));
            } else {
                alert(data.error || "Failed to unenroll.");
            }
        } catch (err) {
            console.error("Unenroll request failed", err);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        router.push('/login');
    };

    const roleStyle = userRole && userRole in ROLE_COLORS ? ROLE_COLORS[userRole as keyof typeof ROLE_COLORS] : ROLE_COLORS.student;

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
            {/* Sticky Navbar */}
            <nav className="cc-nav" style={{ padding: '0 32px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    {/* Brand */}
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
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#111827' }}>CourseConnect</div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500 }}>Enterprise</div>
                        </div>
                    </div>

                    {/* Nav links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {NAV_LINKS.map(link => {
                            if (!link.roles.includes('all') && !link.roles.includes(userRole || '')) return null;
                            const Icon = link.icon;
                            return (
                                <button
                                    key={link.href}
                                    onClick={() => router.push(link.href)}
                                    className={link.primary ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Icon />
                                    {link.label}
                                </button>
                            );
                        })}

                        {/* Role badge */}
                        {userRole && (
                            <div style={{
                                background: roleStyle.bg, color: roleStyle.text,
                                border: `1px solid ${roleStyle.border}`,
                                borderRadius: '8px', padding: '4px 10px',
                                fontSize: '0.75rem', fontWeight: 700,
                                textTransform: 'capitalize', marginLeft: '4px'
                            }}>
                                {userRole}
                            </div>
                        )}

                        <button
                            onClick={handleSignOut}
                            className="btn btn-sm"
                            style={{
                                background: '#fef2f2', color: '#dc2626',
                                border: '1px solid #fecaca', marginLeft: '4px',
                                display: 'inline-flex', alignItems: 'center', gap: '6px'
                            }}
                        >
                            <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Page content */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>

                {/* Page header */}
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }} className="gradient-text">
                        {userRole === 'admin' && 'Administrator Control Panel'}
                        {userRole === 'lecturer' && 'Instructor Portal'}
                        {userRole === 'student' && 'Student Learning Center'}
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '0.95rem' }}>
                        {userRole === 'admin' && 'Real-time database analytics powered by Oracle PL/SQL & MongoDB'}
                        {userRole === 'lecturer' && 'Manage courses and monitor student course ratings'}
                        {userRole === 'student' && 'Welcome back! Monitor your active progress or enroll in new courses below.'}
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
                        <div className="spinner" style={{ width: '36px', height: '36px', borderWidth: '3px' }} />
                        <span style={{ color: '#6b7280', fontWeight: 500 }}>Loading portal data...</span>
                    </div>
                ) : (
                    <>
                        {/* 1. Admin/Lecturer Analytics Row */}
                        {(userRole === 'admin' || userRole === 'lecturer') && (
                            <div style={{ display: 'grid', gridTemplateColumns: userRole === 'admin' ? '1fr 1fr' : '1fr', gap: '24px', marginBottom: '40px' }}>
                                {/* Revenue Card (Only for Admin) */}
                                {/* Revenue Card (Only for Admin) */}
                                {userRole === 'admin' && (
                                    <div className="stat-card">
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.75, margin: '0 0 4px 0' }}>
                                                Total Platform Revenue
                                            </p>
                                            <p style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 12px 0', letterSpacing: '-0.03em' }}>
                                                Rs. {revenue.toLocaleString()}
                                            </p>
                                            
                                            {/* SVG Area/Trend Chart */}
                                            <div style={{ marginTop: '12px' }}>
                                                <svg viewBox="0 0 400 110" style={{ width: '100%', height: '90px', overflow: 'visible' }}>
                                                    <defs>
                                                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                                                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                                                        </linearGradient>
                                                    </defs>
                                                    {/* Area */}
                                                    <path
                                                        d="M 10 90 Q 100 40 200 70 T 390 20 L 390 100 L 10 100 Z"
                                                        fill="url(#areaGrad)"
                                                    />
                                                    {/* Line */}
                                                    <path
                                                        d="M 10 90 Q 100 40 200 70 T 390 20"
                                                        fill="none"
                                                        stroke="#ffffff"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                    />
                                                    {/* Dots */}
                                                    <circle cx="10" cy="90" r="4.5" fill="#ffffff" />
                                                    <circle cx="110" cy="52" r="4.5" fill="#ffffff" />
                                                    <circle cx="200" cy="70" r="4.5" fill="#ffffff" />
                                                    <circle cx="295" cy="48" r="4.5" fill="#ffffff" />
                                                    <circle cx="390" cy="20" r="4.5" fill="#ffffff" />
                                                    
                                                    {/* Labels */}
                                                    <text x="10" y="108" fill="rgba(255,255,255,0.7)" fontSize="8.5" textAnchor="middle">Jan</text>
                                                    <text x="110" y="108" fill="rgba(255,255,255,0.7)" fontSize="8.5" textAnchor="middle">Feb</text>
                                                    <text x="200" y="108" fill="rgba(255,255,255,0.7)" fontSize="8.5" textAnchor="middle">Mar</text>
                                                    <text x="295" y="108" fill="rgba(255,255,255,0.7)" fontSize="8.5" textAnchor="middle">Apr</text>
                                                    <text x="390" y="108" fill="rgba(255,255,255,0.7)" fontSize="8.5" textAnchor="middle">May</text>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Top Rated Card */}
                                <div className="cc-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 16px 0' }}>
                                            Course Satisfaction Ratings
                                        </p>
                                        {topCourses.length === 0 ? (
                                            <p style={{ color: '#9ca3af', fontSize: '0.875rem', padding: '16px 0' }}>No reviews data yet</p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                {topCourses.slice(0, 3).map((tc, idx) => {
                                                    const scorePercent = (tc.average_rating / 5) * 100;
                                                    return (
                                                        <div key={idx}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
                                                                    {tc._id}
                                                                </span>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#b45309' }}>⭐ {tc.average_rating.toFixed(1)}</span>
                                                                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>({tc.total_reviews})</span>
                                                                </div>
                                                            </div>
                                                            <div className="progress-track" style={{ height: '8px' }}>
                                                                <div 
                                                                    className="progress-fill" 
                                                                    style={{ 
                                                                        width: `${scorePercent}%`,
                                                                        background: 'linear-gradient(90deg, #f59e0b, #d97706)'
                                                                    }} 
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '16px', marginBottom: 0 }}>
                                        Aggregation analysis of MongoDB student reviews
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 1.5 Admin Pending Approvals Section */}
                        {userRole === 'admin' && (
                            <section style={{ marginBottom: '48px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Pending Bank Payment Approvals</h2>
                                    <span className="badge" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
                                        {pendingPayments.length} Pending
                                    </span>
                                </div>

                                {pendingPayments.length === 0 ? (
                                    <div className="cc-card" style={{ padding: '40px', textAlign: 'center', background: '#fff' }}>
                                        <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 4px 0' }}>No Pending Approvals</p>
                                        <p style={{ color: '#9ca3af', fontSize: '0.82rem', margin: 0 }}>All bank transfer slip payments have been processed.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                        {pendingPayments.map((p, idx) => (
                                            <div key={p.PAYMENT_ID} className="cc-card fade-in-up" style={{ padding: '22px', background: '#fff', animationDelay: `${idx * 40}ms` }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                    <div>
                                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#111827' }}>
                                                            {p.FIRST_NAME} {p.LAST_NAME}
                                                        </h3>
                                                        <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0 0' }}>
                                                            Course: <strong style={{ color: '#4f46e5' }}>{p.COURSE_TITLE}</strong>
                                                        </p>
                                                    </div>
                                                    <span className="badge badge-amber" style={{ flexShrink: 0 }}>
                                                        Pending Approval
                                                    </span>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                                                    <div>
                                                        <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Amount</p>
                                                        <p style={{ fontSize: '1rem', fontWeight: 800, color: '#059669', margin: '2px 0 0 0' }}>Rs. {Number(p.AMOUNT).toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>Payment ID</p>
                                                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', margin: '2px 0 0 0' }}>{p.PAYMENT_ID}</p>
                                                    </div>
                                                </div>

                                                {p.SLIP_URL && (
                                                    <div style={{ marginTop: '16px' }}>
                                                        <a 
                                                            href={p.SLIP_URL} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="btn btn-ghost btn-sm"
                                                            style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', gap: '8px', color: '#4f46e5', borderColor: '#c7d2fe', background: '#f8f9ff' }}
                                                        >
                                                            📁 View Uploaded Receipt Slip
                                                        </a>
                                                    </div>
                                                )}

                                                <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                                                    <button
                                                        onClick={() => handleApprovePayment(p.PAYMENT_ID, p.ENROLLMENT_ID)}
                                                        className="btn btn-primary btn-sm"
                                                        style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 2px 8px rgba(5,150,105,0.2)' }}
                                                    >
                                                        Approve Enrollment
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* 2. Student Active Enrollments progress Section */}
                        {userRole === 'student' && (
                            <section style={{ marginBottom: '48px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>My Enrolled Courses &amp; Progress</h2>
                                    <span className="badge badge-indigo">{studentProgress.length} Active</span>
                                </div>
                                {studentProgress.length === 0 ? (
                                    <div className="cc-card" style={{ padding: '60px', textAlign: 'center', background: '#fff' }}>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                            width: '56px', height: '56px', borderRadius: '50%',
                                            background: '#eef2ff', color: '#4f46e5', marginBottom: '16px'
                                        }}>
                                            <IconCap />
                                        </div>
                                        <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No Active Enrollments</p>
                                        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Choose a course from the catalog below to enroll and begin your learning path!</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                        {studentProgress.map((en, idx) => {
                                            const pct = en.PROGRESS_PERCENTAGE || 0;
                                            const done = pct >= 100 || en.STATUS === 'completed';
                                            return (
                                                <div key={idx} className="cc-card fade-in-up" style={{ padding: '22px', background: '#fff', animationDelay: `${idx * 50}ms` }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#111827', lineHeight: 1.4 }}>
                                                            {en.TITLE}
                                                        </h3>
                                                        <span className={`badge ${done ? 'badge-emerald' : 'badge-indigo'}`} style={{ flexShrink: 0 }}>
                                                            {done ? 'Completed' : en.STATUS}
                                                        </span>
                                                    </div>
                                                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>Overall Progress</span>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: done ? '#059669' : '#4f46e5' }}>{pct}%</span>
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
                                                            setStudentProgress(prev =>
                                                                prev.map(item =>
                                                                    item.ENROLLMENT_ID === en.ENROLLMENT_ID
                                                                        ? { ...item, PROGRESS_PERCENTAGE: newProgress, STATUS: newProgress >= 100 ? 'completed' : 'active' }
                                                                        : item
                                                                )
                                                            );
                                                        }}
                                                    />
                                                    {userId && (
                                                        <ReviewForm
                                                            courseId={en.COURSE_ID}
                                                            studentId={userId}
                                                            onCompleted={() => {
                                                                fetch('/api/analytics/top-rated')
                                                                    .then(r => r.json())
                                                                    .then(data => {
                                                                        if (data.success) setTopCourses(data.data);
                                                                    });
                                                            }}
                                                        />
                                                    )}
                                                    
                                                    <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                                                        <button
                                                            onClick={() => handleUnenroll(en.ENROLLMENT_ID, en.TITLE)}
                                                            className="btn btn-ghost btn-sm"
                                                            style={{ 
                                                                color: '#dc2626', 
                                                                fontSize: '0.72rem', 
                                                                padding: '6px 12px', 
                                                                borderColor: '#fee2e2', 
                                                                background: '#fef2f2',
                                                                fontWeight: 600,
                                                                borderRadius: '8px'
                                                            }}
                                                        >
                                                            🚪 Unenroll
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* 3. Course Catalogue Section */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
                                        {userRole === 'student' ? 'Explore Available Courses' : 'Active Course Catalogue'}
                                    </h2>
                                    <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '4px 0 0 0' }}>{courses.length} published courses</p>
                                </div>
                                {(userRole === 'admin' || userRole === 'lecturer') && (
                                    <button className="btn btn-primary" onClick={() => router.push('/create-course')}>
                                        + Add Course
                                    </button>
                                )}
                            </div>

                            {courses.length === 0 ? (
                                <div className="cc-card" style={{ padding: '60px', textAlign: 'center' }}>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '56px', height: '56px', borderRadius: '50%',
                                        background: '#f1f5f9', color: '#64748b', marginBottom: '16px'
                                    }}>
                                        <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                        </svg>
                                    </div>
                                    <p style={{ color: '#6b7280', fontWeight: 500 }}>No published courses yet</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                    {courses.map((course, i) => (
                                        <div key={course.COURSE_ID} className="course-card fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                                            {/* Course header accent */}
                                            <div style={{
                                                height: '6px',
                                                background: `linear-gradient(90deg, hsl(${(i * 47) % 360}, 70%, 55%), hsl(${(i * 47 + 60) % 360}, 70%, 60%))`
                                            }} />
                                            <div style={{ padding: '22px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827', lineHeight: 1.4 }}>
                                                        {course.TITLE}
                                                    </h3>
                                                    <span className="badge badge-indigo" style={{ flexShrink: 0 }}>
                                                        {course.CATEGORY}
                                                    </span>
                                                </div>

                                                <p style={{ color: '#6b7280', fontSize: '0.83rem', lineHeight: 1.6, margin: '0 0 20px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {course.DESCRIPTION}
                                                </p>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{
                                                            width: '28px', height: '28px', borderRadius: '50%',
                                                            background: `linear-gradient(135deg, hsl(${(i * 47) % 360}, 60%, 55%), hsl(${(i * 47 + 60) % 360}, 65%, 60%))`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'white', fontSize: '0.68rem', fontWeight: 800
                                                        }}>
                                                            {course.LECTURER_NAME?.[0] || 'L'}
                                                        </div>
                                                        <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>{course.LECTURER_NAME}</span>
                                                    </div>
                                                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669' }}>
                                                        Rs. {Number(course.PRICE).toLocaleString()}
                                                    </span>
                                                </div>

                                                {/* Student: Enroll / Checkout Button */}
                                                {userRole === 'student' && (() => {
                                                    const isEnrolled = studentProgress.some(sp => sp.COURSE_ID === course.COURSE_ID);
                                                    return (
                                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                                                            {isEnrolled ? (
                                                                <div style={{
                                                                    width: '100%',
                                                                    padding: '10px 14px',
                                                                    borderRadius: '10px',
                                                                    background: '#ecfdf5',
                                                                    color: '#047857',
                                                                    border: '1.5px solid #a7f3d0',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.875rem',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '6px'
                                                                }}>
                                                                    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                    </svg>
                                                                    Already Enrolled
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    className="btn btn-primary"
                                                                    style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                                    onClick={() => router.push(`/checkout?courseId=${course.COURSE_ID}`)}
                                                                >
                                                                    <IconCard />
                                                                    Enroll &amp; Pay
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })()}

                                                {/* Admin/Lecturer Controls */}
                                                {(userRole === 'admin' || userRole === 'lecturer') && (
                                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #fef2f2' }}>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                            onClick={async () => {
                                                                if (confirm('Delete this course permanently?')) {
                                                                    await fetch(`/api/courses?id=${course.COURSE_ID}`, { method: 'DELETE' });
                                                                    window.location.reload();
                                                                }
                                                            }}
                                                        >
                                                            <svg style={{ width: '13px', height: '13px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                            Delete Course
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
