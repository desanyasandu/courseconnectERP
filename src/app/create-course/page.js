'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        course_id: '',
        lecturer_id: 'U002', // Defaulting to our seeded lecturer for now
        title: '',
        description: '',
        price: '',
        category: ''
    });

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
                router.push('/'); // Redirect back to dashboard
            }
        } catch (error) {
            console.error("Failed to create course", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 flex justify-center items-center font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-2xl">
                <h1 className="text-3xl font-extrabold text-indigo-700 mb-6">Add New Course</h1>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Course ID</label>
                            <input type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g., C006" onChange={e => setFormData({...formData, course_id: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Price (LKR)</label>
                            <input type="number" required className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g., 5000" onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Course Title</label>
                        <input type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Enter course title" onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                        <input type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="e.g., Web Development" onChange={e => setFormData({...formData, category: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                        <textarea required rows="3" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none" placeholder="Brief course description..." onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={() => router.push('/')} className="px-6 py-2 rounded-lg font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
                            {loading ? 'Saving...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
