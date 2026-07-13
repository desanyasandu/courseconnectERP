'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const IconCap = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
    </svg>
);

const IconChat = ({ size = '16px' }) => (
    <svg style={{ width: size, height: size }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.17 48.17 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
);

const IconSearch = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
    </svg>
);

const IconArrowLeft = () => (
    <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

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

            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
                {/* Header */}
                <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: '#eef2ff', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#4f46e5', border: '1px solid #c7d2fe'
                        }}>
                            <IconChat size="20px" />
                        </div>
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
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', color: '#9ca3af' }}>
                            <IconSearch />
                        </span>
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
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#f1f5f9', color: '#64748b', marginBottom: '16px'
                        }}>
                            <IconChat size="24px" />
                        </div>
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
