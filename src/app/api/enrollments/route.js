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
