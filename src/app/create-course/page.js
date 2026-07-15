'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ═══════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════ */
const IconArrowLeft = () => (
    <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const IconRocket = () => (
    <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.59 2.118a14.98 14.98 0 0 0-3.478 3.8m13.3 8.452a14.98 14.98 0 0 1-3.478 3.8m3.478-3.8c-.342.342-.716.657-1.12.942m-5.18 5.093c.285-.404.6-.778.943-1.12m0 0c.342-.342.66-.713.953-1.112m-9.07 9.07a3 3 0 1 1-4.243-4.243 14.98 14.98 0 0 1 4.242 4.243Z" />
    </svg>
);

const IconCap = () => (
    <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
    </svg>
);

/* ═══════════════════════════════════════════════════
   CATEGORY CONFIG
   ═══════════════════════════════════════════════════ */
const CATEGORIES = [
    { value: 'Web Development',  emoji: '🌐', color: '#3b82f6' },
    { value: 'Data Science',     emoji: '📊', color: '#8b5cf6' },
    { value: 'Design',           emoji: '🎨', color: '#ec4899' },
    { value: 'Business',         emoji: '💼', color: '#f59e0b' },
    { value: 'Mobile Dev',       emoji: '📱', color: '#10b981' },
    { value: 'Cybersecurity',    emoji: '🔒', color: '#ef4444' },
    { value: 'AI & ML',          emoji: '🤖', color: '#6366f1' },
    { value: 'Cloud Computing',  emoji: '☁️',  color: '#0ea5e9' },
];

const MAX_DESC = 500;

/* ═══════════════════════════════════════════════════
   LIVE PREVIEW CARD
   ═══════════════════════════════════════════════════ */
function PreviewCard({ title, category, description, price, lecturerName }) {
    const catObj = CATEGORIES.find(c => c.value === category);
    const colorIndex = CATEGORIES.indexOf(catObj) !== -1 ? CATEGORIES.indexOf(catObj) : 0;
    const hue = (colorIndex * 47) % 360;

    return (
        <div style={{ position: 'sticky', top: '84px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', margin: '0 0 12px 0' }}>
                Live Preview
            </p>
            <div
                className="course-card"
                style={{
                    opacity: title || description || price ? 1 : 0.55,
                    transition: 'opacity 0.3s ease',
                }}
                aria-label="Course preview card"
            >
                {/* Accent bar */}
                <div style={{
                    height: '5px',
                    background: catObj
                        ? `linear-gradient(90deg, ${catObj.color}, ${catObj.color}bb)`
                        : `linear-gradient(90deg, hsl(${hue},70%,55%), hsl(${(hue+60)%360},70%,60%))`,
                }} />

                <div style={{ padding: '20px' }}>
                    {/* Title + badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#111827', lineHeight: 1.4 }}>
                            {title || <span style={{ color: '#cbd5e1' }}>Course title will appear here</span>}
                        </h3>
                        {category && (
                            <span className="badge badge-indigo" style={{ flexShrink: 0 }}>{category}</span>
                        )}
                    </div>

                    <p style={{
                        color: '#64748b', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 16px 0',
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        minHeight: '38px',
                    }}>
                        {description || <span style={{ color: '#cbd5e1' }}>Description will appear here…</span>}
                    </p>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '26px', height: '26px', borderRadius: '50%',
                                background: `linear-gradient(135deg, hsl(${hue},60%,55%), hsl(${(hue+60)%360},65%,60%))`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0,
                            }}>
                                {lecturerName?.[0] || 'L'}
                            </div>
                            <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 500 }}>
                                {lecturerName || 'Instructor'}
                            </span>
                        </div>
                        <div style={{
                            background: '#ecfdf5', color: '#059669',
                            border: '1px solid #a7f3d0', borderRadius: '8px',
                            padding: '3px 10px', fontSize: '0.85rem', fontWeight: 800,
                        }}>
                            {price ? `Rs. ${Number(price).toLocaleString()}` : <span style={{ color: '#cbd5e1' }}>Price</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Helper tip */}
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '12px', textAlign: 'center', lineHeight: 1.5 }}>
                This is how your course will appear in the catalogue.
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   CONFETTI BURST (success)
   ═══════════════════════════════════════════════════ */
function ConfettiBurst() {
    const colors = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
    return (
        <div aria-hidden="true" style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none' }}>
            {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: '8px', height: '8px',
                    borderRadius: i % 3 === 0 ? '50%' : '2px',
                    background: colors[i % colors.length],
                    left: `${(i - 9) * 18}px`,
                    animation: `confettiDrop 0.9s ease forwards`,
                    animationDelay: `${i * 40}ms`,
                    transform: `rotate(${i * 20}deg)`,
                }} />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function CreateCoursePage() {
    const router = useRouter();
    const [loading, setLoading]   = useState(false);
    const [success, setSuccess]   = useState(false);
    const [lecturerName, setLecturerName] = useState('');
    const [formData, setFormData] = useState({
        course_id: '', lecturer_id: '',
        title: '', description: '', price: '', category: ''
    });

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const uid  = localStorage.getItem('userId');
        if (!role) { router.push('/login'); return; }
        if (role !== 'admin' && role !== 'lecturer') { router.push('/'); return; }
        setLecturerName(`${role.charAt(0).toUpperCase() + role.slice(1)}`);
        const generatedCourseId = 'C' + Math.floor(1000 + Math.random() * 9000);
        setFormData(prev => ({ ...prev, lecturer_id: uid || '', course_id: generatedCourseId }));
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/'), 2200);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const descLength = formData.description.length;

    return (
        <div style={{ minHeight: '100vh' }}>
            {success && <ConfettiBurst />}

            {/* ── Navbar ── */}
            <nav className="cc-nav" style={{ padding: '0 32px' }} role="navigation" aria-label="Create course navigation">
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                        }}>
                            <IconCap />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>CourseConnect</span>
                    </div>
                    <button
                        className="btn btn-ghost btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => router.push('/')}
                        aria-label="Back to dashboard"
                    >
                        <IconArrowLeft /> Dashboard
                    </button>
                </div>
            </nav>

            {/* ── Content ── */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

                {/* Header */}
                <div className="page-enter" style={{ marginBottom: '36px' }}>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px 0' }} className="gradient-text">
                        Create New Course
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Fill in the details below to publish a new course to the platform
                    </p>
                </div>

                {/* Success banner */}
                {success && (
                    <div className="alert-success scale-pop" style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }} role="status" aria-live="polite">
                        <span aria-hidden="true">🎉</span>
                        Course published! Redirecting to dashboard...
                    </div>
                )}

                {/* Two-column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>

                    {/* ── FORM ── */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '20px',
                        border: '1.5px solid #e8eaf6',
                        boxShadow: '0 8px 32px rgba(79,70,229,0.08)',
                        overflow: 'hidden',
                    }}>
                        {/* Top accent */}
                        <div style={{ height: '5px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #a855f7)' }} />

                        <form onSubmit={handleSubmit} style={{ padding: '32px' }} noValidate>

                            {/* Row: Course ID + Price */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '22px' }}>
                                <div>
                                    <label className="cc-label" htmlFor="course-id">
                                        Course ID <span style={{ color: '#94a3b8', fontWeight: 400 }}>(auto-generated)</span>
                                    </label>
                                    <input
                                        id="course-id"
                                        className="cc-input" required type="text" readOnly
                                        aria-readonly="true"
                                        style={{ background: '#f8fafc', cursor: 'not-allowed', color: '#64748b', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                                        value={formData.course_id}
                                    />
                                </div>
                                <div>
                                    <label className="cc-label" htmlFor="course-price">Price (LKR)</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{
                                            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                                            color: '#64748b', fontWeight: 600, fontSize: '0.9rem', pointerEvents: 'none',
                                        }}>Rs.</span>
                                        <input
                                            id="course-price"
                                            className="cc-input" required type="number" placeholder="5000"
                                            min="0"
                                            style={{ paddingLeft: '38px' }}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Course title */}
                            <div style={{ marginBottom: '22px' }}>
                                <label className="cc-label" htmlFor="course-title">Course Title</label>
                                <input
                                    id="course-title"
                                    className="cc-input" required type="text"
                                    placeholder="e.g., Advanced React Development"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Category grid */}
                            <div style={{ marginBottom: '22px' }}>
                                <label className="cc-label" id="cat-label">Category</label>
                                <div
                                    style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}
                                    role="group"
                                    aria-labelledby="cat-label"
                                >
                                    {CATEGORIES.map(cat => {
                                        const active = formData.category === cat.value;
                                        return (
                                            <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: cat.value })}
                                                aria-pressed={active}
                                                aria-label={cat.value}
                                                style={{
                                                    padding: '10px 6px',
                                                    borderRadius: '10px',
                                                    border: active ? `2px solid ${cat.color}` : '1.5px solid #e5e7eb',
                                                    background: active ? `${cat.color}14` : '#fafafa',
                                                    cursor: 'pointer',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                                    transition: 'all 0.18s ease',
                                                    boxShadow: active ? `0 0 0 3px ${cat.color}25` : 'none',
                                                    fontFamily: 'Inter, sans-serif',
                                                }}
                                            >
                                                <span style={{ fontSize: '20px', lineHeight: 1 }}>{cat.emoji}</span>
                                                <span style={{
                                                    fontSize: '0.65rem', fontWeight: 700,
                                                    color: active ? cat.color : '#64748b',
                                                    textAlign: 'center', lineHeight: 1.2,
                                                }}>{cat.value}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Hidden required input for category validation */}
                                <input
                                    type="text" required readOnly
                                    value={formData.category}
                                    tabIndex={-1}
                                    aria-hidden="true"
                                    style={{ opacity: 0, height: 0, margin: 0, padding: 0, border: 'none', position: 'absolute' }}
                                />
                            </div>

                            {/* Description + character counter */}
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                                    <label className="cc-label" htmlFor="course-desc" style={{ margin: 0 }}>Course Description</label>
                                    <span
                                        aria-live="polite"
                                        aria-label={`${descLength} of ${MAX_DESC} characters used`}
                                        style={{
                                            fontSize: '0.72rem', fontWeight: 600,
                                            color: descLength > MAX_DESC * 0.9 ? '#ef4444' : descLength > MAX_DESC * 0.7 ? '#f59e0b' : '#94a3b8',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {descLength}/{MAX_DESC}
                                    </span>
                                </div>
                                <textarea
                                    id="course-desc"
                                    className="cc-input"
                                    required
                                    rows={4}
                                    maxLength={MAX_DESC}
                                    placeholder="Describe what students will learn in this course..."
                                    style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif', lineHeight: 1.65 }}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-ghost" onClick={() => router.push('/')} aria-label="Cancel and go back to dashboard">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                    disabled={loading || success}
                                    aria-label="Publish this course"
                                >
                                    {loading ? (
                                        <><div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> Publishing...</>
                                    ) : success ? (
                                        <>🎉 Published!</>
                                    ) : (
                                        <><IconRocket /> Publish Course</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ── LIVE PREVIEW ── */}
                    <PreviewCard
                        title={formData.title}
                        category={formData.category}
                        description={formData.description}
                        price={formData.price}
                        lecturerName={lecturerName}
                    />
                </div>
            </div>

            {/* Responsive: hide preview on narrow screens */}
            <style>{`
                @media (max-width: 900px) {
                    .course-preview-col { display: none !important; }
                }
            `}</style>
        </div>
    );
}
