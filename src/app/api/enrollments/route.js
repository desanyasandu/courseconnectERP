import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

// Create a new enrollment (POST)
export async function POST(request) {
    try {
        const body = await request.json();
        const { enrollment_id, student_id, course_id } = body;
        
        const query = `
            INSERT INTO ENROLLMENT (enrollment_id, student_id, course_id, status, progress_percentage) 
            VALUES (:1, :2, :3, 'active', 0)
        `;
        const binds = [enrollment_id, student_id, course_id];
        
        await executeOracleQuery(query, binds, true);
        return NextResponse.json({ success: true, message: "Enrollment successful!" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Update enrollment progress (PUT)
export async function PUT(request) {
    try {
        const body = await request.json();
        const { enrollment_id, progress_percentage } = body;
        
        if (!enrollment_id || progress_percentage === undefined) {
            return NextResponse.json({ success: false, error: "Missing enrollment_id or progress_percentage" }, { status: 400 });
        }
        
        const pct = Math.min(100, Math.max(0, parseInt(progress_percentage, 10)));
        const status = pct >= 100 ? 'completed' : 'active';
        
        const query = `
            UPDATE ENROLLMENT 
            SET progress_percentage = :1, status = :2 
            WHERE enrollment_id = :3
        `;
        const binds = [pct, status, enrollment_id];
        
        await executeOracleQuery(query, binds, true);
        return NextResponse.json({ success: true, message: "Progress updated successfully!" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
