'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForumsPage() {
    const [threads, setThreads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchThreads = async (query = '') => {
        setLoading(true);
        try {
            const res = await fetch(`/api/forums${query ? `?q=${encodeURIComponent(query)}` : ''}`);
            const data = await res.json();
            if (data.success) setThreads(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (!role) { router.push('/login'); return; }
        fetchThreads();
    }, [router]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchThreads(searchTerm);
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Navbar */}
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
                        ← Dashboard
                    </button>
                </div>
            </nav>

            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: '#eef2ff', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '22px', border: '1px solid #c7d2fe'
                        }}>💬</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }} className="gradient-text">
                            Community Forums
                        </h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                        Browse and search student discussions — powered by MongoDB full-text search
                    </p>
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearch} style={{
                    display: 'flex', gap: '12px', marginBottom: '36px',
                    background: '#fff', padding: '12px', borderRadius: '14px',
                    border: '1.5px solid #e0e7ff', boxShadow: '0 4px 12px rgba(79,70,229,0.07)'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', opacity: 0.5 }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search topics or messages..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="cc-input"
                            style={{ paddingLeft: '42px', margin: 0 }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>Search</button>
                    <button type="button" className="btn btn-ghost" style={{ flexShrink: 0 }}
                        onClick={() => { setSearchTerm(''); fetchThreads(''); }}>
                        Clear
                    </button>
                </form>

                {/* Results count */}
                {!loading && (
                    <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '20px', fontWeight: 500 }}>
                        {threads.length} thread{threads.length !== 1 ? 's' : ''} found
                        {searchTerm && <span> for "<strong style={{ color: '#4f46e5' }}>{searchTerm}</strong>"</span>}
                    </p>
                )}

                {/* Thread list */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', gap: '16px', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }} />
                        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading discussions...</span>
                    </div>
                ) : threads.length === 0 ? (
                    <div className="cc-card" style={{ padding: '60px', textAlign: 'center' }}>
                        <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💬</p>
                        <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No discussions found</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Try a different search term</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {threads.map((thread, idx) => (
                            <div key={idx} className="cc-card fade-in-up" style={{ padding: '0', animationDelay: `${idx * 50}ms`, overflow: 'hidden' }}>
                                {/* Thread header */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #f8f9ff, #eef2ff)',
                                    padding: '18px 24px',
                                    borderBottom: '1px solid #e0e7ff',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>
                                            {thread.topic}
                                        </h2>
                                        <span className="badge badge-indigo">Course: {thread.course_id}</span>
                                    </div>
                                    <span style={{
                                        background: '#fff', color: '#4f46e5',
                                        border: '1px solid #c7d2fe', borderRadius: '20px',
                                        padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700
                                    }}>
                                        {thread.posts?.length || 0} posts
                                    </span>
                                </div>

                                {/* Posts */}
                                <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {thread.posts?.map((post, pIdx) => (
                                        <div key={pIdx} style={{
                                            background: pIdx % 2 === 0 ? '#fafbff' : '#fff',
                                            borderRadius: '10px',
                                            padding: '14px 16px',
                                            border: '1px solid #f0f2ff'
                                        }}>
                                            <p style={{ color: '#374151', fontSize: '0.875rem', margin: '0 0 8px 0', lineHeight: 1.6 }}>{post.message}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    width: '22px', height: '22px', borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', fontSize: '0.65rem', fontWeight: 800
                                                }}>
                                                    {post.student_id?.[0] || 'S'}
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>
                                                    {post.student_id}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
