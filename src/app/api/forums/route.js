import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';
import mongoose from 'mongoose';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get('q');
        
        await connectMongo();
        const db = mongoose.connection.db;
        
        let filter = {};
        
        // Apply regex search if a keyword is provided
        if (searchQuery) {
            filter = {
                $or: [
                    { topic: { $regex: searchQuery, $options: "i" } },
                    { "posts.message": { $regex: searchQuery, $options: "i" } }
                ]
            };
        }
        
        const threads = await db.collection('discussion_forums').find(filter).toArray();
        return NextResponse.json({ success: true, data: threads });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
