'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [loginRole, setLoginRole] = useState('student'); // 'admin' | 'lecturer' | 'student'
    const [registerRole, setRegisterRole] = useState('student'); // 'lecturer' | 'student'

    // Credentials
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Registration profile details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [bio, setBio] = useState('');
    const [expertiseArea, setExpertiseArea] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role: loginRole })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('userRole', data.user.ROLE);
                localStorage.setItem('userId', data.user.USER_ID);
                setSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                setError(data.message || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('Unable to connect. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Client-side validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format.');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            setError('First name and last name must contain only letters (2-50 chars).');
            setLoading(false);
            return;
        }

        if (registerRole === 'student') {
            if (!dob) {
                setError('Date of birth is required.');
                setLoading(false);
                return;
            }
            if (new Date(dob) > new Date()) {
                setError('Date of birth cannot be in the future.');
                setLoading(false);
                return;
            }
            const phoneRegex = /^\d{9,12}$/;
            if (!phoneRegex.test(contactNo)) {
                setError('Contact number must be a valid 9-12 digit number.');
                setLoading(false);
                return;
            }
        }

        try {
            const payload = {
                role: registerRole,
                email,
                password,
                firstName,
                lastName,
                ...(registerRole === 'student' ? { dob, contactNo } : { bio, expertiseArea })
            };

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(data.message || 'Registration successful! Switching to login...');
                setTimeout(() => {
                    setMode('login');
                    setLoginRole(registerRole);
                    setError('');
                    setSuccess('');
                    // Clean fields
                    setFirstName('');
                    setLastName('');
                    setDob('');
                    setContactNo('');
                    setBio('');
                    setExpertiseArea('');
                }, 2000);
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('Unable to register. Please check your connection.');
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

            <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }} className="fade-in-up">
                {/* Logo / Brand */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <img 
                        src="/logo.png" 
                        alt="CourseConnect Logo" 
                        style={{
                            width: '90px', 
                            height: '90px', 
                            borderRadius: '50%',
                            objectFit: 'cover',
                            boxShadow: '0 8px 24px rgba(79,70,229,0.12)',
                            margin: '0 auto 16px auto',
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
                    {/* Mode Toggle */}
                    <div style={{ display: 'flex', borderBottom: '2px solid #f3f4f6', marginBottom: '24px' }}>
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'none',
                                border: 'none',
                                borderBottom: mode === 'login' ? '2px solid #4f46e5' : '2px solid transparent',
                                color: mode === 'login' ? '#4f46e5' : '#6b7280',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'none',
                                border: 'none',
                                borderBottom: mode === 'register' ? '2px solid #4f46e5' : '2px solid transparent',
                                color: mode === 'register' ? '#4f46e5' : '#6b7280',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Register
                        </button>
                    </div>

                    {error && (
                        <div className="alert-error fade-in" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert-success fade-in" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>✅</span> {success}
                        </div>
                    )}

                    {mode === 'login' ? (
                        <form onSubmit={handleLogin}>
                            {/* Role selector for login */}
                            <div style={{ marginBottom: '20px' }}>
                                <label className="cc-label">Sign in as:</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                    {[
                                        { id: 'student', label: 'Student', activeBg: '#eef2ff', activeText: '#4338ca', activeBorder: '#c7d2fe' },
                                        { id: 'lecturer', label: 'Lecturer', activeBg: '#ecfdf5', activeText: '#047857', activeBorder: '#a7f3d0' },
                                        { id: 'admin', label: 'Admin', activeBg: '#fffbeb', activeText: '#b45309', activeBorder: '#fde68a' }
                                    ].map(r => {
                                        const active = loginRole === r.id;
                                        return (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => setLoginRole(r.id)}
                                                style={{
                                                    padding: '10px 8px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.82rem',
                                                    fontWeight: 700,
                                                    border: active ? `1.5px solid ${r.activeBorder}` : '1.5px solid #e5e7eb',
                                                    background: active ? r.activeBg : '#fff',
                                                    color: active ? r.activeText : '#6b7280',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {r.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ marginBottom: '18px' }}>
                                <label className="cc-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="cc-input"
                                    placeholder={`${loginRole}@courseconnect.app`}
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
                    ) : (
                        <form onSubmit={handleRegister}>
                            {/* Role selector for registration */}
                            <div style={{ marginBottom: '20px' }}>
                                <label className="cc-label">Register as a:</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                    {[
                                        { id: 'student', label: 'Student', activeBg: '#eef2ff', activeText: '#4338ca', activeBorder: '#c7d2fe' },
                                        { id: 'lecturer', label: 'Lecturer', activeBg: '#ecfdf5', activeText: '#047857', activeBorder: '#a7f3d0' }
                                    ].map(r => {
                                        const active = registerRole === r.id;
                                        return (
                                            <button
                                                key={r.id}
                                                type="button"
                                                onClick={() => setRegisterRole(r.id)}
                                                style={{
                                                    padding: '10px 8px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.82rem',
                                                    fontWeight: 700,
                                                    border: active ? `1.5px solid ${r.activeBorder}` : '1.5px solid #e5e7eb',
                                                    background: active ? r.activeBg : '#fff',
                                                    color: active ? r.activeText : '#6b7280',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {r.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Common Name Fields */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="cc-label">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="cc-input"
                                        placeholder="Jane"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="cc-label">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="cc-input"
                                        placeholder="Smith"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Common Auth Fields */}
                            <div style={{ marginBottom: '14px' }}>
                                <label className="cc-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="cc-input"
                                    placeholder="jane.smith@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '14px' }}>
                                <label className="cc-label">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="cc-input"
                                    placeholder="Min 6 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            {/* Role-Specific Fields */}
                            {registerRole === 'student' ? (
                                <>
                                    <div style={{ marginBottom: '14px' }}>
                                        <label className="cc-label">Date of Birth</label>
                                        <input
                                            type="date"
                                            required
                                            className="cc-input"
                                            value={dob}
                                            onChange={e => setDob(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label className="cc-label">Contact Number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="cc-input"
                                            placeholder="0771234567"
                                            value={contactNo}
                                            onChange={e => setContactNo(e.target.value)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ marginBottom: '14px' }}>
                                        <label className="cc-label">Expertise Area (Optional)</label>
                                        <input
                                            type="text"
                                            className="cc-input"
                                            placeholder="e.g. Data Science, Web Engineering"
                                            value={expertiseArea}
                                            onChange={e => setExpertiseArea(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label className="cc-label">Short Bio (Optional)</label>
                                        <input
                                            type="text"
                                            className="cc-input"
                                            placeholder="e.g. Passionate about teaching UI/UX design..."
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary btn-lg"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                                        Registering Account...
                                    </>
                                ) : (
                                    <>Create Account →</>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="divider" />

                    <div style={{
                        background: '#f8f9ff',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        border: '1px solid #e0e7ff'
                    }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>
                            🔐 Your credentials are verified against the Oracle USERS table. CourseConnect supports secure role-based portals.
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

