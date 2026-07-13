'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
    { href: '/forums', label: '💬 Forums', roles: ['all'] },
    { href: '/progress', label: '🎓 Progress', roles: ['all'] },
    { href: '/checkout', label: '💳 Checkout', roles: ['all'] },
    { href: '/create-course', label: '+ New Course', roles: ['admin', 'lecturer'], primary: true },
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

export default function Dashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [revenue, setRevenue] = useState<number>(0);
    const [topCourses, setTopCourses] = useState<any[]>([]);
    const [studentProgress, setStudentProgress] = useState<any[]>([]);
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

    const handleSignOut = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        router.push('/login');
    };

    const roleStyle = userRole ? ROLE_COLORS[userRole] || ROLE_COLORS.student : ROLE_COLORS.student;

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
            {/* Sticky Navbar */}
            <nav className="cc-nav" style={{ padding: '0 32px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', boxShadow: '0 4px 12px rgba(79,70,229,0.35)'
                        }}>🎓</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#111827' }}>CourseConnect</div>
                            <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500 }}>Enterprise</div>
                        </div>
                    </div>

                    {/* Nav links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {NAV_LINKS.map(link => {
                            if (!link.roles.includes('all') && !link.roles.includes(userRole || '')) return null;
                            return (
                                <button
                                    key={link.href}
                                    onClick={() => router.push(link.href)}
                                    className={link.primary ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
                                >
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
                                border: '1px solid #fecaca', marginLeft: '4px'
                            }}
                        >
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
                                {userRole === 'admin' && (
                                    <div className="stat-card">
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.75, margin: '0 0 12px 0' }}>
                                                Total Platform Revenue
                                            </p>
                                            <p style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
                                                Rs. {revenue.toLocaleString()}
                                            </p>
                                            <p style={{ fontSize: '0.78rem', opacity: 0.65, margin: 0 }}>via Oracle PL/SQL function</p>
                                        </div>
                                    </div>
                                )}

                                {/* Top Rated Card */}
                                <div className="cc-card" style={{ padding: '24px' }}>
                                    <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 16px 0' }}>
                                        Top Rated Courses
                                    </p>
                                    {topCourses.length === 0 ? (
                                        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No reviews data yet</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {topCourses.slice(0, 4).map((tc, idx) => (
                                                <div key={idx} style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    background: '#f8f9ff', borderRadius: '10px', padding: '10px 14px',
                                                    border: '1px solid #e0e7ff'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{
                                                            width: '24px', height: '24px', borderRadius: '6px',
                                                            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                                                            color: 'white', fontSize: '0.7rem', fontWeight: 800,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                        }}>{idx + 1}</span>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                                                            {tc._id}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <span style={{ fontSize: '0.9rem' }}>⭐</span>
                                                        <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.9rem' }}>
                                                            {tc.average_rating.toFixed(1)}
                                                        </span>
                                                        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                                                            ({tc.total_reviews})
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '12px', marginBottom: 0 }}>MongoDB aggregation pipeline</p>
                                </div>
                            </div>
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
                                        <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎓</p>
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
                                    <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📚</p>
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
                                                {userRole === 'student' && (
                                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ width: '100%', justifyContent: 'center' }}
                                                            onClick={() => router.push(`/checkout?courseId=${course.COURSE_ID}`)}
                                                        >
                                                            💳 Enroll &amp; Pay
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Admin/Lecturer Controls */}
                                                {(userRole === 'admin' || userRole === 'lecturer') && (
                                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #fef2f2' }}>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            style={{ width: '100%', justifyContent: 'center' }}
                                                            onClick={async () => {
                                                                if (confirm('Delete this course permanently?')) {
                                                                    await fetch(`/api/courses?id=${course.COURSE_ID}`, { method: 'DELETE' });
                                                                    window.location.reload();
                                                                }
                                                            }}
                                                        >
                                                            🗑 Delete Course
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
