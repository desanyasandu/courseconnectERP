'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* ═══════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════ */
const IconEyeOpen = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const IconEyeClosed = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
);

const IconArrowRight = () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

const IconCheck = () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

/* ═══════════════════════════════════════════════════
   ROLE CONFIG
   ═══════════════════════════════════════════════════ */
const LOGIN_ROLES  = [
    { id: 'student',  label: 'Student',  emoji: '🎓', activeBg: '#eef2ff', activeText: '#4338ca', activeBorder: '#c7d2fe' },
    { id: 'lecturer', label: 'Lecturer', emoji: '👨‍🏫', activeBg: '#ecfdf5', activeText: '#047857', activeBorder: '#a7f3d0' },
    { id: 'admin',    label: 'Admin',    emoji: '🛡️',  activeBg: '#fffbeb', activeText: '#b45309', activeBorder: '#fde68a' },
];

const REGISTER_ROLES = [
    { id: 'student',  label: 'Student',  emoji: '🎓', activeBg: '#eef2ff', activeText: '#4338ca', activeBorder: '#c7d2fe' },
    { id: 'lecturer', label: 'Lecturer', emoji: '👨‍🏫', activeBg: '#ecfdf5', activeText: '#047857', activeBorder: '#a7f3d0' },
];

const FEATURES = [
    { icon: '🚀', label: 'Oracle-powered analytics' },
    { icon: '📚', label: 'Role-based learning portals' },
    { icon: '💳', label: 'Integrated payment workflow' },
    { icon: '📊', label: 'Real-time progress tracking' },
];

/* ═══════════════════════════════════════════════════
   FLOATING ORB (purely decorative)
   ═══════════════════════════════════════════════════ */
function Orb({ size, top, left, opacity, delay }) {
    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                width: size, height: size,
                top, left,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(1px)',
                animation: `orbFloat ${6 + delay}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                opacity,
                pointerEvents: 'none',
            }}
        />
    );
}

/* ═══════════════════════════════════════════════════
   MAIN LOGIN PAGE
   ═══════════════════════════════════════════════════ */
export default function LoginPage() {
    const [mode, setMode]               = useState('login');
    const [loginRole, setLoginRole]     = useState('student');
    const [registerRole, setRegisterRole] = useState('student');

    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [showPass, setShowPass]   = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [dob, setDob]             = useState('');
    const [contactNo, setContactNo] = useState('');
    const [bio, setBio]             = useState('');
    const [expertiseArea, setExpertiseArea] = useState('');

    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => { setMounted(true); }, []);

    const switchMode = (m) => {
        setMode(m);
        setError('');
        setSuccess('');
    };

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
                setTimeout(() => router.push('/'), 900);
            } else {
                setError(data.message || 'Invalid credentials. Please try again.');
            }
        } catch {
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { setError('Invalid email format.'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            setError('First and last name must contain only letters (2–50 chars).');
            setLoading(false); return;
        }
        if (registerRole === 'student') {
            if (!dob) { setError('Date of birth is required.'); setLoading(false); return; }
            if (new Date(dob) > new Date()) { setError('Date of birth cannot be in the future.'); setLoading(false); return; }
            const phoneRegex = /^\d{9,12}$/;
            if (!phoneRegex.test(contactNo)) { setError('Contact number must be 9–12 digits.'); setLoading(false); return; }
        }

        try {
            const payload = {
                role: registerRole, email, password, firstName, lastName,
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
                    switchMode('login');
                    setLoginRole(registerRole);
                    setFirstName(''); setLastName(''); setDob(''); setContactNo(''); setBio(''); setExpertiseArea('');
                }, 2000);
            } else {
                setError(data.error || 'Registration failed. Please try again.');
            }
        } catch {
            setError('Unable to register. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ── Global keyframe for orb float (not in CSS file so scoped here) ── */}
            <style>{`
                @keyframes orbFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%      { transform: translate(5%, -4%) scale(1.05); }
                    66%      { transform: translate(-3%, 3%) scale(0.96); }
                }
                @keyframes slideTabIndicator {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .form-panel { animation: fadeInUp 0.35s cubic-bezier(0.4,0,0.2,1) both; }
            `}</style>

            <div style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>

                {/* ══════════════════ LEFT BRAND PANEL ══════════════════ */}
                <div
                    aria-hidden="true"
                    style={{
                        display: 'none',
                        flex: '0 0 45%',
                        position: 'relative',
                        background: 'linear-gradient(145deg, #3730a3 0%, #4f46e5 35%, #7c3aed 70%, #a855f7 100%)',
                        overflow: 'hidden',
                    }}
                    className="login-left-panel"
                >
                    {/* Decorative orbs */}
                    <Orb size={200} top="-8%"   left="-5%"  opacity={0.5} delay={0} />
                    <Orb size={140} top="60%"   left="70%"  opacity={0.4} delay={1.5} />
                    <Orb size={90}  top="30%"   left="80%"  opacity={0.3} delay={3} />
                    <Orb size={60}  top="80%"   left="10%"  opacity={0.35} delay={2} />
                    <Orb size={110} top="45%"   left="-8%"  opacity={0.25} delay={4} />

                    {/* Content */}
                    <div style={{
                        position: 'relative', zIndex: 1,
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        height: '100%', padding: '56px 48px',
                        color: 'white',
                    }}>
                        {/* Brand */}
                        <div style={{ marginBottom: '48px' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '56px', height: '56px', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.18)',
                                backdropFilter: 'blur(8px)',
                                marginBottom: '20px',
                                border: '1px solid rgba(255,255,255,0.25)',
                            }}>
                                <svg style={{ width: '28px', height: '28px' }} fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
                                </svg>
                            </div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
                                CourseConnect
                            </h1>
                            <p style={{ fontSize: '1rem', opacity: 0.75, margin: 0, fontWeight: 400, lineHeight: 1.5 }}>
                                Enterprise Learning<br />Management System
                            </p>
                        </div>

                        {/* Feature list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {FEATURES.map((f, i) => (
                                <div
                                    key={i}
                                    className="fade-in-up"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        animationDelay: `${i * 100 + 200}ms`,
                                    }}
                                >
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(6px)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '16px', flexShrink: 0,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}>{f.icon}</div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500, opacity: 0.9 }}>{f.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Bottom quote */}
                        <div style={{
                            marginTop: 'auto', paddingTop: '40px',
                            borderTop: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <p style={{ fontSize: '0.78rem', opacity: 0.55, margin: 0, letterSpacing: '0.04em' }}>
                                COURSECONNECT ENTERPRISE © 2026
                            </p>
                            <p style={{ fontSize: '0.78rem', opacity: 0.45, margin: '4px 0 0 0' }}>
                                Powered by Oracle DB + MongoDB
                            </p>
                        </div>
                    </div>
                </div>

                {/* ══════════════════ RIGHT FORM PANEL ══════════════════ */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px 24px',
                    overflowY: 'auto',
                }}>
                    <div style={{ width: '100%', maxWidth: '440px' }} className={mounted ? 'page-enter' : ''}>

                        {/* Mobile brand header (shown only on small screens) */}
                        <div style={{ textAlign: 'center', marginBottom: '28px' }} className="mobile-brand">
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '52px', height: '52px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                                marginBottom: '14px',
                            }}>
                                <svg style={{ width: '26px', height: '26px', color: 'white' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.906 59.906 0 0 1 10.399 5.84a50.58 50.58 0 0 0-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443" />
                                </svg>
                            </div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }} className="gradient-text">
                                CourseConnect
                            </h1>
                            <p style={{ color: '#64748b', marginTop: '5px', fontSize: '0.85rem', fontWeight: 500 }}>
                                Enterprise Learning Management System
                            </p>
                        </div>

                        {/* Card */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '20px',
                            border: '1.5px solid #e8eaf6',
                            boxShadow: '0 12px 48px rgba(79,70,229,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                            overflow: 'hidden',
                        }}>
                            {/* Top accent bar */}
                            <div style={{ height: '4px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #a855f7)' }} />

                            {/* Tab toggle */}
                            <div style={{ display: 'flex', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
                                {/* Sliding indicator */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: mode === 'login' ? '0%' : '50%',
                                    width: '50%',
                                    height: '2.5px',
                                    background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                                    borderRadius: '2px 2px 0 0',
                                    transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
                                }} aria-hidden="true" />
                                {(['login', 'register']).map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => switchMode(m)}
                                        role="tab"
                                        aria-selected={mode === m}
                                        aria-label={m === 'login' ? 'Sign in tab' : 'Register tab'}
                                        style={{
                                            flex: 1, padding: '14px 16px',
                                            background: 'none', border: 'none',
                                            color: mode === m ? '#4f46e5' : '#64748b',
                                            fontWeight: mode === m ? 700 : 600,
                                            fontSize: '0.9rem', cursor: 'pointer',
                                            transition: 'color 0.2s',
                                            fontFamily: 'Inter, sans-serif',
                                        }}
                                    >
                                        {m === 'login' ? 'Sign In' : 'Register'}
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding: '28px 32px 32px' }}>
                                {/* Alerts */}
                                {error && (
                                    <div className="alert-error fade-in" style={{ marginBottom: '18px', display: 'flex', alignItems: 'flex-start', gap: '8px' }} role="alert" aria-live="assertive">
                                        <span aria-hidden="true">⚠️</span> {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="alert-success fade-in scale-pop" style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }} role="status" aria-live="polite">
                                        <IconCheck /> {success}
                                    </div>
                                )}

                                {/* ── LOGIN FORM ── */}
                                {mode === 'login' ? (
                                    <form key="login" className="form-panel" onSubmit={handleLogin} noValidate>
                                        {/* Role selector */}
                                        <div style={{ marginBottom: '22px' }}>
                                            <label className="cc-label" id="login-role-label">Sign in as:</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }} role="group" aria-labelledby="login-role-label">
                                                {LOGIN_ROLES.map(r => {
                                                    const active = loginRole === r.id;
                                                    return (
                                                        <button
                                                            key={r.id} type="button"
                                                            onClick={() => setLoginRole(r.id)}
                                                            aria-pressed={active}
                                                            aria-label={`Sign in as ${r.label}`}
                                                            style={{
                                                                padding: '10px 6px', borderRadius: '10px',
                                                                fontSize: '0.82rem', fontWeight: 700,
                                                                border: active ? `1.5px solid ${r.activeBorder}` : '1.5px solid #e5e7eb',
                                                                background: active ? r.activeBg : '#fafafa',
                                                                color: active ? r.activeText : '#6b7280',
                                                                cursor: 'pointer', transition: 'all 0.18s ease',
                                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                                                                boxShadow: active ? `0 0 0 3px ${r.activeBorder}40` : 'none',
                                                                fontFamily: 'Inter, sans-serif',
                                                            }}
                                                        >
                                                            <span style={{ fontSize: '18px', lineHeight: 1 }}>{r.emoji}</span>
                                                            {r.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <label className="cc-label" htmlFor="login-email">Email Address</label>
                                            <input
                                                id="login-email" type="email" required
                                                className="cc-input"
                                                placeholder={`${loginRole}@courseconnect.app`}
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                autoComplete="email"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div style={{ marginBottom: '26px' }}>
                                            <label className="cc-label" htmlFor="login-password">Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    id="login-password"
                                                    type={showPass ? 'text' : 'password'}
                                                    required
                                                    className="cc-input"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    autoComplete="current-password"
                                                    style={{ paddingRight: '44px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPass(p => !p)}
                                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                                    style={{
                                                        position: 'absolute', right: '12px', top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: '#94a3b8', padding: '4px',
                                                        display: 'flex', alignItems: 'center',
                                                        borderRadius: '6px',
                                                        transition: 'color 0.15s',
                                                    }}
                                                >
                                                    {showPass ? <IconEyeClosed /> : <IconEyeOpen />}
                                                </button>
                                            </div>
                                        </div>

                                        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                                            {loading ? (
                                                <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> Authenticating...</>
                                            ) : (
                                                <>Sign In <IconArrowRight /></>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    /* ── REGISTER FORM ── */
                                    <form key="register" className="form-panel" onSubmit={handleRegister} noValidate>
                                        {/* Role selector */}
                                        <div style={{ marginBottom: '20px' }}>
                                            <label className="cc-label" id="reg-role-label">Register as a:</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }} role="group" aria-labelledby="reg-role-label">
                                                {REGISTER_ROLES.map(r => {
                                                    const active = registerRole === r.id;
                                                    return (
                                                        <button
                                                            key={r.id} type="button"
                                                            onClick={() => setRegisterRole(r.id)}
                                                            aria-pressed={active}
                                                            aria-label={`Register as ${r.label}`}
                                                            style={{
                                                                padding: '12px 8px', borderRadius: '10px',
                                                                fontSize: '0.85rem', fontWeight: 700,
                                                                border: active ? `1.5px solid ${r.activeBorder}` : '1.5px solid #e5e7eb',
                                                                background: active ? r.activeBg : '#fafafa',
                                                                color: active ? r.activeText : '#6b7280',
                                                                cursor: 'pointer', transition: 'all 0.18s ease',
                                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                                                boxShadow: active ? `0 0 0 3px ${r.activeBorder}40` : 'none',
                                                                fontFamily: 'Inter, sans-serif',
                                                            }}
                                                        >
                                                            <span style={{ fontSize: '22px', lineHeight: 1 }}>{r.emoji}</span>
                                                            {r.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Name row */}
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label className="cc-label" htmlFor="reg-fname">First Name</label>
                                                <input id="reg-fname" type="text" required className="cc-input" placeholder="Jane"
                                                    value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label className="cc-label" htmlFor="reg-lname">Last Name</label>
                                                <input id="reg-lname" type="text" required className="cc-input" placeholder="Smith"
                                                    value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div style={{ marginBottom: '14px' }}>
                                            <label className="cc-label" htmlFor="reg-email">Email Address</label>
                                            <input id="reg-email" type="email" required className="cc-input" placeholder="jane.smith@example.com"
                                                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                                        </div>

                                        {/* Password */}
                                        <div style={{ marginBottom: '14px' }}>
                                            <label className="cc-label" htmlFor="reg-password">Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    id="reg-password"
                                                    type={showPass ? 'text' : 'password'}
                                                    required className="cc-input"
                                                    placeholder="Min 6 characters"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    autoComplete="new-password"
                                                    style={{ paddingRight: '44px' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPass(p => !p)}
                                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                                    style={{
                                                        position: 'absolute', right: '12px', top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: '#94a3b8', padding: '4px',
                                                        display: 'flex', alignItems: 'center', borderRadius: '6px',
                                                    }}
                                                >
                                                    {showPass ? <IconEyeClosed /> : <IconEyeOpen />}
                                                </button>
                                            </div>
                                            {/* Password strength indicator */}
                                            {password.length > 0 && (
                                                <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }} role="status" aria-label={`Password strength: ${password.length < 6 ? 'weak' : password.length < 10 ? 'fair' : 'strong'}`}>
                                                    {[0, 1, 2].map(i => (
                                                        <div key={i} style={{
                                                            flex: 1, height: '3px', borderRadius: '2px',
                                                            background: password.length >= [1, 6, 10][i]
                                                                ? [password.length < 6 ? '#ef4444' : password.length < 10 ? '#f59e0b' : '#10b981'][0]
                                                                : '#e5e7eb',
                                                            transition: 'background 0.3s ease',
                                                        }} />
                                                    ))}
                                                    <span style={{ fontSize: '0.68rem', color: password.length < 6 ? '#ef4444' : password.length < 10 ? '#f59e0b' : '#10b981', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                        {password.length < 6 ? 'Weak' : password.length < 10 ? 'Fair' : 'Strong'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Role-specific fields */}
                                        {registerRole === 'student' ? (
                                            <>
                                                <div style={{ marginBottom: '14px' }}>
                                                    <label className="cc-label" htmlFor="reg-dob">Date of Birth</label>
                                                    <input id="reg-dob" type="date" required className="cc-input"
                                                        value={dob} onChange={e => setDob(e.target.value)} />
                                                </div>
                                                <div style={{ marginBottom: '24px' }}>
                                                    <label className="cc-label" htmlFor="reg-contact">Contact Number</label>
                                                    <input id="reg-contact" type="tel" required className="cc-input" placeholder="0771234567"
                                                        value={contactNo} onChange={e => setContactNo(e.target.value)} autoComplete="tel" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ marginBottom: '14px' }}>
                                                    <label className="cc-label" htmlFor="reg-expertise">Expertise Area <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                                                    <input id="reg-expertise" type="text" className="cc-input" placeholder="e.g. Data Science, Web Engineering"
                                                        value={expertiseArea} onChange={e => setExpertiseArea(e.target.value)} />
                                                </div>
                                                <div style={{ marginBottom: '24px' }}>
                                                    <label className="cc-label" htmlFor="reg-bio">Short Bio <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                                                    <input id="reg-bio" type="text" className="cc-input" placeholder="e.g. Passionate about teaching UI/UX design..."
                                                        value={bio} onChange={e => setBio(e.target.value)} />
                                                </div>
                                            </>
                                        )}

                                        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                                            {loading ? (
                                                <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> Creating Account...</>
                                            ) : (
                                                <>Create Account <IconArrowRight /></>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Security notice */}
                        <div style={{
                            background: 'rgba(238,242,255,0.7)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            border: '1px solid #e0e7ff',
                            marginTop: '16px',
                        }}>
                            <p style={{ fontSize: '0.73rem', color: '#64748b', margin: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span aria-hidden="true">🔐</span>
                                Credentials verified against Oracle USERS table. Role-based secure portals.
                            </p>
                        </div>

                        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', marginTop: '16px' }}>
                            CourseConnect Enterprise © 2026 — Oracle + MongoDB
                        </p>
                    </div>
                </div>
            </div>

            {/* Responsive styles for split panel */}
            <style>{`
                @media (min-width: 768px) {
                    .login-left-panel { display: flex !important; }
                    .mobile-brand { display: none !important; }
                }
            `}</style>
        </>
    );
}
