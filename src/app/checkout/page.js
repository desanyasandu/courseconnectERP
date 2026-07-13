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

const IconCard = ({ size = '16px' }) => (
    <svg style={{ width: size, height: size }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-5.25-9h16.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-9a1.5 1.5 0 0 1 1.5-1.5Z" />
    </svg>
);

const IconBank = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M3 21h18M12 9.75v-1.5" />
    </svg>
);

const IconCash = () => (
    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5c.9 0 1.634.629 1.775 1.496l1.32 8.188c.11.685-.382 1.316-1.075 1.316h-20.14c-.693 0-1.186-.631-1.075-1.316l1.32-8.188A1.8 1.8 0 0 1 3.75 4.5ZM12 9.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
);

const IconLock = ({ size = '16px' }) => (
    <svg style={{ width: size, height: size }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

export default function CheckoutPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        payment_id: '', student_id: '',
        course_id: '', amount: '', payment_method: 'Credit Card'
    });

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (!role) { router.push('/login'); return; }
        
        const uid = localStorage.getItem('userId');
        
        fetch('/api/courses')
            .then(r => r.json())
            .then(data => { 
                if (data.success) {
                    setCourses(data.data);
                    const searchParams = new URLSearchParams(window.location.search);
                    const queryCourseId = searchParams.get('courseId');
                    if (queryCourseId) {
                        const course = data.data.find(c => c.COURSE_ID === queryCourseId);
                        setFormData(prev => ({
                            ...prev,
                            student_id: uid || '',
                            course_id: queryCourseId,
                            amount: course ? course.PRICE : ''
                        }));
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            student_id: uid || ''
                        }));
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoadingCourses(false));
    }, [router]);

    const handleCourseChange = (courseId) => {
        const course = courses.find(c => c.COURSE_ID === courseId);
        setFormData({ ...formData, course_id: courseId, amount: course ? course.PRICE : '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true); setError(''); setMessage('');
        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message || 'Payment processed successfully!');
                setTimeout(() => router.push('/'), 2500);
            } else {
                setError(data.error || 'Transaction failed.');
            }
        } catch {
            setError('Server error. Please try again.');
        } finally {
            setLoadingSubmit(false);
        }
    };

    const selectedCourse = courses.find(c => c.COURSE_ID === formData.course_id);

    return (
        <div style={{ minHeight: '100vh' }}>
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

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
                <div style={{ marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: '#ecfdf5', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#059669', border: '1px solid #a7f3d0'
                        }}>
                            <IconCard size="20px" />
                        </div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }} className="gradient-text">
                            Tuition Checkout
                        </h1>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                        Complete your course enrollment by processing payment
                    </p>
                </div>

                {message && (
                    <div className="alert-success fade-in" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                        <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {message}
                    </div>
                )}
                {error && (
                    <div className="alert-error fade-in" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                        {error}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', alignItems: 'start' }}>
                    {/* Form */}
                    <div style={{
                        background: '#fff', borderRadius: '20px', border: '1.5px solid #e8eaf6',
                        boxShadow: '0 8px 30px rgba(79,70,229,0.08)', overflow: 'hidden'
                    }}>
                        <div style={{ height: '5px', background: 'linear-gradient(90deg, #059669, #0d9488)' }} />
                        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label className="cc-label">Payment ID</label>
                                    <input className="cc-input" required type="text" placeholder="PAY001"
                                        value={formData.payment_id}
                                        onChange={e => setFormData({ ...formData, payment_id: e.target.value })} />
                                </div>
                                <div>
                                    <label className="cc-label">Student ID</label>
                                    <input className="cc-input" required type="text" placeholder="S001"
                                        value={formData.student_id}
                                        onChange={e => setFormData({ ...formData, student_id: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label className="cc-label">Select Course</label>
                                {loadingCourses ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0' }}>
                                        <div className="spinner" style={{ width: '16px', height: '16px' }} />
                                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Loading courses...</span>
                                    </div>
                                ) : (
                                    <select
                                        className="cc-input cc-select"
                                        required
                                        value={formData.course_id}
                                        onChange={e => handleCourseChange(e.target.value)}
                                    >
                                        <option value="">— Choose a course —</option>
                                        {courses.map(c => (
                                            <option key={c.COURSE_ID} value={c.COURSE_ID}>{c.TITLE}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label className="cc-label">Payment Method</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {PAYMENT_METHODS.map(m => (
                                        <label key={m} style={{
                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                            padding: '10px 8px', borderRadius: '10px', cursor: 'pointer',
                                            border: `2px solid ${formData.payment_method === m ? '#4f46e5' : '#e5e7eb'}`,
                                            background: formData.payment_method === m ? '#eef2ff' : '#fff',
                                            fontWeight: 600, fontSize: '0.8rem', color: formData.payment_method === m ? '#4338ca' : '#6b7280',
                                            transition: 'all 0.15s ease'
                                        }}>
                                            <input type="radio" name="pm" value={m} checked={formData.payment_method === m}
                                                onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                                                style={{ display: 'none' }} />
                                            {m === 'Credit Card' && <IconCard size="14px" />}
                                            {m === 'Bank Transfer' && <IconBank />}
                                            {m === 'Cash' && <IconCash />}
                                            {m}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {formData.payment_method === 'Credit Card' && (
                                <div style={{
                                    background: '#f8f9ff', borderRadius: '12px', padding: '20px',
                                    border: '1px solid #e0e7ff', marginBottom: '24px'
                                }}>
                                    <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280', margin: '0 0 14px 0' }}>Card Details</p>
                                    <div style={{ marginBottom: '12px' }}>
                                        <label className="cc-label">Card Number</label>
                                        <input className="cc-input" type="text" placeholder="4000 1234 5678 9010" maxLength={19} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label className="cc-label">Expiry</label>
                                            <input className="cc-input" type="text" placeholder="MM/YY" maxLength={5} />
                                        </div>
                                        <div>
                                            <label className="cc-label">CVC</label>
                                            <input className="cc-input" type="text" placeholder="•••" maxLength={4} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={loadingSubmit} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 4px 14px rgba(5,150,105,0.35)' }}>
                                {loadingSubmit ? (
                                    <>
                                        <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <IconLock size="15px" />
                                        Complete Payment
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order summary */}
                    <div>
                        <div style={{
                            background: '#fff', borderRadius: '20px', border: '1.5px solid #e8eaf6',
                            boxShadow: '0 8px 30px rgba(79,70,229,0.08)', overflow: 'hidden', marginBottom: '16px'
                        }}>
                            <div style={{ height: '5px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }} />
                            <div style={{ padding: '24px' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280', margin: '0 0 16px 0' }}>
                                    Order Summary
                                </p>
                                {selectedCourse ? (
                                    <>
                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ fontWeight: 700, color: '#111827', margin: '0 0 4px 0', fontSize: '0.95rem' }}>{selectedCourse.TITLE}</p>
                                            <span className="badge badge-indigo">{selectedCourse.CATEGORY}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #f3f4f6' }}>
                                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Tuition Fee</span>
                                            <span style={{ fontWeight: 700, color: '#111827' }}>Rs. {Number(selectedCourse.PRICE).toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #f3f4f6' }}>
                                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total</span>
                                            <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#059669' }}>Rs. {Number(selectedCourse.PRICE).toLocaleString()}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center', padding: '24px 0' }}>
                                        Select a course to see the summary
                                    </p>
                                )}
                            </div>
                        </div>
                        <div style={{
                            background: '#f8f9ff', borderRadius: '12px', border: '1px solid #e0e7ff',
                            padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start'
                        }}>
                            <span style={{ color: '#4f46e5', marginTop: '2px' }}><IconLock size="14px" /></span>
                            <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0 }}>
                                Payments are securely logged in Oracle DB. This transaction creates a permanent record.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
