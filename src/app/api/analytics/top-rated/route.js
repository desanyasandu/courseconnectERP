import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await connectMongo();
        const db = mongoose.connection.db;
        
        const topCourses = await db.collection('student_reviews').aggregate([
            {
                $group: {
                    _id: "$course_id",
                    average_rating: { $avg: "$rating" },
                    total_reviews: { $sum: 1 }
                }
            },
            { $sort: { average_rating: -1 } }
        ]).toArray();

        return NextResponse.json({ success: true, data: topCourses });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
