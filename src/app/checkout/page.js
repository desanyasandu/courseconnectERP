'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        payment_id: '',
        student_id: '',
        course_id: '',
        amount: '',
        payment_method: 'Credit Card'
    });

    useEffect(() => {
        fetch('/api/courses')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCourses(data.data);
                }
                setLoadingCourses(false);
            })
            .catch(err => {
                console.error("Failed to load courses", err);
                setLoadingCourses(false);
            });
    }, []);

    // Autofill amount when course is selected
    const handleCourseChange = (courseId) => {
        const selected = courses.find(c => c.COURSE_ID === courseId);
        setFormData({
            ...formData,
            course_id: courseId,
            amount: selected ? selected.PRICE : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message || 'Payment logged successfully!');
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setError(data.error || 'Payment transaction failed.');
            }
        } catch (err) {
            setError('Server error processing payment.');
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-center font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-indigo-700">Student Tuition Checkout</h1>
                    <button onClick={() => router.push('/')} className="text-sm font-bold text-slate-500 hover:text-indigo-600">
                        Cancel
                    </button>
                </div>

                {message && (
                    <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-4 rounded-xl text-center mb-6 font-semibold">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl text-center mb-6 font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Payment ID</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" 
                                placeholder="e.g., PAY001" 
                                value={formData.payment_id}
                                onChange={e => setFormData({...formData, payment_id: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Student ID</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" 
                                placeholder="e.g., S001" 
                                value={formData.student_id}
                                onChange={e => setFormData({...formData, student_id: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Select Course</label>
                            {loadingCourses ? (
                                <div className="text-xs text-indigo-600 animate-pulse py-3">Loading courses...</div>
                            ) : (
                                <select 
                                    required 
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                                    value={formData.course_id}
                                    onChange={e => handleCourseChange(e.target.value)}
                                >
                                    <option value="">-- Choose Course --</option>
                                    {courses.map(c => (
                                        <option key={c.COURSE_ID} value={c.COURSE_ID}>{c.TITLE}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Amount (LKR)</label>
                            <input 
                                type="number" 
                                required 
                                readOnly
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 outline-none font-semibold text-indigo-700" 
                                placeholder="0.00" 
                                value={formData.amount}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                        <div className="flex gap-4">
                            {['Credit Card', 'Bank Transfer', 'Cash'].map(method => (
                                <label key={method} className="flex-1 flex items-center justify-center p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 font-semibold text-sm transition-all has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/50">
                                    <input 
                                        type="radio" 
                                        name="payment_method" 
                                        value={method} 
                                        checked={formData.payment_method === method} 
                                        onChange={e => setFormData({...formData, payment_method: e.target.value})}
                                        className="hidden" 
                                    />
                                    {method}
                                </label>
                            ))}
                        </div>
                    </div>

                    {formData.payment_method === 'Credit Card' && (
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Card Information</h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Card Number</label>
                                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none text-sm" placeholder="4000 1234 5678 9010" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Expiration Date</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none text-sm" placeholder="MM/YY" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">CVC</label>
                                    <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none text-sm" placeholder="123" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-4 mt-8">
                        <button 
                            type="button" 
                            onClick={() => router.push('/')} 
                            className="px-6 py-2.5 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loadingSubmit} 
                            className="px-6 py-2.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
                        >
                            {loadingSubmit ? 'Processing Transaction...' : 'Complete Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
