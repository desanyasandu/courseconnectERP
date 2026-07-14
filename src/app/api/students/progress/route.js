import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');
        
        if (!studentId) {
            return NextResponse.json({ success: false, error: "Student ID is required" }, { status: 400 });
        }
        
        const query = `
            SELECT e.enrollment_id, e.status, e.progress_percentage, c.course_id, c.title, c.category, c.price 
            FROM ENROLLMENT e
            JOIN COURSE c ON e.course_id = c.course_id
            WHERE e.student_id = :1 AND e.status != 'dropped'
        `;
        
        const result = await executeOracleQuery(query, [studentId]);
        
        return NextResponse.json({ 
            success: true, 
            data: result.rows 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
