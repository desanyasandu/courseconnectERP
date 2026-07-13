import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';
import mongoose from 'mongoose';

export async function POST(request) {
    try {
        await connectMongo();
        const db = mongoose.connection.db;
        const body = await request.json();
        const { course_id, student_id, rating, comment } = body;

        if (!course_id || !student_id || !rating) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const newReview = {
            course_id,
            student_id,
            rating: Number(rating),
            comment: comment || "",
            created_at: new Date()
        };

        await db.collection('student_reviews').insertOne(newReview);
        return NextResponse.json({ success: true, message: "Review submitted successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
