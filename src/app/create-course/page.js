'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const IconCap = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
    </svg>
);

const IconArrowLeft = () => (
    <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const IconRocket = () => (
    <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.59 2.118a14.98 14.98 0 0 0-3.478 3.8m13.3 8.452a14.98 14.98 0 0 1-3.478 3.8m3.478-3.8c-.342.342-.716.657-1.12.942m-5.18 5.093c.285-.404.6-.778.943-1.12m0 0c.342-.342.66-.713.953-1.112m-9.07 9.07a3 3 0 1 1-4.243-4.243 14.98 14.98 0 0 1 4.242 4.243Z" />
    </svg>
);

export default function CreateCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        course_id: '', lecturer_id: 'U002',
        title: '', description: '', price: '', category: ''
    });

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (!role) router.push('/login');
        else if (role !== 'admin' && role !== 'lecturer') router.push('/');
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
                setTimeout(() => router.push('/'), 1500);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const CATEGORIES = ['Web Development', 'Data Science', 'Design', 'Business', 'Mobile Dev', 'Cybersecurity', 'AI & ML', 'Cloud Computing'];

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Mini navbar */}
            <nav className="cc-nav" style={{ padding: '0 32px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
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

            <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 6px 0' }} className="gradient-text">
                        Create New Course
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                        Fill in the details below to publish a new course to the platform
                    </p>
                </div>

                {success && (
                    <div className="alert-success fade-in" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Course created! Redirecting to dashboard...
                    </div>
                )}

                <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    border: '1.5px solid #e8eaf6',
                    boxShadow: '0 8px 30px rgba(79,70,229,0.08)',
                    overflow: 'hidden'
                }}>
                    {/* Card header accent */}
                    <div style={{ height: '5px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #a78bfa)' }} />

                    <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label className="cc-label">Course ID</label>
                                <input className="cc-input" required type="text" placeholder="e.g., C006"
                                    onChange={e => setFormData({ ...formData, course_id: e.target.value })} />
                            </div>
                            <div>
                                <label className="cc-label">Price (LKR)</label>
                                <input className="cc-input" required type="number" placeholder="e.g., 5000"
                                    onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label className="cc-label">Course Title</label>
                            <input className="cc-input" required type="text" placeholder="e.g., Advanced React Development"
                                onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label className="cc-label">Category</label>
                            <select
                                className="cc-input cc-select"
                                required
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">— Select a category —</option>
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label className="cc-label">Course Description</label>
                            <textarea
                                className="cc-input"
                                required
                                rows={4}
                                placeholder="Describe what students will learn in this course..."
                                style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-ghost" onClick={() => router.push('/')}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <IconRocket />
                                        Publish Course
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
