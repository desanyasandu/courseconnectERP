'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [revenue, setRevenue] = useState<number>(0);
    const [topCourses, setTopCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (!role) {
            router.push('/login');
            return;
        }
        setUserRole(role);

        // Fetch all data points concurrently
        Promise.all([
            fetch('/api/courses').then(res => res.json()),
            fetch('/api/reports/revenue').then(res => res.json()),
            fetch('/api/analytics/top-rated').then(res => res.json())
        ])
        .then(([courseData, revenueData, topData]) => {
            if (courseData.success) setCourses(courseData.data);
            if (revenueData.success) setRevenue(revenueData.totalRevenue);
            if (topData.success) setTopCourses(topData.data);
            setLoading(false);
        })
        .catch(err => console.error("Data fetching error:", err));
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-8">
            <header className="mb-10 max-w-7xl mx-auto flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">CourseConnect Enterprise</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Platform Administration Dashboard</p>
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    <button 
                        onClick={() => window.location.href = '/forums'}
                        className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                    >
                        💬 Open Forums
                    </button>
                    <button 
                        onClick={() => window.location.href = '/progress'}
                        className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                    >
                        🎓 View Progress
                    </button>
                    <button 
                        onClick={() => window.location.href = '/checkout'}
                        className="bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                    >
                        💳 Tuition Checkout
                    </button>
                    {(userRole === 'admin' || userRole === 'lecturer') && (
                        <button 
                            onClick={() => window.location.href = '/create-course'}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                        >
                            + Create New Course
                        </button>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <span className="text-indigo-600 font-semibold text-lg animate-pulse">Loading Hybrid Analytics...</span>
                </div>
            ) : (
                <main className="max-w-7xl mx-auto space-y-12">
                    
                    {/* Analytics Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Oracle PL/SQL Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Platform Revenue (Oracle PL/SQL)</h2>
                            <p className="text-4xl font-extrabold text-emerald-600">Rs. {revenue.toLocaleString()}</p>
                        </div>

                        {/* MongoDB Aggregation Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Top Rated Courses (MongoDB Aggregation)</h2>
                            <div className="space-y-3">
                                {topCourses.map((tc, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                                        <span className="font-semibold text-slate-700">Course ID: {tc._id}</span>
                                        <span className="text-amber-500 font-bold flex items-center">
                                            ⭐ {tc.average_rating.toFixed(1)} <span className="text-xs text-slate-400 ml-2">({tc.total_reviews} reviews)</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Course Catalogue Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">Active Course Catalogue</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course) => (
                                <div key={course.COURSE_ID} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 leading-snug">{course.TITLE}</h3>
                                        <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                            {course.CATEGORY}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 mb-6 text-sm leading-relaxed line-clamp-3">
                                        {course.DESCRIPTION}
                                    </p>
                                    <div className="flex justify-between items-center pt-5 border-t border-slate-100">
                                        <div className="text-sm text-slate-500">
                                            By: <span className="font-semibold text-slate-700">{course.LECTURER_NAME}</span>
                                        </div>
                                        <div className="text-lg font-extrabold text-emerald-600">
                                            Rs. {course.PRICE}
                                        </div>
                                    </div>

                                    {/* Admin/Lecturer Controls */}
                                    {(userRole === 'admin' || userRole === 'lecturer') && (
                                        <div className="mt-4 pt-4 border-t border-red-100 flex justify-end">
                                            <button 
                                                onClick={async () => {
                                                    if(confirm('Are you sure you want to delete this course?')) {
                                                        await fetch(`/api/courses?id=${course.COURSE_ID}`, { method: 'DELETE' });
                                                        window.location.reload(); // Simple refresh to show updated list
                                                    }
                                                }}
                                                className="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                Delete Course
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            )}
        </div>
    );
}

