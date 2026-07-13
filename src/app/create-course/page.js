'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                        }}>🎓</div>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>CourseConnect</span>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => router.push('/')}>
                        ← Back to Dashboard
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
                        <span>✅</span> Course created! Redirecting to dashboard...
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
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                                        Publishing...
                                    </>
                                ) : '🚀 Publish Course'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
