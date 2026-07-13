'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('userRole', data.user.ROLE);
                localStorage.setItem('userId', data.user.USER_ID);
                router.push('/');
            } else {
                setError(data.message || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('Unable to connect. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            {/* Background decoration */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,70,229,0.08) 0%, transparent 60%)',
                pointerEvents: 'none'
            }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }} className="fade-in-up">
                {/* Logo / Brand */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <img 
                        src="/logo.png" 
                        alt="CourseConnect Logo" 
                        style={{
                            width: '110px', 
                            height: '110px', 
                            borderRadius: '50%',
                            objectFit: 'cover',
                            boxShadow: '0 8px 24px rgba(79,70,229,0.12)',
                            margin: '0 auto 20px auto',
                            display: 'block'
                        }}
                    />
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }} className="gradient-text">
                        CourseConnect
                    </h1>
                    <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '0.9rem', fontWeight: 500 }}>
                        Enterprise Learning Management System
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: '#fff',
                    borderRadius: '20px',
                    border: '1.5px solid #e8eaf6',
                    boxShadow: '0 10px 40px rgba(79,70,229,0.1), 0 4px 16px rgba(0,0,0,0.06)',
                    padding: '36px'
                }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>
                        Welcome back
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 28px 0' }}>
                        Sign in to access your dashboard
                    </p>

                    {error && (
                        <div className="alert-error fade-in" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '18px' }}>
                            <label className="cc-label">Email Address</label>
                            <input
                                type="email"
                                required
                                className="cc-input"
                                placeholder="admin@courseconnect.app"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div style={{ marginBottom: '26px' }}>
                            <label className="cc-label">Password</label>
                            <input
                                type="password"
                                required
                                className="cc-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                                    Authenticating...
                                </>
                            ) : (
                                <>Sign In →</>
                            )}
                        </button>
                    </form>

                    <div className="divider" />

                    <div style={{
                        background: '#f8f9ff',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        border: '1px solid #e0e7ff'
                    }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>
                            🔐 Your credentials are verified against the Oracle USERS table. Contact your administrator for access.
                        </p>
                    </div>
                </div>

                <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.78rem', marginTop: '20px' }}>
                    CourseConnect Enterprise © 2026 — Powered by Oracle + MongoDB
                </p>
            </div>
        </div>
    );
}
