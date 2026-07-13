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
            const res = await fetch(`/api/forums${query ? `?q=${query}` : ''}`);
            const data = await res.json();
            if (data.success) setThreads(data.data);
        } catch (error) {
            console.error("Failed to fetch forums", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchThreads(searchTerm);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-indigo-700">Community Forums</h1>
                    <button onClick={() => router.push('/')} className="text-sm font-bold text-slate-500 hover:text-indigo-600">
                        &larr; Back to Dashboard
                    </button>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8 flex gap-4">
                    <input 
                        type="text" 
                        placeholder="Search topics or messages..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                    <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700">
                        Search
                    </button>
                    <button type="button" onClick={() => { setSearchTerm(''); fetchThreads(''); }} className="bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-lg hover:bg-slate-300">
                        Clear
                    </button>
                </form>

                {/* Threads List */}
                {loading ? (
                    <div className="text-center text-indigo-600 font-semibold animate-pulse mt-10">Loading threads...</div>
                ) : (
                    <div className="space-y-6">
                        {threads.length === 0 ? (
                            <p className="text-slate-500 text-center mt-10">No discussions found.</p>
                        ) : (
                            threads.map((thread, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                                        {thread.topic} <span className="text-xs font-normal text-slate-400 ml-2">(Course: {thread.course_id})</span>
                                    </h2>
                                    <div className="space-y-4">
                                        {thread.posts.map((post, pIdx) => (
                                            <div key={pIdx} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                                <p className="text-sm text-slate-700">{post.message}</p>
                                                <p className="text-xs text-slate-400 mt-2 font-semibold">User: {post.student_id}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
