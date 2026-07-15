'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ═══════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════ */
const IconCap = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
    </svg>
);

const IconChat = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.17 48.17 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
);

const IconCard = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-5.25-9h16.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
);

const IconPlus = () => (
    <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const IconSignOut = () => (
    <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
);

const IconCheck = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const IconTrash = () => (
    <svg style={{ width: '13px', height: '13px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */
const NAV_LINKS = [
    { href: '/forums',        label: 'Forums',     icon: IconChat, roles: ['all'] },
    { href: '/progress',      label: 'Progress',   icon: IconCap,  roles: ['admin', 'lecturer'] },
    { href: '/checkout',      label: 'Checkout',   icon: IconCard, roles: ['student'] },
    { href: '/create-course', label: 'New Course', icon: IconPlus, roles: ['admin', 'lecturer'], primary: true },
];

const ROLE_COLORS = {
    admin:    { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    lecturer: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
    student:  { bg: '#eef2ff', text: '#3730a3', border: '#c7d2fe' },
};

/* ═══════════════════════════════════════════════════
   CUSTOM HOOK: Count-Up Animation
   ═══════════════════════════════════════════════════ */
function useCountUp(target: number, duration = 1200, active = true) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active || target === 0) { setCount(target); return; }
        const startTime = performance.now();
        const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
        let rafId: number;
        const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(easeOutExpo(progress) * target));
            if (progress < 1) rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [target, duration, active]);
    return count;
}

/* ═══════════════════════════════════════════════════
   SKELETON LOADING
   ═══════════════════════════════════════════════════ */
function SkeletonDashboard() {
    return (
        <div style={{ animation: 'fadeIn 0.3s ease' }} aria-label="Loading dashboard content" aria-busy="true">
            {/* Stat skeleton row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                <div className="skeleton skeleton-card" style={{ height: '200px' }} />
                <div className="skeleton skeleton-card" style={{ height: '200px' }} />
            </div>
            {/* Course cards skeleton */}
            <div style={{ marginBottom: '20px' }}>
                <div className="skeleton skeleton-title" style={{ width: '240px', marginBottom: '24px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} className="cc-card" style={{ padding: '22px', animationDelay: `${i * 80}ms` }}>
                            <div className="skeleton" style={{ height: '6px', borderRadius: '4px', marginBottom: '18px' }} />
                            <div className="skeleton skeleton-title" style={{ width: '70%', marginBottom: '12px' }} />
                            <div className="skeleton skeleton-text" style={{ marginBottom: '8px' }} />
                            <div className="skeleton skeleton-text" style={{ width: '85%', marginBottom: '8px' }} />
                            <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '20px' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <div className="skeleton skeleton-avatar" style={{ width: '28px', height: '28px' }} />
                                    <div className="skeleton skeleton-text" style={{ width: '70px' }} />
                                </div>
                                <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '999px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   REVIEW FORM
   ═══════════════════════════════════════════════════ */
function ReviewForm({ courseId, studentId, onCompleted }: { courseId: string; studentId: string; onCompleted: () => void }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
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
                setTimeout(() => { onCompleted(); }, 1500);
            }
        } catch (err) {
            console.error("Failed to submit review", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="scale-pop" style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 0', fontWeight: 600 }} role="status" aria-live="polite">
                <span>✅</span> Thank you! Rating submitted.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '12px', padding: '14px', background: '#f8f9ff', borderRadius: '10px', border: '1px dashed #c7d2fe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Rate this course:</span>
                <div style={{ display: 'flex', gap: '2px' }} role="group" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                            aria-pressed={star <= rating}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '18px', padding: '2px',
                                transition: 'transform 0.15s ease',
                                transform: star <= (hoverRating || rating) ? 'scale(1.2)' : 'scale(1)',
                                filter: star <= (hoverRating || rating) ? 'none' : 'grayscale(1) opacity(0.4)',
                            }}
                        >⭐</button>
                    ))}
                </div>
            </div>
            <textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="cc-input"
                aria-label="Review comment"
                style={{ padding: '8px 12px', fontSize: '0.8rem', minHeight: '48px', marginBottom: '10px', borderRadius: '8px' }}
            />
            <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', padding: '7px 12px' }}
            >
                {submitting ? (<><div className="spinner" style={{ width: '12px', height: '12px', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />Submitting...</>) : 'Submit Rating'}
            </button>
        </form>
    );
}

/* ═══════════════════════════════════════════════════
   PROGRESS UPDATER
   ═══════════════════════════════════════════════════ */
function ProgressUpdater({ enrollmentId, initialProgress, onUpdated }: { enrollmentId: string; initialProgress: number; onUpdated: (val: number) => void }) {
    const [progress, setProgress] = useState(initialProgress);
    const [updating, setUpdating] = useState(false);
    const [showSlider, setShowSlider] = useState(false);

    useEffect(() => { setProgress(initialProgress); }, [initialProgress]);

    const handleSave = async () => {
        setUpdating(true);
        try {
            const res = await fetch('/api/enrollments', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enrollment_id: enrollmentId, progress_percentage: progress })
            });
            const data = await res.json();
            if (data.success) { onUpdated(progress); setShowSlider(false); }
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
                    aria-label="Update course progress"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}
                >
                    ⚙️ Update Progress
                </button>
            ) : (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4b5563' }}>Adjust Progress:</span>
                        <span style={{
                            fontSize: '0.875rem', fontWeight: 800, color: '#4f46e5',
                            background: '#eef2ff', padding: '2px 10px', borderRadius: '999px',
                            border: '1px solid #c7d2fe'
                        }}>{progress}%</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="range" min="0" max="100" step="5"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            aria-label={`Progress: ${progress}%`}
                            aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}
                            style={{ flex: 1, accentColor: '#4f46e5', cursor: 'pointer', height: '6px' }}
                        />
                        <button onClick={handleSave} disabled={updating} className="btn btn-primary btn-sm" style={{ fontSize: '0.72rem', padding: '5px 12px' }}>
                            {updating ? 'Saving…' : 'Save'}
                        </button>
                        <button
                            onClick={() => { setShowSlider(false); setProgress(initialProgress); }}
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                        >Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   ANIMATED PROGRESS BAR
   ═══════════════════════════════════════════════════ */
function AnimatedProgressBar({ pct, done }: { pct: number; done: boolean }) {
    const [displayWidth, setDisplayWidth] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setDisplayWidth(pct), 50);
        return () => clearTimeout(t);
    }, [pct]);
    return (
        <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress: ${pct}%`}>
            <div
                className={`progress-fill ${done ? 'progress-fill-emerald' : 'progress-fill-active'}`}
                style={{ width: `${displayWidth}%` }}
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════ */
function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="cc-card fade-in" style={{ padding: '64px 40px', textAlign: 'center' }}>
            <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                color: '#4f46e5', marginBottom: '18px',
                boxShadow: '0 4px 14px rgba(79,70,229,0.15)'
            }}>
                {icon}
            </div>
            <p style={{ fontWeight: 700, color: '#374151', margin: '0 0 6px 0', fontSize: '0.95rem' }}>{title}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{description}</p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════ */
export default function Dashboard() {
    const router = useRouter();
    const [courses, setCourses]                 = useState<any[]>([]);
    const [revenue, setRevenue]                 = useState<number>(0);
    const [topCourses, setTopCourses]           = useState<any[]>([]);
    const [studentProgress, setStudentProgress] = useState<any[]>([]);
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [loading, setLoading]                 = useState(true);
    const [userRole, setUserRole]               = useState<string | null>(null);
    const [userId, setUserId]                   = useState<string | null>(null);
    const [scrolled, setScrolled]               = useState(false);
    const [dataReady, setDataReady]             = useState(false);

    const animatedRevenue = useCountUp(revenue, 1300, dataReady);

    /* Scroll-aware navbar */
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /* Mouse-tracking glow for course cards */
    const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top)  / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    }, []);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const uid  = localStorage.getItem('userId');
        if (!role) { router.push('/login'); return; }
        setUserRole(role);
        setUserId(uid);

        const fetches: Promise<any>[] = [fetch('/api/courses').then(r => r.json())];

        if (role === 'admin') {
            fetches.push(fetch('/api/reports/revenue').then(r => r.json()));
            fetch('/api/payments/pending').then(r => r.json()).then(data => {
                if (data.success) setPendingPayments(data.data);
            }).catch(console.error);
        } else {
            fetches.push(Promise.resolve({ success: true, totalRevenue: 0 }));
        }

        if (role === 'admin' || role === 'lecturer') {
            fetches.push(fetch('/api/analytics/top-rated').then(r => r.json()));
        } else {
            fetches.push(Promise.resolve({ success: true, data: [] }));
        }

        if (role === 'student' && uid) {
            fetches.push(fetch(`/api/students/progress?studentId=${uid}`).then(r => r.json()));
        } else {
            fetches.push(Promise.resolve({ success: true, data: [] }));
        }

        Promise.all(fetches)
            .then(([courseData, revenueData, topData, progressData]) => {
                if (courseData.success)   setCourses(courseData.data);
                if (revenueData.success)  setRevenue(revenueData.totalRevenue);
                if (topData.success)      setTopCourses(topData.data);
                if (progressData.success) setStudentProgress(progressData.data);
                setLoading(false);
                setTimeout(() => setDataReady(true), 100);
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
                setPendingPayments(prev => prev.filter(p => p.PAYMENT_ID !== paymentId));
                fetch('/api/reports/revenue').then(r => r.json()).then(revData => {
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
        if (!confirm(`Are you sure you want to unenroll from "${courseTitle}"?`)) return;
        try {
            const res = await fetch('/api/enrollments/unenroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enrollment_id: enrollmentId })
            });
            const data = await res.json();
            if (data.success) {
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

    const roleStyle = userRole && userRole in ROLE_COLORS
        ? ROLE_COLORS[userRole as keyof typeof ROLE_COLORS]
        : ROLE_COLORS.student;

    const greetingTitle = userRole === 'admin'    ? 'Administrator Control Panel'
                        : userRole === 'lecturer' ? 'Instructor Portal'
                        : 'Student Learning Center';

    const greetingDesc  = userRole === 'admin'    ? 'Real-time database analytics powered by Oracle PL/SQL & MongoDB'
                        : userRole === 'lecturer' ? 'Manage courses and monitor student course ratings'
                        : 'Welcome back! Monitor your active progress or enroll in new courses below.';

    return (
        <>
            {/* Skip Navigation — Accessibility */}
            <a href="#main-content" className="skip-nav">Skip to main content</a>

            <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>

                {/* ── Sticky Navbar ── */}
                <nav className={`cc-nav ${scrolled ? 'cc-nav--scrolled' : ''}`} style={{ padding: '0 32px' }} role="navigation" aria-label="Main navigation">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

                        {/* Brand */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
                                flexShrink: 0
                            }}>
                                <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
                                </svg>
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#111827' }}>CourseConnect</div>
                                <div style={{ fontSize: '0.68rem', color: '#6b7280', fontWeight: 500, letterSpacing: '0.03em' }}>ENTERPRISE</div>
                            </div>
                        </div>

                        {/* Nav links */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {NAV_LINKS.map(link => {
                                if (!link.roles.includes('all') && !link.roles.includes(userRole || '')) return null;
                                const Icon = link.icon;
                                return (
                                    <button
                                        key={link.href}
                                        onClick={() => router.push(link.href)}
                                        className={link.primary ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                        aria-label={link.label}
                                    >
                                        <Icon />
                                        {link.label}
                                    </button>
                                );
                            })}

                            {/* Role badge */}
                            {userRole && (
                                <div
                                    role="status"
                                    aria-label={`Logged in as ${userRole}`}
                                    style={{
                                        background: roleStyle.bg, color: roleStyle.text,
                                        border: `1px solid ${roleStyle.border}`,
                                        borderRadius: '8px', padding: '4px 10px',
                                        fontSize: '0.72rem', fontWeight: 700,
                                        textTransform: 'capitalize', marginLeft: '6px',
                                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)'
                                    }}
                                >{userRole}</div>
                            )}

                            <button
                                onClick={handleSignOut}
                                className="btn btn-sm"
                                aria-label="Sign out"
                                style={{
                                    background: '#fef2f2', color: '#dc2626',
                                    border: '1px solid #fecaca', marginLeft: '4px',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                }}
                            >
                                <IconSignOut />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </nav>

                {/* ── Page Content ── */}
                <main id="main-content" style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 32px' }}>

                    {/* Page header */}
                    <div className="page-enter" style={{ marginBottom: '44px' }}>
                        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 8px 0' }} className="gradient-text">
                            {greetingTitle}
                        </h1>
                        <p style={{ color: '#64748b', marginTop: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
                            {greetingDesc}
                        </p>
                    </div>

                    {loading ? <SkeletonDashboard /> : (
                        <>
                            {/* ── 1. Admin / Lecturer Analytics Row ── */}
                            {(userRole === 'admin' || userRole === 'lecturer') && (
                                <div style={{ display: 'grid', gridTemplateColumns: userRole === 'admin' ? '1fr 1fr' : '1fr', gap: '24px', marginBottom: '44px' }}>

                                    {/* Revenue Card */}
                                    {userRole === 'admin' && (
                                        <div className="stat-card">
                                            <div style={{ position: 'relative', zIndex: 1 }}>
                                                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75, margin: '0 0 4px 0' }}>
                                                    Total Platform Revenue
                                                </p>
                                                <p style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0 0 4px 0', letterSpacing: '-0.03em' }}>
                                                    Rs.&nbsp;{animatedRevenue.toLocaleString()}
                                                </p>
                                                <p style={{ fontSize: '0.75rem', opacity: 0.65, margin: '0 0 16px 0', fontWeight: 500 }}>
                                                    Lifetime earnings
                                                </p>

                                                {/* Trend chart */}
                                                <div style={{ marginTop: '8px' }}>
                                                    <svg viewBox="0 0 400 100" style={{ width: '100%', height: '80px', overflow: 'visible' }}>
                                                        <defs>
                                                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.3" />
                                                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                                            </linearGradient>
                                                        </defs>
                                                        <path d="M 10 88 Q 100 38 200 65 T 390 18 L 390 96 L 10 96 Z" fill="url(#areaGrad)" />
                                                        <path d="M 10 88 Q 100 38 200 65 T 390 18" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                                                        {[{cx:10,cy:88},{cx:110,cy:50},{cx:200,cy:65},{cx:295,cy:46},{cx:390,cy:18}].map((dot,i) => (
                                                            <circle key={i} cx={dot.cx} cy={dot.cy} r="4" fill="#ffffff" opacity="0.9" />
                                                        ))}
                                                        {['Jan','Feb','Mar','Apr','May'].map((m,i) => (
                                                            <text key={m} x={[10,110,200,295,390][i]} y="104" fill="rgba(255,255,255,0.6)" fontSize="8" textAnchor="middle">{m}</text>
                                                        ))}
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Top Rated Card */}
                                    <div className="cc-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', margin: '0 0 20px 0' }}>
                                                Course Satisfaction Ratings
                                            </p>
                                            {topCourses.length === 0 ? (
                                                <p style={{ color: '#9ca3af', fontSize: '0.875rem', padding: '12px 0' }}>No review data yet.</p>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    {topCourses.slice(0, 3).map((tc, idx) => {
                                                        const scorePercent = (tc.average_rating / 5) * 100;
                                                        return (
                                                            <div key={idx}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                                    <span style={{ fontSize: '0.83rem', fontWeight: 700, color: '#1e293b' }}>{tc._id}</span>
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                        <span style={{ fontSize: '0.83rem', fontWeight: 800, color: '#b45309' }}>⭐ {tc.average_rating.toFixed(1)}</span>
                                                                        <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>({tc.total_reviews})</span>
                                                                    </div>
                                                                </div>
                                                                <div className="progress-track" style={{ height: '6px' }}>
                                                                    <div className="progress-fill" style={{ width: `${scorePercent}%`, background: 'linear-gradient(90deg, #f59e0b, #d97706)' }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '20px', marginBottom: 0 }}>
                                            Aggregation from MongoDB student reviews
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── 1.5 Admin Pending Approvals ── */}
                            {userRole === 'admin' && (
                                <section style={{ marginBottom: '52px' }} aria-labelledby="pending-heading">
                                    <div className="cc-section-header">
                                        <h2 id="pending-heading" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
                                            Pending Bank Payment Approvals
                                        </h2>
                                        <span className="badge badge-amber" aria-label={`${pendingPayments.length} pending approvals`}>
                                            {pendingPayments.length} Pending
                                        </span>
                                    </div>

                                    {pendingPayments.length === 0 ? (
                                        <EmptyState
                                            icon={<svg style={{ width: '26px', height: '26px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
                                            title="No Pending Approvals"
                                            description="All bank transfer slip payments have been processed."
                                        />
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                            {pendingPayments.map((p, idx) => (
                                                <div
                                                    key={p.PAYMENT_ID}
                                                    className={`cc-card fade-in-up stagger-${(idx % 6) + 1}`}
                                                    style={{ padding: '22px', borderLeft: '4px solid #f59e0b' }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                                        <div>
                                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>
                                                                {p.FIRST_NAME} {p.LAST_NAME}
                                                            </h3>
                                                            <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0 }}>
                                                                Course: <strong style={{ color: '#4f46e5' }}>{p.COURSE_TITLE}</strong>
                                                            </p>
                                                        </div>
                                                        <span className="badge badge-amber">Pending</span>
                                                    </div>

                                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', paddingTop: '14px', borderTop: '1px solid #f3f4f6', marginBottom: '14px' }}>
                                                        <div>
                                                            <p style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 3px 0' }}>Amount</p>
                                                            <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669', margin: 0 }}>Rs. {Number(p.AMOUNT).toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '0.68rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 3px 0' }}>Payment ID</p>
                                                            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', margin: 0 }}>{p.PAYMENT_ID}</p>
                                                        </div>
                                                    </div>

                                                    {p.SLIP_URL && (
                                                        <a
                                                            href={p.SLIP_URL} target="_blank" rel="noopener noreferrer"
                                                            className="btn btn-ghost btn-sm"
                                                            style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', color: '#4f46e5', borderColor: '#c7d2fe', background: '#f8f9ff', marginBottom: '10px' }}
                                                        >
                                                            📁 View Uploaded Receipt Slip
                                                        </a>
                                                    )}

                                                    <button
                                                        onClick={() => handleApprovePayment(p.PAYMENT_ID, p.ENROLLMENT_ID)}
                                                        className="btn btn-primary btn-sm"
                                                        aria-label={`Approve payment from ${p.FIRST_NAME} ${p.LAST_NAME}`}
                                                        style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
                                                    >
                                                        <IconCheck /> Approve Enrollment
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* ── 2. Student Enrolled Courses ── */}
                            {userRole === 'student' && (
                                <section style={{ marginBottom: '52px' }} aria-labelledby="enrolled-heading">
                                    <div className="cc-section-header">
                                        <h2 id="enrolled-heading">My Enrolled Courses &amp; Progress</h2>
                                        <span className="badge badge-indigo" aria-label={`${studentProgress.length} active enrollments`}>
                                            {studentProgress.length} Active
                                        </span>
                                    </div>

                                    {studentProgress.length === 0 ? (
                                        <EmptyState
                                            icon={<IconCap />}
                                            title="No Active Enrollments"
                                            description="Choose a course from the catalogue below to enroll and begin your learning path!"
                                        />
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                            {studentProgress.map((en, idx) => {
                                                const pct  = en.PROGRESS_PERCENTAGE || 0;
                                                const done = pct >= 100 || en.STATUS === 'completed';
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`cc-card fade-in-up stagger-${(idx % 6) + 1}`}
                                                        style={{ padding: '22px' }}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#111827', lineHeight: 1.4, paddingRight: '12px' }}>
                                                                {en.TITLE}
                                                            </h3>
                                                            <span className={`badge ${done ? 'badge-emerald' : 'badge-indigo'}`} style={{ flexShrink: 0 }}>
                                                                {done ? 'Completed' : en.STATUS}
                                                            </span>
                                                        </div>

                                                        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>Overall Progress</span>
                                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: done ? '#059669' : '#4f46e5' }}>{pct}%</span>
                                                        </div>

                                                        <AnimatedProgressBar pct={pct} done={done} />

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
                                                                        .then(data => { if (data.success) setTopCourses(data.data); });
                                                                }}
                                                            />
                                                        )}

                                                        <div style={{ marginTop: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                                                            <button
                                                                onClick={() => handleUnenroll(en.ENROLLMENT_ID, en.TITLE)}
                                                                className="btn btn-ghost btn-sm"
                                                                aria-label={`Unenroll from ${en.TITLE}`}
                                                                style={{
                                                                    color: '#dc2626', fontSize: '0.72rem', padding: '6px 12px',
                                                                    borderColor: '#fee2e2', background: '#fef2f2', fontWeight: 600, borderRadius: '8px'
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

                            {/* ── 3. Course Catalogue ── */}
                            <section aria-labelledby="catalogue-heading">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                    <div>
                                        <h2 id="catalogue-heading" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 4px 0' }}>
                                            {userRole === 'student' ? 'Explore Available Courses' : 'Active Course Catalogue'}
                                        </h2>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{courses.length} published courses</p>
                                    </div>
                                    {(userRole === 'admin' || userRole === 'lecturer') && (
                                        <button className="btn btn-primary" onClick={() => router.push('/create-course')} aria-label="Add a new course">
                                            <IconPlus /> Add Course
                                        </button>
                                    )}
                                </div>

                                {courses.length === 0 ? (
                                    <EmptyState
                                        icon={<svg style={{ width: '26px', height: '26px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>}
                                        title="No Published Courses Yet"
                                        description="Create your first course to get started on the platform."
                                    />
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                                        {courses.map((course, i) => (
                                            <div
                                                key={course.COURSE_ID}
                                                className={`course-card fade-in-up stagger-${(i % 6) + 1}`}
                                                onMouseMove={handleCardMouseMove}
                                            >
                                                {/* Color accent bar */}
                                                <div style={{
                                                    height: '5px',
                                                    background: `linear-gradient(90deg, hsl(${(i * 47) % 360}, 70%, 55%), hsl(${(i * 47 + 60) % 360}, 70%, 60%))`
                                                }} />

                                                <div style={{ padding: '22px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '10px' }}>
                                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827', lineHeight: 1.4 }}>
                                                            {course.TITLE}
                                                        </h3>
                                                        <span className="badge badge-indigo" style={{ flexShrink: 0 }}>{course.CATEGORY}</span>
                                                    </div>

                                                    <p style={{
                                                        color: '#64748b', fontSize: '0.83rem', lineHeight: 1.65, margin: '0 0 20px 0',
                                                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                                    }}>
                                                        {course.DESCRIPTION}
                                                    </p>

                                                    {/* Footer row */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div
                                                                title={course.LECTURER_NAME}
                                                                aria-label={`Lecturer: ${course.LECTURER_NAME}`}
                                                                style={{
                                                                    width: '28px', height: '28px', borderRadius: '50%',
                                                                    background: `linear-gradient(135deg, hsl(${(i * 47) % 360}, 60%, 55%), hsl(${(i * 47 + 60) % 360}, 65%, 60%))`,
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    color: 'white', fontSize: '0.68rem', fontWeight: 800,
                                                                    flexShrink: 0
                                                                }}
                                                            >
                                                                {course.LECTURER_NAME?.[0] || 'L'}
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>{course.LECTURER_NAME}</span>
                                                        </div>
                                                        <div style={{
                                                            background: '#ecfdf5', color: '#059669',
                                                            border: '1px solid #a7f3d0', borderRadius: '8px',
                                                            padding: '4px 10px', fontSize: '0.88rem', fontWeight: 800
                                                        }}>
                                                            Rs. {Number(course.PRICE).toLocaleString()}
                                                        </div>
                                                    </div>

                                                    {/* Student: Enroll / Enrolled */}
                                                    {userRole === 'student' && (() => {
                                                        const isEnrolled = studentProgress.some(sp => sp.COURSE_ID === course.COURSE_ID);
                                                        return (
                                                            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                                                                {isEnrolled ? (
                                                                    <div style={{
                                                                        width: '100%', padding: '10px 14px', borderRadius: '10px',
                                                                        background: '#ecfdf5', color: '#047857',
                                                                        border: '1.5px solid #a7f3d0', fontWeight: 700, fontSize: '0.875rem',
                                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                                                    }}
                                                                        role="status" aria-label="Already enrolled in this course"
                                                                    >
                                                                        <IconCheck /> Already Enrolled
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        aria-label={`Enroll in ${course.TITLE}`}
                                                                        style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                                        onClick={() => router.push(`/checkout?courseId=${course.COURSE_ID}`)}
                                                                    >
                                                                        <IconCard /> Enroll &amp; Pay
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* Admin/Lecturer controls */}
                                                    {(userRole === 'admin' || userRole === 'lecturer') && (
                                                        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #fef2f2' }}>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                aria-label={`Delete course: ${course.TITLE}`}
                                                                style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                                onClick={async () => {
                                                                    if (confirm('Delete this course permanently?')) {
                                                                        await fetch(`/api/courses?id=${course.COURSE_ID}`, { method: 'DELETE' });
                                                                        window.location.reload();
                                                                    }
                                                                }}
                                                            >
                                                                <IconTrash /> Delete Course
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </main>
            </div>
        </>
    );
}
