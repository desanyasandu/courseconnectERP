'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentProgressPage() {
    const router = useRouter();
    const [studentId, setStudentId] = useState('');
    const [enrollments, setEnrollments] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentId.trim()) return;

        setLoading(true);
        setError('');
        setSearched(true);

        try {
            const res = await fetch(`/api/students/progress?studentId=${studentId.trim()}`);
            const data = await res.json();
            if (data.success) {
                setEnrollments(data.data);
            } else {
                setError(data.error || 'Failed to retrieve progress data.');
            }
        } catch (err) {
            setError('Error loading progress. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-indigo-700">Student Progress Portal</h1>
                    <button onClick={() => router.push('/')} className="text-sm font-bold text-slate-500 hover:text-indigo-600">
                        &larr; Back to Dashboard
                    </button>
                </div>

                {/* Input Student ID */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Enter Student ID</label>
                            <input 
                                type="text" 
                                placeholder="e.g., S001" 
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
                            View Progress
                        </button>
                    </form>
                </div>

                {/* Loading / Error / Results */}
                {loading && (
                    <div className="text-center py-10 text-indigo-600 font-semibold animate-pulse">
                        Retrieving academic records...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && searched && (
                    <div>
                        {enrollments.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
                                No active enrollments found for student ID <span className="font-bold">{studentId}</span>.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-slate-800">Enrollment & Course Completion Status</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {enrollments.map((en, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-bold text-slate-800 text-lg leading-snug">{en.TITLE}</h3>
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                                        en.STATUS === 'completed' || en.PROGRESS_PERCENTAGE === 100
                                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                            : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                                                    }`}>
                                                        {en.STATUS}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 font-semibold mb-4 uppercase tracking-wider">{en.CATEGORY}</p>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-1 text-sm font-semibold text-slate-600">
                                                    <span>Course Progress</span>
                                                    <span>{en.PROGRESS_PERCENTAGE}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-3">
                                                    <div 
                                                        className={`h-3 rounded-full transition-all duration-500 ${
                                                            en.PROGRESS_PERCENTAGE === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                                                        }`}
                                                        style={{ width: `${en.PROGRESS_PERCENTAGE}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs text-slate-400 mt-4">
                                                    <span>Enrollment ID: {en.ENROLLMENT_ID}</span>
                                                    <span>LKR {en.PRICE}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
